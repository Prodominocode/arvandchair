import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getPortfolioIndustries } from '@/lib/data/portfolio-industries'
import {
  getFilteredPortfolioProjects,
  getPortfolioIndustryTabs,
} from '@/lib/data/portfolio-projects'
import { PortfolioArchiveContent } from '@/components/portfolio/PortfolioArchiveContent'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ industry?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Portfolio' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/portfolio')

  return {
    title: t('archiveTitle'),
    description: t('subtitle'),
    alternates: { canonical, languages },
    openGraph: { title: t('archiveTitle'), description: t('subtitle') },
  }
}

/**
 * `/{locale}/portfolio` — لیست نمونه‌کارها (`05-pages-build-order.md` بسته‌ی ۳ #۹). فیلتر صنعت
 * طبق سند ۰۳ بخش ۳ همیشه Query Param است (`?industry=`)، برای همین `canonical` بالا فقط به
 * مسیر بدون فیلتر اشاره می‌کند نه به هر ترکیب فیلتر — هم‌قانون `/products`.
 */
export default async function PortfolioPage({ params, searchParams }: Args) {
  const { locale } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const sp = await searchParams
  const activeIndustryId = sp.industry ?? null

  const [t, industries, tabs, projects] = await Promise.all([
    getTranslations({ locale, namespace: 'Portfolio' }),
    getPortfolioIndustries(),
    getPortfolioIndustryTabs(activeIndustryId),
    getFilteredPortfolioProjects(activeIndustryId ?? undefined),
  ])

  const industryLabelById = Object.fromEntries(
    industries.map((industry) => [industry.id, industry.label[appLocale]]),
  )

  return (
    <PortfolioArchiveContent
      key={sp.industry ?? ''}
      locale={appLocale}
      title={t('archiveTitle')}
      subtitle={t('subtitle')}
      tabs={tabs}
      projects={projects}
      industryLabelById={industryLabelById}
    />
  )
}
