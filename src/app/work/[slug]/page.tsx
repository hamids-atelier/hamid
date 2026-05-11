import { client, urlFor } from '@/lib/sanity'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  description: string
  coverImage: object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]
  tags: string[]
  year: number
  url: string
}

export const revalidate = 60

async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      _id, title, slug, description, coverImage, body, tags, year, url
    }`,
    { slug }
  )
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    `*[_type == "project"]{ "slug": slug.current }`
  )
  return slugs.map(({ slug }) => ({ slug }))
}

export default async function WorkProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-20">
      {project.coverImage && (
        <div className="relative w-full h-64 mb-10 overflow-hidden rounded-xl">
          <Image
            src={urlFor(project.coverImage).width(800).height(400).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <header className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          {project.year && <span className="text-neutral-400">{project.year}</span>}
        </div>
        {project.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.url && (
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm underline text-neutral-600 hover:text-neutral-900"
          >
            View live project →
          </Link>
        )}
      </header>
      {project.body && <PortableTextRenderer value={project.body} />}
    </main>
  )
}
