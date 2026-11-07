import type { Look } from './looks'

/**
 * نسخه‌ی صندلی: یک صندلی مدیریتی از ۸ زاویه (چرخ‌میز) — منبع public/images/lab/chairs/new،
 * آماده‌شده با scripts/lab/gen-chair-samples.mjs. نام‌ها و رنگ‌ها Placeholder آزمایشی‌اند.
 */
type ChairLocale = 'fa' | 'en'

const COPY = {
  fa: {
    name: 'صندلی مدیریتی',
    kinds: { color: 'رنگ', material: 'متریال', base: 'پایه' },
    material: 'چرم طبیعی',
    base: 'آلومینیوم پولیش',
    colors: {
      red: 'قرمز',
      green: 'سبز طوسی',
    },
    views: {
      front: 'نمای روبه‌رو',
      three: 'نمای سه‌رخ',
      back: 'نمای سه‌رخ از پشت',
      side: 'نیم‌رخ',
    },
  },
  en: {
    name: 'Executive chair',
    kinds: { color: 'Color', material: 'Material', base: 'Base' },
    material: 'Genuine leather',
    base: 'Polished aluminium',
    colors: {
      red: 'Red',
      green: 'Grey green',
    },
    views: {
      front: 'Front view',
      three: 'Three-quarter view',
      back: 'Rear three-quarter view',
      side: 'Side view',
    },
  },
} as const

const SWATCH = { red: '#b23a3f', green: '#4f6660' } as const

const VIEWS: Array<['front' | 'three' | 'back' | 'side', 'red' | 'green']> = [
  ['front', 'red'],
  ['three', 'green'],
  ['back', 'green'],
  ['side', 'red'],
  ['side', 'red'],
  ['back', 'green'],
  ['three', 'green'],
  ['front', 'red'],
]

export function getChairs(locale: ChairLocale): Look[] {
  const c = COPY[locale]
  return VIEWS.map(([view, color], i) => ({
    id: `turntable-${i + 1}`,
    src: `/images/lab/chairs/chair-${i + 1}.png`,
    name: c.name,
    caption: c.views[view],
    items: [
      { kind: c.kinds.color, name: c.colors[color], swatch: SWATCH[color] },
      { kind: c.kinds.material, name: c.material },
      { kind: c.kinds.base, name: c.base },
    ],
  }))
}
