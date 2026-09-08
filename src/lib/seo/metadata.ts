/**
 * کمک‌تابع سئوی پایه‌ی فاز ۳ (docs/03-url-structure-seo.md بخش ۴) — فقط canonical/hreflang
 * نسبی می‌سازد (بدون دامنه‌ی مطلق، چون `metadataBase`/دامنه‌ی نهایی کار فاز ۹/۱۱ است).
 * سخت‌سازی کامل (Structured Data اضافه، OG اختصاصی هر صفحه، دامنه‌ی مطلق) در فاز ۹ انجام می‌شود؛
 * این فقط baseline لازم برای هر صفحه‌ی فاز ۳ را فراهم می‌کند.
 */

import { getPathname } from '@/i18n/navigation'
import { routing, type AppLocale } from '@/i18n/routing'

/**
 * `pathname` بدون پیشوند locale، مثلاً `/about` یا `/products/chairs/ara-managerial-chair`.
 * `canonical` به نسخه‌ی همین صفحه در همین زبان اشاره می‌کند (خودارجاع) — طبق سند ۰۳ فقط صفحات
 * فیلترشده/صفحه‌بندی‌شده باید به نسخه‌ی بدون فیلتر canonical بدهند، نه هر صفحه به فارسی.
 */
export function buildAlternates(
  locale: AppLocale,
  pathname: string,
): {
  canonical: string
  languages: Record<string, string>
} {
  const languages: Record<string, string> = {}
  for (const routeLocale of routing.locales) {
    languages[localeToHreflang(routeLocale)] = getPathname({ locale: routeLocale, href: pathname })
  }
  // x-default طبق سند ۰۳ همیشه به نسخه‌ی فارسیِ همین صفحه اشاره می‌کند (فارسی = defaultLocale بدون پیشوند).
  languages['x-default'] = getPathname({ locale: routing.defaultLocale, href: pathname })

  return {
    canonical: getPathname({ locale, href: pathname }),
    languages,
  }
}

function localeToHreflang(locale: AppLocale): string {
  if (locale === 'fa') return 'fa-IR'
  return locale
}
