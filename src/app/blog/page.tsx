import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'

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
      author { name, image }
    }`
  )
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <main className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-bold mb-10 tracking-tight">Blog</h1>

      {posts.length === 0 && (
        <p className="text-neutral-400">No posts yet. Add one in the Studio.</p>
      )}

      <div className="divide-y divide-gray-100">
        {posts.map((post) => (
          <article key={post._id} className="py-8 first:pt-0">
            <Link href={`/blog/${post.slug.current}`} className="group flex gap-6 items-start justify-between">

              {/* Left — text */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">

                {/* Author */}
                <div className="flex items-center gap-2">
                  {post.author?.image && (
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={urlFor(post.author.image).width(40).height(40).url()}
                        alt={post.author.name ?? ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {post.author?.name && (
                    <span className="text-sm text-gray-500">{post.author.name}</span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:underline line-clamp-3 decoration-gray-300">
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {post.publishedAt && (
                    <time className="text-xs text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — thumbnail */}
              {post.coverImage && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-24 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={urlFor(post.coverImage).width(256).height(192).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                  />
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
