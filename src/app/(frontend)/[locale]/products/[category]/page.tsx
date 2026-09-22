import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories, getCategoryBySlug, getCategoryTabs } from '@/lib/data/categories'
import { getFilteredProducts, type ProductSortOption } from '@/lib/data/products'
import { getProductTags } from '@/lib/data/tags'
import { getProductMaterials } from '@/lib/data/materials'
import { ProductArchiveContent } from '@/components/products/ProductArchiveContent'

type Args = {
  params: Promise<{ locale: string; category: string }>
  searchParams: Promise<{ tag?: string; material?: string; sort?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  const appLocale = locale as AppLocale
  const category = await getCategoryBySlug(appLocale, categorySlug)
  if (!category) return {}

  const { canonical, languages } = buildAlternates(appLocale, `/products/${categorySlug}`)
  const title = category.seo.metaTitle[appLocale]
  const description = category.seo.metaDescription[appLocale]

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description },
  }
}

/**
 * `/{locale}/products/{category-slug}` — لیست محصولات یک دسته (`05-pages-build-order.md`
 * بسته‌ی ۲ #۶)؛ همان کامپوننت `ProductArchiveContent` صفحه‌ی #۵ با پیش‌فیلتر دسته. `category`
 * می‌تواند دسته‌ی سطح‌بالا (مثل `chairs`) یا زیردسته (مثل `chairs-side-guest`) باشد —
 * `getCategoryTabs`/`getFilteredProducts` هر دو حالت را عمومی پوشش می‌دهند.
 */
export default async function ProductCategoryPage({ params, searchParams }: Args) {
  const { locale, category: categorySlug } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const category = await getCategoryBySlug(appLocale, categorySlug)
  if (!category) notFound()

  const sp = await searchParams
  const tagIds = sp.tag?.split(',').filter(Boolean) ?? []
  const materialIds = sp.material ? [sp.material] : []
  const sort = (sp.sort as ProductSortOption | undefined) ?? 'featured'

  const [t, categories, tabs, tags, materials, products] = await Promise.all([
    getTranslations({ locale, namespace: 'Products' }),
    getCategories(),
    getCategoryTabs(category.id),
    getProductTags(),
    getProductMaterials(),
    getFilteredProducts(appLocale, { categoryId: category.id, tagIds, materialIds, sort }),
  ])

  const categorySlugById = Object.fromEntries(categories.map((c) => [c.id, c.slug[appLocale]]))

  const crumbs = [
    { label: t('breadcrumb.home'), href: '/' },
    { label: t('breadcrumb.products'), href: '/products' },
    { label: category.title[appLocale] },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: crumb.href } : {}),
    })),
  }

  return (
    <>
      {/* BreadcrumbList طبق چک‌لیست سئو (سند ۰۳ بخش ۴) — این صفحه عمق ۲ است. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductArchiveContent
        key={`${sp.tag ?? ''}|${sp.material ?? ''}|${sp.sort ?? ''}`}
        locale={appLocale}
        title={category.title[appLocale]}
        crumbs={crumbs}
        tabs={tabs}
        tags={tags}
        materials={materials}
        products={products}
        categorySlugById={categorySlugById}
      />
    </>
  )
}
