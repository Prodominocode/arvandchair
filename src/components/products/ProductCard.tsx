import Image from 'next/image'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'

type ProductCardProps = {
  product: Product
  locale: AppLocale
  /** Slug دسته‌ای که خودِ محصول مستقیم در آن است (نه لزوماً دسته‌ی صفحه‌ی جاری) — طبق سند ۰۳
   * مسیر محصول همیشه `/products/{category-slug}/{product-slug}` است. */
  categorySlug: string
}

/** کارت محصول آرشیو — فقط تصویر + نام (بدون قیمت)، دقیقاً طبق الگوی رفرنس Okamura؛ قیمت/CTA
 * فقط در صفحه‌ی جزئیات محصول (`05-pages-build-order.md` بسته‌ی ۲ #۷، هنوز ساخته نشده) می‌آید.
 * بدون پس‌زمینه‌ی مجزا برای جعبه‌ی تصویر — چون پس‌زمینه‌ی کل صفحه همین‌الان surface-mist است
 * (`globals.css`)، مرز هر سلول را کامپوننت والد (`ProductGrid`) با border مشخص می‌کند، نه رنگ.
 * تنها واکنش Hover همان تغییر پس‌زمینه‌ی کل باکس در `ProductGrid` است — عمداً بدون زوم/Scale
 * روی خودِ تصویر (طبق رفرنس، که تصویر ثابت می‌ماند). */
export function ProductCard({ product, locale, categorySlug }: ProductCardProps) {
  const t = useTranslations('Products')
  const image = product.images[0]
  const badgeTagId = product.tagIds.includes('bestseller')
    ? 'bestseller'
    : product.tagIds.includes('new-arrival')
      ? 'new-arrival'
      : null

  return (
    <Link
      href={`/products/${categorySlug}/${product.slug[locale]}`}
      className="focus-visible:ring-ring block outline-none focus-visible:ring-2"
    >
      <div className="relative aspect-square overflow-hidden">
        {badgeTagId ? (
          <Badge
            variant="secondary"
            className="bg-surface-white/90 absolute start-0 top-0 z-10 backdrop-blur-sm"
          >
            {t(`badges.${badgeTagId}`)}
          </Badge>
        ) : null}
        {image ? (
          <Image
            src={image.src}
            alt={image.alt[locale]}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 44vw"
            className="object-contain"
          />
        ) : null}
      </div>
      <p className="text-arvand-ink mt-6 text-sm font-medium sm:mt-7 sm:text-base">
        {product.title[locale]}
      </p>
    </Link>
  )
}
