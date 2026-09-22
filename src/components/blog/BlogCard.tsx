import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { BlogPost } from '@/lib/mock-data/blog-posts'
import { formatBlogDate } from '@/lib/utils/date'
import { Badge } from '@/components/ui/badge'

type BlogCardProps = {
  post: BlogPost
  locale: AppLocale
}

/** کارت آرشیو وبلاگ — تصویر + دسته‌بندی (Badge روی تصویر، هم‌الگوی Badge پرفروش/تازه‌وارد
 * در `ProductCard`) + عنوان + تاریخ. بدون خلاصه/نویسنده چون این‌ها فقط در صفحه‌ی جزئیات
 * (`05-pages-build-order.md` #۱۲) می‌آیند، نه در کارت آرشیو. */
export function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug[locale]}`}
      className="focus-visible:ring-ring block outline-none focus-visible:ring-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Badge
          variant="secondary"
          className="bg-surface-white/90 absolute start-0 top-0 z-10 backdrop-blur-sm"
        >
          {post.category[locale]}
        </Badge>
        <Image
          src={post.coverImage.src}
          alt={post.coverImage.alt[locale]}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 44vw"
          className="object-contain"
        />
      </div>
      <p className="text-arvand-ink mt-6 text-sm font-medium sm:mt-7 sm:text-base">
        {post.title[locale]}
      </p>
      <p className="text-muted-foreground mt-1.5 text-xs sm:text-sm">
        {formatBlogDate(post.publishedDate, locale)}
      </p>
    </Link>
  )
}
