import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { hasLocale } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { defaultLocale, routing, rtlLocales, type AppLocale } from '@/i18n/routing'
import { manrope, persianFont } from '@/styles/fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'اروند',
}

type Args = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

async function isLocaleEnabled(locale: AppLocale): Promise<boolean> {
  if (locale === defaultLocale) return true

  const payload = await getPayload({ config })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
  const enabledLocales = (siteSettings.enabledLocales ?? []) as string[]

  return enabledLocales.includes(locale)
}

export default async function LocaleLayout({ children, params }: Args) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  if (!(await isLocaleEnabled(locale))) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${manrope.variable} ${persianFont.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
