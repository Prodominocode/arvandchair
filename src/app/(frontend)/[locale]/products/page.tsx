import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories, getCategoryTabs } from '@/lib/data/categories'
import { getFilteredProducts, type ProductSortOption } from '@/lib/data/products'
import { getProductTags } from '@/lib/data/tags'
import { getProductMaterials } from '@/lib/data/materials'
import { ProductArchiveContent } from '@/components/products/ProductArchiveContent'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string; material?: string; sort?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Products' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/products')

  return {
    title: t('allProductsTitle'),
    alternates: { canonical, languages },
    openGraph: { title: t('allProductsTitle') },
  }
}

/**
 * `/{locale}/products` — لیست همه‌ی محصولات (`05-pages-build-order.md` بسته‌ی ۲ #۵). فیلتر/
 * مرتب‌سازی همیشه Query Param است (سند ۰۳ بخش ۳)، برای همین `canonical` بالا فقط به مسیر بدون
 * فیلتر اشاره می‌کند نه به هر ترکیب فیلتر.
 */
export default async function ProductsPage({ params, searchParams }: Args) {
  const { locale } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const sp = await searchParams
  const tagIds = sp.tag?.split(',').filter(Boolean) ?? []
  const materialIds = sp.material ? [sp.material] : []
  const sort = (sp.sort as ProductSortOption | undefined) ?? 'featured'

  const [t, categories, tabs, tags, materials, products] = await Promise.all([
    getTranslations({ locale, namespace: 'Products' }),
    getCategories(),
    getCategoryTabs(null),
    getProductTags(),
    getProductMaterials(),
    getFilteredProducts(appLocale, { tagIds, materialIds, sort }),
  ])

  const categorySlugById = Object.fromEntries(
    categories.map((category) => [category.id, category.slug[appLocale]]),
  )

  return (
    <ProductArchiveContent
      key={`${sp.tag ?? ''}|${sp.material ?? ''}|${sp.sort ?? ''}`}
      locale={appLocale}
      title={t('allProductsTitle')}
      crumbs={[{ label: t('breadcrumb.home'), href: '/' }, { label: t('breadcrumb.products') }]}
      tabs={tabs}
      tags={tags}
      materials={materials}
      products={products}
      categorySlugById={categorySlugById}
    />
  )
}
