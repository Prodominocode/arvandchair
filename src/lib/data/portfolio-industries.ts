/**
 * لایه‌ی Data Access برای واژه‌نامه‌ی `PortfolioIndustries` — فاز ۵ به Payload وصل شد
 * (`loadVocabulary` در `./payload`؛ `id` = فیلد `key`، همان مقدار `?industry=` در URL آرشیو).
 * توضیح کلی معماری در `lib/data/categories.ts`.
 */

import type { PortfolioIndustry } from '@/lib/mock-data/portfolio-industries'
import { loadVocabulary } from './payload'

export async function getPortfolioIndustries(): Promise<PortfolioIndustry[]> {
  return loadVocabulary('portfolio-industries')
}
