/**
 * لایه‌ی Data Access برای Collection `Categories` — فاز ۳ از `lib/mock-data` می‌خواند،
 * فاز ۵ فقط بدنه‌ی همین توابع به Payload Local API وصل می‌شود (کامپوننت‌های UI دست‌نخورده می‌مانند).
 *
 * همه‌ی توابع عمداً `async` هستند با اینکه Mock همگام (sync) است — چون فراخوان واقعی Payload
 * در فاز ۵ async است؛ این یعنی هیچ Call-site ای در UI موقع سوییچ به داده‌ی واقعی تغییر نمی‌کند.
 */

import { categories, type Category } from '@/lib/mock-data/categories'
import type { AppLocale } from '@/i18n/routing'
import type { LocalizedText } from '@/lib/mock-data/types'

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return categories.find((category) => category.id === id) ?? null
}

export async function getCategoryBySlug(locale: AppLocale, slug: string): Promise<Category | null> {
  return categories.find((category) => category.slug[locale] === slug) ?? null
}

export async function getTopLevelCategories(): Promise<Category[]> {
  return categories.filter((category) => category.parentId === null)
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  return categories.filter((category) => category.parentId === parentId)
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

export type CategoryTab = {
  /** `null` فقط برای تب «همه‌ی محصولات» در ریشه‌ی `/products` — بدون Category واقعی، چون خودِ
   * ریشه معادل هیچ رکورد Category‌ای نیست. */
  category: Category | null
  /** تب «همه» روی خودِ دسته‌ی جاری (اگر والد است)، والدش (اگر زیردسته است)، یا ریشه‌ی
   * `/products` اشاره می‌کند — برچسبش همیشه از `ALL_TAB_LABEL` می‌آید، نه عنوان واقعی دسته. */
  isAllTab: boolean
  isActive: boolean
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

export const ALL_TAB_LABEL: LocalizedText = { fa: 'همه', en: 'All' }
