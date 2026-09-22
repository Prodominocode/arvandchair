/**
 * لایه‌ی Data Access برای Collection `Products`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { products, type Product } from '@/lib/mock-data/products'
import type { AppLocale } from '@/i18n/routing'
import { getCategoryById, getCategoryWithDescendantIds } from './categories'

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

export type ProductSortOption = 'featured' | 'newest' | 'name-asc'

export type ProductFilterParams = {
  /** رفرنس هر دسته‌ای (والد یا زیردسته) — والد بودن یعنی محصولات همه‌ی زیردسته‌هایش هم لحاظ
   * می‌شوند (`getCategoryWithDescendantIds`)، دقیقاً همان رفتاری که `/products/chairs` لازم دارد. */
  categoryId?: string
  /** فیلتر Facet — OR درون خودِ تگ‌ها (هر کدام کافی است)، AND با فیلتر متریال و دسته. */
  tagIds?: string[]
  materialIds?: string[]
  sort?: ProductSortOption
}

/**
 * تابع عمومی فیلتر آرشیو محصول — پایه‌ی صفحه‌ی `/products` و `/products/{category}`
 * (`05-pages-build-order.md` بسته‌ی ۲ #۵/#۶). هر سه محور فیلتر (دسته/تگ/متریال) و مرتب‌سازی از
 * همین یک تابع رد می‌شوند تا هر دو صفحه دقیقاً یک منطق داشته باشند.
 */
export async function getFilteredProducts(
  locale: AppLocale,
  params: ProductFilterParams = {},
): Promise<Product[]> {
  let result = products

  if (params.categoryId) {
    const familyIds = new Set(await getCategoryWithDescendantIds(params.categoryId))
    result = result.filter((product) => familyIds.has(product.categoryId))
  }

  if (params.tagIds?.length) {
    const wanted = params.tagIds
    result = result.filter((product) => wanted.some((tagId) => product.tagIds.includes(tagId)))
  }

  if (params.materialIds?.length) {
    const wanted = params.materialIds
    result = result.filter((product) =>
      wanted.some((materialId) => product.materialIds.includes(materialId)),
    )
  }

  return sortProducts(result, locale, params.sort ?? 'featured')
}

function sortProducts(list: Product[], locale: AppLocale, sort: ProductSortOption): Product[] {
  const copy = [...list]
  if (sort === 'name-asc') {
    return copy.sort((a, b) => a.title[locale].localeCompare(b.title[locale], locale))
  }
  if (sort === 'newest') {
    // Mock فاقد `createdAt` است؛ ترتیب معکوس آرایه به‌عنوان تقریب «جدیدترین اول» استفاده می‌شود —
    // فاز ۵ این را با `createdAt` واقعی از Payload جایگزین می‌کند، امضای تابع تغییر نمی‌کند.
    return copy.reverse()
  }
  return copy
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
