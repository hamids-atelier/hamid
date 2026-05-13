'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

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

export default function BlogList({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(p => p.tags?.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [posts])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return posts.filter(post => {
      const matchesSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.tags?.some(t => t.toLowerCase().includes(q))
      const matchesTag = !activeTag || post.tags?.includes(activeTag)
      return matchesSearch && matchesTag
    })
  }, [posts, search, activeTag])

  return (
    <div>
      {/* Search + Tag filter row */}
      <div className="flex items-center gap-3 mb-10 flex-wrap sm:flex-nowrap">

        {/* Search bar */}
        <div className="relative w-full sm:w-72 shrink-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-8 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tag chips — horizontally scrollable */}
        {allTags.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none min-w-0 pb-0.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all duration-150 ${
                  activeTag === tag
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-800'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {(search || activeTag) && (
        <p className="text-sm text-gray-400 mb-6">
          {filtered.length === 0
            ? 'No articles match.'
            : `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'} found`}
        </p>
      )}

      {/* Post list */}
      <div className="divide-y divide-gray-100">
        {filtered.length === 0 && (search || activeTag) ? (
          <p className="text-gray-400 py-16 text-center text-sm">No articles match your search.</p>
        ) : (
          filtered.map((post) => (
            <article key={post._id} className="py-8 first:pt-0">
              <Link
                href={`/blog/${post.slug.current}`}
                className="group flex gap-6 items-start justify-between"
              >
                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
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

                  <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:underline line-clamp-3 decoration-gray-300">
                    {post.title}
                  </h2>

                  {post.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {post.publishedAt && (
                      <time className="text-xs text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.tags?.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail — bigger */}
                {post.coverImage && (
                  <div className="relative w-32 h-24 sm:w-52 sm:h-36 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={urlFor(post.coverImage).width(416).height(288).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-300"
                    />
                  </div>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
