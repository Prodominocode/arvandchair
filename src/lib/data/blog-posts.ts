/**
 * لایه‌ی Data Access برای Collection `BlogPosts` — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock
 * (`BlogPost`) Adapt می‌شود. توضیح کلی معماری در `lib/data/categories.ts`. نگاشت فیلدها:
 * `author` (relation به Users) → `authorName`، `content` (Lexical) → متن ساده با پاراگراف‌های
 * `\n\n`، `publishedDate` (Timestamp) → `YYYY-MM-DD` تقویم تهران.
 *
 * Draft/Publish فعال است — فقط `_status: published` خوانده می‌شود (رجوع به portfolio-projects.ts).
 */

import { cache } from 'react'

import type { BlogPost } from '@/lib/mock-data/blog-posts'
import type { AppLocale } from '@/i18n/routing'
import { lexicalToPlainText } from './lexical'
import {
  getPayloadClient,
  toImage,
  toLocalized,
  toSeo,
  toTehranDate,
  type LocalizedValue,
} from './payload'

/** نویسنده‌ی پیش‌فرض وقتی relation خالی است یا کاربرش حذف شده — همان مقدار Mock فاز ۳. */
const DEFAULT_AUTHOR_NAME = 'تیم محتوای اروند'

type LexicalState = Parameters<typeof lexicalToPlainText>[0]

type LocalizedBlogDoc = {
  id: number
  title: LocalizedValue
  slug: LocalizedValue
  excerpt: LocalizedValue
  content?: { fa?: LexicalState; en?: LexicalState } | null
  coverImage: unknown
  author?: unknown
  category?: LocalizedValue
  tags?: string[] | null
  publishedDate?: string | null
  createdAt: string
  seo?: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null
}

function authorName(author: unknown): string {
  if (author && typeof author === 'object' && 'name' in author && author.name) {
    return String(author.name)
  }
  return DEFAULT_AUTHOR_NAME
}

function toBlogPost(doc: LocalizedBlogDoc): BlogPost {
  const title = toLocalized(doc.title)
  const contentFa = lexicalToPlainText(doc.content?.fa)
  return {
    id: String(doc.id),
    title,
    slug: toLocalized(doc.slug),
    excerpt: toLocalized(doc.excerpt),
    content: { fa: contentFa, en: lexicalToPlainText(doc.content?.en) || contentFa },
    coverImage: toImage(doc.coverImage, title),
    authorName: authorName(doc.author),
    category: toLocalized(doc.category),
    tags: doc.tags ?? [],
    publishedDate: toTehranDate(doc.publishedDate ?? doc.createdAt),
    seo: toSeo(doc.seo),
  }
}

const loadBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'blog-posts',
    locale: 'all',
    depth: 1,
    pagination: false,
    where: { _status: { equals: 'published' } },
    sort: 'id',
  })
  return (docs as unknown as LocalizedBlogDoc[]).map(toBlogPost)
})

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...(await loadBlogPosts())].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1))
}

export async function getBlogPostBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  return (await loadBlogPosts()).find((post) => post.slug[locale] === slug) ?? null
}

/** پست‌های مرتبط برای جزئیات پست (`05-pages-build-order.md` #۱۲) — اول هم‌دسته‌ها (بر اساس
 * `category.fa` که یکتاکننده‌ی ساده‌ی دسته در mock است)، بعد در صورت کمبود از جدیدترین بقیه
 * پر می‌شود؛ خودِ پست هیچ‌وقت در نتیجه نیست. */
export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const rest = (await loadBlogPosts()).filter((candidate) => candidate.id !== post.id)
  const sameCategory = rest.filter((candidate) => candidate.category.fa === post.category.fa)
  const others = rest.filter((candidate) => candidate.category.fa !== post.category.fa)
  return [...sameCategory, ...others].slice(0, limit)
}
