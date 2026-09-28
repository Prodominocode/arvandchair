/**
 * لایه‌ی Data Access برای استوری‌های محصول (سکشن Stories صفحه‌ی اصلی). توضیح کلی معماری در
 * `lib/data/categories.ts`.
 */

import { productStories, type ProductStory } from '@/lib/mock-data/product-stories'
import { getProductIdByMockId } from './products'

/** استوری‌ها Collection ندارند (خارج از دامنه‌ی ۴‑الف) و Mock می‌مانند؛ ولی Products از فاز ۵
 * از Payload می‌آید، پس `productId` رشته‌ای Mock به id واقعی ترجمه می‌شود (از طریق sku). */
export async function getProductStories(): Promise<ProductStory[]> {
  return Promise.all(
    productStories.map(async (story) => ({
      ...story,
      productId: (await getProductIdByMockId(story.productId)) ?? story.productId,
    })),
  )
}
