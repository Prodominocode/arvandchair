import type { Look } from './looks'

/**
 * مقادیر پیش‌فرض کامل کاروسل صفحه‌ی اصلی: یک صندلی مدیریتی از ۸ زاویه (چرخ‌میز) — منبع
 * public/images/lab/chairs/new، آماده‌شده با scripts/lab/gen-chair-samples.mjs. نام‌ها، رنگ‌ها و
 * ابعاد Placeholder آزمایشی‌اند.
 *
 * دو مصرف‌کننده: ۱) `getChairs` (Fallback وقتی Global «کاروسل صفحه‌ی اصلی» در پنل خالی است)،
 * ۲) `npm run seed:carousel` که همین مقادیر را (با آپلود تصاویر) در پنل می‌ریزد.
 */
type ChairLocale = 'fa' | 'en'
type Bilingual = Record<ChairLocale, string>

export type DefaultChair = {
  name: Bilingual
  caption: Bilingual
  /** تصویر اصلی (مسیر زیر public/) */
  image: string
  /** عکس‌های جزئی (مسیر زیر public/) */
  gallery: string[]
  specs: Array<{ kind: Bilingual; value: Bilingual; swatch?: string }>
}

const NAME: Bilingual = { fa: 'صندلی مدیریتی', en: 'Executive chair' }

const VIEWS = {
  front: { fa: 'نمای روبه‌رو', en: 'Front view' },
  three: { fa: 'نمای سه‌رخ', en: 'Three-quarter view' },
  back: { fa: 'نمای سه‌رخ از پشت', en: 'Rear three-quarter view' },
  side: { fa: 'نیم‌رخ', en: 'Side view' },
} satisfies Record<string, Bilingual>

const COLORS = {
  red: { name: { fa: 'قرمز', en: 'Red' }, swatch: '#b23a3f' },
  green: { name: { fa: 'سبز طوسی', en: 'Grey green' }, swatch: '#4f6660' },
} satisfies Record<string, { name: Bilingual; swatch: string }>

const SPEC_KINDS = {
  color: { fa: 'رنگ', en: 'Color' },
  material: { fa: 'متریال', en: 'Material' },
  base: { fa: 'پایه', en: 'Base' },
  size: { fa: 'ابعاد', en: 'Size' },
  warranty: { fa: 'گارانتی', en: 'Warranty' },
} satisfies Record<string, Bilingual>

const SPEC_VALUES = {
  material: { fa: 'چرم طبیعی', en: 'Genuine leather' },
  base: { fa: 'آلومینیوم پولیش', en: 'Polished aluminium' },
  size: { fa: '۶۸×۷۰×۱۲۰ سانتی‌متر', en: '68×70×120 cm' },
  warranty: { fa: '۱۸ ماه', en: '18 months' },
} satisfies Record<string, Bilingual>

/** ۴ زاویه‌ی یکتا؛ زاویه‌های ۵…۸ آینه‌ی ۴…۱ هستند و همان تصویرها را دوباره استفاده می‌کنند */
const ANGLES: Array<['front' | 'three' | 'back' | 'side', 'red' | 'green']> = [
  ['front', 'red'],
  ['three', 'green'],
  ['back', 'green'],
  ['side', 'red'],
  ['side', 'red'],
  ['back', 'green'],
  ['three', 'green'],
  ['front', 'red'],
]

const imageOf = (n: number) => `/images/lab/chairs/chair-${n}.png`

export const DEFAULT_CHAIRS: DefaultChair[] = ANGLES.map(([view, color], i) => ({
  name: NAME,
  caption: VIEWS[view],
  image: imageOf(i + 1),
  // عکس‌های جزئی پیش‌فرض: سه زاویه‌ی دیگر از همین صندلی (تا عکس واقعی جزئیات آپلود شود)
  gallery: [1, 2, 3, 4].filter((n) => n !== (i < 4 ? i + 1 : 8 - i)).map(imageOf),
  specs: [
    { kind: SPEC_KINDS.color, value: COLORS[color].name, swatch: COLORS[color].swatch },
    { kind: SPEC_KINDS.material, value: SPEC_VALUES.material },
    { kind: SPEC_KINDS.base, value: SPEC_VALUES.base },
    { kind: SPEC_KINDS.size, value: SPEC_VALUES.size },
    { kind: SPEC_KINDS.warranty, value: SPEC_VALUES.warranty },
  ],
}))

export function getChairs(locale: ChairLocale): Look[] {
  return DEFAULT_CHAIRS.map((chair, i) => ({
    id: `turntable-${i + 1}`,
    src: chair.image,
    name: chair.name[locale],
    caption: chair.caption[locale],
    items: chair.specs.map((spec) => ({
      kind: spec.kind[locale],
      name: spec.value[locale],
      ...(spec.swatch ? { swatch: spec.swatch } : {}),
    })),
    gallery: chair.gallery.map((src, g) => {
      // عنوان Placeholder = نام زاویه‌ی همان تصویر (chair-N.png → ANGLES[N-1])
      const n = Number(/chair-(\d+)\.png$/.exec(src)?.[1])
      const view = ANGLES[n - 1]?.[0]
      return {
        src,
        alt: `${chair.name[locale]} — ${g + 1}`,
        ...(view ? { title: VIEWS[view][locale] } : {}),
      }
    }),
  }))
}
