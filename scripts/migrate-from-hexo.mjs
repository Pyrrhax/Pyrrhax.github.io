import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, 'backup-hexo-content');
const POSTS_DIR = path.join(BACKUP_DIR, 'posts');
const TAGS_DIR = path.join(BACKUP_DIR, 'tags');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'posts');

const keywordRules = [
  ['SQL注入', { all: [/sql/i, /注入/] }],
  ['Java', { any: [/java/i, /spring/i, /spel/i] }],
  ['Spring', { any: [/spring/i, /spel/i, /cve-2010-1622/i] }],
  ['漏洞分析', { any: [/漏洞/, /cve/i, /cnvd/i, /rce/i] }],
  ['渗透测试', { any: [/渗透/, /kali/i, /靶机/, /靶场/, /uploadlabs/i] }],
  ['内网', { any: [/内网/, /cobalt/i, /crossc2/i] }],
  ['文件上传', { any: [/文件上传/, /upload/i] }],
  ['Windows', { any: [/windows/i, /域/] }],
  ['逆向', { any: [/汇编/, /逆向/, /调试/] }],
  ['编程题', { any: [/编程题/, /笔试/, /算法/] }],
  ['Hexo', { any: [/hexo/i, /githubpages/i, /github pages/i] }],
  ['游戏', { any: [/游戏/, /深海迷航/] }],
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getMatch(html, pattern, fallback = '') {
  return html.match(pattern)?.[1]?.trim() ?? fallback;
}

function getTitle(html, slug) {
  const heading = getMatch(html, /<h1 class="post-title"[^>]*>([\s\S]*?)<\/h1>/);
  if (heading) return stripTags(heading);
  const title = getMatch(html, /<title>([\s\S]*?)<\/title>/);
  return title.replace(/\s*\|\s*Pyrrhax\s*$/, '') || slug;
}

function getDate(html) {
  return getMatch(html, /<time[^>]*datetime="([^"]+)"/, new Date().toISOString());
}

function getCategories(html) {
  const block = getMatch(html, /<span class="post-categories">([\s\S]*?)<\/span>\s*(?:<\/div>|<span|$)/);
  const names = [...block.matchAll(/<span itemprop="name">([\s\S]*?)<\/span>/g)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  return [...new Set(names)];
}

function getMain(html) {
  const main = getMatch(html, /<main class="post-main"[^>]*>([\s\S]*?)<\/main>/);
  return main
    .replace(/<a id="more"><\/a>/g, '')
    .replace(/<p>\[toc\]<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function getDescription(main) {
  const paragraphs = [...main.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  const badFragments = [/^\+?-?$/, /^web$/i, /^官网[:：]?$/i, /^操作$/, /^服务端[:：]?$/, /^上传工具$/, /^Linux$/i, /^Windows$/i, /^Mimikatz$/i, /^meterpreter\s*>$/i];
  const text = paragraphs.find((paragraph) => {
    const cjkCount = (paragraph.match(/[\u4e00-\u9fff]/g) ?? []).length;
    if (paragraph.length < 40 || cjkCount < 12) return false;
    if (/https?:\/\//i.test(paragraph)) return false;
    if (/^[a-z0-9_.:/?&=%\s-]+$/i.test(paragraph)) return false;
    if (badFragments.some((pattern) => pattern.test(paragraph))) return false;
    return true;
  }) ?? '';
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

function collectTags() {
  const map = new Map();
  if (!fs.existsSync(TAGS_DIR)) return map;

  for (const tagName of fs.readdirSync(TAGS_DIR)) {
    const indexPath = path.join(TAGS_DIR, tagName, 'index.html');
    if (!fs.existsSync(indexPath)) continue;
    const html = fs.readFileSync(indexPath, 'utf8');
    const linkedPosts = [...html.matchAll(/href="\/posts\/([^"]+)\.html"/g)].map((match) => match[1]);
    for (const slug of linkedPosts) {
      const tags = map.get(slug) ?? new Set();
      tags.add(tagName);
      map.set(slug, tags);
    }
  }

  return map;
}

function inferTags(title, main, categories, existingTags) {
  const haystack = `${title}\n${stripTags(main)}\n${categories.join(' ')}`;
  const tags = new Set(existingTags);
  for (const [tag, rule] of keywordRules) {
    const matchedAny = rule.any?.some((pattern) => pattern.test(haystack)) ?? false;
    const matchedAll = rule.all?.every((pattern) => pattern.test(haystack)) ?? false;
    if (matchedAny || matchedAll) {
      tags.add(tag);
    }
  }
  for (const category of categories) {
    const last = category.split('/').at(-1);
    if (last && last.length <= 12) tags.add(last);
  }
  return [...tags].slice(0, 8);
}

function yamlString(value) {
  return JSON.stringify(value);
}

function writePost({ slug, title, date, description, categories, tags, main }) {
  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${yamlString(date)}`,
    `description: ${yamlString(description)}`,
    `categories: ${JSON.stringify(categories)}`,
    `tags: ${JSON.stringify(tags)}`,
    `legacyPath: ${yamlString(`/posts/${slug}.html`)}`,
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), `${frontmatter}${main}\n`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const tagMap = collectTags();
const postFiles = fs
  .readdirSync(POSTS_DIR)
  .filter((file) => file.endsWith('.html'))
  .sort();

for (const file of postFiles) {
  const slug = file.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const title = getTitle(html, slug);
  const date = getDate(html);
  const categories = getCategories(html);
  const main = getMain(html);
  const description = getDescription(main);
  const tags = inferTags(title, main, categories, tagMap.get(slug) ?? []);
  writePost({ slug, title, date, description, categories, tags, main });
}

console.log(`Migrated ${postFiles.length} posts into ${path.relative(ROOT, OUT_DIR)}.`);
