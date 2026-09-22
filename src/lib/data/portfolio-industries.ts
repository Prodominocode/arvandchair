/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `PortfolioIndustries` (`lib/mock-data/portfolio-industries.ts`).
 * توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { portfolioIndustries, type PortfolioIndustry } from '@/lib/mock-data/portfolio-industries'

export async function getPortfolioIndustries(): Promise<PortfolioIndustry[]> {
  return portfolioIndustries
}
