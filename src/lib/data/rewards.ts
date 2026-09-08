/**
 * لایه‌ی Data Access برای Collection `Rewards`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۵ و صفحه‌ی عمومی باشگاه مشتریان.
 */

import { rewards, type Reward } from '@/lib/mock-data/rewards'

export async function getRewards(): Promise<Reward[]> {
  return rewards
}
