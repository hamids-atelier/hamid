import HeroVideo from '@/components/HeroVideo'
import Navbar from '@/components/Navbar'
import ChatbotLoader from '@/components/ChatbotLoader'

export default function Home() {
  return (
    <main className="font-sans antialiased overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section aria-labelledby="hero-heading" className="relative flex flex-col overflow-hidden md:h-screen" style={{ minHeight: '400px' }}>

        <HeroVideo />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/10 to-black/40 pointer-events-none" />

        <Navbar theme="light" />

        {/* Video spacer — pushes intro below, ensures video is visible */}
        <div className="relative z-10 flex-1" style={{ minHeight: '400px' }} />

        {/* Intro — title left, body right */}
        <div className="relative z-10 w-full bg-white px-8 lg:px-16 py-14 grid md:grid-cols-2 gap-4 items-start">

          {/* Left — title + verse */}
          <div>
            <h1 id="hero-heading" className="text-3xl lg:text-4xl font-bold leading-snug text-gray-900">
              Welcome to <br /> Hamid&apos;s Atelier!
            </h1>
            <blockquote style={{ marginTop: '1.5rem', fontSize: '1rem', color: '#333333' }} className="leading-relaxed text-balance">
              &ldquo;Whatever you do, work at it with all your heart, as working for the Lord, not for human masters&rdquo; &mdash; Colossians 3:23
            </blockquote>
          </div>

          {/* Right — body copy */}
          <p className="text-gray-900 leading-relaxed text-balance" style={{ fontSize: '1.2rem' }}>
            Since 2007, I have shaped ideas into refined digital experiences across graphic design, UI, UX, and web development. I combine creative thinking with technical skill and a clear understanding of your brand to build custom solutions that engage your audience and support real business growth.
          </p>

        </div>
      </section>

      {/* ── Chatbot ── */}
      <ChatbotLoader />

    </main>
  )
}
