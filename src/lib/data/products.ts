/**
 * لایه‌ی Data Access برای Collection `Products`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { products, type Product } from '@/lib/mock-data/products'
import type { AppLocale } from '@/i18n/routing'
import { getCategoryById } from './categories'

export async function getProducts(): Promise<Product[]> {
  return products
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((product) => product.id === id) ?? null
}

export async function getProductBySlug(locale: AppLocale, slug: string): Promise<Product | null> {
  return products.find((product) => product.slug[locale] === slug) ?? null
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  return products.filter((product) => product.categoryId === categoryId)
}

/** برای بخش «محصولات ویژه»ی Home — فعلاً ساده‌ترین قانون: N محصول اول هر دسته را نمی‌گیرد،
 * بلکه یک محصول شاخص از هر دسته‌ی direct-purchase/mixed انتخاب می‌کند تا در Home تنوع دسته باشد. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const seen = new Set<string>()
  const featured: Product[] = []
  for (const product of products) {
    if (seen.has(product.categoryId)) continue
    seen.add(product.categoryId)
    featured.push(product)
    if (featured.length >= limit) break
  }
  return featured
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return products.filter((candidate) => product.relatedProductIds.includes(candidate.id))
}

/** enum نهایی سند ۰۲ فقط دو مقدار قابل‌نمایش دارد؛ این تابع `inherit-from-category` را حل می‌کند. */
export async function resolveProductSalesMode(
  product: Product,
): Promise<'direct-purchase' | 'quote-only'> {
  if (product.salesMode !== 'inherit-from-category') return product.salesMode

  const category = await getCategoryById(product.categoryId)
  if (!category) return 'direct-purchase'
  // «mixed» یعنی دسته خودش هر دو نوع محصول را دارد؛ بدون override صریح محصول، پیش‌فرض امن
  // نمایش قیمت مستقیم است (محصولات quote-only این دسته باید صراحتاً override کرده باشند).
  return category.salesMode === 'mixed' ? 'direct-purchase' : category.salesMode
}
