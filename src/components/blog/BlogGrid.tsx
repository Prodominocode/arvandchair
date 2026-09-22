import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { BlogPost } from '@/lib/mock-data/blog-posts'
import { BlogCard } from './BlogCard'

type BlogGridProps = {
  posts: BlogPost[]
  locale: AppLocale
}

export function BlogGrid({ posts, locale }: BlogGridProps) {
  const t = useTranslations('Blog')

  if (posts.length === 0) {
    return (
      <div className="border-border py-section-y-sm rounded-lg border border-dashed text-center">
        <p className="text-foreground font-medium">{t('empty.title')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{t('empty.hint')}</p>
      </div>
    )
  }

  return (
    /* همان الگوی خط‌دار `ProductGrid` (رجوع به توضیح آن‌جا) — ۴ ستون طبق درخواست، با همان
       شکست‌نقطه‌های محصول (۲/۳/۴) تا در صفحات کوچک‌تر کارت‌ها له نشوند. */
    <div className="border-border grid grid-cols-2 border-s border-t sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-border group hover:bg-surface-mist-hover duration-base border-e border-b p-6 transition-colors sm:p-8"
        >
          <BlogCard post={post} locale={locale} />
        </div>
      ))}
    </div>
  )
}
