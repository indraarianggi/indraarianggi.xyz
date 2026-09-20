import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { visibleNewestFirst } from '../lib/content';
import { site } from '../config/site';

export async function GET(context: APIContext) {
  const articles = visibleNewestFirst(await getCollection('blog'), import.meta.env.PROD);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? new URL('http://localhost:4321'),
    items: articles.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/blog/${entry.id}/`,
    })),
  });
}
