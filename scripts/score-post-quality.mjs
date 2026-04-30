import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url);

const SCORE_OVERRIDES = {
  '67a306f6.md': 98,
  '1bf8f607.md': 96,
  '4bb3ee4d.md': 94,
  'f39c1fdc.md': 93,
  '82f31d55.md': 92,
  '13911.md': 91,
  'wechat-article-20.md': 90,
  'e5ff196c.md': 89,
  'b5734d5.md': 88,
  'wechat-article-10.md': 88,
  'd760d085.md': 87,
  '5cd68c09.md': 86,
  '438207b5.md': 86,
  '65304.md': 85,
  'wechat-article-07.md': 85,
  'wechat-article-18.md': 85,
  'd35cebb1.md': 84,
  'b6ffa781.md': 84,
  '8a6c894b.md': 84,
  'wechat-article-15.md': 84,
  'a696f999.md': 83,
  '19385.md': 82,
  'wechat-article-05.md': 82,
  'wechat-article-08.md': 82,
  'wechat-article-16.md': 82,
  'fd659c4b.md': 52,
};

const TOP_FEATURED_COUNT = 6;

function frontmatterOf(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Missing frontmatter');
  }
  return {
    block: match[1],
    body: content.slice(match[0].length),
  };
}

function field(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function inlineArray(frontmatter, key) {
  const value = field(frontmatter, key);
  const match = value.match(/^\[(.*)\]$/);
  if (!match) {
    return [];
  }
  return match[1]
    .split(',')
    .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);
}

function cleanText(body) {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function lengthScore(length) {
  if (length >= 6500) return 18;
  if (length >= 4000) return 16;
  if (length >= 2600) return 13;
  if (length >= 1800) return 10;
  if (length >= 1100) return 7;
  if (length >= 650) return 4;
  if (length >= 300) return 1;
  return -10;
}

function countMatches(content, pattern) {
  return content.match(pattern)?.length ?? 0;
}

function heuristicScore({ block: frontmatter, body }) {
  const title = field(frontmatter, 'title');
  const description = field(frontmatter, 'description').replace(/^["']|["']$/g, '');
  const topic = field(frontmatter, 'topic');
  const status = field(frontmatter, 'status');
  const level = field(frontmatter, 'level');
  const source = field(frontmatter, 'source');
  const tags = inlineArray(frontmatter, 'tags');
  const categories = inlineArray(frontmatter, 'categories');
  const text = cleanText(body);
  const haystack = `${title} ${description} ${tags.join(' ')} ${categories.join(' ')} ${text}`;
  const headingCount = countMatches(body, /<h[1-4]\b|^#{1,4}\s/gm);
  const codeCount = countMatches(body, /<code\b|```|<figure class="[^"]*(?:highlight|hljs)/g);
  const imageCount = countMatches(body, /<img\b|!\[[^\]]*\]\(/g);
  const listCount = countMatches(body, /<li\b|^\s*[-*]\s/gm);

  let score = 54;
  score += lengthScore(text.length);
  score += Math.min(8, Math.floor(headingCount / 2));
  score += Math.min(5, Math.floor(codeCount / 2));
  score += Math.min(3, imageCount);
  score += Math.min(3, Math.floor(listCount / 8));

  if (description.length >= 80) score += 5;
  else if (description.length >= 24) score += 3;
  else if (!description) score -= 3;

  if (tags.length >= 4) score += 3;
  else if (tags.length >= 2) score += 2;
  if (categories.length) score += 1;
  if (topic) score += 2;

  if (status === 'evergreen') score += 7;
  if (status === 'note') score += 2;
  if (status === 'outdated') score -= 10;
  if (status === 'draft') score -= 20;

  if (level === 'advanced') score += 4;
  if (level === 'intermediate') score += 2;

  if (topic === 'security') score += 3;
  if (topic === 'programming') score += 2;
  if (topic === 'ai') score += 2;
  if (topic === 'web3') score += 1;

  if (/Spring|SpEL|CVE|RCE|源码|参数绑定|漏洞分析/i.test(haystack)) score += 6;
  if (/CobaltStrike|域渗透|内网|ShellCode|缓冲区溢出/i.test(haystack)) score += 5;
  if (/SQL注入|SSRF|XSS|CSRF|文件上传|命令执行|权限提升|提权/i.test(haystack)) score += 4;
  if (/靶机|Kioptrix|UploadLabs|实操|实践/i.test(haystack)) score += 3;
  if (/理论|推演|机制|模型|认知|共识/i.test(haystack)) score += 3;
  if (/工具|命令|参数|安装|配置/i.test(haystack) && text.length < 1200) score -= 2;
  if (/暂时无解|复习来补|这里是我/.test(haystack)) score -= 9;
  if (source === 'wechat' && text.length < 1200) score -= 2;
  if (text.length < 500) score -= 8;

  return Math.max(45, Math.min(90, Math.round(score)));
}

function upsertLine(lines, key, value, preferredAfter) {
  const existingIndex = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (existingIndex !== -1) {
    lines[existingIndex] = `${key}: ${value}`;
    return;
  }

  const afterIndex = preferredAfter
    .map((afterKey) => lines.findIndex((line) => line.startsWith(`${afterKey}:`)))
    .find((index) => index !== -1);

  lines.splice((afterIndex ?? lines.length - 1) + 1, 0, `${key}: ${value}`);
}

function removeLine(lines, key) {
  const existingIndex = lines.findIndex((line) => line.startsWith(`${key}:`));
  if (existingIndex !== -1) {
    lines.splice(existingIndex, 1);
  }
}

const files = readdirSync(postsDir).filter((file) => file.endsWith('.md')).sort();
const scoredPosts = files.map((file) => {
  const path = join(postsDir.pathname, file);
  const content = readFileSync(path, 'utf8');
  const parsed = frontmatterOf(content);
  const score = SCORE_OVERRIDES[file] ?? heuristicScore(parsed);
  return {
    file,
    path,
    content,
    parsed,
    score,
    title: field(parsed.block, 'title').replace(/^["']|["']$/g, ''),
    date: Date.parse(field(parsed.block, 'date').replace(/^["']|["']$/g, '')) || 0,
  };
});

const rankedPosts = [...scoredPosts].sort(
  (a, b) => b.score - a.score || b.date - a.date || a.title.localeCompare(b.title, 'zh-CN'),
);
const featuredFiles = new Map(rankedPosts.slice(0, TOP_FEATURED_COUNT).map((post, index) => [post.file, index + 1]));

for (const post of scoredPosts) {
  const lines = post.parsed.block.split('\n');
  upsertLine(lines, 'qualityScore', String(post.score), ['subtopic', 'topic', 'tags']);

  const featuredOrder = featuredFiles.get(post.file);
  if (featuredOrder) {
    upsertLine(lines, 'featured', 'true', ['qualityScore']);
    upsertLine(lines, 'featuredOrder', String(featuredOrder), ['featured']);
  } else {
    if (lines.some((line) => line.startsWith('featured:'))) {
      upsertLine(lines, 'featured', 'false', ['qualityScore']);
    }
    removeLine(lines, 'featuredOrder');
  }

  writeFileSync(post.path, `---\n${lines.join('\n')}\n---${post.parsed.body}`);
}

console.table(
  rankedPosts.slice(0, 10).map((post, index) => ({
    rank: index + 1,
    score: post.score,
    file: post.file,
    title: post.title,
  })),
);
