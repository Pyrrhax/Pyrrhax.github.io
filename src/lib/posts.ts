import { getCollection } from 'astro:content';

export const TOPIC_LABELS: Record<string, string> = {
  security: '信息安全',
  programming: '编程与工程',
  ai: 'AI 与认知',
  web3: 'Web3 与投资',
  thinking: '认知与思考',
  tooling: '工具与构建',
};

const LEGACY_TOPIC_FALLBACKS: Record<string, string> = {
  信息安全: 'security',
  渗透测试: 'security',
  漏洞分析: 'security',
  软件安全: 'security',
  靶机: 'security',
  专项靶场: 'security',
  编程语言: 'programming',
  编程题: 'programming',
  Java: 'programming',
  汇编: 'programming',
  网络运维: 'tooling',
  Hexo: 'tooling',
  公众号: 'thinking',
  翻译: 'thinking',
  游戏: 'thinking',
};

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function postSlug(post: { id: string }) {
  return post.id.replace(/\.md$/, '');
}

export function postUrl(post: { id: string }) {
  return `/posts/${postSlug(post)}/`;
}

export function tagUrl(tag: string) {
  return `/tags/${tag}/`;
}

export function categoryUrl(category: string) {
  return `/categories/${category}/`;
}

export function postTopic(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  if (post.data.topic) {
    return post.data.topic;
  }
  const legacyCategory = post.data.categories[0];
  return LEGACY_TOPIC_FALLBACKS[legacyCategory] || legacyCategory || 'uncategorized';
}

export function topicLabel(topic: string) {
  return TOPIC_LABELS[topic] ?? topic;
}

export function topicUrl(topic: string) {
  return `/topics/${encodeURIComponent(topic)}/`;
}

type PostEntry = Awaited<ReturnType<typeof getPosts>>[number];

type ColumnDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  label: string;
  sort?: (a: PostEntry, b: PostEntry) => number;
  match: (post: PostEntry) => boolean;
};

function postHaystack(post: PostEntry) {
  return [
    post.data.title,
    post.data.description,
    ...post.data.categories,
    ...post.data.tags,
    post.data.topic,
    post.data.subtopic,
  ]
    .filter(Boolean)
    .join(' ');
}

function columnHaystack(post: PostEntry) {
  return [
    post.data.title,
    ...post.data.categories,
    ...post.data.tags,
    post.data.topic,
    post.data.subtopic,
  ]
    .filter(Boolean)
    .join(' ');
}

function hasTag(post: PostEntry, tag: string) {
  return post.data.tags.includes(tag);
}

function matches(post: PostEntry, pattern: RegExp) {
  return pattern.test(postHaystack(post));
}

function matchesColumn(post: PostEntry, pattern: RegExp) {
  return pattern.test(columnHaystack(post));
}

function rankPost(post: PostEntry, patterns: RegExp[]) {
  const titleIndex = patterns.findIndex((pattern) => pattern.test(post.data.title));
  if (titleIndex !== -1) {
    return titleIndex;
  }

  const index = patterns.findIndex((pattern) => pattern.test(columnHaystack(post)));
  return index === -1 ? Number.POSITIVE_INFINITY : index + patterns.length;
}

function chronological(a: PostEntry, b: PostEntry) {
  return a.data.date.valueOf() - b.data.date.valueOf();
}

const PENTEST_ORDER = [
  /渗透测试及Kali初探|Kali定制|实验环境/,
  /被动信息收集|GoogleHacking|Recon-ng|DNS与SHODAN/,
  /主动信息收集|主机发现|端口扫描|服务扫描|OS识别|SNMP|SMB|SMTP|防火墙|负载均衡/,
  /网络工具|NETCAT|WireShark|TCPdump|NCAT|SOCAT|流量操控|隧道|DNS协议隧道|rinetd|SSH|ptunnle|proxytunnle|sslh|stunnle/,
  /Web扫描|漏洞扫描|Burpsuite|w3af|Arachni|Nikto|Vega|Skipfish|手动漏洞挖掘/,
  /SQL注入|SQLMap/,
  /XSS|跨站脚本|CSRF|拒绝服务|DoS|SSRF|文件上传|WebShell|Web渗透/,
  /MSF|exploit|payload|meterpreter|msfcli|缓冲区溢出|ShellCode|免杀/,
  /提权|后渗透|后门|密码|嗅探|痕迹|取证|社会工程学/,
  /内网|CobaltStrike|CrossC2|域渗透/,
  /无线|802\.11|Aircrack|WEP|WPA/,
  /靶机|靶场|UploadLabs|Kioptrix/,
];

const BLOCKCHAIN_ORDER = [
  /链上和链下/,
  /DEX|去中心化交易所/,
  /挖矿|流动性挖矿/,
  /共识机制/,
  /公链|私链|联盟链/,
  /庞氏|空气币/,
  /比特币|铸币税|数字黄金/,
  /^(?!.*(?:光以太|以太网)).*(?:以太坊|智能合约|dApp)/,
  /稳定币|代币|ERC-20/,
  /Layer2/,
  /RWA|预言机/,
  /NFT|OAT/,
  /Web3撸毛|空投/,
  /光以太|以太网|错误如何塑造/,
  /不可修改的代码/,
];

const AI_ORDER = [
  /AI泛化认知/,
  /群智涌现/,
  /系统如何决定牺牲谁/,
  /提示词工程|元技能/,
  /上班消耗.*判断力/,
  /流窜AI|Mythos|模型泄露/,
];

export const COLUMN_DEFINITIONS: ColumnDefinition[] = [
  {
    slug: 'pentest-notes',
    title: '渗透测试学习笔记',
    shortTitle: '渗透测试学习笔记',
    description: '从 Kali、信息收集、Web 漏洞、SQL 注入、漏洞利用、后渗透到靶场实践，把旧笔记串成连续的安全学习线。',
    label: 'Security',
    sort: (a, b) => rankPost(a, PENTEST_ORDER) - rankPost(b, PENTEST_ORDER) || chronological(a, b),
    match: (post) =>
      hasTag(post, 'KaliLinux渗透测试学习笔记') ||
      hasTag(post, '漏洞利用及渗透测试基础学习笔记') ||
      post.data.categories.includes('渗透测试') ||
      post.data.categories.includes('靶机') ||
      post.data.categories.includes('专项靶场') ||
      matchesColumn(post, /渗透|Kali|信息收集|SQL注入|SQLMap|Burpsuite|MSF|后渗透|提权|内网|靶机|Aircrack|缓冲区溢出/i),
  },
  {
    slug: 'blockchain-basics',
    title: '区块链基础概念',
    shortTitle: '区块链基础概念',
    description: '面向跨领域读者的 Web3 入门专栏：链上链下、DEX、挖矿、共识机制、公私联盟链、稳定币、Layer2、RWA、NFT 等。',
    label: 'Web3',
    sort: (a, b) => rankPost(a, BLOCKCHAIN_ORDER) - rankPost(b, BLOCKCHAIN_ORDER) || chronological(a, b),
    match: (post) =>
      post.data.topic === 'web3' &&
      matchesColumn(
        post,
        /区块链基础概念|链上和链下|DEX|挖矿|共识机制|公链|私链|联盟链|空气币|比特币|以太坊|智能合约|dApp|稳定币|ERC-20|Layer2|RWA|预言机|NFT|OAT|以太坊|不可修改的代码/i,
      ),
  },
  {
    slug: 'spring-vulnerability-analysis',
    title: 'Spring 漏洞分析',
    shortTitle: 'Spring 漏洞分析',
    description: '围绕 Spring、SpEL、参数绑定和历史 CVE 的源码跟踪与漏洞复现，适合从 Java Web 框架理解安全问题。',
    label: 'Java Security',
    sort: chronological,
    match: (post) => hasTag(post, 'Spring') || matches(post, /Spring|SpEL|springMVC|SpringBeansRCE|CVE-2010-1622|CNVD-2016-04742/i),
  },
  {
    slug: 'ai-cognition-futures',
    title: 'AI、认知与未来推演',
    shortTitle: 'AI 与未来推演',
    description: '把 AI 泛化认知、群智涌现、提示词工程、判断力、人机协作和流窜 AI 等未来推演放在同一条思考线上。',
    label: 'AI Thinking',
    sort: (a, b) => rankPost(a, AI_ORDER) - rankPost(b, AI_ORDER) || chronological(a, b),
    match: (post) =>
      post.data.topic === 'ai' &&
      matchesColumn(
        post,
        /AI泛化认知|群智涌现|提示词工程|元技能|判断力|上班消耗|系统如何决定|人机协作|流窜AI|Mythos|模型泄露|AI.*网络安全|网络安全.*AI|复杂系统风险/i,
      ),
  },
];

export function columnUrl(slug: string) {
  return `/paths/${encodeURIComponent(slug)}/`;
}

export function getColumnDefinition(slug: string) {
  return COLUMN_DEFINITIONS.find((column) => column.slug === slug);
}

export function getPostsByColumn(slug: string, inputPosts: PostEntry[]) {
  const column = getColumnDefinition(slug);
  if (!column) {
    return [];
  }
  return inputPosts
    .filter(column.match)
    .sort(column.sort || chronological);
}

export function getAllColumns(inputPosts: PostEntry[]) {
  return COLUMN_DEFINITIONS.map((column) => ({
    ...column,
    count: inputPosts.filter(column.match).length,
  })).filter((column) => column.count > 0);
}

export function comparePostQuality(a: PostEntry, b: PostEntry) {
  return (
    b.data.qualityScore - a.data.qualityScore ||
    b.data.date.valueOf() - a.data.date.valueOf() ||
    a.data.title.localeCompare(b.data.title, 'zh-CN')
  );
}

export async function getRankedPosts() {
  const posts = await getPosts();
  return posts.sort(comparePostQuality);
}

export async function getFeaturedPosts(limit = 6) {
  const posts = await getRankedPosts();
  return posts.slice(0, limit);
}

export async function getAllTopics(inputPosts?: Awaited<ReturnType<typeof getPosts>>) {
  const posts = inputPosts ?? await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    const topic = postTopic(post);
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, label: topicLabel(topic), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN'));
}

export async function getPostsByTopic(topic: string) {
  const posts = await getPosts();
  return posts.filter((post) => postTopic(post) === topic);
}

export function getAllTerms(posts: Awaited<ReturnType<typeof getPosts>>, key: 'tags' | 'categories') {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const term of post.data[key]) {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}
