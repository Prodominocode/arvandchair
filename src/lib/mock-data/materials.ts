/**
 * Mock data برای Collection سبک `ProductMaterials` — واژه‌نامه‌ی کنترل‌شده‌ی متریال، برای فیلتر
 * «ویژگی مشابه» در آرشیو محصول (`docs/05-pages-build-order.md` بسته‌ی ۲ #۵). این جدا از
 * `Product.specs.material` است: `specs.material` متن نمایشی آزاد (توصیفی، برای صفحه‌ی جزئیات)
 * است؛ `Product.materialIds` همین واژه‌نامه را رفرنس می‌دهد و مبنای فیلتر Facet آرشیو است — دو
 * فیلد با دو مسئولیت جدا، نه تکرار داده.
 */

import type { LocalizedText } from './types'

export type ProductMaterial = {
  id: string
  label: LocalizedText
}

export const productMaterials: ProductMaterial[] = [
  {
    id: 'mesh-fabric',
    label: { fa: 'پارچه‌ی مش', en: 'Mesh Fabric' },
  },
  {
    id: 'faux-leather',
    label: { fa: 'چرم مصنوعی', en: 'Faux Leather' },
  },
  {
    id: 'wool-fabric',
    label: { fa: 'پارچه‌ی نساجی', en: 'Wool Fabric' },
  },
  {
    id: 'wood-veneer',
    label: { fa: 'روکش چوب طبیعی', en: 'Wood Veneer' },
  },
  {
    id: 'steel',
    label: { fa: 'فولاد', en: 'Steel' },
  },
  {
    id: 'aluminum',
    label: { fa: 'آلومینیوم', en: 'Aluminum' },
  },
  {
    id: 'polymer',
    label: { fa: 'پلیمر', en: 'Polymer' },
  },
  {
    id: 'velvet',
    label: { fa: 'مخمل', en: 'Velvet' },
  },
]
