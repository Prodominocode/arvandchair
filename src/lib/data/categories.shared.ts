/**
 * بخش Client-safe لایه‌ی دسته‌ها — `CategoryTabs` داخل Client Component `ProductArchiveContent`
 * رندر می‌شود، پس نباید از `categories.ts` (که Payload/Postgres را import می‌کند) مقدار بگیرد؛
 * وگرنه کل Payload وارد Bundle مرورگر می‌شود. `categories.ts` همین‌ها را دوباره Export می‌کند.
 */

import type { Category } from '@/lib/mock-data/categories'
import type { LocalizedText } from '@/lib/mock-data/types'

export type CategoryTab = {
  /** `null` فقط برای تب «همه‌ی محصولات» در ریشه‌ی `/products` — بدون Category واقعی، چون خودِ
   * ریشه معادل هیچ رکورد Category‌ای نیست. */
  category: Category | null
  /** تب «همه» روی خودِ دسته‌ی جاری (اگر والد است)، والدش (اگر زیردسته است)، یا ریشه‌ی
   * `/products` اشاره می‌کند — برچسبش همیشه از `ALL_TAB_LABEL` می‌آید، نه عنوان واقعی دسته. */
  isAllTab: boolean
  isActive: boolean
}

export const ALL_TAB_LABEL: LocalizedText = { fa: 'همه', en: 'All' }
