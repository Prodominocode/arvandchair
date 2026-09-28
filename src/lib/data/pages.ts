/**
 * لایه‌ی Data Access برای Collection `Pages` — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock
 * (`Page`) Adapt می‌شود. توضیح کلی معماری در `lib/data/categories.ts`. نگاشت فیلدها: بلوک‌ها
 * `blockType` → `type`، `content` بلوک rich-text (Lexical) → متن ساده. Draft/Publish فعال است —
 * فقط `_status: published` خوانده می‌شود.
 *
 * ⚠️ فعلاً هیچ Routeی این تابع را صدا نمی‌زند: صفحات حریم‌خصوصی/شرایط استفاده در فاز ۳ متن‌شان را
 * از پیام‌های next-intl (`LegalPageContent`) می‌گیرند، نه از این Collection — ویرایش Pages در پنل
 * هنوز روی سایت اثری ندارد (docs/progress/phase-05-data-wiring.md).
 */

import type { Page, PageBlock } from '@/lib/mock-data/pages'
import type { AppLocale } from '@/i18n/routing'
import { lexicalToPlainText } from './lexical'
import { getPayloadClient, toLocalized, toSeo, type LocalizedValue } from './payload'

type LexicalState = Parameters<typeof lexicalToPlainText>[0]

type LocalizedBlock =
  | { blockType: 'rich-text'; content?: { fa?: LexicalState; en?: LexicalState } | null }
  | { blockType: 'cta'; title: LocalizedValue; buttonLabel: LocalizedValue; href: string }

type LocalizedPageDoc = {
  id: number
  title: LocalizedValue
  slug: LocalizedValue
  layout?: LocalizedBlock[] | null
  seo?: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null
}

function toBlock(block: LocalizedBlock): PageBlock {
  if (block.blockType === 'cta') {
    return {
      type: 'cta',
      title: toLocalized(block.title),
      buttonLabel: toLocalized(block.buttonLabel),
      href: block.href,
    }
  }
  const fa = lexicalToPlainText(block.content?.fa)
  return { type: 'rich-text', content: { fa, en: lexicalToPlainText(block.content?.en) || fa } }
}

export async function getPageBySlug(locale: AppLocale, slug: string): Promise<Page | null> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    locale: 'all',
    depth: 1,
    limit: 1,
    where: {
      and: [{ _status: { equals: 'published' } }, { [`slug.${locale}`]: { equals: slug } }],
    },
  })
  const doc = docs[0] as unknown as LocalizedPageDoc | undefined
  if (!doc) return null
  return {
    id: String(doc.id),
    title: toLocalized(doc.title),
    slug: toLocalized(doc.slug),
    layout: (doc.layout ?? []).map(toBlock),
    seo: toSeo(doc.seo),
  }
}
