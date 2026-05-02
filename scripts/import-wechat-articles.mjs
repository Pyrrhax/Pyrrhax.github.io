import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const sourceDir = '/Users/pyrrhax/Documents/codexProjects/wechat-official-account/articles';
const outputDir = path.resolve('src/content/posts');

const articles = JSON.parse(fs.readFileSync(path.join(sourceDir, 'articles.json'), 'utf8'));

const BLOCKCHAIN_RE = /区块链|Web3|比特币|以太坊|智能合约|dApp|DEX|CEX|NFT|OAT|Layer2|RWA|预言机|稳定币|代币|公链|私链|联盟链|空气币|撸毛|铸币税/;
const SECURITY_RE = /网络安全|CISSP|安全|模型泄露|流窜AI/;
const PROGRAMMING_RE = /代码|开发|工程|程序|软件/;
const AI_RE = /(^|[^A-Za-z])AI([^A-Za-z]|$)|人工智能|Claude|ChatGPT|Codex|DeepSeek|Mythos|提示词|Prompt/i;

function yamlString(value) {
  return JSON.stringify(value ?? '');
}

function yamlArray(values) {
  return `[${values.map(yamlString).join(', ')}]`;
}

function attrMap(node) {
  return new Map((node.attrs || []).map((attr) => [attr.name, attr.value]));
}

function findById(node, id) {
  const attrs = attrMap(node);
  if (attrs.get('id') === id) {
    return node;
  }
  for (const child of node.childNodes || []) {
    const match = findById(child, id);
    if (match) {
      return match;
    }
  }
  return null;
}

function cloneClean(node) {
  if (node.nodeName === '#text') {
    return { ...node };
  }

  if (node.nodeName === '#comment') {
    return null;
  }

  const tag = node.tagName;
  if (['script', 'style', 'iframe', 'mp-style-type'].includes(tag)) {
    return null;
  }

  const attrs = attrMap(node);
  if ((attrs.get('style') || '').includes('display: none')) {
    return null;
  }

  const cleaned = { ...node, attrs: [], childNodes: [] };
  for (const child of node.childNodes || []) {
    const next = cloneClean(child);
    if (next) {
      cleaned.childNodes.push(next);
    }
  }

  if (tag === 'img') {
    const src = attrs.get('data-src') || attrs.get('src');
    if (!src) {
      return null;
    }
    cleaned.attrs = [
      { name: 'src', value: src.startsWith('//') ? `https:${src}` : src },
      { name: 'alt', value: attrs.get('alt') || '' },
      { name: 'loading', value: 'lazy' },
    ];
  } else if (tag === 'a') {
    const href = attrs.get('href');
    cleaned.attrs = href
      ? [
          { name: 'href', value: href.startsWith('//') ? `https:${href}` : href },
          { name: 'target', value: '_blank' },
          { name: 'rel', value: 'noopener noreferrer' },
        ]
      : [];
  }

  return cleaned;
}

function cleanContent(contentNode) {
  const fragment = {
    nodeName: '#document-fragment',
    childNodes: (contentNode.childNodes || []).map(cloneClean).filter(Boolean),
  };

  return parse5
    .serialize(fragment)
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function inferTopic(article) {
  const haystack = `${article.title} ${article.excerpt} ${(article.headings || []).join(' ')}`;
  if (AI_RE.test(haystack)) {
    return 'ai';
  }
  if (BLOCKCHAIN_RE.test(haystack)) {
    return 'web3';
  }
  if (SECURITY_RE.test(haystack)) {
    return 'security';
  }
  if (PROGRAMMING_RE.test(haystack)) {
    return 'programming';
  }
  return 'thinking';
}

function inferTags(article, topic) {
  const tags = [];
  if (topic === 'web3') {
    tags.push('Web3', '区块链');
  }
  if (AI_RE.test(`${article.title} ${article.excerpt}`)) {
    tags.push('AI');
  }
  if (/提示词|Prompt/i.test(article.title)) {
    tags.push('提示词工程');
  }
  return [...new Set(tags)];
}

function categoryForTopic(topic) {
  return (
    {
      ai: 'AI',
      web3: 'Web3',
      security: '安全',
      programming: '编程',
      thinking: '认知与思考',
    }[topic] ?? '认知与思考'
  );
}

let imported = 0;

for (const article of articles) {
  const htmlPath = path.join(sourceDir, `article_${article.i}_mobile.html`);
  if (!fs.existsSync(htmlPath)) {
    console.warn(`Missing mobile HTML for article ${article.i}`);
    continue;
  }

  const document = parse5.parse(fs.readFileSync(htmlPath, 'utf8'));
  const contentNode = findById(document, 'js_content');
  if (!contentNode) {
    console.warn(`Missing #js_content for article ${article.i}`);
    continue;
  }

  const content = cleanContent(contentNode);
  if (!content || content.includes('当前环境异常')) {
    console.warn(`No usable content for article ${article.i}`);
    continue;
  }

  const slug = `wechat-article-${String(article.i).padStart(2, '0')}`;
  const topic = inferTopic(article);
  const tags = inferTags(article, topic);
  const frontmatter = [
    '---',
    `title: ${yamlString(article.title)}`,
    `date: ${yamlString(`${article.date}T00:00:00+08:00`)}`,
    `description: ${yamlString(article.excerpt || '')}`,
    `categories: ${yamlArray([categoryForTopic(topic)])}`,
    `tags: ${yamlArray(tags)}`,
    `topic: ${topic}`,
    'status: note',
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outputDir, `${slug}.md`), `${frontmatter}${content}\n`);
  imported += 1;
}

console.log(`Imported ${imported} WeChat articles.`);
