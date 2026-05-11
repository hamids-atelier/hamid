'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import ContactPanel from './ContactPanel'
import FaqPanel from './FaqPanel'

interface NavbarProps {
  theme?: 'light' | 'dark'
}

const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Work', href: '/work' },
]

export default function Navbar({ theme = 'light' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const openFaq = () => {
    setMenuOpen(false)
    setTimeout(() => setFaqOpen(true), 320)
  }

  const isLight = theme === 'light'
  const lineColor = isLight ? 'bg-white' : 'bg-black'
  const navClass = isLight
    ? 'relative z-20 flex items-center justify-between px-8 lg:px-14 pt-7'
    : 'sticky top-0 z-30 flex items-center justify-between px-8 lg:px-14 py-5 bg-white border-b border-gray-100'

  return (
    <>
      <nav aria-label="Main navigation" className={navClass}>
        <Link href="/" aria-label="Home">
          <Image
            src="/logo.svg"
            alt="HAMID"
            width={120}
            height={28}
            className={`h-7 w-auto ${isLight ? 'brightness-0 invert' : 'brightness-0'}`}
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <ContactPanel theme={theme} />

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="flex flex-col justify-center gap-[5px] p-2 -mr-2"
          >
            <span className={`block w-6 h-[2px] ${lineColor} transition-all duration-300`} />
            <span className={`block w-4 h-[2px] ${lineColor} transition-all duration-300`} />
            <span className={`block w-6 h-[2px] ${lineColor} transition-all duration-300`} />
          </button>
        </div>
      </nav>

      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
            className={`fixed inset-0 z-40 transition-all duration-500 ${
              menuOpen ? 'visible bg-black/50 backdrop-blur-sm' : 'invisible bg-transparent pointer-events-none'
            }`}
          />

          {/* Menu panel — slides from right */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={`fixed right-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                <Image src="/logo.svg" alt="HAMID" width={90} height={22} className="brightness-0 h-6 w-auto" />
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 bg-[#E8432D] hover:bg-[#d03a26] text-white rounded-full flex items-center justify-center transition-colors duration-150 shrink-0"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-8 pt-4 flex-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center justify-between py-5 border-b border-gray-100 text-2xl font-bold text-gray-900 hover:text-gray-500 transition-colors duration-200"
                >
                  {label}
                  <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
              <button
                onClick={openFaq}
                className="group flex items-center justify-between py-5 border-b border-gray-100 text-2xl font-bold text-gray-900 hover:text-gray-500 transition-colors duration-200 text-left"
              >
                FAQs
                <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-8 pb-8 pt-4">
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} Hamid&apos;s Atelier</p>
            </div>
          </aside>
        </>,
        document.body
      )}

      <FaqPanel open={faqOpen} onClose={() => setFaqOpen(false)} />
    </>
  )
}
