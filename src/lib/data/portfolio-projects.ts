/**
 * لایه‌ی Data Access برای Collection `PortfolioProjects` — فاز ۵ به Payload وصل شد؛ خروجی به شکل
 * Mock (`PortfolioProject`) Adapt می‌شود. توضیح کلی معماری در `lib/data/categories.ts`. نگاشت
 * فیلدها: `industryRef` → `industryId` (با `key` صنعت)، `productsUsed` → `productIds`.
 *
 * Draft/Publish این Collection فعال است و Local API پیش‌فرض Draftها را هم برمی‌گرداند — پس فقط
 * `_status: published` خوانده می‌شود تا پروژه‌ای که ویرایشگر فقط Draft کرده در سایت دیده نشود.
 */

import { cache } from 'react'

import type { PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import { getPortfolioIndustries } from '@/lib/data/portfolio-industries'
import type { PortfolioIndustry } from '@/lib/mock-data/portfolio-industries'
import type { AppLocale } from '@/i18n/routing'
import type { LocalizedText } from '@/lib/mock-data/types'
import {
  getPayloadClient,
  relationId,
  toImage,
  toImages,
  toLocalized,
  toSeo,
  type LocalizedValue,
} from './payload'

type LocalizedProjectDoc = {
  id: number
  title: LocalizedValue
  slug: LocalizedValue
  clientName?: LocalizedValue
  industry?: LocalizedValue
  industryRef: unknown
  location?: LocalizedValue
  scope?: LocalizedValue
  duration?: LocalizedValue
  completionYear?: number | null
  coverImage: unknown
  gallery?: unknown
  summary?: LocalizedValue
  challenge?: LocalizedValue
  solution?: LocalizedValue
  productsUsed?: unknown
  featured?: boolean | null
  seo?: { metaTitle?: LocalizedValue; metaDescription?: LocalizedValue } | null
}

function toProject(doc: LocalizedProjectDoc): PortfolioProject {
  const title = toLocalized(doc.title)
  const industryRef = doc.industryRef
  return {
    id: String(doc.id),
    title,
    slug: toLocalized(doc.slug),
    clientName: toLocalized(doc.clientName),
    industry: toLocalized(doc.industry),
    industryId:
      industryRef && typeof industryRef === 'object' && 'key' in industryRef
        ? String(industryRef.key)
        : (relationId(industryRef) ?? ''),
    location: toLocalized(doc.location),
    scope: toLocalized(doc.scope),
    duration: toLocalized(doc.duration),
    completionYear: doc.completionYear ?? 0,
    coverImage: toImage(doc.coverImage, title),
    gallery: toImages(doc.gallery),
    summary: toLocalized(doc.summary),
    challenge: toLocalized(doc.challenge),
    solution: toLocalized(doc.solution),
    productIds: Array.isArray(doc.productsUsed)
      ? doc.productsUsed.map(relationId).filter((id): id is string => Boolean(id))
      : [],
    featured: Boolean(doc.featured),
    seo: toSeo(doc.seo),
  }
}

const loadProjects = cache(async (): Promise<PortfolioProject[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'portfolio-projects',
    locale: 'all',
    depth: 1,
    pagination: false,
    where: { _status: { equals: 'published' } },
    // ترتیب درج (= ترتیب Mock/Seed)؛ getFilteredPortfolioProjects بعداً «ویژه»ها را جلو می‌آورد.
    sort: 'id',
  })
  return (docs as unknown as LocalizedProjectDoc[]).map(toProject)
})

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return loadProjects()
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
  const portfolioProjects = await loadProjects()
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
  const [industries, portfolioProjects] = await Promise.all([
    getPortfolioIndustries(),
    loadProjects(),
  ])
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
  return (await loadProjects()).filter((project) => project.featured).slice(0, limit)
}

export async function getPortfolioProjectBySlug(
  locale: AppLocale,
  slug: string,
): Promise<PortfolioProject | null> {
  return (await loadProjects()).find((project) => project.slug[locale] === slug) ?? null
}

/** پروژه‌های مرتبط برای جزئیات پروژه (`05-pages-build-order.md` #۱۰) — هم‌الگوی
 * `getRelatedBlogPosts`: اول هم‌صنعت‌ها، بعد در صورت کمبود از بقیه پر می‌شود؛ خودِ پروژه هیچ‌وقت
 * در نتیجه نیست. */
export async function getRelatedPortfolioProjects(
  project: PortfolioProject,
  limit = 3,
): Promise<PortfolioProject[]> {
  const rest = (await loadProjects()).filter((candidate) => candidate.id !== project.id)
  const sameIndustry = rest.filter((candidate) => candidate.industryId === project.industryId)
  const others = rest.filter((candidate) => candidate.industryId !== project.industryId)
  return [...sameIndustry, ...others].slice(0, limit)
}
