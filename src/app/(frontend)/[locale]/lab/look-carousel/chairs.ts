import type { Look } from './looks'

/**
 * صندلی‌های نمونه (public/images/products/side-guest) — نرمال‌شده با scripts/lab/gen-chair-samples.mjs.
 * نام/رنگ‌ها Placeholder آزمایشی‌اند و از کاتالوگ واقعی نیامده‌اند.
 */
export const CHAIRS: Look[] = [
  ['arghavan', 'ارغوان', 'مشکی', '#2b2b2e', 'صندلی مهمان تاشو'],
  ['diba', 'دیبا', 'طوسی', '#8e9496', 'صندلی مدیریتی پشت‌بلند'],
  ['kiana', 'کیانا', 'سرمه‌ای', '#2c3a5c', 'صندلی مدیریتی'],
  ['mahur', 'ماهور', 'کرم', '#cdbfa5', 'صندلی کارمندی'],
  ['nasim', 'نسیم', 'شنی', '#c9b79a', 'صندلی ارگونومیک'],
  ['parand', 'پرند', 'طوسی روشن', '#d9dbdd', 'صندلی کارمندی توری'],
  ['roya', 'رؤیا', 'خاکی', '#c9c3a3', 'صندلی گردان'],
  ['sadaf', 'صدف', 'خردلی', '#d79b3a', 'صندلی کنفرانسی'],
  ['simin', 'سیمین', 'ذغالی', '#4a4d52', 'صندلی مهمان پایه‌ی لوله‌ای'],
  ['yasna', 'یاسنا', 'مشکی', '#2a2a2a', 'صندلی استک'],
].map(([id, name, color, swatch, type], i) => ({
  id: id!,
  src: `/images/lab/chairs/chair-${i + 1}.png`,
  name: `صندلی ${name}`,
  caption: type!,
  items: [
    { kind: 'نوع', name: type! },
    { kind: 'رنگ', name: color!, swatch: swatch! },
    { kind: 'خانواده', name: 'صندلی مهمان' },
  ],
}))
