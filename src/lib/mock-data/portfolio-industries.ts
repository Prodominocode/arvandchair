/**
 * Mock data برای واژه‌نامه‌ی کنترل‌شده‌ی «صنعت» پروژه‌های نمونه‌کار — جدا از
 * `PortfolioProject.industry` (که متن نمایشی آزاد روی کارت/جزئیات است)، دقیقاً هم‌الگوی
 * `ProductMaterials` (`lib/mock-data/materials.ts`): `PortfolioProject.industryId` همین
 * واژه‌نامه را رفرنس می‌دهد و مبنای فیلتر Facet آرشیو نمونه‌کارها می‌شود. *(افزوده‌ی فاز ۳،
 * چون در Draft اولیه‌ی `docs/02-data-model.md` فقط `industry` آزاد وجود داشت، نه یک فیلد
 * قابل‌فیلتر — یادداشت آن‌جا هم گذاشته شد.)*
 */

import type { LocalizedText } from './types'

export type PortfolioIndustry = {
  id: string
  label: LocalizedText
}

export const portfolioIndustries: PortfolioIndustry[] = [
  { id: 'financial-services', label: { fa: 'خدمات مالی', en: 'Financial Services' } },
  { id: 'higher-education', label: { fa: 'آموزش عالی', en: 'Higher Education' } },
  { id: 'events-hospitality', label: { fa: 'رویداد و گردهمایی', en: 'Events & Hospitality' } },
  {
    id: 'oil-gas-petrochemicals',
    label: { fa: 'نفت، گاز و پتروشیمی', en: 'Oil, Gas & Petrochemicals' },
  },
  { id: 'banking', label: { fa: 'بانکداری', en: 'Banking' } },
]
