/**
 * لایه‌ی Data Access برای Collection `LoyaltyTransactions`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۵ (تاریخچه‌ی امتیاز).
 */

import { loyaltyTransactions, type LoyaltyTransaction } from '@/lib/mock-data/loyalty-transactions'

export async function getLoyaltyTransactionsByCustomerId(
  customerId: string,
): Promise<LoyaltyTransaction[]> {
  return loyaltyTransactions
    .filter((transaction) => transaction.customerId === customerId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}
