/**
 * لایه‌ی Data Access برای Collection `LoyaltyTiers`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { loyaltyTiers, type LoyaltyTier } from '@/lib/mock-data/loyalty-tiers'

export async function getLoyaltyTiers(): Promise<LoyaltyTier[]> {
  return loyaltyTiers
}

export async function getLoyaltyTierById(id: LoyaltyTier['id']): Promise<LoyaltyTier | null> {
  return loyaltyTiers.find((tier) => tier.id === id) ?? null
}
