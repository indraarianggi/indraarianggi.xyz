import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const imageFields = <S extends z.ZodType>(image: () => S) => ({
  image: image().optional(),
  imageAlt: z.string().trim().min(1).optional(),
});

const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    role: z.string().trim().min(1),
    status: z.enum(['building', 'shipped', 'paused', 'archived']),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    stack: z.array(z.string().trim().min(1)).default([]),
    repository: z.url().optional(),
    website: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ...imageFields(image),
  }).refine((data) => !data.image || Boolean(data.imageAlt), {
    message: 'imageAlt is required when image is present',
    path: ['imageAlt'],
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    topics: z.array(z.string().trim().min(1)).default([]),
    draft: z.boolean().default(false),
    ...imageFields(image),
  }).refine((data) => !data.image || Boolean(data.imageAlt), {
    message: 'imageAlt is required when image is present',
    path: ['imageAlt'],
  }),
});

const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/[^_]*.md' }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    author: z.string().trim().min(1),
    status: z.enum(['reading', 'finished', 'paused', 'want-to-read']),
    date: z.coerce.date(),
    startedDate: z.coerce.date().optional(),
    finishedDate: z.coerce.date().optional(),
    order: z.number().int().nonnegative().optional(),
    draft: z.boolean().default(false),
    cover: image().optional(),
    coverAlt: z.string().trim().min(1).optional(),
  }).refine((data) => !data.cover || Boolean(data.coverAlt), {
    message: 'coverAlt is required when cover is present',
    path: ['coverAlt'],
  }),
});

export const collections = { work, blog, books };
