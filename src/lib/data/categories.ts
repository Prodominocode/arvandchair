/**
 * لایه‌ی Data Access برای Collection `Categories` — فاز ۳ از `lib/mock-data` می‌خواند؛ فاز ۵
 * بدنه‌ی همین توابع به Payload Local API وصل شد و خروجی به همان شکل Mock (`Category`) Adapt
 * می‌شود (کامپوننت‌های UI دست‌نخورده می‌مانند). نگاشت فیلدها: `parent` → `parentId`، id عددی
 * Payload → رشته.
 *
 * کل دسته‌ها با `cache()` یک بار در هر Request خوانده و بقیه‌ی توابع روی همان فیلتر می‌شوند —
 * تعداد دسته‌ها کم است و منطق دقیقاً همان منطق فاز ۳ می‌ماند.
 */

import { cache } from 'react'

import type { Category } from '@/lib/mock-data/categories'
import type { Category as PayloadCategory } from '@/payload-types'
import type { AppLocale } from '@/i18n/routing'
import { ALL_TAB_LABEL, type CategoryTab } from './categories.shared'
import {
  getPayloadClient,
  relationId,
  toImage,
  toLocalized,
  toSeo,
  type LocalizedValue,
} from './payload'

export { ALL_TAB_LABEL, type CategoryTab }

type LocalizedCategoryDoc = Omit<PayloadCategory, 'title' | 'slug' | 'seo'> & {
  title: LocalizedValue
  slug: LocalizedValue
  seo?: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null
}

function toCategory(doc: LocalizedCategoryDoc): Category {
  const title = toLocalized(doc.title)
  return {
    id: String(doc.id),
    title,
    slug: toLocalized(doc.slug),
    parentId: relationId(doc.parent),
    image: toImage(doc.image, title),
    salesMode: doc.salesMode,
    seo: toSeo(doc.seo),
  }
}

const loadCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale: 'all',
    depth: 1,
    pagination: false,
    // ترتیب درج (= ترتیب Mock/Seed)؛ ترتیب دستی دسته‌ها هنوز فیلدی در Schema ندارد.
    sort: 'id',
  })
  return (docs as unknown as LocalizedCategoryDoc[]).map(toCategory)
})

export async function getCategories(): Promise<Category[]> {
  return loadCategories()
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return (await loadCategories()).find((category) => category.id === id) ?? null
}

export async function getCategoryBySlug(locale: AppLocale, slug: string): Promise<Category | null> {
  return (await loadCategories()).find((category) => category.slug[locale] === slug) ?? null
}

export async function getTopLevelCategories(): Promise<Category[]> {
  return (await loadCategories()).filter((category) => category.parentId === null)
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return (await loadCategories()).filter((category) => category.parentId === parentId)
}

/**
 * یک دسته + تمام زیردسته‌های آن (بازگشتی، هرچند در Mock فعلی فقط یک سطح زیردسته وجود دارد) —
 * برای گرفتن «همه‌ی محصولات این خانواده‌ی دسته» در صفحه‌ی آرشیو (مثلاً `/products/chairs` باید
 * محصولات هر ۵ زیردسته‌ی صندلی را هم نشان دهد، نه فقط محصولات مستقیم خود `chairs`).
 */
export async function getCategoryWithDescendantIds(categoryId: string): Promise<string[]> {
  const ids = [categoryId]
  const children = await getSubcategories(categoryId)
  for (const child of children) {
    ids.push(...(await getCategoryWithDescendantIds(child.id)))
  }
  return ids
}

/**
 * ردیف Tabهای بالای آرشیو محصول (الگوی رفرنس Okamura: All / Office Chairs / Side & Guest
 * Chairs / ...) — عمومی برای هر خانواده‌ی دسته، نه فقط «صندلی». قانون:
 * - دسته‌ی جاری زیردسته دارد (مثل `chairs`) → تب‌ها: [خودش به‌عنوان «همه»، ...زیردسته‌هایش]
 * - دسته‌ی جاری خودش زیردسته است (مثل `chairs-side-guest`) → تب‌ها: [والدش به‌عنوان «همه»،
 *   ...همه‌ی زیردسته‌های همان والد (شامل خودش)]
 * - دسته‌ی جاری نه والد دارد نه فرزند (مثل `desks`) → آرایه‌ی تک‌عضوی برمی‌گردد؛ کامپوننت وقتی
 *   طول آرایه ≤ ۱ است ردیف Tab را اصلاً نمایش نمی‌دهد (چیزی برای سوییچ‌کردن نیست).
 */
export async function getCategoryTabs(currentCategoryId: string | null): Promise<CategoryTab[]> {
  if (currentCategoryId === null) {
    const topLevel = await getTopLevelCategories()
    return [
      { category: null, isAllTab: true, isActive: true },
      ...topLevel.map((category) => ({ category, isAllTab: false, isActive: false })),
    ]
  }

  const current = await getCategoryById(currentCategoryId)
  if (!current) return []

  const children = await getSubcategories(current.id)
  if (children.length > 0) {
    return [
      { category: current, isAllTab: true, isActive: true },
      ...children.map((child) => ({ category: child, isAllTab: false, isActive: false })),
    ]
  }

  if (current.parentId) {
    const parent = await getCategoryById(current.parentId)
    if (!parent) return [{ category: current, isAllTab: false, isActive: true }]
    const siblings = await getSubcategories(parent.id)
    return [
      { category: parent, isAllTab: true, isActive: false },
      ...siblings.map((sibling) => ({
        category: sibling,
        isAllTab: false,
        isActive: sibling.id === current.id,
      })),
    ]
  }

  return [{ category: current, isAllTab: false, isActive: true }]
}
