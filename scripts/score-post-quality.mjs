import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const postsDir = new URL('../src/content/posts/', import.meta.url);

const TOP_FEATURED_COUNT = 6;

const FEATURED_DESCRIPTION_TEMPLATES = [
  {
    pattern: /共识机制|去中心化真的/,
    text: '从分布式一致性、激励机制和资源集中三个层面，解释区块链如何生产信任，也追问去中心化为什么不是一次设计就能永久保持的状态。',
  },
  {
    pattern: /Layer2/i,
    text: '把以太坊扩容拆成 Layer1、Rollup、跨链桥和用户成本几个问题，说明 Layer2 不只是性能方案，也是区块链走向日常应用的基础设施实验。',
  },
  {
    pattern: /庞氏|空气币/,
    text: '用庞氏骗局的资金逻辑反推空气币的识别方法，从用途、收益承诺、钱包控制权和流动性等维度判断项目风险。',
  },
  {
    pattern: /不可修改的代码|承载变化/,
    text: '围绕智能合约“不可修改”的信任前提，讨论代码成为制度之后如何面对升级、治理和现实变化，解释以太坊为什么更像长期信任底座。',
  },
  {
    pattern: /spring|RCE|漏洞/i,
    text: '从 Spring 参数绑定与日志配置改写切入，把漏洞利用路径还原到框架机制层面，适合用来理解 Java Web 框架中“自动绑定”带来的安全边界。',
  },
  {
    pattern: /群智涌现|CIE|脑机|意识/,
    text: '把 AI、脑机接口和去中心化网络放进同一套群智涌现框架，推演个体认知、协作结构和文明形态可能发生的长期变化。',
  },
  {
    pattern: /提示词|元技能/,
    text: '把提示词工程从“会不会提问”的技巧，提升到学习、判断、表达和系统思考的元技能层面，重新理解 AI 时代的人机协作能力。',
  },
  {
    pattern: /流窜AI|Mythos|模型泄露/i,
    text: '以模型泄露和自主代理为情景入口，推演 AI、网络安全、区块链和去中心化算力交汇后可能出现的新型系统性风险。',
  },
];

const TOPIC_PHRASES = {
  security: '安全机制、攻击路径和工程边界',
  programming: '工程实现、底层机制和问题拆解',
  ai: 'AI 发展、认知结构和现实影响',
  web3: '链上机制、经济激励和现实风险',
  thinking: '个人判断、系统约束和长期选择',
  tooling: '工具链、实践步骤和效率改进',
};

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

function yamlString(value) {
  return JSON.stringify(value);
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function densityScore(count, steps) {
  const matchedStep = steps.find(([threshold]) => count >= threshold);
  return matchedStep?.[1] ?? 0;
}

function analyzePost({ block: frontmatter, body }) {
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
  const paragraphCount = countMatches(body, /<p\b|(?:^|\n)\s*[^<#\n][^\n]{30,}/g);

  return {
    title,
    description,
    topic,
    status,
    level,
    source,
    tags,
    text,
    haystack,
    headingCount,
    codeCount,
    imageCount,
    listCount,
    paragraphCount,
  };
}

function rubricScore(parsed) {
  const post = analyzePost(parsed);
  const {
    title,
    description,
    topic,
    status,
    level,
    source,
    tags,
    text,
    haystack,
    headingCount,
    codeCount,
    imageCount,
    listCount,
    paragraphCount,
  } = post;

  const isOpinionTopic = ['ai', 'web3', 'thinking'].includes(topic);
  const isTechnicalTopic = ['security', 'programming', 'tooling'].includes(topic);
  const conceptSignals = countMatches(haystack, /本质|核心|底层|结构|机制|模型|框架|悖论|矛盾|边界|路径|范式|系统|演化|趋势|长期|判断|认知|共识|信任|激励/g);
  const thesisSignals = countMatches(haystack, /我认为|在我看来|不是.+而是|并不是|真正|意味着|换句话说|也就是说|可以理解为|结论|必须|应该如何看待|我们要看|问题是|关键在于/g);
  const realitySignals = countMatches(haystack, /现实|真实|案例|实践|实操|场景|业务|成本|收益|风险|攻击|防御|市场|用户|开发者|投资者|公司|治理|监管|资源|约束|当前|今天|已经出现|比如|例如|长期来看|未来/g);
  const infoSignals = countMatches(haystack, /什么是|原理|流程|步骤|示例|代码|参数|命令|配置|安装|利用|漏洞|协议|工具|环境|扫描|注入|提权|认证|加密|数据库|合约|PoW|PoS|Layer2|RWA|预言机|ERC-20/gi);
  const deepTechSignals = countMatches(haystack, /源码|CVE|RCE|SpEL|Spring|ShellCode|缓冲区溢出|参数绑定|表达式注入|协议栈|认证过程|漏洞分析|手动漏洞挖掘/gi);
  const practicalSignals = countMatches(haystack, /靶机|Kioptrix|UploadLabs|实操|实践|复现|绕过|Bypass|payload|meterpreter|sqlmap|Burpsuite|mimikatz|MSF|命令执行|文件上传|SSRF|XSS|CSRF|SQL注入|提权/gi);
  const thinNotePenalty = text.length < 500 ? 8 : text.length < 900 ? 4 : 0;
  const draftPenalty = /暂时无解|复习来补|这里是我|待补充|TODO/i.test(haystack) ? 8 : 0;

  let originality = 8;
  originality += isOpinionTopic ? 5 : isTechnicalTopic ? 1 : 2;
  originality += densityScore(thesisSignals, [[8, 8], [5, 6], [3, 4], [1, 2]]);
  originality += densityScore(conceptSignals, [[16, 7], [10, 5], [5, 3], [2, 1]]);
  originality += /理论|Theory|模型|框架|推演|悖论|判断力|系统如何|不可修改|流窜AI/i.test(haystack) ? 5 : 0;
  originality += deepTechSignals >= 4 ? 3 : deepTechSignals >= 1 ? 1 : 0;
  originality -= /工具|命令|安装|配置|基础知识/.test(title) && thesisSignals < 2 ? 4 : 0;
  originality -= source === 'wechat' && text.length < 1200 ? 2 : 0;
  originality = clamp(Math.round(originality), 3, 30);

  let informationValue = 9;
  informationValue += lengthScore(text.length) > 10 ? 4 : lengthScore(text.length) > 3 ? 2 : 0;
  informationValue += densityScore(infoSignals, [[24, 6], [14, 5], [8, 4], [3, 2]]);
  informationValue += densityScore(headingCount, [[8, 4], [5, 3], [2, 1]]);
  informationValue += densityScore(listCount, [[24, 3], [10, 2], [4, 1]]);
  informationValue += densityScore(codeCount, [[8, 3], [3, 2], [1, 1]]);
  informationValue += description.length >= 80 ? 2 : description.length >= 24 ? 1 : 0;
  informationValue += tags.length >= 4 ? 1 : 0;
  informationValue -= thinNotePenalty > 0 ? 2 : 0;
  informationValue = clamp(Math.round(informationValue), 4, 25);

  let depth = 7;
  depth += densityScore(conceptSignals, [[20, 7], [12, 5], [7, 3], [3, 1]]);
  depth += densityScore(thesisSignals, [[8, 5], [5, 3], [2, 1]]);
  depth += densityScore(deepTechSignals, [[8, 5], [4, 3], [1, 1]]);
  depth += level === 'advanced' ? 3 : level === 'intermediate' ? 1 : 0;
  depth += paragraphCount >= 18 ? 2 : paragraphCount >= 10 ? 1 : 0;
  depth += /约束|阻抗|本质|根本|长期|复杂|权力|人性|经济设计|安全基础|信任机制|攻防关系|物理世界/i.test(haystack) ? 3 : 0;
  depth -= /工具|命令|参数|安装|配置/.test(title) && conceptSignals < 5 ? 4 : 0;
  depth -= thinNotePenalty > 0 ? 2 : 0;
  depth = clamp(Math.round(depth), 3, 25);

  let explanationPower = 6;
  explanationPower += densityScore(realitySignals, [[20, 6], [12, 5], [7, 3], [3, 2]]);
  explanationPower += densityScore(practicalSignals, [[12, 5], [6, 4], [2, 2]]);
  explanationPower += imageCount >= 3 ? 1 : 0;
  explanationPower += status === 'evergreen' ? 2 : 0;
  explanationPower += /案例|实践|复现|成本|收益|风险|攻击|防御|市场|投资|治理|未来|真实世界|现实世界|业务场景/i.test(haystack) ? 4 : 0;
  explanationPower += source === 'wechat' && isOpinionTopic ? 2 : 0;
  explanationPower -= /翻译的文章在这里|暂时无解|待补充/i.test(haystack) ? 5 : 0;
  explanationPower -= status === 'outdated' ? 3 : status === 'draft' ? 6 : 0;
  explanationPower = clamp(Math.round(explanationPower), 2, 20);

  const total = clamp(originality + informationValue + depth + explanationPower - draftPenalty, 25, 98);

  return {
    total,
    originality,
    informationValue,
    depth,
    explanationPower,
  };
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

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function extractHeadings(body) {
  const htmlHeadings = [...body.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((match) =>
    cleanText(match[1]),
  );
  const markdownHeadings = [...body.matchAll(/^#{1,4}\s+(.+)$/gm)].map((match) => cleanText(match[1]));

  return unique([...htmlHeadings, ...markdownHeadings])
    .map((heading) =>
      heading
        .replace(/^[一二三四五六七八九十\d]+[、.．]\s*/, '')
        .replace(/^\d+\s*/, '')
        .trim(),
    )
    .filter((heading) => heading.length >= 2 && heading.length <= 28);
}

function trimDescription(text) {
  return text.replace(/\s+/g, ' ').trim().slice(0, 120);
}

function genericFeaturedDescription(post) {
  const headings = extractHeadings(post.parsed.body).slice(0, 3);
  const focus = headings.length > 0 ? headings.join('、') : post.tags.slice(0, 3).join('、') || post.title;
  const topicPhrase = TOPIC_PHRASES[post.topic] || '关键问题、结构脉络和现实含义';

  return `围绕「${focus}」展开，提炼${topicPhrase}，概括这篇文章最值得读的核心判断。`;
}

function featuredDescriptionFor(post) {
  const template = FEATURED_DESCRIPTION_TEMPLATES.find(({ pattern }) => pattern.test(post.title));
  return trimDescription(template?.text || genericFeaturedDescription(post));
}

const files = readdirSync(postsDir).filter((file) => file.endsWith('.md')).sort();
const scoredPosts = files.map((file) => {
  const path = join(postsDir.pathname, file);
  const content = readFileSync(path, 'utf8');
  const parsed = frontmatterOf(content);
  const rubric = rubricScore(parsed);
  return {
    file,
    path,
    content,
    parsed,
    score: rubric.total,
    rubric,
    title: field(parsed.block, 'title').replace(/^["']|["']$/g, ''),
    topic: field(parsed.block, 'topic'),
    tags: inlineArray(parsed.block, 'tags'),
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
    upsertLine(lines, 'featuredDescription', yamlString(featuredDescriptionFor(post)), ['description']);
  } else {
    if (lines.some((line) => line.startsWith('featured:'))) {
      upsertLine(lines, 'featured', 'false', ['qualityScore']);
    }
    removeLine(lines, 'featuredOrder');
    removeLine(lines, 'featuredDescription');
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
