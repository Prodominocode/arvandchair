/**
 * لایه‌ی Data Access برای جست‌وجوی سراسری — طبق `docs/03-url-structure-seo.md` و
 * `docs/05-pages-build-order.md` (بسته‌ی ۲ #۸) قرار است در نهایت به Meilisearch وصل شود
 * (`lib/meilisearch/`، فعلاً خالی)؛ این نسخه‌ی اول همان قرارداد را با فیلتر ساده‌ی روی
 * mock data پیاده می‌کند تا وقتی Meilisearch وصل شد، فقط بدنه‌ی این تابع عوض شود، نه UI.
 */

import { getProducts } from './products'
import { getBlogPosts } from './blog-posts'
import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import type { BlogPost } from '@/lib/mock-data/blog-posts'

export type SearchResults = {
  products: Product[]
  blogPosts: BlogPost[]
}

function includesQuery(haystack: string | undefined, query: string): boolean {
  return Boolean(haystack?.toLowerCase().includes(query))
}

export async function searchContent(locale: AppLocale, rawQuery: string): Promise<SearchResults> {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return { products: [], blogPosts: [] }

  const [products, blogPosts] = await Promise.all([getProducts(), getBlogPosts()])

  const matchedProducts = products.filter(
    (product) =>
      includesQuery(product.title[locale], query) ||
      includesQuery(product.sku, query) ||
      includesQuery(product.shortDescription[locale], query),
  )

  const matchedBlogPosts = blogPosts.filter(
    (post) =>
      includesQuery(post.title[locale], query) ||
      includesQuery(post.excerpt[locale], query) ||
      includesQuery(post.category[locale], query) ||
      post.tags.some((tag) => includesQuery(tag, query)),
  )

  return { products: matchedProducts, blogPosts: matchedBlogPosts }
}
