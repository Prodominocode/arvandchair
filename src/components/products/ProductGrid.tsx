import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
  locale: AppLocale
  categorySlugById: Record<string, string>
}

export function ProductGrid({ products, locale, categorySlugById }: ProductGridProps) {
  const t = useTranslations('Products')

  if (products.length === 0) {
    return (
      <div className="border-border py-section-y-sm rounded-lg border border-dashed text-center">
        <p className="text-foreground font-medium">{t('empty.title')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{t('empty.hint')}</p>
      </div>
    )
  }

  return (
    /* شبکه‌ی خط‌دار طبق رفرنس (نه Card جدا با فاصله/سایه) — والد فقط ضلع بالا/شروع را می‌کشد،
       هر سلول فقط ضلع پایان/پایین خودش را؛ نتیجه یک خط تکی (نه دوبار کشیده‌شده) بین هر دو
       سلول کنار هم است، بدون نیاز به منطق شرطی «آخرین ستون» که با تغییر تعداد ستون در هر
       breakpoint (۲/۳/۴) فرق می‌کند. */
    <div className="border-border grid grid-cols-2 border-s border-t sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border-border group hover:bg-surface-mist-hover duration-base border-e border-b p-6 transition-colors sm:p-8"
        >
          <ProductCard
            product={product}
            locale={locale}
            categorySlug={categorySlugById[product.categoryId] ?? ''}
          />
        </div>
      ))}
    </div>
  )
}
