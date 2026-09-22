import type { AppLocale } from '@/i18n/routing'

/**
 * فرمت تاریخ انتشار — فارسی با تقویم جلالی و ارقام فارسی، انگلیسی با تقویم میلادی،
 * دقیقاً هم‌قواره‌ی الگوی `formatPrice` (`lib/utils/currency.ts`).
 */
const INTL_LOCALE: Record<AppLocale, string> = {
  fa: 'fa-IR-u-ca-persian',
  en: 'en-US',
}

export function formatBlogDate(isoDate: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
}
