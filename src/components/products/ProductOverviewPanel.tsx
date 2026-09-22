'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import type { ProductMaterial } from '@/lib/mock-data/materials'
import { formatPrice } from '@/lib/utils/currency'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ProductAccordion,
  ProductAccordionContent,
  ProductAccordionItem,
  ProductAccordionTrigger,
} from '@/components/products/ProductAccordion'
import { cn } from '@/lib/utils/cn'

/**
 * موقتاً مخفی: دکمه‌ی «افزودن به سبد»، نشان موجودی و کد کالا (SKU). برای برگرداندن، فقط این
 * مقدار را `true` کنید. دکمه‌ی «درخواست استعلام» محصولات پروژه‌محور از این پرچم تأثیر نمی‌پذیرد.
 */
const SHOW_PURCHASE_CONTROLS = false

type ProductOverviewPanelProps = {
  product: Product
  locale: AppLocale
  salesMode: 'direct-purchase' | 'quote-only'
  materials: ProductMaterial[]
}

/**
 * ستون راستِ سکشن Overview — الگوی دقیق رفرنس Okamura: Accordion فشرده (Size / Material /
 * Options) به‌جای یک پنل خرید بزرگ، و زیرش (نه داخل خودِ Accordion) قیمت/وضعیت موجودی + دکمه‌ی
 * CTA — دقیقاً جایگاه «Available Regions + Color Simulator/Models/Documents» رفرنس. تنها
 * لهجه‌ی طلایی صفحه همین دکمه‌ی CTA است (سند ۰۶ بخش ۲).
 */
export function ProductOverviewPanel({
  product,
  locale,
  salesMode,
  materials,
}: ProductOverviewPanelProps) {
  const t = useTranslations('ProductDetail')
  const tCommon = useTranslations('Common')
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id)
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId)

  const displayPrice = product.basePrice + (selectedVariant?.priceModifier ?? 0)
  const isInStock = (selectedVariant?.stock ?? product.stock) > 0
  const isDirectPurchase = salesMode === 'direct-purchase'

  const dimensions = product.specs.dimensions
  const dimensionsValue = t('specs.dimensionsValue', {
    length: formatPrice(dimensions.lengthCm, locale),
    width: formatPrice(dimensions.widthCm, locale),
    height: formatPrice(dimensions.heightCm, locale),
  })
  const weightValue = t('specs.weightValue', {
    weight: formatPrice(product.specs.weightKg, locale),
  })

  return (
    <div data-section="overview-panel" className="flex flex-col gap-16">
      <ProductAccordion data-section="overview-specs-accordion" type="single" collapsible>
        <ProductAccordionItem value="size">
          <ProductAccordionTrigger>{t('specs.dimensions')}</ProductAccordionTrigger>
          <ProductAccordionContent className="text-arvand-ink flex flex-col gap-1.5 text-sm">
            <p>{dimensionsValue}</p>
            <p>
              {t('specs.weight')}: {weightValue}
            </p>
            {product.specs.capacity ? (
              <p>
                {t('specs.capacity')}: {product.specs.capacity[locale]}
              </p>
            ) : null}
          </ProductAccordionContent>
        </ProductAccordionItem>

        <ProductAccordionItem value="material">
          <ProductAccordionTrigger>{t('specs.material')}</ProductAccordionTrigger>
          <ProductAccordionContent className="flex flex-col gap-3">
            <p className="text-arvand-ink text-sm">{product.specs.material[locale]}</p>
            {materials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <Badge key={material.id} variant="outline" className="text-arvand-ink">
                    {material.label[locale]}
                  </Badge>
                ))}
              </div>
            ) : null}
          </ProductAccordionContent>
        </ProductAccordionItem>

        {product.variants.length > 1 ? (
          <ProductAccordionItem value="options">
            <ProductAccordionTrigger>{t('variant.label')}</ProductAccordionTrigger>
            <ProductAccordionContent>
              <div
                className="flex flex-wrap gap-2"
                role="radiogroup"
                aria-label={t('variant.label')}
              >
                {product.variants.map((variant) => {
                  const outOfStock = variant.stock === 0
                  const isSelected = variant.id === selectedVariantId
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={outOfStock}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={cn(
                        'duration-base rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                        isSelected
                          ? 'border-arvand-ink bg-arvand-ink text-surface-white'
                          : 'border-border text-arvand-ink hover:border-arvand-ink/50',
                        outOfStock && 'cursor-not-allowed opacity-40',
                      )}
                    >
                      {variant.label[locale]}
                      {outOfStock ? ` · ${t('variant.outOfStock')}` : ''}
                    </button>
                  )
                })}
              </div>
            </ProductAccordionContent>
          </ProductAccordionItem>
        ) : null}
      </ProductAccordion>

      {/* متن آزمایشی «مناطق قابل عرضه» — جایگاه دقیق «Available Regions» رفرنس، بین Accordion و قیمت */}
      <div data-section="overview-regions" className="flex flex-col gap-4 px-1.5">
        <p className="text-arvand-ink text-base">{t('regions.title')}</p>
        <p className="text-arvand-ink max-w-lg text-base leading-relaxed">{t('regions.text')}</p>
      </div>

      <div data-section="overview-price-cta" className="flex flex-col gap-4">
        {isDirectPurchase ? (
          <div className="flex flex-col gap-1">
            <p className="text-arvand-ink text-2xl font-bold">
              {formatPrice(displayPrice, locale)}{' '}
              <span className="text-base font-medium">{tCommon('currency')}</span>
            </p>
            {selectedVariant && selectedVariant.priceModifier !== 0 ? (
              <p className="text-arvand-ink text-sm">
                {t('variant.priceModifier', {
                  amount: `${selectedVariant.priceModifier > 0 ? '+' : ''}${formatPrice(selectedVariant.priceModifier, locale)}`,
                  currency: tCommon('currency'),
                })}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-arvand-ink text-sm">{t('quote.note')}</p>
        )}

        {/* با مخفی‌بودن کنترل‌های خرید، محصول خرید مستقیم چیزی برای نمایش در این ردیف ندارد */}
        <div
          className={cn(
            'flex flex-wrap items-center gap-3',
            isDirectPurchase && !SHOW_PURCHASE_CONTROLS && 'hidden',
          )}
        >
          {isDirectPurchase && SHOW_PURCHASE_CONTROLS ? (
            <Button
              size="lg"
              disabled={!isInStock}
              onClick={() => toast.success(t('cta.addedToCart', { title: product.title[locale] }))}
            >
              {isInStock ? tCommon('actions.addToCart') : tCommon('badges.outOfStock')}
            </Button>
          ) : null}
          {!isDirectPurchase ? (
            <Button size="lg" asChild>
              <Link href={{ pathname: '/quote-request', query: { product: product.slug[locale] } }}>
                {tCommon('actions.requestQuote')}
              </Link>
            </Button>
          ) : null}
          {isDirectPurchase && SHOW_PURCHASE_CONTROLS ? (
            <Badge variant={isInStock ? 'secondary' : 'outline'}>
              {isInStock ? tCommon('badges.inStock') : tCommon('badges.outOfStock')}
            </Badge>
          ) : null}
        </div>

        {SHOW_PURCHASE_CONTROLS ? (
          <p className="text-arvand-ink text-xs">
            {t('sku')}: <span className="font-mono">{product.sku}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}
