import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date()
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    externalUrl: z.url(),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    capabilities: z.array(z.string()).default([])
  }).refine(
    ({ heroImage, heroAlt }) => !heroImage || Boolean(heroAlt),
    { message: 'heroAlt is required when heroImage is provided' }
  )
});

export const collections = { insights, projects };
