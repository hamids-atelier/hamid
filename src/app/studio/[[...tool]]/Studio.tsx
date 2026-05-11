'use client'

import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from '@/sanity/schema'
import { structure } from '@/sanity/structure'

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Hamid's Atelier",
  basePath: '/studio',
  plugins: [structureTool({ structure })],
  schema,
})

export default function Studio() {
  return <NextStudio config={config} />
}
