'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  slug: string
  title: string
}

function ShareDropdown({ title, onClose }: { title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '')

  const copyLink = async () => {
    await navigator.clipboard.writeText(getUrl())
    setCopied(true)
    setTimeout(() => { setCopied(false); onClose() }, 1500)
  }

  const options = [
    {
      label: copied ? 'Copied!' : 'Copy Link',
      action: copyLink,
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      ),
    },
    {
      label: 'X (Twitter)',
      action: () => {
        window.open(
          `https://x.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`,
          '_blank', 'noopener'
        )
        onClose()
      },
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
          '_blank', 'noopener'
        )
        onClose()
      },
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
          '_blank', 'noopener'
        )
        onClose()
      },
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ]

  return (
    <div
      ref={ref}
      className="absolute bottom-full right-0 mb-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden"
    >
      {options.map(({ label, action, icon }) => (
        <button
          key={label}
          onClick={action}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100 text-left"
        >
          <span className="text-gray-500">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  )
}

export default function PostActions({ slug, title }: Props) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    setLiked(!!localStorage.getItem(`liked:${slug}`))
    setBookmarked(!!localStorage.getItem(`bookmarked:${slug}`))
  }, [slug])

  const toggleLike = () => {
    const next = !liked
    setLiked(next)
    if (next) localStorage.setItem(`liked:${slug}`, '1')
    else localStorage.removeItem(`liked:${slug}`)
  }

  const toggleBookmark = () => {
    const next = !bookmarked
    setBookmarked(next)
    if (next) localStorage.setItem(`bookmarked:${slug}`, '1')
    else localStorage.removeItem(`bookmarked:${slug}`)
  }

  const closeShare = useCallback(() => setShareOpen(false), [])

  return (
    <div className="flex items-center justify-between py-4 border-y border-gray-200 my-8">
      {/* Left — like */}
      <button
        onClick={toggleLike}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={`flex items-center gap-1.5 transition-colors duration-150 ${
          liked ? 'text-green-600' : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        <span className="text-sm font-medium">{liked ? 'Liked' : 'Like'}</span>
      </button>

      {/* Right — bookmark + share */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleBookmark}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          className={`transition-colors duration-150 ${
            bookmarked ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>

        {/* Share with dropdown */}
        <div className="relative">
          <button
            onClick={() => setShareOpen(p => !p)}
            aria-label="Share"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors duration-150"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span className="text-sm font-medium">Share</span>
          </button>

          {shareOpen && <ShareDropdown title={title} onClose={closeShare} />}
        </div>
      </div>
    </div>
  )
}
