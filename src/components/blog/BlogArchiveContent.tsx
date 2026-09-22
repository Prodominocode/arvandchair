import type { AppLocale } from '@/i18n/routing'
import type { BlogPost } from '@/lib/mock-data/blog-posts'
import { BlogGrid } from './BlogGrid'

type BlogArchiveContentProps = {
  locale: AppLocale
  title: string
  posts: BlogPost[]
}

/** قالب آرشیو وبلاگ — هم‌الگوی `ProductArchiveContent` (تیتر+شمارش، سپس Grid) اما بدون Tab
 * دسته/فیلتر (هنوز درخواست نشده) و بدون `dir="ltr"` اجباری، چون آن ترفند فقط برای هم‌ردیف
 * نگه‌داشتن عنوان و Tabهای دسته لازم بود که اینجا وجود ندارند. */
export function BlogArchiveContent({ locale, title, posts }: BlogArchiveContentProps) {
  return (
    <div className="px-container-x py-section-y-sm max-w-container mx-auto">
      <h1 className="text-arvand-ink mb-6 flex items-baseline gap-2 pb-4 text-2xl font-bold sm:text-3xl">
        {title}
        <span className="text-muted-foreground text-lg font-normal">({posts.length})</span>
      </h1>

      <BlogGrid posts={posts} locale={locale} />
    </div>
  )
}
