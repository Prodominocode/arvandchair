import { Check } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import type { ProductTag } from '@/lib/mock-data/tags'
import type { ProductMaterial } from '@/lib/mock-data/materials'
import { formatPrice } from '@/lib/utils/currency'
import { getVariantSwatchColor } from '@/lib/utils/variant-swatch'
import {
  ProductAccordion,
  ProductAccordionContent,
  ProductAccordionItem,
  ProductAccordionTrigger,
} from '@/components/products/ProductAccordion'

type ProductLineupAccordionProps = {
  product: Product
  locale: AppLocale
  tags: ProductTag[]
  materials: ProductMaterial[]
}

/**
 * سکشن «Lineup» — الگوی رفرنس Okamura: چند ردیف Accordion که هرکدام باز شدنش یک شبکه از
 * کارت‌های گزینه را نشان می‌دهد (رفرنس: Backrest Type/Material/Body Color/...، هرکدام با گرید
 * تصویر). چون مدل داده‌ی اروند محور تنظیم جداگانه ندارد (فقط یک آرایه‌ی `variants` رنگ/قیمت)،
 * این‌جا صادقانه با همان محورهای واقعی پر می‌شود (رنگ از `variants`، متریال از `materialIds`،
 * ویژگی از `tagIds`) نه محورهای ساختگی — ردیفی که داده ندارد اصلاً رندر نمی‌شود.
 */
export async function ProductLineupAccordion({
  product,
  locale,
  tags,
  materials,
}: ProductLineupAccordionProps) {
  const t = await getTranslations({ locale, namespace: 'ProductDetail' })
  const tCommon = await getTranslations({ locale, namespace: 'Common' })

  const hasOptions = product.variants.length > 1
  const hasMaterials = materials.length > 0
  const hasFeatures = tags.length > 0

  if (!hasOptions && !hasMaterials && !hasFeatures) return null

  return (
    <ProductAccordion type="single" collapsible>
      {hasOptions ? (
        <ProductAccordionItem value="options">
          <ProductAccordionTrigger>{t('variant.label')}</ProductAccordionTrigger>
          <ProductAccordionContent>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-4">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="border-accordion-border flex flex-col items-center gap-2.5 border p-4 text-center"
                >
                  <span
                    className="border-border/60 size-9 rounded-full border"
                    style={{ backgroundColor: getVariantSwatchColor(variant.id) }}
                    aria-hidden="true"
                  />
                  <span className="text-arvand-ink text-sm font-medium">
                    {variant.label[locale]}
                  </span>
                  {variant.priceModifier !== 0 ? (
                    <span className="text-arvand-ink text-xs">
                      {t('variant.priceModifier', {
                        amount: `${variant.priceModifier > 0 ? '+' : ''}${formatPrice(variant.priceModifier, locale)}`,
                        currency: tCommon('currency'),
                      })}
                    </span>
                  ) : null}
                  {variant.stock === 0 ? (
                    <span className="text-arvand-ink text-xs">{t('variant.outOfStock')}</span>
                  ) : null}
                </div>
              ))}
            </div>
          </ProductAccordionContent>
        </ProductAccordionItem>
      ) : null}

      {hasMaterials ? (
        <ProductAccordionItem value="materials">
          <ProductAccordionTrigger>{t('specs.materials')}</ProductAccordionTrigger>
          <ProductAccordionContent>
            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 lg:grid-cols-4">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border-accordion-border flex items-center justify-center border p-4 text-center"
                >
                  <span className="text-arvand-ink text-sm font-medium">
                    {material.label[locale]}
                  </span>
                </div>
              ))}
            </div>
          </ProductAccordionContent>
        </ProductAccordionItem>
      ) : null}

      {hasFeatures ? (
        <ProductAccordionItem value="features">
          <ProductAccordionTrigger>{t('keyFeatures')}</ProductAccordionTrigger>
          <ProductAccordionContent>
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="border-accordion-border flex items-center gap-2.5 border p-4"
                >
                  <Check className="text-arvand-ink size-4 shrink-0" aria-hidden="true" />
                  <span className="text-arvand-ink text-sm font-medium">{tag.label[locale]}</span>
                </div>
              ))}
            </div>
          </ProductAccordionContent>
        </ProductAccordionItem>
      ) : null}
    </ProductAccordion>
  )
}
