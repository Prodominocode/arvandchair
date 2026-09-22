import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { BlogPost } from '@/lib/mock-data/blog-posts'
import { formatBlogDate } from '@/lib/utils/date'

type SearchBlogListProps = {
  posts: BlogPost[]
  locale: AppLocale
}

/**
 * ردیف‌های فشرده‌ی نتیجه‌ی بلاگ در صفحه‌ی جست‌وجو — برخلاف `BlogGrid` (کارت‌های تصویر-محور
 * آرشیو)، اینجا محتوای متنی اولویت دارد: تصویر کوچک و ثابت، عنوان+خلاصه+تاریخ کنار آن،
 * ارتفاع هر ردیف کم. دقیقاً طبق درخواست: «بلاگ لیستی با تصویر کوچک و ارتفاع و جای کمتر»،
 * در تضاد آگاهانه با گرید بزرگ و عکس‌محور بخش محصولات (`ProductGrid`) در همین صفحه.
 */
export function SearchBlogList({ posts, locale }: SearchBlogListProps) {
  return (
    <ul className="border-border divide-border divide-y border-t">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/blog/${post.slug[locale]}`}
            className="hover:bg-surface-mist-hover duration-base focus-visible:ring-ring flex items-center gap-4 py-4 transition-colors outline-none focus-visible:ring-2 sm:gap-5"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md sm:size-20">
              <Image
                src={post.coverImage.src}
                alt={post.coverImage.alt[locale]}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-arvand-ink truncate text-sm font-medium sm:text-base">
                {post.title[locale]}
              </p>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs sm:text-sm">
                {post.excerpt[locale]}
              </p>
              <p className="text-muted-foreground/80 mt-1.5 text-xs">
                {post.category[locale]} · {formatBlogDate(post.publishedDate, locale)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
