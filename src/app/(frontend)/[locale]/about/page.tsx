import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { AboutContent } from './about-content'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/about')

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

export default async function AboutPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutContent />
}
