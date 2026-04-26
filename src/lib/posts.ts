import { getCollection } from 'astro:content';

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

export function getAllTerms(posts: Awaited<ReturnType<typeof getPosts>>, key: 'tags' | 'categories') {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const term of post.data[key]) {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}
