import type { Field } from 'payload'

/**
 * کلید پایدار واژه‌نامه‌ها (`ProductTags`/`ProductMaterials`/`PortfolioIndustries`) — تصمیم فاز ۵:
 * فیلترهای آرشیو این مقدار را در URL می‌گذارند (`?tag=bestseller`)، نه id عددی Postgres که با هر
 * Seed دوباره عوض می‌شود. Localized نیست تا URL فیلتر بین fa/en یکسان بماند.
 */
export const keyField: Field = {
  name: 'key',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    description:
      'شناسه‌ی لاتین ثابت (مثلاً `bestseller`) — در URL فیلترها استفاده می‌شود؛ بعد از انتشار عوضش نکنید.',
  },
}
