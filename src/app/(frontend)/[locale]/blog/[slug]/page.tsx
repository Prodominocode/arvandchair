import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/data/blog-posts'
import { formatBlogDate } from '@/lib/utils/date'
import { getReadingTimeMinutes } from '@/lib/utils/reading-time'
import { Badge } from '@/components/ui/badge'
import { BlogShareBar } from '@/components/blog/BlogShareBar'
import { BlogGrid } from '@/components/blog/BlogGrid'

type Args = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const appLocale = locale as AppLocale
  const post = await getBlogPostBySlug(appLocale, slug)
  if (!post) return {}

  const { canonical, languages } = buildAlternates(appLocale, `/blog/${slug}`)
  const title = post.seo.metaTitle[appLocale]
  const description = post.seo.metaDescription[appLocale]

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedDate,
      images: [post.coverImage.src],
    },
  }
}

/**
 * `/{locale}/blog/{slug}` — جزئیات پست وبلاگ (`05-pages-build-order.md` بسته‌ی ۳ #۱۲)، هم‌الگوی
 * بصری جزئیات محصول (Hero تمام‌قد data-header-solid → متن معرفی وسط‌چین → محتوا → بازگشت →
 * مرتبط) اما ساده‌تر: پست وبلاگ نه Gallery/Features دارد نه Variant/CTA خرید؛ به‌جایشان یک نوار
 * متا (نویسنده/تاریخ/زمان مطالعه) + اشتراک‌گذاری زیر هیرو می‌آید.
 */
export default async function BlogPostPage({ params }: Args) {
  const { locale, slug } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const post = await getBlogPostBySlug(appLocale, slug)
  if (!post) notFound()

  const [t, tBlog, relatedPosts] = await Promise.all([
    getTranslations({ locale, namespace: 'BlogDetail' }),
    getTranslations({ locale, namespace: 'Blog' }),
    getRelatedBlogPosts(post),
  ])

  const paragraphs = post.content[appLocale].split('\n\n')
  const minutes = getReadingTimeMinutes(post.content[appLocale])

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: tBlog('breadcrumb.home'), href: '/' },
    { label: tBlog('breadcrumb.blog'), href: '/blog' },
    { label: post.title[appLocale] },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: crumb.href } : {}),
    })),
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title[appLocale],
    description: post.excerpt[appLocale],
    image: [post.coverImage.src],
    datePublished: post.publishedDate,
    author: { '@type': 'Organization', name: post.authorName },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero — دقیقاً هم‌الگوی هیروی جزئیات محصول (تصویر تمام‌قد + گرادیان + عنوان وسط‌چین روی
          ۷۵٪ ارتفاع)؛ به‌جای زیرنویس، بج دسته‌بندی بالای عنوان می‌آید (هم‌شکل بج `BlogCard`). */}
      <section
        data-section="hero"
        data-header-tone="light"
        data-header-solid
        className="bg-arvand-ink relative -mt-16 h-svh min-h-[520px] w-full overflow-hidden"
      >
        <Image
          src={post.coverImage.src}
          alt={post.coverImage.alt[appLocale]}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          data-section="hero-overlay"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(20,20,20,.2), rgba(20,20,20,.55))',
          }}
        />
        <div
          data-section="hero-text"
          className="px-container-x absolute inset-x-0 top-[75%] flex -translate-y-1/2 flex-col items-center gap-4 text-center font-normal text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]"
        >
          <Badge variant="secondary" className="bg-surface-white/90 backdrop-blur-sm">
            {post.category[appLocale]}
          </Badge>
          <h1
            data-section="hero-title"
            className="max-w-3xl text-[28px] leading-tight font-normal tracking-tight sm:text-[36px]"
          >
            {post.title[appLocale]}
          </h1>
        </div>
      </section>

      {/* نوار متا — نویسنده/تاریخ/زمان مطالعه در یک سمت، اشتراک‌گذاری در سمت دیگر؛ یک خط
          نازک پایین (هم‌الگوی خط‌های ظریف `BlogGrid`/`Footer`) آن را از محتوا جدا می‌کند. */}
      <div
        data-section="meta"
        className="border-border px-container-x max-w-container mx-auto flex flex-wrap items-center justify-between gap-4 border-b py-6"
      >
        <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span>{t('meta.by', { author: post.authorName })}</span>
          <span aria-hidden="true">·</span>
          <span>{formatBlogDate(post.publishedDate, appLocale)}</span>
          <span aria-hidden="true">·</span>
          <span>{t('meta.minRead', { minutes })}</span>
        </p>
        <BlogShareBar title={post.title[appLocale]} />
      </div>

      {/* متن معرفی — خلاصه‌ی پست، وسط‌چین و سبک (هم‌الگوی سکشن `intro` جزئیات محصول) */}
      <section
        data-section="intro"
        className="px-container-x flex items-center justify-center py-16 sm:py-20"
      >
        <p
          data-section="intro-text"
          className="text-arvand-ink mx-auto max-w-3xl text-center text-[19.2px] leading-relaxed font-light text-balance sm:text-2xl sm:leading-relaxed"
        >
          {post.excerpt[appLocale]}
        </p>
      </section>

      {/* بدنه‌ی محتوا — پاراگراف‌بندی‌شده، ستون خوانا (max-w-3xl) */}
      <section data-section="content" className="px-container-x pb-section-y-lg">
        <div className="text-arvand-ink mx-auto flex max-w-3xl flex-col gap-6 text-base leading-relaxed sm:text-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div data-section="back-link" className="py-section-y-sm flex justify-center">
        <Link
          href="/blog"
          className="text-arvand-ink hover:text-arvand-ink/70 duration-base text-sm transition-colors"
        >
          {t('backToIndex')}
        </Link>
      </div>

      {relatedPosts.length > 0 ? (
        <div data-section="related-posts" className="bg-surface-mist py-section-y-lg">
          <p
            data-section="related-posts-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('related.title')}
          </p>
          <div data-section="related-posts-grid" className="px-container-x max-w-container mx-auto">
            <BlogGrid posts={relatedPosts} locale={appLocale} />
          </div>
        </div>
      ) : null}
    </>
  )
}
