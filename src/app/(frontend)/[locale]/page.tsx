import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getHomeData } from './home-data'
import { Landing1Content } from './landing1-content'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Landing1' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/')

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { canonical, languages },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/images/landing1/hero-img1.png'],
    },
  }
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale

  const { showcaseProducts, stories, siteSettings } = await getHomeData(appLocale)

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.siteName[appLocale],
    url: '/',
    logo: siteSettings.logo.src,
    sameAs: siteSettings.socialLinks.map((social) => social.url),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteSettings.contactPhone,
      email: siteSettings.contactEmail,
      contactType: 'sales',
    },
  }

  return (
    <>
      {/* Structured Data — Organization (docs/03-url-structure-seo.md بخش ۴) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Landing1Content locale={appLocale} products={showcaseProducts} stories={stories} />
    </>
  )
}
