/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `ProductTags` — فاز ۵ به Payload وصل شد (`loadVocabulary`
 * در `./payload`؛ `id` = فیلد `key`). توضیح کلی معماری در `lib/data/categories.ts`.
 */

import type { ProductTag } from '@/lib/mock-data/tags'
import { loadVocabulary } from './payload'

export async function getProductTags(): Promise<ProductTag[]> {
  return loadVocabulary('product-tags')
}

export async function getProductTagsByIds(ids: string[]): Promise<ProductTag[]> {
  const idSet = new Set(ids)
  return (await getProductTags()).filter((tag) => idSet.has(tag.id))
}
