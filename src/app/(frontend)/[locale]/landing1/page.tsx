import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories } from '@/lib/data/categories'
import { getFeaturedProducts } from '@/lib/data/products'
import { getTestimonials } from '@/lib/data/testimonials'
import { Landing1Content } from './landing1-content'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Landing1' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/landing1')

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: { canonical, languages },
    // این صفحه هنوز یک نمونه‌ی طراحی برای بازبینی داخلی است، نه صفحه‌ی نهایی اصلی — طبق الگوی
    // style-guide، از ایندکس‌شدن در نتایج جستجو کنار گذاشته می‌شود تا با Home تداخل محتوایی نسازد.
    robots: { index: false, follow: false },
  }
}

export default async function Landing1Page({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale

  const [categories, featuredProducts, testimonials] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getTestimonials(),
  ])

  const showcaseProducts = featuredProducts.map((product) => {
    const category = categories.find((c) => c.id === product.categoryId)
    return {
      id: product.id,
      title: product.title[appLocale],
      description: product.shortDescription[appLocale],
      href: `/products/${category?.slug[appLocale] ?? ''}/${product.slug[appLocale]}`,
    }
  })

  return (
    <Landing1Content locale={appLocale} products={showcaseProducts} testimonials={testimonials} />
  )
}
