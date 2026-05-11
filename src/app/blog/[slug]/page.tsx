import { client, urlFor } from '@/lib/sanity'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import PostActions from '@/components/PostActions'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  coverImage: object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]
  publishedAt: string
  tags: string[]
  author?: { name?: string; bio?: string; image?: object }
}

function readTime(body: Post['body']): number {
  if (!body?.length) return 1
  const text = body
    .flatMap(b =>
      b._type === 'block'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (b.children ?? []).map((c: any) => c.text ?? '')
        : []
    )
    .join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, coverImage, body, publishedAt, tags,
      author { name, bio, image }
    }`,
    { slug }
  )
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const imageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current }`
  )
  return slugs.map(({ slug }) => ({ slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const mins = readTime(post.body)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex gap-14 items-start">

        {/* ── Left: sticky author sidebar ── */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0 sticky top-24 self-start">

          {/* Avatar */}
          <div className="flex flex-col items-start text-left gap-3">
            {post.author?.image ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-100">
                <Image
                  src={urlFor(post.author.image).width(160).height(160).url()}
                  alt={post.author.name ?? 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-gray-100">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.6">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            )}

            {post.author?.name && (
              <p className="font-semibold text-gray-900 text-sm leading-snug">{post.author.name}</p>
            )}

            {post.author?.bio && (
              <p className="text-xs text-gray-400 leading-relaxed">{post.author.bio}</p>
            )}
          </div>

          <div className="w-full border-t border-gray-100" />

          {/* Meta */}
          <div className="flex flex-col gap-3 text-xs text-gray-400">
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{mins} min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </aside>

        {/* ── Right: post content ── */}
        <article className="flex-1 min-w-0">

          {/* Mobile author row */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            {post.author?.image ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image
                  src={urlFor(post.author.image).width(72).height(72).url()}
                  alt={post.author.name ?? 'Author'}
                  fill className="object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            )}
            <div>
              {post.author?.name && <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>}
              <p className="text-xs text-gray-400">{mins} min read · {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Tags (mobile) */}
          {post.tags?.length > 0 && (
            <div className="flex lg:hidden gap-2 flex-wrap mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight text-gray-900 mb-3">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-400 leading-relaxed mb-8">{post.excerpt}</p>
          )}

          {/* Actions */}
          <PostActions slug={post.slug.current} title={post.title} />

          {/* Cover image */}
          {post.coverImage && (
            <div className="relative w-full aspect-video overflow-hidden rounded-xl mb-10">
              <Image
                src={urlFor(post.coverImage).width(900).height(506).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body */}
          {post.body && <PortableTextRenderer value={post.body} />}

          {/* Bottom actions */}
          <PostActions slug={post.slug.current} title={post.title} />

        </article>
      </div>
    </div>
  )
}
