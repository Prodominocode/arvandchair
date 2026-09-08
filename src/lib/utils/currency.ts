import type { AppLocale } from '@/i18n/routing'

/**
 * فرمت عدد قیمت (بدون واحد پول) بر اساس اعداد رایج هر زبان — فارسی با ارقام فارسی،
 * انگلیسی/عربی با ارقام لاتین (خروجی واقعی Intl روی این ران‌تایم برای 'ar' هم لاتین است).
 * واحد پول («تومان»/«Toman») از ترجمه‌ی `Common.currency` جدا خوانده می‌شود، نه اینجا —
 * تا رشته‌های نمایشی همیشه از طریق next-intl عبور کنند.
 */
const INTL_LOCALE: Record<AppLocale, string> = {
  fa: 'fa-IR',
  en: 'en-US',
  ar: 'ar',
}

export function formatPrice(amount: number, locale: AppLocale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(amount)
}
