/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `ProductTags` (`lib/mock-data/tags.ts`). توضیح کلی معماری
 * در `lib/data/categories.ts`.
 */

import { productTags, type ProductTag } from '@/lib/mock-data/tags'

export async function getProductTags(): Promise<ProductTag[]> {
  return productTags
}

export async function getProductTagsByIds(ids: string[]): Promise<ProductTag[]> {
  const idSet = new Set(ids)
  return productTags.filter((tag) => idSet.has(tag.id))
}
