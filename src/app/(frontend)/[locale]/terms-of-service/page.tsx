import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getSiteSettings } from '@/lib/data/site-settings'
import { LegalPageContent } from '@/components/legal/LegalPageContent'

// تاریخ آخرین ویرایش محتوای این سند — با هر تغییر محسوس در متن شرایط، این مقدار را به‌روز کن.
const LAST_UPDATED_ISO = '2026-09-22'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'TermsOfService' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/terms-of-service')

  return {
    title: t('hero.title'),
    description: t('hero.intro'),
    alternates: { canonical, languages },
    openGraph: {
      title: t('hero.title'),
      description: t('hero.intro'),
    },
  }
}

/** `/{locale}/terms-of-service` — بسته‌ی ۶ #۲۴ (docs/05-pages-build-order.md). */
export default async function TermsOfServicePage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale
  const siteSettings = await getSiteSettings()

  return (
    <LegalPageContent
      namespace="TermsOfService"
      locale={appLocale}
      lastUpdatedIso={LAST_UPDATED_ISO}
      contactEmail={siteSettings.contactEmail}
      contactPhone={siteSettings.contactPhone}
    />
  )
}
