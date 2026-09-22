import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories } from '@/lib/data/categories'
import { getFeaturedProducts } from '@/lib/data/products'
import { getProductById } from '@/lib/data/products'
import { getProductStories } from '@/lib/data/product-stories'
import { getSiteSettings } from '@/lib/data/site-settings'
import { Landing1Content } from './landing1-content'
import type { StoryItem } from './stories-section'

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

  const [categories, featuredProducts, productStories, siteSettings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getProductStories(),
    getSiteSettings(),
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

  // استوری‌هایی که محصولشان پیدا نشد (مثلاً حذف‌شده) کنار گذاشته می‌شوند
  const resolvedStories = await Promise.all(
    productStories.map(async (story): Promise<StoryItem | null> => {
      const product = await getProductById(story.productId)
      if (!product) return null
      const category = categories.find((c) => c.id === product.categoryId)
      return {
        id: story.id,
        productName: product.title[appLocale],
        title: story.title[appLocale],
        text: story.text[appLocale],
        href: `/products/${category?.slug[appLocale] ?? ''}/${product.slug[appLocale]}`,
        image: story.image,
      }
    }),
  )
  const stories = resolvedStories.filter((story): story is StoryItem => story !== null)

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
