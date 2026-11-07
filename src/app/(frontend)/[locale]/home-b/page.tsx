import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getHomeData } from '../home-data'
import { Landing1Content } from '../landing1-content'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Landing1' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/home-b')

  return {
    title: `${t('meta.title')} (B)`,
    description: t('meta.description'),
    alternates: { canonical, languages },
    // نسخه‌ی B صفحه‌ی اصلی برای A/B تست سایدبار کاروسل — فقط بازبینی داخلی، نباید ایندکس شود
    robots: { index: false, follow: false },
  }
}

/** کپی صفحه‌ی اصلی (/) با نسخه‌ی B سایدبار کاروسل صندلی؛ داده و بقیه‌ی سکشن‌ها دقیقاً مثل A. */
export default async function HomeBPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale
  const { showcaseProducts, stories } = await getHomeData(appLocale)

  return (
    <Landing1Content
      locale={appLocale}
      products={showcaseProducts}
      stories={stories}
      sidebarVariant="b"
    />
  )
}
