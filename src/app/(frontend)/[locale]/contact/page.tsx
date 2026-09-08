import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getOffices, getSiteSettings } from '@/lib/data/site-settings'
import { ContactContent } from './contact-content'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/contact')

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical, languages },
    openGraph: { title: t('title'), description: t('subtitle') },
  }
}

export default async function ContactPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale

  const [offices, siteSettings] = await Promise.all([getOffices(), getSiteSettings()])

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@graph': offices.map((office) => ({
      '@type': 'LocalBusiness',
      name: `${siteSettings.siteName[appLocale]} — ${office.title[appLocale]}`,
      telephone: office.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: office.address.street,
        addressLocality: office.address.city,
        addressRegion: office.address.province,
        postalCode: office.address.postalCode,
        addressCountry: 'IR',
      },
    })),
  }

  return (
    <>
      {/* Structured Data — LocalBusiness به‌ازای هر شعبه (docs/03-url-structure-seo.md بخش ۴) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <ContactContent offices={offices} contactEmail={siteSettings.contactEmail} />
    </>
  )
}
