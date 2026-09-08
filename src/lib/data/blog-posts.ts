/**
 * لایه‌ی Data Access برای Collection `BlogPosts`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۳.
 */

import { blogPosts, type BlogPost } from '@/lib/mock-data/blog-posts'
import type { AppLocale } from '@/i18n/routing'

export async function getBlogPosts(): Promise<BlogPost[]> {
  return [...blogPosts].sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1))
}

export async function getBlogPostBySlug(locale: AppLocale, slug: string): Promise<BlogPost | null> {
  return blogPosts.find((post) => post.slug[locale] === slug) ?? null
}
