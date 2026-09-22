/**
 * Mock data برای Collection `Products` (docs/02-data-model.md بخش ۲).
 * ۹ محصول واقع‌گرایانه‌ی اولیه پخش‌شده روی هر ۵ دسته، به‌علاوه ۱۱ صندلی همراه/مهمان
 * (`chairs-side-guest`) برای صفحه‌ی آرشیو محصول (`05-pages-build-order.md` بسته‌ی ۲ #۵) —
 * قیمت‌ها به تومان (سند ۰۲: تک‌ارزی، فروش فقط ایران).
 */

import type { LocalizedText, MockImage, SeoFields } from './types'

/** enum سند ۰۲ — `inherit-from-category` پیش‌فرض؛ فقط وقتی محصول باید از پیش‌فرض دسته منحرف شود ست می‌شود. */
export type ProductSalesMode = 'inherit-from-category' | 'direct-purchase' | 'quote-only'

export type ProductVariant = {
  id: string
  label: LocalizedText
  /** به تومان، نسبت به `basePrice` — می‌تواند منفی هم باشد. */
  priceModifier: number
  stock: number
}

export type ProductSpecs = {
  dimensions: { lengthCm: number; widthCm: number; heightCm: number }
  material: LocalizedText
  weightKg: number
  /** فقط برای محصولات پروژه‌محور (آمفی‌تئاتر/همایش) معنادار است — ظرفیت هر ردیف/ست. */
  capacity?: LocalizedText
}

/** افزوده‌ی فاز ۳ برای صفحه‌ی جزئیات محصول (`05-pages-build-order.md` بسته‌ی ۲ #۷، الگوی
 * بخش «Features» رفرنس Okamura Plimode) — بلوک‌های روایت تصویری/متنی درباره‌ی محصول، جدا از
 * `description` (که یک پاراگراف کلی است). اختیاری است: محصولی که این را ندارد، سکشن
 * «ویژگی‌ها»ی صفحه‌ی جزئیات را اصلاً نشان نمی‌دهد. */
export type ProductFeature = {
  title: LocalizedText
  text: LocalizedText
  /** ۱ تصویر → بلوک تمام‌عرض؛ ۲ تصویر → ردیف دوستونه (دقیقاً همان دو الگوی رفرنس). */
  images: MockImage[]
}

export type Product = {
  id: string
  title: LocalizedText
  slug: LocalizedText
  sku: string
  categoryId: string
  shortDescription: LocalizedText
  description: LocalizedText
  images: MockImage[]
  /** فایل glTF/GLB واقعی هنوز موجود نیست (پایپ‌لاین فاز ۲ آماده است) — فعلاً همیشه null. */
  model3d: null
  specs: ProductSpecs
  variants: ProductVariant[]
  basePrice: number
  currency: 'IRR'
  stock: number
  relatedProductIds: string[]
  salesMode: ProductSalesMode
  /** relation → `ProductTags` (`lib/mock-data/tags.ts`) — فیلتر «تگ» در آرشیو محصول. */
  tagIds: string[]
  /** relation → `ProductMaterials` (`lib/mock-data/materials.ts`) — فیلتر «متریال»، جدا از متن
   * نمایشی `specs.material`. */
  materialIds: string[]
  /** افزوده‌ی فاز ۳، اختیاری — رجوع به تعریف `ProductFeature`. */
  features?: ProductFeature[]
  seo: SeoFields
}

export const products: Product[] = [
  {
    id: 'ara-managerial-chair',
    title: {
      fa: 'صندلی مدیریتی آرا',
      en: 'Arvand Ara Managerial Chair',
    },
    slug: { fa: 'ara-managerial-chair', en: 'ara-managerial-chair' },
    sku: 'ARV-CHR-ARA-001',
    categoryId: 'chairs-office',
    shortDescription: {
      fa: 'صندلی مدیریتی با پشتی مش تنفس‌پذیر و مکانیزم تنظیم ارتفاع/زاویه.',
      en: 'Managerial chair with breathable mesh back and height/tilt adjustment.',
    },
    description: {
      fa: 'صندلی مدیریتی آرا برای ساعت‌های طولانی کار پشت میز طراحی شده. پشتی مش با تهویه‌ی هوا از خستگی کمر جلوگیری می‌کند، دسته‌های قابل تنظیم در سه جهت و مکانیزم Synchro-Tilt امکان تنظیم دقیق زاویه‌ی نشستن را می‌دهند. پایه‌ی آلومینیومی ریخته‌گری و چرخ‌های نرم مناسب کف سرامیک و پارکت.',
      en: 'The Ara managerial chair is built for long hours at the desk. The ventilated mesh backrest reduces back fatigue, tri-directional armrests and a synchro-tilt mechanism allow precise seating adjustment, and the cast-aluminum base pairs with soft casters safe for tile and parquet floors.',
    },
    /* ————— گالری کامل — تنها محصولی که فعلاً برای نمونه‌سازی صفحه‌ی جزئیات محصول
     * (`05-pages-build-order.md` بسته‌ی ۲ #۷) با چند تصویر واقعی غنی‌سازی شده (رجوع به
     * `ref/prdimages`، الگوی Okamura Plimode)؛ بقیه‌ی محصولات فعلاً فقط یک تصویر دارند —
     * قالب صفحه‌ی جزئیات کاملاً عمومی است و با هر تعداد تصویر (حتی ۱) درست کار می‌کند. تصویر
     * اول عمداً همان Cutout ساده روی زمینه‌ی سفید ماند تا ظاهر کارت محصول در Grid/Home
     * (که همیشه images[0] را نشان می‌دهند) تغییر نکند؛ تصاویر بعدی فقط در گالری صفحه‌ی
     * جزئیات دیده می‌شوند. */
    images: [
      {
        src: '/images/products/ara-managerial-chair/cutout-front.png',
        alt: {
          fa: 'صندلی مدیریتی آرا اروند، نمای روبه‌رو',
          en: 'Arvand Ara managerial chair, front view',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/lifestyle-hero.jpg',
        alt: {
          fa: 'صندلی مدیریتی آرا در اتاق مدیریت، کنار میز کنفرانس',
          en: 'Arvand Ara managerial chair in an executive office, beside a conference table',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/lifestyle-01.jpg',
        alt: {
          fa: 'دو صندلی آرا زیر میز مدیریتی، رنگ سرمه‌ای و بژ',
          en: 'Two Ara chairs under a managerial desk, in navy and beige',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/detail-headrest.jpg',
        alt: {
          fa: 'نمای نزدیک قاب کروم پشتی صندلی آرا',
          en: 'Close-up of the Ara backrest chrome frame',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/detail-armrest.jpg',
        alt: {
          fa: 'نمای نزدیک دسته‌ی قابل‌تنظیم و بازوی آلومینیومی',
          en: 'Close-up of the adjustable armrest and aluminum arm',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/detail-weave.jpg',
        alt: {
          fa: 'نمای نزدیک بافت پارچه‌ی پشتی و اتصال بازوی پولیش‌خورده',
          en: 'Close-up of the backrest weave and polished arm joint',
        },
      },
      {
        src: '/images/products/ara-managerial-chair/lifestyle-02.jpg',
        alt: {
          fa: 'صندلی آرا رنگ بژ، نمای کامل کنار میز کار',
          en: 'Ara chair in beige, full view beside a desk',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 68, widthCm: 72, heightCm: 128 },
      material: {
        fa: 'پارچه‌ی مش + پایه‌ی آلومینیوم ریخته‌گری',
        en: 'Mesh fabric + cast-aluminum base',
      },
      weightKg: 18,
    },
    variants: [
      {
        id: 'black',
        label: { fa: 'مشکی', en: 'Black' },
        priceModifier: 0,
        stock: 24,
      },
      {
        id: 'graphite',
        label: { fa: 'خاکستری گرافیتی', en: 'Graphite Grey' },
        priceModifier: 350_000,
        stock: 12,
      },
    ],
    basePrice: 8_500_000,
    currency: 'IRR',
    stock: 36,
    relatedProductIds: ['sabk-task-chair', 'vesta-conference-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['bestseller', 'height-adjustable', 'mesh-back'],
    materialIds: ['mesh-fabric', 'aluminum'],
    features: [
      {
        title: {
          fa: 'پشتی مش تنفس‌پذیر، همیشه خنک',
          en: 'Ventilated mesh that stays cool all day',
        },
        text: {
          fa: 'بافت مش با خط‌دوزی هرینگ‌بون هوا را از پشتی عبور می‌دهد و در جلسات طولانی دما و رطوبت را پایین نگه می‌دارد، بدون اینکه از حمایت کمر کم شود.',
          en: 'The herringbone-weave mesh lets air pass straight through the backrest, keeping heat and moisture down through long sessions without giving up lumbar support.',
        },
        images: [
          {
            src: '/images/products/ara-managerial-chair/detail-weave.jpg',
            alt: {
              fa: 'نمای نزدیک بافت مش هرینگ‌بون پشتی',
              en: 'Close-up of the herringbone mesh weave',
            },
          },
          {
            src: '/images/products/ara-managerial-chair/detail-headrest.jpg',
            alt: {
              fa: 'نمای نزدیک قاب کروم پشتی',
              en: 'Close-up of the chrome backrest frame',
            },
          },
        ],
      },
      {
        title: {
          fa: 'دسته و بازو، دقیقاً برای اندام شما',
          en: 'Armrests and recline, tuned to you',
        },
        text: {
          fa: 'دسته‌های قابل‌تنظیم در سه جهت روی هر ارتفاع و عرض شانه می‌نشینند، و مکانیزم Synchro-Tilt زاویه‌ی نشیمن و پشتی را هم‌زمان و متناسب با فشار بدن تنظیم می‌کند.',
          en: 'Tri-directional armrests adjust to any shoulder height and width, while the synchro-tilt mechanism balances seat and backrest angle together as you shift your weight.',
        },
        images: [
          {
            src: '/images/products/ara-managerial-chair/detail-armrest.jpg',
            alt: {
              fa: 'نمای نزدیک دسته‌ی قابل‌تنظیم آلومینیومی',
              en: 'Close-up of the adjustable aluminum armrest',
            },
          },
        ],
      },
      {
        title: {
          fa: 'پایه‌ای ساخته‌شده برای استفاده‌ی روزانه',
          en: 'A base built for everyday use',
        },
        text: {
          fa: 'پایه‌ی آلومینیومی ریخته‌گری وزن را به‌طور یکنواخت پخش می‌کند و چرخ‌های نرم آن روی کف سرامیک و پارکت بدون خط‌انداختن حرکت می‌کنند.',
          en: 'The cast-aluminum base spreads weight evenly, and its soft casters roll cleanly across tile and parquet floors without marking them.',
        },
        images: [
          {
            src: '/images/products/ara-managerial-chair/lifestyle-02.jpg',
            alt: {
              fa: 'صندلی آرا رنگ بژ، نمای کامل کنار میز کار',
              en: 'Ara chair in beige, full view beside a desk',
            },
          },
        ],
      },
    ],
    seo: {
      metaTitle: {
        fa: 'صندلی مدیریتی آرا اروند | خرید آنلاین',
        en: 'Arvand Ara Managerial Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی مدیریتی آرا با پشتی مش و مکانیزم تنظیم کامل — ارسال سریع در سراسر ایران.',
        en: 'Ara managerial chair with mesh back and full adjustment — fast shipping across Iran.',
      },
    },
  },
  {
    id: 'sabk-task-chair',
    title: { fa: 'صندلی کارمندی سبک', en: 'Arvand Sabk Task Chair' },
    slug: { fa: 'sabk-task-chair', en: 'sabk-task-chair' },
    sku: 'ARV-CHR-SBK-002',
    categoryId: 'chairs-office',
    shortDescription: {
      fa: 'صندلی کارمندی سبک‌وزن با روکش پارچه‌ای و قیمت مناسب برای خرید تیراژ بالا.',
      en: 'Lightweight task chair with fabric upholstery — affordable for bulk office orders.',
    },
    description: {
      fa: 'صندلی سبک برای فضاهای کارمندی طراحی شده که هم راحتی روزانه و هم صرفه‌ی اقتصادی در خریدهای تیراژبالای سازمانی را فراهم می‌کند. پشتی نیمه‌بلند با فوم متراکم، پایه‌ی پنج‌پر پلیمری مقاوم و امکان تنظیم ارتفاع گازی.',
      en: 'A lightweight chair built for staff workstations, balancing everyday comfort with cost-efficiency for large organizational orders. Mid-back with dense foam, a durable five-star polymer base, and gas-lift height adjustment.',
    },
    images: [
      {
        src: '/images/mock/icon-chair.svg',
        alt: {
          fa: 'صندلی کارمندی سبک اروند',
          en: 'Arvand Sabk task chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 60, widthCm: 62, heightCm: 98 },
      material: {
        fa: 'پارچه‌ی نشکن + پایه‌ی پلیمری',
        en: 'Rip-stop fabric + polymer base',
      },
      weightKg: 11,
    },
    variants: [
      {
        id: 'charcoal',
        label: { fa: 'زغالی', en: 'Charcoal' },
        priceModifier: 0,
        stock: 60,
      },
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy' }, priceModifier: 0, stock: 40 },
    ],
    basePrice: 3_200_000,
    currency: 'IRR',
    stock: 100,
    relatedProductIds: ['ara-managerial-chair', 'persepolis-workstation-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['stackable', 'height-adjustable'],
    materialIds: ['wool-fabric', 'polymer'],
    seo: {
      metaTitle: {
        fa: 'صندلی کارمندی سبک اروند | خرید عمده و تکی',
        en: 'Arvand Sabk Task Chair | Retail & Bulk',
      },
      metaDescription: {
        fa: 'صندلی کارمندی مقرون‌به‌صرفه اروند، مناسب تجهیز سازمانی و خرید تکی.',
        en: 'Affordable Arvand task chair, suited for organizational fit-outs and single purchases.',
      },
    },
  },
  {
    id: 'vesta-conference-chair',
    title: {
      fa: 'صندلی کنفرانس وستا',
      en: 'Arvand Vesta Conference Chair',
    },
    slug: {
      fa: 'vesta-conference-chair',
      en: 'vesta-conference-chair',
    },
    sku: 'ARV-CHR-VST-003',
    categoryId: 'chairs-conference',
    shortDescription: {
      fa: 'صندلی کنفرانس با پشتی بلند چرمی و ظاهر رسمی برای اتاق جلسات.',
      en: 'High-back leather conference chair with a formal presence for meeting rooms.',
    },
    description: {
      fa: 'وستا برای اتاق‌های جلسه و کنفرانس طراحی شده — پشتی بلند چرم مصنوعی درجه‌یک، بدنه‌ی استیل کروم‌شده و نشیمن روکش‌دار با فوم سرد. ظاهر رسمی و یکدست برای ردیف صندلی‌های میز کنفرانس.',
      en: 'Vesta is designed for boardrooms and meeting spaces — a premium faux-leather high back, chromed steel frame, and cold-cure foam upholstery for a uniform, formal look along a conference table.',
    },
    images: [
      {
        src: '/images/mock/icon-chair-conference.svg',
        alt: {
          fa: 'صندلی کنفرانس وستا اروند',
          en: 'Arvand Vesta conference chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 65, widthCm: 70, heightCm: 118 },
      material: {
        fa: 'چرم مصنوعی + استیل کروم',
        en: 'Faux leather + chromed steel',
      },
      weightKg: 15,
    },
    variants: [
      { id: 'black', label: { fa: 'مشکی', en: 'Black' }, priceModifier: 0, stock: 18 },
      {
        id: 'brown',
        label: { fa: 'قهوه‌ای', en: 'Brown' },
        priceModifier: 400_000,
        stock: 10,
      },
    ],
    basePrice: 11_900_000,
    currency: 'IRR',
    stock: 28,
    relatedProductIds: ['ara-managerial-chair', 'resta-conference-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base'],
    materialIds: ['faux-leather', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی کنفرانس وستا اروند | اتاق جلسات',
        en: 'Arvand Vesta Conference Chair | Boardroom',
      },
      metaDescription: {
        fa: 'صندلی کنفرانس چرمی وستا با ظاهر رسمی، مناسب اتاق جلسات و هیئت‌مدیره.',
        en: 'Vesta leather conference chair with a formal presence, ideal for boardrooms.',
      },
    },
  },
  {
    id: 'alvand-managerial-desk',
    title: {
      fa: 'میز مدیریتی الوند',
      en: 'Arvand Alvand Managerial Desk',
    },
    slug: {
      fa: 'alvand-managerial-desk',
      en: 'alvand-managerial-desk',
    },
    sku: 'ARV-DSK-ALV-001',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز مدیریتی با روکش ملامینه ضدخش و کشوی قفل‌دار جانبی.',
      en: 'Managerial desk with scratch-resistant melamine top and a lockable side drawer unit.',
    },
    description: {
      fa: 'میز مدیریتی الوند با ابعاد بزرگ برای اتاق‌های مدیریتی طراحی شده. روکش ملامینه‌ی ضدخش و ضدرطوبت، پایه‌ی فلزی رنگ‌شده با پوشش الکترواستاتیک، و باکس کشوی جانبی سه‌طبقه با قفل مرکزی.',
      en: 'The Alvand desk is sized for executive offices. It features a scratch- and moisture-resistant melamine top, an electrostatically coated steel frame, and a three-drawer side pedestal with a central lock.',
    },
    images: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میز مدیریتی الوند اروند',
          en: 'Arvand Alvand managerial desk',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 180, widthCm: 80, heightCm: 75 },
      material: {
        fa: 'ملامینه + فلز رنگ‌شده الکترواستاتیک',
        en: 'Melamine + electrostatically coated steel',
      },
      weightKg: 62,
    },
    variants: [
      {
        id: 'walnut',
        label: { fa: 'گردویی', en: 'Walnut' },
        priceModifier: 0,
        stock: 14,
      },
      { id: 'white', label: { fa: 'سفید', en: 'White' }, priceModifier: 0, stock: 9 },
    ],
    basePrice: 14_500_000,
    currency: 'IRR',
    stock: 23,
    relatedProductIds: ['ara-managerial-chair', 'persepolis-workstation-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['lockable'],
    materialIds: ['steel'],
    seo: {
      metaTitle: {
        fa: 'میز مدیریتی الوند اروند | خرید آنلاین',
        en: 'Arvand Alvand Managerial Desk | Buy Online',
      },
      metaDescription: {
        fa: 'میز مدیریتی الوند با کشوی قفل‌دار و روکش ضدخش، مناسب اتاق مدیریت.',
        en: 'Alvand managerial desk with a lockable drawer and scratch-resistant top, built for executive offices.',
      },
    },
  },
  {
    id: 'persepolis-workstation-desk',
    title: {
      fa: 'میز کارشناسی پرسپولیس',
      en: 'Arvand Persepolis Workstation Desk',
    },
    slug: {
      fa: 'persepolis-workstation-desk',
      en: 'persepolis-workstation-desk',
    },
    sku: 'ARV-DSK-PRS-002',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز کارشناسی با مدیریت کابل داخلی، مناسب چیدمان اپن‌اسپیس.',
      en: 'Workstation desk with built-in cable management, ideal for open-space layouts.',
    },
    description: {
      fa: 'میز پرسپولیس برای فضاهای اپن‌اسپیس و اتاق کارشناسی طراحی شده. کانال مدیریت کابل زیر سطح میز، امکان چیدمان به‌صورت تک یا مجموعه‌ی چندنفره (Cluster)، و رویه‌ی ضدخط‌وخش مناسب استفاده‌ی روزانه‌ی سنگین.',
      en: 'Persepolis is built for open-plan and specialist offices — an under-desk cable channel, single or multi-user cluster configuration, and a scratch-resistant surface for heavy daily use.',
    },
    images: [
      {
        src: '/images/mock/icon-desk-workstation.svg',
        alt: {
          fa: 'میز کارشناسی پرسپولیس اروند',
          en: 'Arvand Persepolis workstation desk',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 140, widthCm: 70, heightCm: 75 },
      material: {
        fa: 'ملامینه + فلز',
        en: 'Melamine + steel',
      },
      weightKg: 41,
    },
    variants: [
      { id: 'oak', label: { fa: 'بلوط', en: 'Oak' }, priceModifier: 0, stock: 30 },
      {
        id: 'grey',
        label: { fa: 'خاکستری', en: 'Grey' },
        priceModifier: 0,
        stock: 22,
      },
    ],
    basePrice: 7_400_000,
    currency: 'IRR',
    stock: 52,
    relatedProductIds: ['sabk-task-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['new-arrival'],
    materialIds: ['steel'],
    seo: {
      metaTitle: {
        fa: 'میز کارشناسی پرسپولیس اروند | تجهیز اپن‌اسپیس',
        en: 'Arvand Persepolis Workstation Desk | Open-Space Fit-Out',
      },
      metaDescription: {
        fa: 'میز کارشناسی پرسپولیس با مدیریت کابل، برای تجهیز سریع فضای اداری اپن‌اسپیس.',
        en: 'Persepolis workstation desk with cable management, for fast open-plan office fit-outs.',
      },
    },
  },
  {
    id: 'resta-conference-desk',
    title: {
      fa: 'میز کنفرانس رستا',
      en: 'Arvand Resta Conference Table',
    },
    slug: { fa: 'resta-conference-desk', en: 'resta-conference-desk' },
    sku: 'ARV-DSK-RST-003',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز کنفرانس بیضی برای اتاق جلسات ۸ تا ۱۲ نفره.',
      en: 'Oval conference table for 8–12 person meeting rooms.',
    },
    description: {
      fa: 'میز کنفرانس رستا با فرم بیضی، امکان عبور کابل شبکه/برق از مرکز میز از طریق دریچه‌ی تعبیه‌شده، و رویه‌ی روکش چوب طبیعی. برای اتاق جلسات متوسط تا بزرگ سازمانی مناسب است.',
      en: 'Resta is an oval conference table with a center cable pass-through for power and network cabling, finished in natural wood veneer. Suited to mid-to-large organizational meeting rooms.',
    },
    images: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میز کنفرانس رستا اروند',
          en: 'Arvand Resta conference table',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 320, widthCm: 120, heightCm: 75 },
      material: {
        fa: 'روکش چوب طبیعی + فلز',
        en: 'Natural wood veneer + steel',
      },
      weightKg: 98,
      capacity: { fa: '۸ تا ۱۲ نفر', en: '8–12 people' },
    },
    variants: [
      {
        id: 'walnut',
        label: { fa: 'گردویی', en: 'Walnut' },
        priceModifier: 0,
        stock: 6,
      },
    ],
    basePrice: 38_000_000,
    currency: 'IRR',
    stock: 8,
    relatedProductIds: ['vesta-conference-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    tagIds: ['project-grade'],
    materialIds: ['wood-veneer', 'steel'],
    seo: {
      metaTitle: {
        fa: 'میز کنفرانس رستا اروند | اتاق جلسات',
        en: 'Arvand Resta Conference Table | Boardroom',
      },
      metaDescription: {
        fa: 'میز کنفرانس بیضی رستا با روکش چوب طبیعی برای اتاق جلسات ۸ تا ۱۲ نفره.',
        en: 'Resta oval conference table in natural wood veneer, for 8–12 person meeting rooms.',
      },
    },
  },
  {
    id: 'dorsa-reception-sofa-set',
    title: {
      fa: 'ست مبل پذیرایی اداری درسا',
      en: 'Arvand Dorsa Reception Sofa Set',
    },
    slug: {
      fa: 'dorsa-reception-sofa-set',
      en: 'dorsa-reception-sofa-set',
    },
    sku: 'ARV-OFN-DRS-001',
    categoryId: 'office-furniture',
    shortDescription: {
      fa: 'ست مبل سه‌نفره + دو مبل تک‌نفره برای لابی و اتاق انتظار.',
      en: 'Three-seat sofa plus two single armchairs, for lobbies and waiting areas.',
    },
    description: {
      fa: 'ست مبل درسا شامل یک مبل سه‌نفره و دو مبل تک‌نفره با اسکلت چوب راش و فوم سردِ باکیفیت است. روکش پارچه‌ای مقاوم به سایش برای ترافیک بالای لابی و اتاق انتظار مناسب سازمان‌های متوسط تا بزرگ طراحی شده — برای تیراژ بالا/رنگ سفارشی معمولاً استعلام قیمت پروژه‌ای انجام می‌شود.',
      en: 'The Dorsa set includes one three-seat sofa and two single armchairs on a beechwood frame with high-density cold-cure foam. The abrasion-resistant fabric upholstery suits high-traffic lobbies and waiting areas for mid-to-large organizations — bulk orders or custom colors typically go through a project quote.',
    },
    images: [
      {
        src: '/images/mock/icon-sofa.svg',
        alt: {
          fa: 'ست مبل پذیرایی اداری درسا اروند',
          en: 'Arvand Dorsa reception sofa set',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 210, widthCm: 85, heightCm: 80 },
      material: {
        fa: 'چوب راش + پارچه‌ی مقاوم به سایش',
        en: 'Beechwood + abrasion-resistant fabric',
      },
      weightKg: 74,
    },
    variants: [
      { id: 'beige', label: { fa: 'بژ', en: 'Beige' }, priceModifier: 0, stock: 5 },
      {
        id: 'slate-grey',
        label: { fa: 'خاکستری سربی', en: 'Slate Grey' },
        priceModifier: 0,
        stock: 3,
      },
    ],
    basePrice: 45_000_000,
    currency: 'IRR',
    stock: 8,
    relatedProductIds: ['alvand-managerial-desk'],
    salesMode: 'quote-only',
    tagIds: ['project-grade', 'upholstered'],
    materialIds: ['wool-fabric'],
    seo: {
      metaTitle: {
        fa: 'ست مبل پذیرایی اداری درسا اروند',
        en: 'Arvand Dorsa Reception Sofa Set',
      },
      metaDescription: {
        fa: 'ست مبل لابی و اتاق انتظار درسا برای سازمان‌های متوسط تا بزرگ — استعلام قیمت پروژه‌ای.',
        en: 'Dorsa lobby and waiting-area sofa set for mid-to-large organizations — project-based quote.',
      },
    },
  },
  {
    id: 'salen-amphitheater-seating',
    title: {
      fa: 'صندلی آمفی‌تئاتر سالن',
      en: 'Arvand Salen Amphitheater Seating',
    },
    slug: {
      fa: 'salen-amphitheater-seating',
      en: 'salen-amphitheater-seating',
    },
    sku: 'ARV-AMP-SLN-001',
    categoryId: 'amphitheater',
    shortDescription: {
      fa: 'سیستم صندلی ردیفی تاشو برای آمفی‌تئاتر دانشگاه‌ها و سالن‌های اجتماع.',
      en: 'Fold-up row seating system for university amphitheaters and assembly halls.',
    },
    description: {
      fa: 'سیستم صندلی سالن برای نصب ردیفی در آمفی‌تئاتر طراحی شده — نشیمن تاشوی خودکار برای صرفه‌جویی در فضای عبور، شاسی فولادی مقاوم مناسب استفاده‌ی سنگین روزانه، و امکان تعبیه‌ی میز یادداشت‌برداری تاشو در پشتی هر صندلی. طراحی، تعداد ردیف، و رنگ‌بندی برای هر پروژه به‌صورت اختصاصی مشاوره داده می‌شود.',
      en: 'Salen is a row-seating system built for amphitheater installation — a self-folding seat to preserve aisle space, a heavy-duty steel chassis for daily wear, and an optional fold-down writing tablet on the seatback. Layout, row count, and color are consulted per project.',
    },
    images: [
      {
        src: '/images/mock/icon-amphitheater.svg',
        alt: {
          fa: 'صندلی آمفی‌تئاتر سالن اروند',
          en: 'Arvand Salen amphitheater seating',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 55, widthCm: 60, heightCm: 90 },
      material: {
        fa: 'شاسی فولادی + روکش پلی‌یورتان',
        en: 'Steel chassis + polyurethane upholstery',
      },
      weightKg: 14,
      capacity: {
        fa: 'قابل تنظیم بر اساس نقشه‌ی سالن',
        en: 'Configurable per hall layout',
      },
    },
    variants: [
      {
        id: 'standard',
        label: { fa: 'استاندارد', en: 'Standard' },
        priceModifier: 0,
        stock: 0,
      },
    ],
    basePrice: 4_800_000,
    currency: 'IRR',
    stock: 0,
    relatedProductIds: ['royal-cinema-hall-seating'],
    salesMode: 'inherit-from-category',
    tagIds: ['project-grade', 'stackable'],
    materialIds: ['steel', 'polymer'],
    seo: {
      metaTitle: {
        fa: 'صندلی آمفی‌تئاتر سالن اروند | پروژه‌های دانشگاهی',
        en: 'Arvand Salen Amphitheater Seating | University Projects',
      },
      metaDescription: {
        fa: 'سیستم صندلی ردیفی تاشو سالن برای آمفی‌تئاتر — طراحی اختصاصی هر پروژه.',
        en: 'Salen fold-up row seating for amphitheaters — custom design per project.',
      },
    },
  },
  {
    id: 'royal-cinema-hall-seating',
    title: {
      fa: 'صندلی سالن همایش و سینما رویال',
      en: 'Arvand Royal Cinema Hall Seating',
    },
    slug: {
      fa: 'royal-cinema-hall-seating',
      en: 'royal-cinema-hall-seating',
    },
    sku: 'ARV-CIN-RYL-001',
    categoryId: 'cinema-conference',
    shortDescription: {
      fa: 'صندلی راحت سالن سینما و همایش با بالشتک ضخیم و پشتی بلند.',
      en: 'Plush cinema and conference hall seating with a thick cushion and high back.',
    },
    description: {
      fa: 'رویال برای سالن‌های همایش و سینما طراحی شده — بالشتک ضخیم با فوم چگالی بالا برای نشستن طولانی‌مدت، پشتی بلند برای عایق صدا و حریم بصری بین ردیف‌ها، و امکان اتصال ردیفی یا نصب مستقل. رنگ روکش و تعداد صندلی هر ردیف بر اساس نقشه‌ی سالن سفارشی‌سازی می‌شود.',
      en: 'Royal is built for conference and cinema halls — a high-density thick cushion for long sessions, a high back for sound dampening and visual privacy between rows, and either ganged-row or standalone installation. Upholstery color and row seat count are customized to the hall layout.',
    },
    images: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: {
          fa: 'صندلی سالن همایش و سینما رویال اروند',
          en: 'Arvand Royal cinema hall seating',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 58, widthCm: 65, heightCm: 105 },
      material: {
        fa: 'فوم چگالی‌بالا + روکش مخمل ضدآتش',
        en: 'High-density foam + fire-retardant velvet upholstery',
      },
      weightKg: 17,
      capacity: {
        fa: 'قابل تنظیم بر اساس نقشه‌ی سالن',
        en: 'Configurable per hall layout',
      },
    },
    variants: [
      {
        id: 'burgundy',
        label: { fa: 'زرشکی', en: 'Burgundy' },
        priceModifier: 0,
        stock: 0,
      },
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy' }, priceModifier: 0, stock: 0 },
    ],
    basePrice: 6_200_000,
    currency: 'IRR',
    stock: 0,
    relatedProductIds: ['salen-amphitheater-seating'],
    salesMode: 'inherit-from-category',
    tagIds: ['project-grade', 'upholstered'],
    materialIds: ['velvet', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی سالن همایش و سینما رویال اروند',
        en: 'Arvand Royal Cinema & Conference Hall Seating',
      },
      metaDescription: {
        fa: 'صندلی راحت رویال برای سالن همایش و سینما — استعلام قیمت پروژه‌ای.',
        en: 'Comfortable Royal seating for conference and cinema halls — project-based quote.',
      },
    },
  },

  /* ————— صندلی همراه و مهمان (chairs-side-guest) — ۱۱ مدل، برای صفحه‌ی آرشیو محصول ————— */
  {
    id: 'nasim-side-guest-chair',
    title: { fa: 'صندلی همراه نسیم', en: 'Arvand Nasim Side Chair' },
    slug: {
      fa: 'nasim-side-guest-chair',
      en: 'nasim-side-guest-chair',
    },
    sku: 'ARV-CHR-NSM-004',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه با پشتی مش تنفس‌پذیر و پایه‌ی چرخان آلومینیومی.',
      en: 'Side chair with breathable mesh back and a swivel aluminum base.',
    },
    description: {
      fa: 'نسیم برای میزهای کار کنار هم و فضاهای کولوبریتیو طراحی شده — پشتی مش با خط‌دوزی ظریف، دسته‌های قابل تنظیم، و پایه‌ی پنج‌پر آلومینیومی با مکانیزم بالا/پایین گازی.',
      en: 'Nasim is built for shared desks and collaborative zones — a finely stitched mesh back, adjustable arms, and a five-star aluminum base with gas-lift height adjustment.',
    },
    images: [
      {
        src: '/images/products/side-guest/nasim-side-guest-chair.png',
        alt: {
          fa: 'صندلی همراه نسیم اروند',
          en: 'Arvand Nasim side chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 66, widthCm: 70, heightCm: 112 },
      material: {
        fa: 'پارچه‌ی مش + پایه‌ی آلومینیوم',
        en: 'Mesh fabric + aluminum base',
      },
      weightKg: 16,
    },
    variants: [
      { id: 'sand', label: { fa: 'شنی', en: 'Sand' }, priceModifier: 0, stock: 12 },
      { id: 'black', label: { fa: 'مشکی', en: 'Black' }, priceModifier: 0, stock: 8 },
    ],
    basePrice: 7_400_000,
    currency: 'IRR',
    stock: 20,
    relatedProductIds: ['diba-side-guest-chair', 'kiana-side-guest-chair', 'ara-managerial-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'mesh-back', 'height-adjustable'],
    materialIds: ['mesh-fabric', 'aluminum'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه نسیم اروند | خرید آنلاین',
        en: 'Arvand Nasim Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه نسیم با پشتی مش و پایه‌ی چرخان آلومینیومی، مناسب فضای کار مشترک.',
        en: 'Nasim side chair with mesh back and a swivel aluminum base, ideal for shared workspaces.',
      },
    },
  },
  {
    id: 'diba-side-guest-chair',
    title: { fa: 'صندلی همراه دیبا', en: 'Arvand Diba Side Chair' },
    slug: { fa: 'diba-side-guest-chair', en: 'diba-side-guest-chair' },
    sku: 'ARV-CHR-DIB-005',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه سبک‌وزن با پشتی مش خاکستری و پایه‌ی چرخان.',
      en: 'Lightweight side chair with a charcoal mesh back and a swivel base.',
    },
    description: {
      fa: 'دیبا نسخه‌ی ساده‌تر و اقتصادی‌تر خانواده‌ی صندلی‌های همراه اروند است — بدون پیچیدگی مکانیزم اضافه، فقط تنظیم ارتفاع و پشتی مش، برای تیراژ بالای خرید سازمانی مناسب.',
      en: 'Diba is the leaner, more affordable member of the Arvand side-chair family — height adjustment and a mesh back only, no extra mechanisms, suited to large organizational orders.',
    },
    images: [
      {
        src: '/images/products/side-guest/diba-side-guest-chair.png',
        alt: { fa: 'صندلی همراه دیبا اروند', en: 'Arvand Diba side chair' },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 64, widthCm: 68, heightCm: 108 },
      material: {
        fa: 'پارچه‌ی مش + پایه‌ی فولادی',
        en: 'Mesh fabric + steel base',
      },
      weightKg: 15,
    },
    variants: [
      {
        id: 'graphite',
        label: { fa: 'گرافیتی', en: 'Graphite' },
        priceModifier: 0,
        stock: 30,
      },
    ],
    basePrice: 6_800_000,
    currency: 'IRR',
    stock: 30,
    relatedProductIds: ['nasim-side-guest-chair', 'sabk-task-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'mesh-back', 'height-adjustable'],
    materialIds: ['mesh-fabric', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه دیبا اروند | خرید عمده و تکی',
        en: 'Arvand Diba Side Chair | Retail & Bulk',
      },
      metaDescription: {
        fa: 'صندلی همراه دیبا، ساده و مقرون‌به‌صرفه برای تجهیز سازمانی.',
        en: 'Diba side chair, simple and affordable for organizational fit-outs.',
      },
    },
  },
  {
    id: 'kiana-side-guest-chair',
    title: { fa: 'صندلی همراه کیانا', en: 'Arvand Kiana Side Chair' },
    slug: {
      fa: 'kiana-side-guest-chair',
      en: 'kiana-side-guest-chair',
    },
    sku: 'ARV-CHR-KIA-006',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه روکش‌دار سرمه‌ای با پشتی بلند و پایه‌ی سفید.',
      en: 'Upholstered navy side chair with a high back and a white base.',
    },
    description: {
      fa: 'کیانا برای اتاق‌های کار اختصاصی و فضاهای پذیرایی نیمه‌رسمی طراحی شده — روکش پارچه‌ای سرمه‌ای روی فوم متراکم، پشتی بلند برای حمایت کامل کمر، و پایه‌ی سفید که ظاهر سبک‌تری به صندلی می‌دهد.',
      en: 'Kiana is designed for private offices and semi-formal reception areas — navy fabric upholstery over dense foam, a high back for full lumbar support, and a white base that keeps the silhouette light.',
    },
    images: [
      {
        src: '/images/products/side-guest/kiana-side-guest-chair.png',
        alt: {
          fa: 'صندلی همراه کیانا اروند',
          en: 'Arvand Kiana side chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 65, widthCm: 68, heightCm: 115 },
      material: {
        fa: 'پارچه‌ی نساجی + پایه‌ی پلیمری',
        en: 'Wool fabric + polymer base',
      },
      weightKg: 17,
    },
    variants: [
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy' }, priceModifier: 0, stock: 9 },
      {
        id: 'sage',
        label: { fa: 'سبز زیتونی', en: 'Sage' },
        priceModifier: 200_000,
        stock: 5,
      },
    ],
    basePrice: 8_900_000,
    currency: 'IRR',
    stock: 14,
    relatedProductIds: ['mahur-side-guest-chair', 'sadaf-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'height-adjustable', 'upholstered'],
    materialIds: ['wool-fabric', 'polymer'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه کیانا اروند | خرید آنلاین',
        en: 'Arvand Kiana Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه کیانا با روکش سرمه‌ای و پشتی بلند، مناسب اتاق کار اختصاصی.',
        en: 'Kiana side chair with navy upholstery and a high back, suited to private offices.',
      },
    },
  },
  {
    id: 'mahur-side-guest-chair',
    title: { fa: 'صندلی همراه ماهور', en: 'Arvand Mahur Side Chair' },
    slug: {
      fa: 'mahur-side-guest-chair',
      en: 'mahur-side-guest-chair',
    },
    sku: 'ARV-CHR-MHR-007',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه روکش‌دار با بدنه‌ی فشرده و پایه‌ی فولادی چرخان.',
      en: 'Upholstered side chair with a compact frame and a swivel steel base.',
    },
    description: {
      fa: 'ماهور برای اتاق‌های کار با متراژ محدود طراحی شده — نشیمن و پشتی جمع‌وجور اما راحت، روکش پارچه‌ای مقاوم به سایش، و پایه‌ی فولادی چرخان با پوشش کروم.',
      en: 'Mahur is built for tight-footprint offices — a compact yet comfortable seat and back, abrasion-resistant upholstery, and a chrome-finished swivel steel base.',
    },
    images: [
      {
        src: '/images/products/side-guest/mahur-side-guest-chair.png',
        alt: {
          fa: 'صندلی همراه ماهور اروند',
          en: 'Arvand Mahur side chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 62, widthCm: 66, heightCm: 110 },
      material: {
        fa: 'پارچه‌ی نساجی + پایه‌ی فولاد کروم',
        en: 'Wool fabric + chromed steel base',
      },
      weightKg: 14,
    },
    variants: [{ id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy' }, priceModifier: 0, stock: 16 }],
    basePrice: 6_200_000,
    currency: 'IRR',
    stock: 22,
    relatedProductIds: ['kiana-side-guest-chair', 'roya-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'upholstered'],
    materialIds: ['wool-fabric', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه ماهور اروند | خرید آنلاین',
        en: 'Arvand Mahur Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه ماهور، جمع‌وجور و راحت برای اتاق‌های کار با فضای محدود.',
        en: 'Mahur side chair, compact and comfortable for tight-footprint offices.',
      },
    },
  },
  {
    id: 'parand-side-guest-chair',
    title: { fa: 'صندلی همراه پرند', en: 'Arvand Parand Side Chair' },
    slug: {
      fa: 'parand-side-guest-chair',
      en: 'parand-side-guest-chair',
    },
    sku: 'ARV-CHR-PRN-008',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه با بدنه‌ی پلیمری سفید یک‌تکه و پایه‌ی چرخان.',
      en: 'Side chair with a one-piece white polymer shell and a swivel base.',
    },
    description: {
      fa: 'پرند با بدنه‌ی یک‌تکه‌ی پلیمری، ظاهری سبک و تمیز به فضای کار می‌دهد — بدون درز اضافه، تمیزکردن آسان، و پایه‌ی چرخان فولادی برای جابه‌جایی راحت بین ایستگاه‌های کار.',
      en: 'Parand’s one-piece polymer shell gives the workspace a light, clean look — no extra seams, easy to clean, on a swivel steel base for easy movement between stations.',
    },
    images: [
      {
        src: '/images/products/side-guest/parand-side-guest-chair.png',
        alt: {
          fa: 'صندلی همراه پرند اروند',
          en: 'Arvand Parand side chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 60, widthCm: 64, heightCm: 96 },
      material: {
        fa: 'پلیمر یک‌تکه + پایه‌ی فولادی',
        en: 'One-piece polymer + steel base',
      },
      weightKg: 12,
    },
    variants: [{ id: 'white', label: { fa: 'سفید', en: 'White' }, priceModifier: 0, stock: 24 }],
    basePrice: 5_400_000,
    currency: 'IRR',
    stock: 26,
    relatedProductIds: ['roya-side-guest-chair', 'yasna-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'upholstered'],
    materialIds: ['polymer', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه پرند اروند | خرید آنلاین',
        en: 'Arvand Parand Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه پرند با بدنه‌ی پلیمری یک‌تکه‌ی سفید، ظاهری سبک برای فضای کار.',
        en: 'Parand side chair with a one-piece white polymer shell, a light look for the workspace.',
      },
    },
  },
  {
    id: 'roya-side-guest-chair',
    title: { fa: 'صندلی همراه رویا', en: 'Arvand Roya Side Chair' },
    slug: { fa: 'roya-side-guest-chair', en: 'roya-side-guest-chair' },
    sku: 'ARV-CHR-ROY-009',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه با پشتی مش روشن و ظاهری ملایم و مینیمال.',
      en: 'Side chair with a light-toned mesh back and a soft, minimal look.',
    },
    description: {
      fa: 'رویا برای فضاهای کار روشن و مینیمال طراحی شده — پشتی مش با تن رنگی روشن، دسته‌های ثابت اما ارگونومیک، و پایه‌ی چرخان پلیمری با چرخ‌های نرم.',
      en: 'Roya is built for bright, minimal workspaces — a light-toned mesh back, fixed but ergonomic armrests, and a swivel polymer base with soft casters.',
    },
    images: [
      {
        src: '/images/products/side-guest/roya-side-guest-chair.png',
        alt: { fa: 'صندلی همراه رویا اروند', en: 'Arvand Roya side chair' },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 63, widthCm: 66, heightCm: 100 },
      material: {
        fa: 'پارچه‌ی مش + پایه‌ی پلیمری',
        en: 'Mesh fabric + polymer base',
      },
      weightKg: 13,
    },
    variants: [{ id: 'beige', label: { fa: 'بژ', en: 'Beige' }, priceModifier: 0, stock: 20 }],
    basePrice: 5_900_000,
    currency: 'IRR',
    stock: 19,
    relatedProductIds: ['parand-side-guest-chair', 'mahur-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'mesh-back'],
    materialIds: ['mesh-fabric', 'polymer'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه رویا اروند | خرید آنلاین',
        en: 'Arvand Roya Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه رویا با پشتی مش روشن، مناسب فضای کار مینیمال.',
        en: 'Roya side chair with a light mesh back, suited to minimal workspaces.',
      },
    },
  },
  {
    id: 'sadaf-side-guest-chair',
    title: { fa: 'صندلی همراه صدف', en: 'Arvand Sadaf Side Chair' },
    slug: {
      fa: 'sadaf-side-guest-chair',
      en: 'sadaf-side-guest-chair',
    },
    sku: 'ARV-CHR-SDF-010',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی همراه روکش‌دار بوکله با بدنه‌ی پلیمری شنی و پایه‌ی چرخان.',
      en: 'Boucle-upholstered side chair with a sand polymer shell and a swivel base.',
    },
    description: {
      fa: 'صدف با روکش پارچه‌ی بوکله‌ی رنگی و بدنه‌ی پلیمری شنی، لهجه‌ی گرم و غیررسمی به لابی یا اتاق جلسات کوچک می‌دهد؛ پایه‌ی چرخان با تنظیم ارتفاع گازی راحتی روزانه را هم تضمین می‌کند.',
      en: 'With colorful boucle upholstery over a sand-toned polymer shell, Sadaf brings a warm, informal accent to a lobby or small meeting room; a swivel gas-lift base keeps everyday comfort in check.',
    },
    images: [
      {
        src: '/images/products/side-guest/sadaf-side-guest-chair.png',
        alt: {
          fa: 'صندلی همراه صدف اروند',
          en: 'Arvand Sadaf side chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 64, widthCm: 68, heightCm: 98 },
      material: {
        fa: 'پارچه‌ی بوکله + بدنه‌ی پلیمری',
        en: 'Boucle fabric + polymer shell',
      },
      weightKg: 14,
    },
    variants: [
      {
        id: 'amber',
        label: { fa: 'کهربایی', en: 'Amber' },
        priceModifier: 0,
        stock: 10,
      },
      {
        id: 'sand',
        label: { fa: 'شنی', en: 'Sand' },
        priceModifier: 0,
        stock: 5,
      },
    ],
    basePrice: 7_100_000,
    currency: 'IRR',
    stock: 15,
    relatedProductIds: ['kiana-side-guest-chair', 'taban-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['swivel-base', 'upholstered', 'height-adjustable'],
    materialIds: ['wool-fabric', 'polymer'],
    seo: {
      metaTitle: {
        fa: 'صندلی همراه صدف اروند | خرید آنلاین',
        en: 'Arvand Sadaf Side Chair | Buy Online',
      },
      metaDescription: {
        fa: 'صندلی همراه صدف با روکش بوکله‌ی رنگی، لهجه‌ی گرم برای لابی و اتاق جلسات کوچک.',
        en: 'Sadaf side chair with colorful boucle upholstery, a warm accent for lobbies and small meeting rooms.',
      },
    },
  },
  {
    id: 'taban-side-guest-chair',
    title: { fa: 'صندلی استراحت تابان', en: 'Arvand Taban Lounge Chair' },
    slug: {
      fa: 'taban-side-guest-chair',
      en: 'taban-side-guest-chair',
    },
    sku: 'ARV-CHR-TBN-011',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی استراحت روکش‌دار با پایه‌ی چوبی، برای لابی و فضای انتظار.',
      en: 'Upholstered lounge chair on wooden legs, for lobbies and waiting areas.',
    },
    description: {
      fa: 'تابان بدون چرخ و مکانیزم اداری، فقط برای راحتی نشستن کوتاه‌مدت طراحی شده — روکش پارچه‌ای سرمه‌ای ضخیم، اسکلت داخلی فولادی روی چهار پایه‌ی چوبی، مناسب لابی، اتاق انتظار و گوشه‌های غیررسمی.',
      en: 'Without casters or office mechanisms, Taban is built purely for short-stay comfort — thick navy fabric upholstery over a steel inner frame on four wood legs, suited to lobbies, waiting areas, and informal corners.',
    },
    images: [
      {
        src: '/images/products/side-guest/taban-side-guest-chair.png',
        alt: {
          fa: 'صندلی استراحت تابان اروند',
          en: 'Arvand Taban lounge chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 68, widthCm: 72, heightCm: 78 },
      material: {
        fa: 'پارچه‌ی نساجی + پایه‌ی چوبی',
        en: 'Wool fabric + wood legs',
      },
      weightKg: 13,
    },
    variants: [
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy' }, priceModifier: 0, stock: 6 },
      {
        id: 'terracotta',
        label: { fa: 'سفالی', en: 'Terracotta' },
        priceModifier: 300_000,
        stock: 2,
      },
    ],
    basePrice: 9_800_000,
    currency: 'IRR',
    stock: 8,
    relatedProductIds: ['sadaf-side-guest-chair', 'dorsa-reception-sofa-set'],
    salesMode: 'inherit-from-category',
    tagIds: ['upholstered'],
    materialIds: ['wool-fabric', 'wood-veneer'],
    seo: {
      metaTitle: {
        fa: 'صندلی استراحت تابان اروند | لابی و اتاق انتظار',
        en: 'Arvand Taban Lounge Chair | Lobby & Waiting Area',
      },
      metaDescription: {
        fa: 'صندلی استراحت تابان با روکش سرمه‌ای و پایه‌ی چوبی، برای لابی و فضای انتظار.',
        en: 'Taban lounge chair with navy upholstery and wood legs, for lobbies and waiting areas.',
      },
    },
  },
  {
    id: 'yasna-side-guest-chair',
    title: { fa: 'صندلی مهمان یسنا', en: 'Arvand Yasna Guest Chair' },
    slug: {
      fa: 'yasna-side-guest-chair',
      en: 'yasna-side-guest-chair',
    },
    sku: 'ARV-CHR-YAS-012',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی مهمان قابل چیدن روی هم با چهار پایه‌ی فولادی، برای تیراژ بالا.',
      en: 'Stackable four-leg guest chair on a steel frame, for high-volume orders.',
    },
    description: {
      fa: 'یسنا برای اتاق‌های آموزش، سالن انتظار و رویدادهای موقت طراحی شده — بدنه‌ی پلیمری یک‌تکه روی چهار پایه‌ی فولادی، قابل چیدن تا ۸ عدد روی هم برای صرفه‌جویی در فضای انبار.',
      en: 'Yasna is built for training rooms, waiting halls, and temporary events — a one-piece polymer shell on a four-leg steel frame, stackable up to 8 high to save storage space.',
    },
    images: [
      {
        src: '/images/products/side-guest/yasna-side-guest-chair.png',
        alt: {
          fa: 'صندلی مهمان یسنا اروند',
          en: 'Arvand Yasna guest chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 52, widthCm: 56, heightCm: 80 },
      material: {
        fa: 'پلیمر + چهارپایه‌ی فولادی',
        en: 'Polymer + four-leg steel frame',
      },
      weightKg: 7,
    },
    variants: [
      {
        id: 'graphite',
        label: { fa: 'گرافیتی', en: 'Graphite' },
        priceModifier: 0,
        stock: 40,
      },
      { id: 'white', label: { fa: 'سفید', en: 'White' }, priceModifier: 0, stock: 20 },
    ],
    basePrice: 2_900_000,
    currency: 'IRR',
    stock: 60,
    relatedProductIds: ['arghavan-side-guest-chair', 'simin-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['stackable'],
    materialIds: ['polymer', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی مهمان یسنا اروند | خرید عمده',
        en: 'Arvand Yasna Guest Chair | Bulk Orders',
      },
      metaDescription: {
        fa: 'صندلی مهمان یسنا، قابل چیدن روی هم، اقتصادی برای اتاق آموزش و سالن انتظار.',
        en: 'Yasna guest chair, stackable and affordable for training rooms and waiting halls.',
      },
    },
  },
  {
    id: 'arghavan-side-guest-chair',
    title: { fa: 'صندلی مهمان ارغوان', en: 'Arvand Arghavan Guest Chair' },
    slug: {
      fa: 'arghavan-side-guest-chair',
      en: 'arghavan-side-guest-chair',
    },
    sku: 'ARV-CHR-ARG-013',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی مهمان قابل چیدن روی هم با بدنه‌ی مشکی و امکان نصب چرخ.',
      en: 'Stackable guest chair with a black shell and optional casters.',
    },
    description: {
      fa: 'ارغوان نسخه‌ی کمی رسمی‌تر خانواده‌ی صندلی‌های تیراژبالای اروند است — بدنه‌ی مشکی یک‌دست، امکان سفارش با چرخ برای جابه‌جایی سریع بین سالن‌ها، و همان قابلیت چیدن روی هم برای انبارش فشرده.',
      en: 'Arghavan is the slightly more formal member of the Arvand high-volume chair family — a uniform black shell, orderable with casters for fast movement between halls, and the same stacking capability for compact storage.',
    },
    images: [
      {
        src: '/images/products/side-guest/arghavan-side-guest-chair.png',
        alt: {
          fa: 'صندلی مهمان ارغوان اروند',
          en: 'Arvand Arghavan guest chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 54, widthCm: 58, heightCm: 82 },
      material: {
        fa: 'پلیمر + چهارپایه‌ی فولادی',
        en: 'Polymer + four-leg steel frame',
      },
      weightKg: 8,
    },
    variants: [
      { id: 'black', label: { fa: 'مشکی', en: 'Black' }, priceModifier: 0, stock: 45 },
      {
        id: 'black-castors',
        label: { fa: 'مشکی + چرخ', en: 'Black + Casters' },
        priceModifier: 250_000,
        stock: 15,
      },
    ],
    basePrice: 3_400_000,
    currency: 'IRR',
    stock: 48,
    relatedProductIds: ['yasna-side-guest-chair', 'simin-side-guest-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['stackable'],
    materialIds: ['polymer', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی مهمان ارغوان اروند | خرید عمده',
        en: 'Arvand Arghavan Guest Chair | Bulk Orders',
      },
      metaDescription: {
        fa: 'صندلی مهمان ارغوان، قابل چیدن روی هم با امکان نصب چرخ برای جابه‌جایی سریع.',
        en: 'Arghavan guest chair, stackable with optional casters for fast movement.',
      },
    },
  },
  {
    id: 'simin-side-guest-chair',
    title: { fa: 'صندلی مهمان سیمین', en: 'Arvand Simin Guest Chair' },
    slug: {
      fa: 'simin-side-guest-chair',
      en: 'simin-side-guest-chair',
    },
    sku: 'ARV-CHR-SMN-014',
    categoryId: 'chairs-side-guest',
    shortDescription: {
      fa: 'صندلی مهمان قابل چیدن روی هم با پشتی مش و شاسی سلد کروم.',
      en: 'Stackable guest chair with a mesh back and a chromed sled frame.',
    },
    description: {
      fa: 'سیمین با شاسی سلد فولادی کروم و پشتی مش، برای اتاق‌های جلسه‌ی چندمنظوره طراحی شده — دسته‌های ثابت پلیمری، امکان چیدن روی هم و ردیف‌کردن کنار میزهای کنفرانس موقت.',
      en: 'With a chrome steel sled frame and a mesh back, Simin is built for multi-purpose meeting rooms — fixed polymer armrests, stackable, and easy to row alongside temporary conference tables.',
    },
    images: [
      {
        src: '/images/products/side-guest/simin-side-guest-chair.png',
        alt: {
          fa: 'صندلی مهمان سیمین اروند',
          en: 'Arvand Simin guest chair',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 58, widthCm: 60, heightCm: 84 },
      material: {
        fa: 'پارچه‌ی مش + شاسی فولاد کروم',
        en: 'Mesh fabric + chromed steel sled frame',
      },
      weightKg: 9,
    },
    variants: [
      {
        id: 'black-chrome',
        label: { fa: 'مشکی/کروم', en: 'Black/Chrome' },
        priceModifier: 0,
        stock: 35,
      },
    ],
    basePrice: 4_200_000,
    currency: 'IRR',
    stock: 40,
    relatedProductIds: ['arghavan-side-guest-chair', 'vesta-conference-chair'],
    salesMode: 'inherit-from-category',
    tagIds: ['stackable', 'mesh-back'],
    materialIds: ['mesh-fabric', 'steel'],
    seo: {
      metaTitle: {
        fa: 'صندلی مهمان سیمین اروند | اتاق جلسات چندمنظوره',
        en: 'Arvand Simin Guest Chair | Multi-Purpose Meeting Rooms',
      },
      metaDescription: {
        fa: 'صندلی مهمان سیمین با پشتی مش و شاسی سلد کروم، قابل چیدن روی هم.',
        en: 'Simin guest chair with a mesh back and a chromed sled frame, stackable.',
      },
    },
  },
]
