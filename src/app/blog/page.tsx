import { client } from '@/lib/sanity'
import BlogList from './BlogList'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  coverImage: object
  publishedAt: string
  tags: string[]
  author?: { name?: string; image?: object }
}

export const revalidate = 60

async function getPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage, publishedAt, tags,
      author-> { name, image }
    }`
  )
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-neutral-400">No posts yet. Add one in the Studio.</p>
      ) : (
        <BlogList posts={posts} />
      )}
    </main>
  )
}
