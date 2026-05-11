import { client, urlFor } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  description: string
  coverImage: object
  tags: string[]
  year: number
  featured: boolean
}

async function getProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(year desc) {
      _id, title, slug, description, coverImage, tags, year, featured
    }`
  )
}

export default async function WorkPage() {
  const projects = await getProjects()

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold mb-12">Work</h1>
      {projects.length === 0 && (
        <p className="text-neutral-500">No projects yet. Add one in the Studio.</p>
      )}
      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/work/${project.slug.current}`}
            className="group flex flex-col gap-4"
          >
            {project.coverImage && (
              <div className="relative w-full aspect-video overflow-hidden rounded-xl">
                <Image
                  src={urlFor(project.coverImage).width(640).height(360).url()}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold group-hover:underline">{project.title}</h2>
                {project.year && <span className="text-sm text-neutral-400">{project.year}</span>}
              </div>
              {project.description && (
                <p className="text-neutral-500 text-sm line-clamp-2">{project.description}</p>
              )}
              {project.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
