import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getBlogPosts } from '@/lib/data/blog-posts'
import { BlogArchiveContent } from '@/components/blog/BlogArchiveContent'

type Args = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Blog' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/blog')

  return {
    title: t('archiveTitle'),
    alternates: { canonical, languages },
    openGraph: { title: t('archiveTitle') },
  }
}

/** `/{locale}/blog` — لیست وبلاگ (`05-pages-build-order.md` بسته‌ی ۳ #۱۱). */
export default async function BlogPage({ params }: Args) {
  const { locale } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const [t, posts] = await Promise.all([
    getTranslations({ locale, namespace: 'Blog' }),
    getBlogPosts(),
  ])

  return <BlogArchiveContent locale={appLocale} title={t('archiveTitle')} posts={posts} />
}
