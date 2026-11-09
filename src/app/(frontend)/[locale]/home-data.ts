import type { AppLocale } from '@/i18n/routing'
import { getCategories } from '@/lib/data/categories'
import { getHomeCarousel } from '@/lib/data/home-carousel'
import { getFeaturedProducts, getProductById } from '@/lib/data/products'
import { getProductStories } from '@/lib/data/product-stories'
import { getSiteSettings } from '@/lib/data/site-settings'
import type { ShowcaseProduct } from './showcase-section'
import type { StoryItem } from './stories-section'

/** داده‌ی مشترک صفحه‌ی اصلی و نسخه‌های آزمایشی‌اش (مثل /home-b) — تا همیشه هم‌گام بمانند. */
export async function getHomeData(appLocale: AppLocale) {
  const [categories, featuredProducts, productStories, siteSettings, chairs] = await Promise.all([
    getCategories(),
    getFeaturedProducts(4),
    getProductStories(),
    getSiteSettings(),
    getHomeCarousel(appLocale),
  ])

  const showcaseProducts: ShowcaseProduct[] = featuredProducts.map((product) => {
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

  return { showcaseProducts, stories, siteSettings, chairs }
}
