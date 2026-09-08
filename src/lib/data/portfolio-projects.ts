/**
 * لایه‌ی Data Access برای Collection `PortfolioProjects`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { portfolioProjects, type PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import type { AppLocale } from '@/i18n/routing'

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  return portfolioProjects
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
