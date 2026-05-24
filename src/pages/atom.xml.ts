import { getPosts, postUrl } from '../lib/posts';

const SITE_URL = 'https://0rbs.com';

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getPosts();
  const updated = posts[0]?.data.updated ?? posts[0]?.data.date ?? new Date();
  const entries = posts
    .map((post) => {
      const url = new URL(postUrl(post), SITE_URL).toString();
      const summary = post.data.description || post.data.featuredDescription || '0rbs note';
      return `  <entry>
    <title>${escapeXml(post.data.title)}</title>
    <link href="${url}" />
    <id>${url}</id>
    <updated>${(post.data.updated ?? post.data.date).toISOString()}</updated>
    <published>${post.data.date.toISOString()}</published>
    <summary>${escapeXml(summary)}</summary>
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>0rbs</title>
  <subtitle>Observation, judgment, and structured thinking by Pyrrhax.</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self" />
  <link href="${SITE_URL}/" />
  <id>${SITE_URL}/</id>
  <updated>${updated.toISOString()}</updated>
  <author>
    <name>Pyrrhax</name>
  </author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
