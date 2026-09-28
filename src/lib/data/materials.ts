/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `ProductMaterials` — فاز ۵ به Payload وصل شد
 * (`loadVocabulary` در `./payload`؛ `id` = فیلد `key`). توضیح کلی معماری در `lib/data/categories.ts`.
 */

import type { ProductMaterial } from '@/lib/mock-data/materials'
import { loadVocabulary } from './payload'

export async function getProductMaterials(): Promise<ProductMaterial[]> {
  return loadVocabulary('product-materials')
}

export async function getProductMaterialsByIds(ids: string[]): Promise<ProductMaterial[]> {
  const idSet = new Set(ids)
  return (await getProductMaterials()).filter((material) => idSet.has(material.id))
}
