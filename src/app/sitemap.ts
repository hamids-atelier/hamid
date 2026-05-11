import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

const BASE = 'https://hamidsharifi.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current, "updatedAt": _updatedAt
      }`
    ),
    client.fetch<{ slug: string; updatedAt: string }[]>(
      `*[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
        "slug": slug.current, "updatedAt": _updatedAt
      }`
    ),
  ])

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/blog`,
      lastModified: posts[0]?.updatedAt ? new Date(posts[0].updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...posts.map(({ slug, updatedAt }) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${BASE}/work`,
      lastModified: projects[0]?.updatedAt ? new Date(projects[0].updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...projects.map(({ slug, updatedAt }) => ({
      url: `${BASE}/work/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
