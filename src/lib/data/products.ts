/**
 * لایه‌ی Data Access برای Collection `Products` — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock
 * (`Product`) Adapt می‌شود. توضیح کلی معماری در `lib/data/categories.ts`. نگاشت فیلدها:
 * `category` → `categoryId`، `relatedProducts` → `relatedProductIds`، `tags`/`materials` →
 * `tagIds`/`materialIds` (با `key` واژه‌نامه، نه id عددی — همان مقداری که در URL فیلتر است)،
 * `variants[].key` → `variants[].id` (مبنای رنگ Swatch)، `description` (Lexical) → متن ساده.
 */

import { cache } from 'react'

import { products as mockProducts, type Product } from '@/lib/mock-data/products'
import type { Product as PayloadProduct } from '@/payload-types'
import type { AppLocale } from '@/i18n/routing'
import { getCategoryById, getCategoryWithDescendantIds } from './categories'
import { lexicalToPlainText } from './lexical'
import {
  getPayloadClient,
  relationId,
  toImages,
  toLocalized,
  toSeo,
  type LocalizedValue,
} from './payload'

type LocalizedProductDoc = Omit<
  PayloadProduct,
  'title' | 'slug' | 'shortDescription' | 'description' | 'specs' | 'variants' | 'features' | 'seo'
> & {
  title: LocalizedValue
  slug: LocalizedValue
  shortDescription: LocalizedValue
  description?: { fa?: PayloadProduct['description']; en?: PayloadProduct['description'] } | null
  specs?: {
    dimensions?: {
      lengthCm?: number | null
      widthCm?: number | null
      heightCm?: number | null
    } | null
    material?: LocalizedValue
    weightKg?: number | null
    capacity?: LocalizedValue
  } | null
  variants?:
    | {
        id?: string | null
        key?: string | null
        label: LocalizedValue
        priceModifier?: number | null
        stock?: number | null
      }[]
    | null
  features?: { title: LocalizedValue; text: LocalizedValue; images?: unknown }[] | null
  seo?: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null
}

/** tag/material populate‌شده → `key`؛ اگر populate نشده بود (depth) خود id برمی‌گردد. */
function vocabularyKeys(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((item) =>
      item && typeof item === 'object' && 'key' in item ? String(item.key) : relationId(item),
    )
    .filter((key): key is string => Boolean(key))
}

function relationIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map(relationId).filter((id): id is string => Boolean(id))
}

function toProduct(doc: LocalizedProductDoc): Product {
  const descriptionFa = lexicalToPlainText(doc.description?.fa)
  const capacity = toLocalized(doc.specs?.capacity)
  const features = (doc.features ?? []).map((feature) => ({
    title: toLocalized(feature.title),
    text: toLocalized(feature.text),
    images: toImages(feature.images),
  }))

  return {
    id: String(doc.id),
    title: toLocalized(doc.title),
    slug: toLocalized(doc.slug),
    sku: doc.sku,
    categoryId: relationId(doc.category) ?? '',
    shortDescription: toLocalized(doc.shortDescription),
    description: {
      fa: descriptionFa,
      en: lexicalToPlainText(doc.description?.en) || descriptionFa,
    },
    images: toImages(doc.images),
    // پایپ‌لاین 3D هنوز موکول است؛ Type فاز ۳ فقط null را می‌پذیرد.
    model3d: null,
    specs: {
      dimensions: {
        lengthCm: doc.specs?.dimensions?.lengthCm ?? 0,
        widthCm: doc.specs?.dimensions?.widthCm ?? 0,
        heightCm: doc.specs?.dimensions?.heightCm ?? 0,
      },
      material: toLocalized(doc.specs?.material),
      weightKg: doc.specs?.weightKg ?? 0,
      // UI فقط وقتی سطر «ظرفیت» را نشان می‌دهد که مقدار داشته باشد — خالی باید undefined باشد.
      capacity: capacity.fa ? capacity : undefined,
    },
    variants: (doc.variants ?? []).map((variant, index) => ({
      id: variant.key || variant.id || String(index),
      label: toLocalized(variant.label),
      priceModifier: variant.priceModifier ?? 0,
      stock: variant.stock ?? 0,
    })),
    basePrice: doc.basePrice,
    currency: 'IRR',
    stock: doc.stock,
    relatedProductIds: relationIds(doc.relatedProducts),
    salesMode: doc.salesMode,
    tagIds: vocabularyKeys(doc.tags),
    materialIds: vocabularyKeys(doc.materials),
    features: features.length ? features : undefined,
    seo: toSeo(doc.seo),
  }
}

type LoadedProducts = { list: Product[]; createdAt: Map<string, string> }

const loadProducts = cache(async (): Promise<LoadedProducts> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    locale: 'all',
    depth: 1,
    pagination: false,
    // ترتیب درج (= ترتیب Mock/Seed) — مبنای مرتب‌سازی پیش‌فرض «ویژه».
    sort: 'id',
  })
  const typed = docs as unknown as LocalizedProductDoc[]
  return {
    list: typed.map(toProduct),
    createdAt: new Map(typed.map((doc) => [String(doc.id), doc.createdAt])),
  }
})

export async function getProducts(): Promise<Product[]> {
  return (await loadProducts()).list
}

export async function getProductById(id: string): Promise<Product | null> {
  return (await getProducts()).find((product) => product.id === id) ?? null
}

/**
 * id رشته‌ای Mock (مثلاً `ara-managerial-chair`) → id واقعی Payload، از طریق `sku` که کلید
 * پایدار و غیرLocalized مشترک بین Mock و دیتابیس است. مصرف: داده‌هایی که هنوز (یا برای همیشه)
 * Mock هستند و به محصول ارجاع می‌دهند — `product-stories` (Collection ندارد).
 */
export async function getProductIdByMockId(mockId: string): Promise<string | null> {
  const sku = mockProducts.find((product) => product.id === mockId)?.sku
  if (!sku) return null
  return (await getProducts()).find((product) => product.sku === sku)?.id ?? null
}

export async function getProductBySlug(locale: AppLocale, slug: string): Promise<Product | null> {
  return (await getProducts()).find((product) => product.slug[locale] === slug) ?? null
}

export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
  return (await getProducts()).filter((product) => product.categoryId === categoryId)
}

/** برای بخش «محصولات ویژه»ی Home — فعلاً ساده‌ترین قانون: N محصول اول هر دسته را نمی‌گیرد،
 * بلکه یک محصول شاخص از هر دسته‌ی direct-purchase/mixed انتخاب می‌کند تا در Home تنوع دسته باشد. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const seen = new Set<string>()
  const featured: Product[] = []
  for (const product of await getProducts()) {
    if (seen.has(product.categoryId)) continue
    seen.add(product.categoryId)
    featured.push(product)
    if (featured.length >= limit) break
  }
  return featured
}

export async function getRelatedProducts(product: Product): Promise<Product[]> {
  return (await getProducts()).filter((candidate) =>
    product.relatedProductIds.includes(candidate.id),
  )
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
  const { list, createdAt } = await loadProducts()
  let result = list

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

  return sortProducts(result, locale, params.sort ?? 'featured', createdAt)
}

function sortProducts(
  list: Product[],
  locale: AppLocale,
  sort: ProductSortOption,
  createdAt: Map<string, string>,
): Product[] {
  const copy = [...list]
  if (sort === 'name-asc') {
    return copy.sort((a, b) => a.title[locale].localeCompare(b.title[locale], locale))
  }
  if (sort === 'newest') {
    // `createdAt` واقعی Payload؛ id (ترتیب درج) برای ردیف‌های هم‌زمان (مثلاً Seed) Tie-breaker است.
    return copy.sort(
      (a, b) =>
        (createdAt.get(b.id) ?? '').localeCompare(createdAt.get(a.id) ?? '') ||
        Number(b.id) - Number(a.id),
    )
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
