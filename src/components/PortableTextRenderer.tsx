import { PortableText, type PortableTextComponents } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-semibold mt-8 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-6 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-xl font-semibold mt-5 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="leading-relaxed mb-4 text-black font-medium text-[1.125rem]">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neutral-300 pl-4 italic text-neutral-500 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-neutral-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-neutral-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="underline text-neutral-900 hover:text-brand-purple transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <div className="my-8 overflow-hidden rounded-xl">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt ?? ''}
            width={800}
            height={450}
            className="w-full object-cover"
          />
          {value.alt && (
            <p className="text-xs text-neutral-400 mt-2 text-center">{value.alt}</p>
          )}
        </div>
      )
    },
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableTextRenderer({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />
}
