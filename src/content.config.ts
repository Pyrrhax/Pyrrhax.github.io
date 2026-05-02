import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    featuredDescription: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    topic: z.string().optional(),
    subtopic: z.string().optional(),
    qualityScore: z.number().min(0).max(100).default(0),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    status: z.enum(['evergreen', 'note', 'outdated', 'draft']).default('note'),
    updated: z.coerce.date().optional(),
    legacyPath: z.string().optional(),
    source: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    sourceAccount: z.string().optional(),
  }),
});

export const collections = { posts };
