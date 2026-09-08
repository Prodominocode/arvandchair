/**
 * لایه‌ی Data Access برای Collection `Pages`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۶ (حریم خصوصی/شرایط استفاده).
 */

import { pages, type Page } from '@/lib/mock-data/pages'
import type { AppLocale } from '@/i18n/routing'

export async function getPageBySlug(locale: AppLocale, slug: string): Promise<Page | null> {
  return pages.find((page) => page.slug[locale] === slug) ?? null
}
