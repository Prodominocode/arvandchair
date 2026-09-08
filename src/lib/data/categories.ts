/**
 * لایه‌ی Data Access برای Collection `Categories` — فاز ۳ از `lib/mock-data` می‌خواند،
 * فاز ۵ فقط بدنه‌ی همین توابع به Payload Local API وصل می‌شود (کامپوننت‌های UI دست‌نخورده می‌مانند).
 *
 * همه‌ی توابع عمداً `async` هستند با اینکه Mock همگام (sync) است — چون فراخوان واقعی Payload
 * در فاز ۵ async است؛ این یعنی هیچ Call-site ای در UI موقع سوییچ به داده‌ی واقعی تغییر نمی‌کند.
 */

import { categories, type Category } from '@/lib/mock-data/categories'
import type { AppLocale } from '@/i18n/routing'

export async function getCategories(): Promise<Category[]> {
  return categories
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return categories.find((category) => category.id === id) ?? null
}

export async function getCategoryBySlug(locale: AppLocale, slug: string): Promise<Category | null> {
  return categories.find((category) => category.slug[locale] === slug) ?? null
}
