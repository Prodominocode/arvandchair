import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import type { BlogPost } from '@/lib/mock-data/blog-posts'
import { ProductGrid } from '@/components/products/ProductGrid'
import { SearchBlogList } from './SearchBlogList'

type SearchResultsContentProps = {
  locale: AppLocale
  query: string
  products: Product[]
  blogPosts: BlogPost[]
  categorySlugById: Record<string, string>
}

/**
 * قالب صفحه‌ی جست‌وجو — هم‌الگوی تیتر+شمارش آرشیوهای دیگر (`ProductArchiveContent`/
 * `BlogArchiveContent`)، اما به‌جای یک Grid واحد، دو بخش جدا برای محصول و بلاگ دارد چون طبق
 * درخواست باید بصری از هم متمایز باشند: محصولات همان `ProductGrid` بزرگ و عکس‌محور آرشیو
 * محصول را عیناً بازاستفاده می‌کند، بلاگ در عوض لیست فشرده‌ی `SearchBlogList` (تصویر کوچک،
 * ارتفاع کم، تمرکز روی متن) می‌گیرد — نه `BlogGrid`، که همان کارت بزرگِ آرشیو بلاگ است.
 */
export function SearchResultsContent({
  locale,
  query,
  products,
  blogPosts,
  categorySlugById,
}: SearchResultsContentProps) {
  const t = useTranslations('Search')
  const totalCount = products.length + blogPosts.length

  return (
    <div className="px-container-x py-section-y-sm max-w-container mx-auto">
      <div className="mb-10 sm:mb-12">
        <h1 className="text-arvand-ink text-2xl font-bold sm:text-3xl">{t('title')}</h1>
        {query ? (
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {t('resultsFor', { query })}
            {totalCount > 0 ? (
              <>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                {t('resultsCount', { count: totalCount })}
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {!query ? (
        <SearchEmptyState title={t('noQuery.title')} hint={t('noQuery.hint')} />
      ) : totalCount === 0 ? (
        <SearchEmptyState title={t('empty.title')} hint={t('empty.hint')} />
      ) : (
        <div className="flex flex-col gap-14 sm:gap-16">
          {products.length > 0 ? (
            <section>
              <h2 className="text-arvand-ink mb-6 flex items-baseline gap-2 text-lg font-bold sm:text-xl">
                {t('products.title')}
                <span className="text-muted-foreground text-sm font-normal">
                  ({products.length})
                </span>
              </h2>
              <ProductGrid
                products={products}
                locale={locale}
                categorySlugById={categorySlugById}
              />
            </section>
          ) : null}

          {blogPosts.length > 0 ? (
            <section>
              <h2 className="text-arvand-ink mb-4 flex items-baseline gap-2 text-lg font-bold sm:text-xl">
                {t('blog.title')}
                <span className="text-muted-foreground text-sm font-normal">
                  ({blogPosts.length})
                </span>
              </h2>
              <SearchBlogList posts={blogPosts} locale={locale} />
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}

function SearchEmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="border-border py-section-y-sm rounded-lg border border-dashed text-center">
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
    </div>
  )
}
