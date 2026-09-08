/**
 * لایه‌ی Data Access برای Collection `QuoteRequests`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۴ (فرم درخواست استعلام).
 */

import { quoteRequests, type QuoteRequest } from '@/lib/mock-data/quote-requests'

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  return quoteRequests
}
