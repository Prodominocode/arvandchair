/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `ProductMaterials` (`lib/mock-data/materials.ts`). توضیح
 * کلی معماری در `lib/data/categories.ts`.
 */

import { productMaterials, type ProductMaterial } from '@/lib/mock-data/materials'

export async function getProductMaterials(): Promise<ProductMaterial[]> {
  return productMaterials
}

export async function getProductMaterialsByIds(ids: string[]): Promise<ProductMaterial[]> {
  const idSet = new Set(ids)
  return productMaterials.filter((material) => idSet.has(material.id))
}
