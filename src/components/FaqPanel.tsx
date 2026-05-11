'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const FAQS = [
  {
    q: 'How much does a website cost?',
    a: "Every project is different. Pricing depends on scope, number of pages, custom features, and timeline. I'll provide a clear, detailed quote after a brief discovery call.",
  },
  {
    q: 'How long does it take to build a website?',
    a: "A typical website takes 4 to 8 weeks from kickoff to launch. More complex projects with custom functionality can take longer. You'll receive a clear timeline before any work begins.",
  },
  {
    q: 'Do you provide photos, images, and website copy (text)?',
    a: "Content is what makes a website truly work. If you don't have professional photography or written copy ready, you have a few options: you can hire your own, or I can connect you with trusted photographers and copywriters from my network whose fees are separate and billed directly to you. Where stock imagery makes sense, I can source it for you and that cost is also passed on to you at cost. I'll advise on exactly what you need from day one.",
  },
  {
    q: 'What do I need to provide before we start?',
    a: "Typically: your brand assets (logo, colours, fonts), any existing content (text and photos), a few websites you like the look of, and a clear idea of your goals. Don't worry if you're missing some of it. We'll figure it out together.",
  },
  {
    q: 'Will my website be mobile-friendly?',
    a: 'Absolutely. Every website I build is fully responsive and tested across phones, tablets, and desktops to make sure it looks great and works perfectly on every screen size.',
  },
  {
    q: "Can I update the website myself after it's built?",
    a: "Yes. Depending on your needs, I can build on a CMS that lets you edit content without touching code. I'll also walk you through everything at handover so you feel confident managing it.",
  },
  {
    q: 'Do you handle hosting and domain setup?',
    a: "Yes. I can recommend reliable hosting providers, help you register a domain, and handle the full technical setup so you don't have to deal with any of it.",
  },
  {
    q: 'What happens after the website launches?',
    a: "I include a post-launch support window to catch any issues. After that, I offer ongoing maintenance packages covering updates, security monitoring, and performance checks.",
  },
  {
    q: 'Will my website be optimised for search engines (SEO)?',
    a: "Yes. Every site I build follows SEO best practices: clean code, fast load times, proper meta tags, structured data, and mobile optimisation. For deeper SEO work like content strategy or link building, I can refer you to a specialist.",
  },
  {
    q: 'Can you redesign my existing website?',
    a: "Absolutely. Whether you need a full visual overhaul or improvements to performance and UX, I can work with your existing content or start completely fresh. We'll figure out which approach makes more sense for your goals.",
  },
  {
    q: 'What does the payment process look like?',
    a: 'Projects are split into milestones: a deposit upfront to kick things off, a payment at design approval, and the final payment before launch. I accept bank transfer and major credit cards.',
  },
]

interface FaqPanelProps {
  open: boolean
  onClose: () => void
}

export default function FaqPanel({ open, onClose }: FaqPanelProps) {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState<number | null>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const toggle = (index: number) => setActive(prev => (prev === index ? null : index))

  if (!mounted) return null

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          open ? 'visible bg-black/60 backdrop-blur-sm' : 'invisible bg-transparent pointer-events-none'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Frequently Asked Questions"
        className={`fixed left-0 top-0 bottom-0 z-50 w-full max-w-120 bg-white shadow-2xl overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-10 pt-10 pb-16">
          <div className="flex items-start justify-between mb-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">FAQs</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="mt-1 ml-6 shrink-0 w-10 h-10 bg-[#E8432D] hover:bg-[#d03a26] text-white rounded-full flex items-center justify-center transition-colors duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={active === i}
                  className="w-full flex items-center justify-between gap-4 py-3 text-left group"
                >
                  <span className="text-gray-900 font-semibold text-base leading-snug group-hover:text-black">
                    {faq.q}
                  </span>
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 group-hover:text-black transition-colors">
                    {active === i ? (
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                        <path d="M1 1h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${active === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="pb-5 text-gray-800 text-md leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>,
    document.body
  )
}
