'use client'

import { useState } from 'react'

export default function AuthorBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      onClick={() => setExpanded(p => !p)}
      className="text-left group"
      aria-expanded={expanded}
    >
      <p className={`text-xs text-gray-400 leading-relaxed transition-all duration-200 ${expanded ? '' : 'line-clamp-3'}`}>
        {bio}
      </p>
      <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors mt-1 block">
        {expanded ? 'Show less ↑' : 'Read more ↓'}
      </span>
    </button>
  )
}
