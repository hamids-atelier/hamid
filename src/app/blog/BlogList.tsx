'use client'

import { useState, useMemo, useRef, useEffect, useId } from 'react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const listboxId = useId()
  const searchId = useId()

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(p => p.tags?.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [posts])

  // options[0] = '' means "All topics" (clear filter)
  const options = useMemo(() => ['', ...allTags], [allTags])

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

  // Close on outside click or Escape
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  // Move DOM focus to the highlighted option
  useEffect(() => {
    if (!dropdownOpen || !listboxRef.current) return
    const items = listboxRef.current.querySelectorAll<HTMLElement>('[role="option"]')
    items[focusedIndex]?.focus()
  }, [focusedIndex, dropdownOpen])

  const openDropdown = () => {
    const idx = activeTag ? options.indexOf(activeTag) : 0
    setFocusedIndex(idx >= 0 ? idx : 0)
    setDropdownOpen(true)
  }

  const closeDropdown = () => {
    setDropdownOpen(false)
    triggerRef.current?.focus()
  }

  const selectOption = (value: string) => {
    setActiveTag(value || null)
    closeDropdown()
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      openDropdown()
    } else if (e.key === 'Escape') {
      setDropdownOpen(false)
    }
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(Math.min(index + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) closeDropdown()
      else setFocusedIndex(index - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      selectOption(value)
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      closeDropdown()
    }
  }

  const triggerLabel = activeTag ?? 'All topics'
  const hasFilters = !!(search || activeTag)

  return (
    <div>
      {/* Controls row — mirrors post card proportions */}
      <div className="flex items-center gap-6 mb-10">

        {/* Search */}
        <div role="search" className="relative flex-1 min-w-0">
          <label htmlFor={searchId} className="sr-only">Search articles</label>
          <svg
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            id={searchId}
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            aria-label="Search articles"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); searchRef.current?.focus() }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tag dropdown — fixed width matching thumbnails */}
        {allTags.length > 0 && (
          <div ref={dropdownRef} className="relative w-32 sm:w-52 shrink-0">
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-controls={listboxId}
              aria-label={`Filter by topic, currently: ${triggerLabel}`}
              onClick={() => dropdownOpen ? closeDropdown() : openDropdown()}
              onKeyDown={handleTriggerKeyDown}
              className={`w-full flex items-center justify-between gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                activeTag
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              <svg aria-hidden="true" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M1 3h12M3 7h8M5 11h4"/>
              </svg>
              <span className="flex-1 truncate text-left">{triggerLabel}</span>
              <svg
                aria-hidden="true"
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {dropdownOpen && (
              <ul
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                aria-label="Filter by topic"
                className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20 py-1"
              >
                {options.map((tag, i) => {
                  const isSelected = activeTag === (tag || null)
                  return (
                    <li
                      key={tag || '__all__'}
                      id={`${listboxId}-option-${i}`}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      onClick={() => selectOption(tag)}
                      onKeyDown={e => handleOptionKeyDown(e, tag, i)}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors outline-none focus:bg-gray-50 hover:bg-gray-50 ${
                        isSelected ? 'font-semibold text-gray-900' : 'text-gray-600'
                      } ${i === 0 ? 'border-b border-gray-100' : ''}`}
                    >
                      <span>{tag || 'All topics'}</span>
                      {isSelected && (
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none"
                          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2 7 6 11 12 3"/>
                        </svg>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {hasFilters
          ? `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'} found`
          : ''}
      </div>

      {/* Visual results count */}
      {hasFilters && (
        <p className="text-sm text-gray-400 mb-6" aria-hidden="true">
          {filtered.length === 0
            ? 'No articles match.'
            : `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'} found`}
        </p>
      )}

      {/* Post list */}
      <div className="divide-y divide-gray-100">
        {filtered.length === 0 && hasFilters ? (
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
                      <time dateTime={post.publishedAt} className="text-xs text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Thumbnail */}
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
