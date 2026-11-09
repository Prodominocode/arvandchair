/**
 * داده‌ی نمونه‌ی صفحه‌ی آزمایشی کاروسل. تصاویر Placeholder تولیدشده با
 * scripts/lab/gen-look-samples.mjs هستند؛ بعداً با PNG واقعی (پس‌زمینه شفاف) عوض می‌شوند.
 */
export type LookItem = { kind: string; name: string; price?: string; swatch?: string }

export type LookDetail = {
  src: string
  alt: string
  /** عنوان کوتاه بالا-چپ تصویر در سایدبار؛ اگر نباشد از alt استفاده می‌شود */
  title?: string
}

export type Look = {
  id: string
  src: string
  name: string
  caption: string
  items: LookItem[]
  /** عکس‌های جزئی که در سایدبار جزئیات نمایش داده می‌شوند (اختیاری) */
  gallery?: LookDetail[]
}

export const LOOKS: Look[] = [
  {
    id: 'studio-day',
    src: '/images/lab/looks/look-1.png',
    name: 'روز استودیو',
    caption: 'تی‌شرت مشکی، جین گشاد آبی‌روشن',
    items: [
      { kind: 'بالاتنه', name: 'تی‌شرت اورسایز مشکی', price: '۱٬۲۹۰٬۰۰۰', swatch: '#161616' },
      { kind: 'پایین‌تنه', name: 'جین گشاد شسته', price: '۲٬۴۸۰٬۰۰۰', swatch: '#aebfd6' },
      { kind: 'کفش', name: 'کتانی سفید کلاسیک', price: '۳٬۹۰۰٬۰۰۰', swatch: '#f3f3ef' },
    ],
  },
  {
    id: 'soft-sage',
    src: '/images/lab/looks/look-2.png',
    name: 'سیج نرم',
    caption: 'تی‌شرت شیری، شلوار سبز مه‌آلود',
    items: [
      { kind: 'بالاتنه', name: 'تی‌شرت نخی شیری', price: '۱٬۱۹۰٬۰۰۰', swatch: '#f1efe9' },
      { kind: 'پایین‌تنه', name: 'شلوار گشاد سیج', price: '۲٬۲۰۰٬۰۰۰', swatch: '#b9c3ad' },
      { kind: 'کفش', name: 'کتانی استخوانی', price: '۳٬۷۰۰٬۰۰۰', swatch: '#ece8de' },
    ],
  },
  {
    id: 'city-grey',
    src: '/images/lab/looks/look-3.png',
    name: 'خاکستری شهری',
    caption: 'سوییشرت طوسی، جین آبی',
    items: [
      { kind: 'بالاتنه', name: 'سوییشرت یقه‌گرد طوسی', price: '۱٬۸۵۰٬۰۰۰', swatch: '#8b8d90' },
      { kind: 'پایین‌تنه', name: 'جین مستقیم آبی', price: '۲٬۱۰۰٬۰۰۰', swatch: '#5f84b3' },
      { kind: 'کفش', name: 'کتانی تیره', price: '۳٬۴۰۰٬۰۰۰', swatch: '#3a3a3a' },
    ],
  },
  {
    id: 'olive-line',
    src: '/images/lab/looks/look-4.png',
    name: 'خط زیتونی',
    caption: 'سوییشرت زیتونی، شلوار قهوه‌ای',
    items: [
      { kind: 'بالاتنه', name: 'سوییشرت زیتونی', price: '۱٬۹۰۰٬۰۰۰', swatch: '#6f7a45' },
      { kind: 'پایین‌تنه', name: 'شلوار پارچه‌ای قهوه‌ای', price: '۲٬۳۵۰٬۰۰۰', swatch: '#7a5a42' },
      { kind: 'کلاه', name: 'کلاه نقاب‌دار شنی', price: '۶۹۰٬۰۰۰', swatch: '#c9c2b2' },
    ],
  },
  {
    id: 'night-shade',
    src: '/images/lab/looks/look-5.png',
    name: 'سایه‌ی شب',
    caption: 'تی‌شرت مشکی، شلوار گشاد روشن',
    items: [
      { kind: 'بالاتنه', name: 'تی‌شرت مشکی گرافیکی', price: '۱٬۳۹۰٬۰۰۰', swatch: '#1b1b1b' },
      { kind: 'پایین‌تنه', name: 'جین بگی طوسی‌روشن', price: '۲٬۶۹۰٬۰۰۰', swatch: '#d7dbe4' },
      { kind: 'کفش', name: 'کتانی سفید', price: '۳٬۹۰۰٬۰۰۰', swatch: '#f0f0f0' },
    ],
  },
  {
    id: 'warm-layer',
    src: '/images/lab/looks/look-6.png',
    name: 'لایه‌ی گرم',
    caption: 'هودی کرم، شلوار زغالی',
    items: [
      { kind: 'بالاتنه', name: 'هودی کرم سنگین', price: '۲٬۹۰۰٬۰۰۰', swatch: '#e8dfce' },
      { kind: 'پایین‌تنه', name: 'شلوار کارگو زغالی', price: '۲٬۷۵۰٬۰۰۰', swatch: '#3e4043' },
      { kind: 'کفش', name: 'کتانی کرم', price: '۳٬۶۰۰٬۰۰۰', swatch: '#d7d0c0' },
    ],
  },
  {
    id: 'navy-sand',
    src: '/images/lab/looks/look-7.png',
    name: 'سرمه‌ای و شنی',
    caption: 'ژاکت سرمه‌ای، شلوار شنی',
    items: [
      { kind: 'بالاتنه', name: 'ژاکت سرمه‌ای', price: '۴٬۱۰۰٬۰۰۰', swatch: '#26324a' },
      { kind: 'پایین‌تنه', name: 'شلوار کتان شنی', price: '۲٬۴۰۰٬۰۰۰', swatch: '#cbb89a' },
      { kind: 'کفش', name: 'کتانی سفید', price: '۳٬۹۰۰٬۰۰۰', swatch: '#f5f5f2' },
    ],
  },
  {
    id: 'rust-denim',
    src: '/images/lab/looks/look-8.png',
    name: 'زنگار و دنیم',
    caption: 'هودی زنگاری، جین سرمه‌ای',
    items: [
      { kind: 'بالاتنه', name: 'هودی زنگاری', price: '۲٬۹۵۰٬۰۰۰', swatch: '#c0563a' },
      { kind: 'پایین‌تنه', name: 'جین دنیم تیره', price: '۲٬۵۵۰٬۰۰۰', swatch: '#2f3b52' },
      { kind: 'کفش', name: 'کتانی سفید', price: '۳٬۹۰۰٬۰۰۰', swatch: '#f3f3ef' },
    ],
  },
  {
    id: 'sage-cream',
    src: '/images/lab/looks/look-9.png',
    name: 'مریم‌گلی و کرم',
    caption: 'ژاکت مریم‌گلی، شلوار کرم',
    items: [
      { kind: 'بالاتنه', name: 'ژاکت سبز‌خاکستری', price: '۴٬۳۰۰٬۰۰۰', swatch: '#8a8f7a' },
      { kind: 'پایین‌تنه', name: 'شلوار گشاد کرم', price: '۲٬۳۰۰٬۰۰۰', swatch: '#e9e3d4' },
      { kind: 'کفش', name: 'کتانی مشکی', price: '۳٬۵۰۰٬۰۰۰', swatch: '#2b2b2b' },
    ],
  },
  {
    id: 'mustard-cap',
    src: '/images/lab/looks/look-10.png',
    name: 'خردلی و کلاه',
    caption: 'تی‌شرت خردلی، شلوار ذغالی',
    items: [
      { kind: 'بالاتنه', name: 'تی‌شرت خردلی', price: '۱٬۲۴۰٬۰۰۰', swatch: '#d9a441' },
      { kind: 'پایین‌تنه', name: 'شلوار بگی ذغالی', price: '۲٬۶۰۰٬۰۰۰', swatch: '#41434a' },
      { kind: 'کلاه', name: 'کلاه سرمه‌ای', price: '۶۵۰٬۰۰۰', swatch: '#1d2b4a' },
    ],
  },
]
