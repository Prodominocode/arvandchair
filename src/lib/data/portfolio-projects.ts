/**
 * لایه‌ی Data Access برای Collection `PortfolioProjects`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { portfolioProjects, type PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import { getPortfolioIndustries } from '@/lib/data/portfolio-industries'
import type { PortfolioIndustry } from '@/lib/mock-data/portfolio-industries'
import type { AppLocale } from '@/i18n/routing'
import type { LocalizedText } from '@/lib/mock-data/types'

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioProjects
}

/**
 * لیست آرشیو `/portfolio` — فیلتر اختیاری بر اساس `industryId` (Query Param، هم‌قانون
 * `03-url-structure-seo.md` بخش ۳ برای فیلترهای محصول: فقط در Path صفحاتی می‌آید که خودشان یک
 * منبع محتوایی مستقل‌اند، نه هر Facet). پروژه‌های ویژه (`featured`) همیشه اول لیست می‌آیند —
 * هم‌الگوی مرتب‌سازی پیش‌فرض «ویژه» در `getFilteredProducts`، چون در نمونه‌کارهای B2B هم
 * پروژه‌های شاخص‌تر باید اول دیده شوند، نه صرفاً جدیدترین.
 */
export async function getFilteredPortfolioProjects(
  industryId?: string,
): Promise<PortfolioProject[]> {
  const filtered = industryId
    ? portfolioProjects.filter((project) => project.industryId === industryId)
    : portfolioProjects
  return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured))
}

export type PortfolioIndustryTab = {
  /** `null` فقط برای تب «همه» — بدون Industry واقعی. */
  industry: PortfolioIndustry | null
  isActive: boolean
}

export const ALL_INDUSTRY_TAB_LABEL: LocalizedText = { fa: 'همه', en: 'All' }

/** ردیف Tabهای صنعت بالای آرشیو نمونه‌کارها — هم‌الگوی `CategoryTabs`/`getCategoryTabs` اما
 * تخت (بدون سلسله‌مراتب دسته/زیردسته، چون صنعت سلسله‌مراتبی نیست)؛ فقط صنعت‌هایی که حداقل
 * یک پروژه دارند نمایش داده می‌شوند تا هیچ‌وقت تبی با نتیجه‌ی خالی دیده نشود. */
export async function getPortfolioIndustryTabs(
  activeIndustryId: string | null,
): Promise<PortfolioIndustryTab[]> {
  const industries = await getPortfolioIndustries()
  const usedIds = new Set(portfolioProjects.map((project) => project.industryId))
  const usedIndustries = industries.filter((industry) => usedIds.has(industry.id))

  return [
    { industry: null, isActive: activeIndustryId === null },
    ...usedIndustries.map((industry) => ({
      industry,
      isActive: industry.id === activeIndustryId,
    })),
  ]
}

export async function getFeaturedPortfolioProjects(limit = 3): Promise<PortfolioProject[]> {
  return portfolioProjects.filter((project) => project.featured).slice(0, limit)
}

export async function getPortfolioProjectBySlug(
  locale: AppLocale,
  slug: string,
): Promise<PortfolioProject | null> {
  return portfolioProjects.find((project) => project.slug[locale] === slug) ?? null
}

/** پروژه‌های مرتبط برای جزئیات پروژه (`05-pages-build-order.md` #۱۰) — هم‌الگوی
 * `getRelatedBlogPosts`: اول هم‌صنعت‌ها، بعد در صورت کمبود از بقیه پر می‌شود؛ خودِ پروژه هیچ‌وقت
 * در نتیجه نیست. */
export async function getRelatedPortfolioProjects(
  project: PortfolioProject,
  limit = 3,
): Promise<PortfolioProject[]> {
  const rest = portfolioProjects.filter((candidate) => candidate.id !== project.id)
  const sameIndustry = rest.filter((candidate) => candidate.industryId === project.industryId)
  const others = rest.filter((candidate) => candidate.industryId !== project.industryId)
  return [...sameIndustry, ...others].slice(0, limit)
}
