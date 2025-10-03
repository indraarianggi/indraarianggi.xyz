import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    author: z
      .object({
        name: z.string(),
        occupation: z.string().optional(),
        avatar: z.string().optional(),
      })
      .optional(),
    time: z.object({
      created: z.string().or(z.date()),
      updated: z.string().or(z.date()).optional(),
    }),
    published: z.boolean().default(true),
  }),
});

export const collections = { posts };
