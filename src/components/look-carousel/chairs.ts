import type { Look } from './looks'

/**
 * نسخه‌ی صندلی: یک صندلی مدیریتی از ۸ زاویه (چرخ‌میز) — منبع public/images/lab/chairs/new،
 * آماده‌شده با scripts/lab/gen-chair-samples.mjs. نام‌ها و رنگ‌ها Placeholder آزمایشی‌اند.
 */
const RED = { name: 'قرمز', swatch: '#b23a3f' }
const GREEN = { name: 'سبز طوسی', swatch: '#4f6660' }

const VIEWS: Array<[string, typeof RED]> = [
  ['نمای روبه‌رو', RED],
  ['نمای سه‌رخ', GREEN],
  ['نمای سه‌رخ از پشت', GREEN],
  ['نیم‌رخ', RED],
  ['نیم‌رخ', RED],
  ['نمای سه‌رخ از پشت', GREEN],
  ['نمای سه‌رخ', GREEN],
  ['نمای روبه‌رو', RED],
]

export const CHAIRS: Look[] = VIEWS.map(([view, color], i) => ({
  id: `turntable-${i + 1}`,
  src: `/images/lab/chairs/chair-${i + 1}.png`,
  name: 'صندلی مدیریتی',
  caption: view,
  items: [
    { kind: 'نوع', name: 'صندلی مدیریتی' },
    { kind: 'نما', name: view },
    { kind: 'رنگ', name: color.name, swatch: color.swatch },
  ],
}))
