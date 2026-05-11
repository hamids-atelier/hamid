import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Hamid's Atelier")
    .items([
      S.listItem()
        .title('Blog Posts')
        .schemaType('post')
        .child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem()
        .title('Portfolio Projects')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Portfolio Projects')),
    ])
