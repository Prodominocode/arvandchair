/**
 * Seed فاز ۵ — انتقال `lib/mock-data/*` به Collectionهای دامنه‌ی ۴‑الف در Payload.
 * اجرا: `pnpm seed` (= `payload run src/seed/index.ts`).
 *
 * - هر بار اجرا، اول همین Collectionها را کامل خالی می‌کند و از نو می‌سازد (Idempotent). به
 *   `users` دست نمی‌زند، جز ساختن/یافتن کاربر نویسنده‌ی بلاگ.
 * - هر سند اول با locale `fa` ساخته و بعد با `en` به‌روز می‌شود؛ در آرایه‌ها/بلوک‌ها id ردیف‌های
 *   نسخه‌ی fa دوباره فرستاده می‌شود (`withRowIds`) وگرنه Payload ردیف‌ها را از نو می‌سازد و مقدار
 *   fa از بین می‌رود.
 * - شناسه‌های رشته‌ای Mock روی واژه‌نامه‌ها در فیلد `key`، و روی واریانت‌ها در `variants[].key`
 *   نگه داشته می‌شوند؛ بقیه‌ی relationها با نگاشت mockId → id واقعی وصل می‌شوند.
 */

import { randomBytes } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

import config from '../payload.config'
import { plainTextToLexical } from '../lib/data/lexical'
import { blogPosts } from '../lib/mock-data/blog-posts'
import { categories, type Category } from '../lib/mock-data/categories'
import { productMaterials } from '../lib/mock-data/materials'
import { pages } from '../lib/mock-data/pages'
import { portfolioIndustries } from '../lib/mock-data/portfolio-industries'
import { portfolioProjects } from '../lib/mock-data/portfolio-projects'
import { products } from '../lib/mock-data/products'
import { quoteRequests } from '../lib/mock-data/quote-requests'
import { siteSettings } from '../lib/mock-data/site-settings'
import { productTags } from '../lib/mock-data/tags'
import { testimonials } from '../lib/mock-data/testimonials'
import type { LocalizedText, MockImage, SeoFields } from '../lib/mock-data/types'

type Locale = 'fa' | 'en'
type Id = number | string
type Data = Record<string, unknown>

const filename = fileURLToPath(import.meta.url)
const publicDir = path.resolve(path.dirname(filename), '../../public')

const BLOG_AUTHOR_EMAIL = 'content-team@arvand.local'

const direction = (locale: Locale) => (locale === 'fa' ? 'rtl' : 'ltr')
const seo = (value: SeoFields, locale: Locale) => ({
  metaTitle: value.metaTitle[locale],
  metaDescription: value.metaDescription[locale],
})

/** id ردیف‌های آرایه/بلوک سند fa را (بازگشتی) روی داده‌ی en می‌نشاند. */
function withRowIds<T>(target: T, source: unknown): T {
  if (Array.isArray(target) && Array.isArray(source)) {
    return target.map((row, index) => {
      const sourceRow = source[index] as Data | undefined
      const merged = withRowIds(row, sourceRow)
      return sourceRow && typeof sourceRow === 'object' && 'id' in sourceRow
        ? { ...(merged as Data), id: sourceRow.id }
        : merged
    }) as T
  }
  if (target && typeof target === 'object' && source && typeof source === 'object') {
    const result: Data = {}
    for (const [key, value] of Object.entries(target as Data)) {
      result[key] = withRowIds(value, (source as Data)[key])
    }
    return result as T
  }
  return target
}

/** ساخت سند دوزبانه: create با fa، سپس update با en (با حفظ id ردیف‌ها). */
async function createLocalized(
  payload: Payload,
  collection: CollectionSlug,
  build: (locale: Locale) => Data,
  options: { drafts?: boolean } = {},
): Promise<{ id: Id }> {
  const status = options.drafts ? { _status: 'published' } : {}
  const faDoc = (await payload.create({
    collection,
    locale: 'fa',
    data: { ...build('fa'), ...status } as never,
    overrideAccess: true,
    draft: false,
  })) as unknown as Data & { id: Id }

  await payload.update({
    collection,
    id: faDoc.id,
    locale: 'en',
    data: { ...withRowIds(build('en'), faDoc), ...status } as never,
    overrideAccess: true,
    draft: false,
  })
  return faDoc
}

async function wipe(payload: Payload) {
  // ترتیب معکوس وابستگی — Collectionهای ارجاع‌دهنده قبل از مرجع‌ها.
  const order: CollectionSlug[] = [
    'quote-requests',
    'pages',
    'testimonials',
    'blog-posts',
    'portfolio-projects',
    'products',
    'portfolio-industries',
    'product-materials',
    'product-tags',
    'categories',
    'media',
  ]
  for (const collection of order) {
    const { docs } = await payload.delete({
      collection,
      where: { id: { exists: true } },
      overrideAccess: true,
    })
    payload.logger.info(`  wiped ${collection}: ${docs.length}`)
  }
}

/** هر `src` یکتا فقط یک سند Media (alt اولین استفاده) — تصمیم تأییدشده‌ی پلن. */
function createMediaRegistry(payload: Payload) {
  const bySrc = new Map<string, Id>()
  return async function media(image: MockImage | string | null | undefined, alt?: LocalizedText) {
    if (!image) return null
    const src = typeof image === 'string' ? image : image.src
    const altText = typeof image === 'string' ? alt : image.alt
    const existing = bySrc.get(src)
    if (existing !== undefined) return existing

    const doc = await payload.create({
      collection: 'media',
      locale: 'fa',
      data: { alt: altText?.fa ?? '' },
      filePath: path.join(publicDir, src),
      overrideAccess: true,
    })
    if (altText) {
      await payload.update({
        collection: 'media',
        id: doc.id,
        locale: 'en',
        data: { alt: altText.en },
        overrideAccess: true,
      })
    }
    bySrc.set(src, doc.id)
    return doc.id
  }
}

async function findOrCreateBlogAuthor(payload: Payload, name: string): Promise<Id> {
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: BLOG_AUTHOR_EMAIL } },
    limit: 1,
    overrideAccess: true,
  })
  if (docs[0]) return docs[0].id
  const user = await payload.create({
    collection: 'users',
    data: {
      email: BLOG_AUTHOR_EMAIL,
      // کاربر نمایشی نویسنده — رمز تصادفی، کسی با آن وارد نمی‌شود.
      password: randomBytes(24).toString('base64url'),
      name,
      role: 'content-editor',
    },
    overrideAccess: true,
  })
  return user.id
}

function mapIds(ids: string[], lookup: Map<string, Id>, label: string): Id[] {
  return ids.map((mockId) => {
    const id = lookup.get(mockId)
    if (id === undefined) throw new Error(`Seed: unknown ${label} "${mockId}"`)
    return id
  })
}

async function seed() {
  const payload = await getPayload({ config })
  const media = createMediaRegistry(payload)

  payload.logger.info('Seed: wiping collections…')
  await wipe(payload)

  // ۱) واژه‌نامه‌ها
  payload.logger.info('Seed: vocabularies…')
  const tagIds = new Map<string, Id>()
  for (const tag of productTags) {
    const doc = await createLocalized(payload, 'product-tags', (locale) => ({
      key: tag.id,
      label: tag.label[locale],
    }))
    tagIds.set(tag.id, doc.id)
  }
  const materialIds = new Map<string, Id>()
  for (const material of productMaterials) {
    const doc = await createLocalized(payload, 'product-materials', (locale) => ({
      key: material.id,
      label: material.label[locale],
    }))
    materialIds.set(material.id, doc.id)
  }
  const industryIds = new Map<string, Id>()
  for (const industry of portfolioIndustries) {
    const doc = await createLocalized(payload, 'portfolio-industries', (locale) => ({
      key: industry.id,
      label: industry.label[locale],
    }))
    industryIds.set(industry.id, doc.id)
  }

  // ۲) Categories — والدها قبل از فرزندان (ترتیب توپولوژیک ساده روی parentId).
  payload.logger.info('Seed: categories…')
  const categoryIds = new Map<string, Id>()
  const pending: Category[] = [...categories]
  while (pending.length) {
    const index = pending.findIndex((c) => !c.parentId || categoryIds.has(c.parentId))
    if (index === -1) throw new Error('Seed: category parent cycle or missing parent')
    const category = pending.splice(index, 1)[0]!
    const image = await media(category.image)
    const doc = await createLocalized(payload, 'categories', (locale) => ({
      title: category.title[locale],
      slug: category.slug[locale],
      parent: category.parentId ? categoryIds.get(category.parentId) : null,
      image,
      salesMode: category.salesMode,
      seo: seo(category.seo, locale),
    }))
    categoryIds.set(category.id, doc.id)
  }

  // ۳) Products — مرحله‌ی اول بدون relatedProducts (ارجاع به خود Collection).
  payload.logger.info('Seed: products…')
  const productIds = new Map<string, Id>()
  for (const product of products) {
    const images: (Id | null)[] = []
    for (const image of product.images) images.push(await media(image))
    const featureImages: Id[][] = []
    for (const feature of product.features ?? []) {
      const ids: Id[] = []
      for (const image of feature.images) ids.push((await media(image)) as Id)
      featureImages.push(ids)
    }

    const doc = await createLocalized(payload, 'products', (locale) => ({
      title: product.title[locale],
      slug: product.slug[locale],
      sku: product.sku,
      category: mapIds([product.categoryId], categoryIds, 'category')[0],
      shortDescription: product.shortDescription[locale],
      description: plainTextToLexical(product.description[locale], direction(locale)),
      images,
      specs: {
        dimensions: product.specs.dimensions,
        material: product.specs.material[locale],
        weightKg: product.specs.weightKg,
        capacity: product.specs.capacity?.[locale] ?? null,
      },
      variants: product.variants.map((variant) => ({
        key: variant.id,
        label: variant.label[locale],
        priceModifier: variant.priceModifier,
        stock: variant.stock,
      })),
      basePrice: product.basePrice,
      currency: product.currency,
      stock: product.stock,
      salesMode: product.salesMode,
      tags: mapIds(product.tagIds, tagIds, 'tag'),
      materials: mapIds(product.materialIds, materialIds, 'material'),
      features: (product.features ?? []).map((feature, i) => ({
        title: feature.title[locale],
        text: feature.text[locale],
        images: featureImages[i],
      })),
      seo: seo(product.seo, locale),
    }))
    productIds.set(product.id, doc.id)
  }
  // مرحله‌ی دوم: relatedProducts (غیر Localized — یک update کافی است).
  for (const product of products) {
    if (!product.relatedProductIds.length) continue
    await payload.update({
      collection: 'products',
      id: productIds.get(product.id)!,
      data: { relatedProducts: mapIds(product.relatedProductIds, productIds, 'product') } as never,
      overrideAccess: true,
    })
  }

  // ۴) PortfolioProjects
  payload.logger.info('Seed: portfolio projects…')
  for (const project of portfolioProjects) {
    const coverImage = await media(project.coverImage)
    const gallery: (Id | null)[] = []
    for (const image of project.gallery) gallery.push(await media(image))
    await createLocalized(
      payload,
      'portfolio-projects',
      (locale) => ({
        title: project.title[locale],
        slug: project.slug[locale],
        clientName: project.clientName[locale],
        industry: project.industry[locale],
        industryRef: mapIds([project.industryId], industryIds, 'industry')[0],
        location: project.location[locale],
        scope: project.scope[locale],
        duration: project.duration[locale],
        completionYear: project.completionYear,
        coverImage,
        gallery,
        summary: project.summary[locale],
        challenge: project.challenge[locale],
        solution: project.solution[locale],
        productsUsed: mapIds(project.productIds, productIds, 'product'),
        featured: project.featured,
        seo: seo(project.seo, locale),
      }),
      { drafts: true },
    )
  }

  // ۵) BlogPosts
  payload.logger.info('Seed: blog posts…')
  const authors = new Map<string, Id>()
  for (const post of blogPosts) {
    if (!authors.has(post.authorName)) {
      authors.set(post.authorName, await findOrCreateBlogAuthor(payload, post.authorName))
    }
    const coverImage = await media(post.coverImage)
    await createLocalized(
      payload,
      'blog-posts',
      (locale) => ({
        title: post.title[locale],
        slug: post.slug[locale],
        excerpt: post.excerpt[locale],
        content: plainTextToLexical(post.content[locale], direction(locale)),
        coverImage,
        author: authors.get(post.authorName),
        category: post.category[locale],
        tags: post.tags,
        publishedDate: post.publishedDate,
        seo: seo(post.seo, locale),
      }),
      { drafts: true },
    )
  }

  // ۶) Testimonials
  payload.logger.info('Seed: testimonials…')
  for (const testimonial of testimonials) {
    const avatar = await media(testimonial.avatar)
    await createLocalized(payload, 'testimonials', (locale) => ({
      authorName: testimonial.authorName[locale],
      authorCompany: testimonial.authorCompany[locale],
      quote: testimonial.quote[locale],
      avatar,
      rating: testimonial.rating,
    }))
  }

  // ۷) Pages
  payload.logger.info('Seed: pages…')
  for (const page of pages) {
    await createLocalized(
      payload,
      'pages',
      (locale) => ({
        title: page.title[locale],
        slug: page.slug[locale],
        layout: page.layout.map((block) =>
          block.type === 'rich-text'
            ? {
                blockType: 'rich-text',
                content: plainTextToLexical(block.content[locale], direction(locale)),
              }
            : {
                blockType: 'cta',
                title: block.title[locale],
                buttonLabel: block.buttonLabel[locale],
                href: block.href,
              },
        ),
        seo: seo(page.seo, locale),
      }),
      { drafts: true },
    )
  }

  // ۸) QuoteRequests (بدون Localization؛ status فقط با overrideAccess قابل‌ست است)
  payload.logger.info('Seed: quote requests…')
  for (const request of quoteRequests) {
    await payload.create({
      collection: 'quote-requests',
      data: {
        company: request.company,
        contactName: request.contactName,
        email: request.email,
        phone: request.phone,
        items: request.items.map((item) => ({
          product: mapIds([item.productId], productIds, 'product')[0] as number,
          qty: item.qty,
          notes: item.notes,
        })),
        message: request.message,
        status: request.status,
        createdAt: new Date(request.createdAt).toISOString(),
      },
      overrideAccess: true,
    })
  }

  // ۹) Global SiteSettings
  payload.logger.info('Seed: site settings…')
  const logo = await media(siteSettings.logo)
  const logoOnDark = await media(siteSettings.logoOnDark, siteSettings.logo.alt)
  const buildSettings = (locale: Locale) => ({
    siteName: siteSettings.siteName[locale],
    tagline: siteSettings.tagline[locale],
    logo,
    logoOnDark,
    socialLinks: siteSettings.socialLinks,
    navMenu: siteSettings.navMenu.map((link) => ({
      label: link.label[locale],
      href: link.href,
      children: (link.children ?? []).map((child) => ({
        label: child.label[locale],
        href: child.href,
      })),
    })),
    offices: siteSettings.offices.map((office) => ({
      title: office.title[locale],
      type: office.type,
      address: office.address,
      phone: office.phone,
      hours: office.hours[locale],
    })),
    contactEmail: siteSettings.contactEmail,
    contactPhone: siteSettings.contactPhone,
  })
  const faSettings = await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'fa',
    data: buildSettings('fa') as never,
    overrideAccess: true,
  })
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: withRowIds(buildSettings('en'), faSettings) as never,
    overrideAccess: true,
  })

  const admins = await payload.count({
    collection: 'users',
    where: { role: { equals: 'superadmin' } },
    overrideAccess: true,
  })
  if (!admins.totalDocs) {
    // کاربر نویسنده‌ی بالا صفحه‌ی «ساخت اولین کاربر» پنل را از کار می‌اندازد.
    payload.logger.warn(
      'No superadmin exists — run `pnpm create-admin <email>` to log in to /admin.',
    )
  }

  payload.logger.info(
    `Seed done:${categoryIds.size} categories, ${productIds.size} products, ${tagIds.size} tags, ` +
      `${materialIds.size} materials, ${industryIds.size} industries, ${portfolioProjects.length} projects, ` +
      `${blogPosts.length} posts, ${testimonials.length} testimonials, ${pages.length} pages, ` +
      `${quoteRequests.length} quote requests.`,
  )
}

// Top-level await: `payload run` بلافاصله بعد از import ماژول process را می‌بندد.
try {
  await seed()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
