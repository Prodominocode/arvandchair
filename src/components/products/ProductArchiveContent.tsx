'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import type { ProductTag } from '@/lib/mock-data/tags'
import type { ProductMaterial } from '@/lib/mock-data/materials'
import type { CategoryTab } from '@/lib/data/categories'
import { Button } from '@/components/ui/button'
import { CategoryTabs } from './CategoryTabs'
import { ProductFilterBar } from './ProductFilterBar'
import { ProductGrid } from './ProductGrid'
import { cn } from '@/lib/utils/cn'

const PAGE_SIZE = 12

/** فلگ موقت — درخواست شد این بخش‌ها فعلاً مخفی باشند اما به‌راحتی قابل‌فعال‌سازی بمانند؛
 * برای برگرداندن‌شان فقط مقدار را به `true` تغییر بده، چیز دیگری لازم نیست تغییر کند. */
const SHOW_BREADCRUMB = false
const SHOW_FILTER_BAR = false
const SHOW_HEADER_DIVIDER = false

type Crumb = { label: string; href?: string }

type ProductArchiveContentProps = {
  locale: AppLocale
  title: string
  crumbs: Crumb[]
  tabs: CategoryTab[]
  tags: ProductTag[]
  materials: ProductMaterial[]
  products: Product[]
  categorySlugById: Record<string, string>
}

/**
 * قالب عمومی آرشیو محصول — الگوی رفرنس Okamura (تیتر+شمارش، Tab دسته، Grid). عمداً یک کامپوننت
 * واحد است که هم `/products` و هم `/products/{category}` هر دو از آن استفاده می‌کنند
 * (`05-pages-build-order.md` بسته‌ی ۲ #۵ و #۶ صراحتاً «همان کامپوننت‌های #۵» را می‌خواهند).
 * فیلتر/مرتب‌سازی از طریق Query Param توسط `ProductFilterBar` اعمال می‌شود که باعث رندر مجدد
 * `page.tsx` سمت سرور با لیست فیلترشده‌ی جدید می‌شود؛ این کامپوننت فقط لیست را می‌گیرد و
 * صفحه‌بندی «نمایش بیشتر» سمت کلاینت را مدیریت می‌کند.
 */
export function ProductArchiveContent({
  locale,
  title,
  crumbs,
  tabs,
  tags,
  materials,
  products,
  categorySlugById,
}: ProductArchiveContentProps) {
  const t = useTranslations('Products')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  return (
    <div className="px-container-x py-section-y-sm max-w-container mx-auto">
      {/*
        چیدمان فیزیکی ثابت در هر دو زبان (fa/en) — دقیقاً مثل قرارداد `HeaderNav.tsx`
        («هدر در همه‌ی زبان‌ها همیشه چیدمان LTR دارد ... جهت خواندن متن هر زبان مستقل از این
        چیدمان و طبق الگوریتم bidi یونیکد صحیح باقی می‌ماند»). بدون این `dir="ltr"` اجباری،
        ترتیب Breadcrumb/عنوان/Tab با جهت هر صفحه (RTL برای fa، LTR برای en) آینه می‌شد و
        بین زبان‌ها فرق می‌کرد. چیدمان خواسته‌شده: عنوان همیشه چپ، Tab دسته و Breadcrumb همیشه
        راست — برای همین عنوان اول در DOM می‌آید (لبه‌ی start = چپ در این `dir="ltr"`) و
        Breadcrumb/Tab با `justify-end`/`justify-between` روی لبه‌ی end (راست) می‌نشینند.
      */}
      <div dir="ltr">
        {SHOW_BREADCRUMB ? (
          <nav
            aria-label={t('breadcrumb.home')}
            className="text-muted-foreground mb-4 flex flex-wrap items-center justify-end gap-1.5 text-sm"
          >
            {crumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">›</span> : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {/* عنوان چپ، Tab دسته راست (الگوی خواسته‌شده) — فیلتر تگ/متریال زیر هر دو. */}
        <div
          className={cn(
            'mb-6 flex flex-col gap-3 pb-4 sm:flex-row sm:items-baseline sm:justify-between',
            SHOW_HEADER_DIVIDER && 'border-border border-b',
          )}
        >
          <h1 className="text-arvand-ink flex items-baseline gap-2 text-2xl font-bold text-nowrap sm:text-3xl">
            {title}
            <span className="text-muted-foreground text-lg font-normal">({products.length})</span>
          </h1>
          <CategoryTabs tabs={tabs} locale={locale} />
        </div>
      </div>

      {SHOW_FILTER_BAR ? (
        <div className="mb-8">
          <ProductFilterBar tags={tags} materials={materials} locale={locale} />
        </div>
      ) : null}

      <ProductGrid products={visibleProducts} locale={locale} categorySlugById={categorySlugById} />

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            {t('loadMore')}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
