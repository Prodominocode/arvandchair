import { defineRouting } from 'next-intl/routing'

export const locales = ['fa', 'en'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'fa'

export const rtlLocales: AppLocale[] = ['fa']

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
})
