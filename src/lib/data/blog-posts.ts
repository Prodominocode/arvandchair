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

/** پست‌های مرتبط برای جزئیات پست (`05-pages-build-order.md` #۱۲) — اول هم‌دسته‌ها (بر اساس
 * `category.fa` که یکتاکننده‌ی ساده‌ی دسته در mock است)، بعد در صورت کمبود از جدیدترین بقیه
 * پر می‌شود؛ خودِ پست هیچ‌وقت در نتیجه نیست. */
export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const rest = blogPosts.filter((candidate) => candidate.id !== post.id)
  const sameCategory = rest.filter((candidate) => candidate.category.fa === post.category.fa)
  const others = rest.filter((candidate) => candidate.category.fa !== post.category.fa)
  return [...sameCategory, ...others].slice(0, limit)
}
