import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BlogPosts } from './collections/BlogPosts'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { PortfolioIndustries } from './collections/PortfolioIndustries'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { ProductMaterials } from './collections/ProductMaterials'
import { ProductTags } from './collections/ProductTags'
import { Products } from './collections/Products'
import { QuoteRequests } from './collections/QuoteRequests'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Categories,
    ProductTags,
    ProductMaterials,
    Products,
    PortfolioIndustries,
    PortfolioProjects,
    BlogPosts,
    Testimonials,
    Pages,
    QuoteRequests,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  localization: {
    locales: ['fa', 'en'],
    defaultLocale: 'fa',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
    },
  }),
  sharp,
})
