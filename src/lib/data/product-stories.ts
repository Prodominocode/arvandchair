/**
 * لایه‌ی Data Access برای استوری‌های محصول (سکشن Stories صفحه‌ی اصلی). توضیح کلی معماری در
 * `lib/data/categories.ts`.
 */

import { productStories, type ProductStory } from '@/lib/mock-data/product-stories'

export async function getProductStories(): Promise<ProductStory[]> {
  return productStories
}
