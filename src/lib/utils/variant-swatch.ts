/**
 * تناظر تقریبی id واریانت رنگ → Hex، فقط برای رسم یک نقطه/کاشی رنگی در سکشن «Lineup» صفحه‌ی
 * جزئیات محصول (بدون عکس واقعی هر رنگ در Mock). چون این‌ها معنایی/آزاد هستند، نه یک واژه‌نامه‌ی
 * کنترل‌شده مثل `ProductMaterials`، به‌جای Collection جدا همین‌جا map شده‌اند؛ id ناشناخته یک
 * خاکستری خنثی می‌گیرد تا هیچ‌وقت کرش نکند.
 */
const VARIANT_SWATCH_COLORS: Record<string, string> = {
  black: '#1c1c1c',
  'black-chrome': '#1c1c1c',
  'black-castors': '#1c1c1c',
  charcoal: '#3a3a3a',
  graphite: '#4b4b4b',
  'slate-grey': '#6d6f71',
  grey: '#8a8a8a',
  navy: '#22304a',
  sage: '#8a9a7b',
  beige: '#d8cdb8',
  sand: '#c9b898',
  amber: '#b9822f',
  terracotta: '#b5573a',
  burgundy: '#5c1f28',
  brown: '#5a3f30',
  walnut: '#5a3f2e',
  oak: '#b98a55',
  white: '#f5f5f3',
  standard: '#9a9a9a',
}

export function getVariantSwatchColor(variantId: string): string {
  return VARIANT_SWATCH_COLORS[variantId] ?? '#9a9a9a'
}
