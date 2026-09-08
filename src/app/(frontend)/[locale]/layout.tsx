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
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'اروند',
}

type Args = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

/**
 * فارسی همیشه فعال است؛ en/ar از Payload Global واقعی خوانده می‌شوند (سند ۰۳ بخش ۲) — همان
 * منبعی که پیش از این فقط برای notFound() چک می‌شد، حالا برای سوییچر زبان هم مصرف می‌شود.
 *
 * قبل از این تغییر، فارسی (defaultLocale) هرگز Payload را صدا نمی‌زد (Short-circuit فوری)؛
 * چون حالا حتی صفحه‌ی فارسی هم برای ساخت سوییچر زبان باید بداند en/ar فعال‌اند یا نه، این
 * فراخوانی دیگر قابل‌حذف نیست — اما طبق سیاست Local-First (docs/00-tech-stack.md بخش ۱.۲)،
 * یک قطعی موقت دیتابیس نباید فارسی (تجربه‌ی پیش‌فرض) را هم بشکند؛ در آن حالت فقط سوییچر
 * en/ar را مخفی می‌کنیم، فارسی همیشه در دسترس می‌ماند.
 */
async function getEnabledLocales(): Promise<AppLocale[]> {
  try {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({ slug: 'site-settings' })
    const enabled = (siteSettings.enabledLocales ?? []) as string[]

    return routing.locales.filter((locale) => locale === defaultLocale || enabled.includes(locale))
  } catch {
    return [defaultLocale]
  }
}

export default async function LocaleLayout({ children, params }: Args) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const enabledLocales = await getEnabledLocales()
  if (!enabledLocales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${manrope.variable} ${persianFont.variable}`}>
      <body className="flex min-h-svh flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} enabledLocales={enabledLocales} />
          {/* هدر اکنون fixed و بدون پس‌زمینه است (بدون فضای خودش در flow)؛ pt-16 دقیقاً معادل
              ارتفاع هدر (h-16) جای آن را جبران می‌کند. فقط هیرو صفحه‌ی اصلی با mt-16- منفی این
              فاصله را لغو می‌کند تا هدر شفاف روی آن شناور بماند. */}
          <main id="main-content" className="flex-1 pt-16">
            {children}
          </main>
          <Footer locale={locale} />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
