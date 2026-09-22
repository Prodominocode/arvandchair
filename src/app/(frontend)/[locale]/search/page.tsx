import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { getCategories } from '@/lib/data/categories'
import { searchContent } from '@/lib/data/search'
import { SearchResultsContent } from '@/components/search/SearchResultsContent'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Search' })

  return {
    title: t('metaTitle'),
    // نتایج جست‌وجو کیفیت پایینی برای ایندکس گوگل دارند و به‌ازای هر عبارت یک URL متفاوت
    // می‌سازند — طبق `docs/03-url-structure-seo.md` (اولویت سئوی صفحه‌ی جست‌وجو: پایین/noindex).
    robots: { index: false, follow: true },
  }
}

/**
 * `/{locale}/search?q=...` — صفحه‌ی نتایج جست‌وجو (`05-pages-build-order.md` بسته‌ی ۲ #۸).
 * فعلاً به‌جای Meilisearch (هنوز وصل نشده، `lib/meilisearch/`) از فیلتر ساده‌ی
 * `lib/data/search.ts` روی mock data استفاده می‌کند؛ همان قرارداد صفحه، بدنه‌ی همان یک تابع
 * بعداً عوض می‌شود.
 */
export default async function SearchPage({ params, searchParams }: Args) {
  const { locale } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const [categories, { products, blogPosts }] = await Promise.all([
    getCategories(),
    searchContent(appLocale, query),
  ])

  const categorySlugById = Object.fromEntries(
    categories.map((category) => [category.id, category.slug[appLocale]]),
  )

  return (
    <SearchResultsContent
      locale={appLocale}
      query={query}
      products={products}
      blogPosts={blogPosts}
      categorySlugById={categorySlugById}
    />
  )
}
