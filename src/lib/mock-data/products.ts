/**
 * Mock data برای Collection `Products` (docs/02-data-model.md بخش ۲).
 * ۸ محصول واقع‌گرایانه، پخش‌شده روی هر ۵ دسته — قیمت‌ها به تومان (سند ۰۲: تک‌ارزی، فروش فقط ایران).
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
  seo: SeoFields
}

export const products: Product[] = [
  {
    id: 'ara-managerial-chair',
    title: {
      fa: 'صندلی مدیریتی آرا',
      en: 'Arvand Ara Managerial Chair',
      ar: 'كرسي أرواند آرا الإداري',
    },
    slug: { fa: 'ara-managerial-chair', en: 'ara-managerial-chair', ar: 'ara-managerial-chair' },
    sku: 'ARV-CHR-ARA-001',
    categoryId: 'chairs',
    shortDescription: {
      fa: 'صندلی مدیریتی با پشتی مش تنفس‌پذیر و مکانیزم تنظیم ارتفاع/زاویه.',
      en: 'Managerial chair with breathable mesh back and height/tilt adjustment.',
      ar: 'كرسي إداري بظهر شبكي قابل للتنفس وآلية ضبط الارتفاع والميلان.',
    },
    description: {
      fa: 'صندلی مدیریتی آرا برای ساعت‌های طولانی کار پشت میز طراحی شده. پشتی مش با تهویه‌ی هوا از خستگی کمر جلوگیری می‌کند، دسته‌های قابل تنظیم در سه جهت و مکانیزم Synchro-Tilt امکان تنظیم دقیق زاویه‌ی نشستن را می‌دهند. پایه‌ی آلومینیومی ریخته‌گری و چرخ‌های نرم مناسب کف سرامیک و پارکت.',
      en: 'The Ara managerial chair is built for long hours at the desk. The ventilated mesh backrest reduces back fatigue, tri-directional armrests and a synchro-tilt mechanism allow precise seating adjustment, and the cast-aluminum base pairs with soft casters safe for tile and parquet floors.',
      ar: 'صُمّم كرسي آرا الإداري لساعات العمل الطويلة خلف المكتب. يقلل الظهر الشبكي المهوّى من إجهاد الظهر، وتتيح مساند الذراعين القابلة للتعديل ثلاثي الاتجاه وآلية الميلان المتزامن ضبطًا دقيقًا لوضعية الجلوس، مع قاعدة ألمنيوم مصبوبة وعجلات ناعمة آمنة على البلاط والباركيه.',
    },
    images: [
      {
        src: '/images/mock/icon-chair.svg',
        alt: {
          fa: 'صندلی مدیریتی آرا اروند',
          en: 'Arvand Ara managerial chair',
          ar: 'كرسي أرواند آرا الإداري',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 68, widthCm: 72, heightCm: 128 },
      material: {
        fa: 'پارچه‌ی مش + پایه‌ی آلومینیوم ریخته‌گری',
        en: 'Mesh fabric + cast-aluminum base',
        ar: 'قماش شبكي + قاعدة ألمنيوم مصبوبة',
      },
      weightKg: 18,
    },
    variants: [
      {
        id: 'black',
        label: { fa: 'مشکی', en: 'Black', ar: 'أسود' },
        priceModifier: 0,
        stock: 24,
      },
      {
        id: 'graphite',
        label: { fa: 'خاکستری گرافیتی', en: 'Graphite Grey', ar: 'رمادي غرافيتي' },
        priceModifier: 350_000,
        stock: 12,
      },
    ],
    basePrice: 8_500_000,
    currency: 'IRR',
    stock: 36,
    relatedProductIds: ['sabk-task-chair', 'vesta-conference-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'صندلی مدیریتی آرا اروند | خرید آنلاین',
        en: 'Arvand Ara Managerial Chair | Buy Online',
        ar: 'كرسي أرواند آرا الإداري | تسوّق أونلاين',
      },
      metaDescription: {
        fa: 'صندلی مدیریتی آرا با پشتی مش و مکانیزم تنظیم کامل — ارسال سریع در سراسر ایران.',
        en: 'Ara managerial chair with mesh back and full adjustment — fast shipping across Iran.',
        ar: 'كرسي آرا الإداري بظهر شبكي وضبط كامل — شحن سريع في جميع أنحاء إيران.',
      },
    },
  },
  {
    id: 'sabk-task-chair',
    title: { fa: 'صندلی کارمندی سبک', en: 'Arvand Sabk Task Chair', ar: 'كرسي أرواند سبک المكتبي' },
    slug: { fa: 'sabk-task-chair', en: 'sabk-task-chair', ar: 'sabk-task-chair' },
    sku: 'ARV-CHR-SBK-002',
    categoryId: 'chairs',
    shortDescription: {
      fa: 'صندلی کارمندی سبک‌وزن با روکش پارچه‌ای و قیمت مناسب برای خرید تیراژ بالا.',
      en: 'Lightweight task chair with fabric upholstery — affordable for bulk office orders.',
      ar: 'كرسي مكتبي خفيف بتنجيد قماشي — سعر مناسب للطلبات الكبيرة.',
    },
    description: {
      fa: 'صندلی سبک برای فضاهای کارمندی طراحی شده که هم راحتی روزانه و هم صرفه‌ی اقتصادی در خریدهای تیراژبالای سازمانی را فراهم می‌کند. پشتی نیمه‌بلند با فوم متراکم، پایه‌ی پنج‌پر پلیمری مقاوم و امکان تنظیم ارتفاع گازی.',
      en: 'A lightweight chair built for staff workstations, balancing everyday comfort with cost-efficiency for large organizational orders. Mid-back with dense foam, a durable five-star polymer base, and gas-lift height adjustment.',
      ar: 'كرسي خفيف مصمم لمحطات عمل الموظفين، يوازن بين الراحة اليومية والكفاءة الاقتصادية للطلبات المؤسسية الكبيرة. ظهر متوسط برغوة كثيفة، قاعدة بوليمر خماسية متينة، وضبط ارتفاع هوائي.',
    },
    images: [
      {
        src: '/images/mock/icon-chair.svg',
        alt: {
          fa: 'صندلی کارمندی سبک اروند',
          en: 'Arvand Sabk task chair',
          ar: 'كرسي أرواند سبک المكتبي',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 60, widthCm: 62, heightCm: 98 },
      material: {
        fa: 'پارچه‌ی نشکن + پایه‌ی پلیمری',
        en: 'Rip-stop fabric + polymer base',
        ar: 'قماش مقاوم للتمزق + قاعدة بوليمر',
      },
      weightKg: 11,
    },
    variants: [
      {
        id: 'charcoal',
        label: { fa: 'زغالی', en: 'Charcoal', ar: 'فحمي' },
        priceModifier: 0,
        stock: 60,
      },
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy', ar: 'كحلي' }, priceModifier: 0, stock: 40 },
    ],
    basePrice: 3_200_000,
    currency: 'IRR',
    stock: 100,
    relatedProductIds: ['ara-managerial-chair', 'persepolis-workstation-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'صندلی کارمندی سبک اروند | خرید عمده و تکی',
        en: 'Arvand Sabk Task Chair | Retail & Bulk',
        ar: 'كرسي أرواند سبک المكتبي | تجزئة وجملة',
      },
      metaDescription: {
        fa: 'صندلی کارمندی مقرون‌به‌صرفه اروند، مناسب تجهیز سازمانی و خرید تکی.',
        en: 'Affordable Arvand task chair, suited for organizational fit-outs and single purchases.',
        ar: 'كرسي أرواند المكتبي الاقتصادي، مناسب لتجهيز المؤسسات والشراء الفردي.',
      },
    },
  },
  {
    id: 'vesta-conference-chair',
    title: {
      fa: 'صندلی کنفرانس وستا',
      en: 'Arvand Vesta Conference Chair',
      ar: 'كرسي أرواند فيستا للاجتماعات',
    },
    slug: {
      fa: 'vesta-conference-chair',
      en: 'vesta-conference-chair',
      ar: 'vesta-conference-chair',
    },
    sku: 'ARV-CHR-VST-003',
    categoryId: 'chairs',
    shortDescription: {
      fa: 'صندلی کنفرانس با پشتی بلند چرمی و ظاهر رسمی برای اتاق جلسات.',
      en: 'High-back leather conference chair with a formal presence for meeting rooms.',
      ar: 'كرسي اجتماعات بظهر جلدي عالٍ ومظهر رسمي لقاعات الاجتماعات.',
    },
    description: {
      fa: 'وستا برای اتاق‌های جلسه و کنفرانس طراحی شده — پشتی بلند چرم مصنوعی درجه‌یک، بدنه‌ی استیل کروم‌شده و نشیمن روکش‌دار با فوم سرد. ظاهر رسمی و یکدست برای ردیف صندلی‌های میز کنفرانس.',
      en: 'Vesta is designed for boardrooms and meeting spaces — a premium faux-leather high back, chromed steel frame, and cold-cure foam upholstery for a uniform, formal look along a conference table.',
      ar: 'صُمم فيستا لقاعات الاجتماعات ومجالس الإدارة — ظهر عالٍ من الجلد الصناعي الفاخر، هيكل من الفولاذ المطلي بالكروم، وتنجيد برغوة باردة لمظهر رسمي وموحّد على طاولة الاجتماعات.',
    },
    images: [
      {
        src: '/images/mock/icon-chair-conference.svg',
        alt: {
          fa: 'صندلی کنفرانس وستا اروند',
          en: 'Arvand Vesta conference chair',
          ar: 'كرسي أرواند فيستا للاجتماعات',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 65, widthCm: 70, heightCm: 118 },
      material: {
        fa: 'چرم مصنوعی + استیل کروم',
        en: 'Faux leather + chromed steel',
        ar: 'جلد صناعي + فولاذ مطلي بالكروم',
      },
      weightKg: 15,
    },
    variants: [
      { id: 'black', label: { fa: 'مشکی', en: 'Black', ar: 'أسود' }, priceModifier: 0, stock: 18 },
      {
        id: 'brown',
        label: { fa: 'قهوه‌ای', en: 'Brown', ar: 'بني' },
        priceModifier: 400_000,
        stock: 10,
      },
    ],
    basePrice: 11_900_000,
    currency: 'IRR',
    stock: 28,
    relatedProductIds: ['ara-managerial-chair', 'resta-conference-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'صندلی کنفرانس وستا اروند | اتاق جلسات',
        en: 'Arvand Vesta Conference Chair | Boardroom',
        ar: 'كرسي أرواند فيستا للاجتماعات | قاعة المجلس',
      },
      metaDescription: {
        fa: 'صندلی کنفرانس چرمی وستا با ظاهر رسمی، مناسب اتاق جلسات و هیئت‌مدیره.',
        en: 'Vesta leather conference chair with a formal presence, ideal for boardrooms.',
        ar: 'كرسي فيستا الجلدي للاجتماعات بمظهر رسمي، مثالي لقاعات مجلس الإدارة.',
      },
    },
  },
  {
    id: 'alvand-managerial-desk',
    title: {
      fa: 'میز مدیریتی الوند',
      en: 'Arvand Alvand Managerial Desk',
      ar: 'مكتب أرواند ألوند الإداري',
    },
    slug: {
      fa: 'alvand-managerial-desk',
      en: 'alvand-managerial-desk',
      ar: 'alvand-managerial-desk',
    },
    sku: 'ARV-DSK-ALV-001',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز مدیریتی با روکش ملامینه ضدخش و کشوی قفل‌دار جانبی.',
      en: 'Managerial desk with scratch-resistant melamine top and a lockable side drawer unit.',
      ar: 'مكتب إداري بسطح ميلامين مقاوم للخدش ووحدة أدراج جانبية قابلة للقفل.',
    },
    description: {
      fa: 'میز مدیریتی الوند با ابعاد بزرگ برای اتاق‌های مدیریتی طراحی شده. روکش ملامینه‌ی ضدخش و ضدرطوبت، پایه‌ی فلزی رنگ‌شده با پوشش الکترواستاتیک، و باکس کشوی جانبی سه‌طبقه با قفل مرکزی.',
      en: 'The Alvand desk is sized for executive offices. It features a scratch- and moisture-resistant melamine top, an electrostatically coated steel frame, and a three-drawer side pedestal with a central lock.',
      ar: 'صُمم مكتب ألوند بأبعاد كبيرة لمكاتب الإدارة. يتميز بسطح ميلامين مقاوم للخدش والرطوبة، وهيكل فولاذي بطلاء إلكتروستاتيكي، ووحدة أدراج جانبية ثلاثية بقفل مركزي.',
    },
    images: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میز مدیریتی الوند اروند',
          en: 'Arvand Alvand managerial desk',
          ar: 'مكتب أرواند ألوند الإداري',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 180, widthCm: 80, heightCm: 75 },
      material: {
        fa: 'ملامینه + فلز رنگ‌شده الکترواستاتیک',
        en: 'Melamine + electrostatically coated steel',
        ar: 'ميلامين + فولاذ بطلاء إلكتروستاتيكي',
      },
      weightKg: 62,
    },
    variants: [
      {
        id: 'walnut',
        label: { fa: 'گردویی', en: 'Walnut', ar: 'جوزي' },
        priceModifier: 0,
        stock: 14,
      },
      { id: 'white', label: { fa: 'سفید', en: 'White', ar: 'أبيض' }, priceModifier: 0, stock: 9 },
    ],
    basePrice: 14_500_000,
    currency: 'IRR',
    stock: 23,
    relatedProductIds: ['ara-managerial-chair', 'persepolis-workstation-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'میز مدیریتی الوند اروند | خرید آنلاین',
        en: 'Arvand Alvand Managerial Desk | Buy Online',
        ar: 'مكتب أرواند ألوند الإداري | تسوّق أونلاين',
      },
      metaDescription: {
        fa: 'میز مدیریتی الوند با کشوی قفل‌دار و روکش ضدخش، مناسب اتاق مدیریت.',
        en: 'Alvand managerial desk with a lockable drawer and scratch-resistant top, built for executive offices.',
        ar: 'مكتب ألوند الإداري بدرج قابل للقفل وسطح مقاوم للخدش، مناسب لمكاتب الإدارة.',
      },
    },
  },
  {
    id: 'persepolis-workstation-desk',
    title: {
      fa: 'میز کارشناسی پرسپولیس',
      en: 'Arvand Persepolis Workstation Desk',
      ar: 'مكتب أرواند برسبوليس',
    },
    slug: {
      fa: 'persepolis-workstation-desk',
      en: 'persepolis-workstation-desk',
      ar: 'persepolis-workstation-desk',
    },
    sku: 'ARV-DSK-PRS-002',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز کارشناسی با مدیریت کابل داخلی، مناسب چیدمان اپن‌اسپیس.',
      en: 'Workstation desk with built-in cable management, ideal for open-space layouts.',
      ar: 'مكتب عمل بإدارة كابلات مدمجة، مثالي لتخطيط المساحات المفتوحة.',
    },
    description: {
      fa: 'میز پرسپولیس برای فضاهای اپن‌اسپیس و اتاق کارشناسی طراحی شده. کانال مدیریت کابل زیر سطح میز، امکان چیدمان به‌صورت تک یا مجموعه‌ی چندنفره (Cluster)، و رویه‌ی ضدخط‌وخش مناسب استفاده‌ی روزانه‌ی سنگین.',
      en: 'Persepolis is built for open-plan and specialist offices — an under-desk cable channel, single or multi-user cluster configuration, and a scratch-resistant surface for heavy daily use.',
      ar: 'صُمم برسبوليس للمساحات المفتوحة ومكاتب الاختصاصيين — قناة كابلات أسفل المكتب، وإمكانية التركيب الفردي أو كمجموعة متعددة المستخدمين، وسطح مقاوم للخدش للاستخدام اليومي المكثف.',
    },
    images: [
      {
        src: '/images/mock/icon-desk-workstation.svg',
        alt: {
          fa: 'میز کارشناسی پرسپولیس اروند',
          en: 'Arvand Persepolis workstation desk',
          ar: 'مكتب أرواند برسبوليس',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 140, widthCm: 70, heightCm: 75 },
      material: {
        fa: 'ملامینه + فلز',
        en: 'Melamine + steel',
        ar: 'ميلامين + فولاذ',
      },
      weightKg: 41,
    },
    variants: [
      { id: 'oak', label: { fa: 'بلوط', en: 'Oak', ar: 'بلوط' }, priceModifier: 0, stock: 30 },
      {
        id: 'grey',
        label: { fa: 'خاکستری', en: 'Grey', ar: 'رمادي' },
        priceModifier: 0,
        stock: 22,
      },
    ],
    basePrice: 7_400_000,
    currency: 'IRR',
    stock: 52,
    relatedProductIds: ['sabk-task-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'میز کارشناسی پرسپولیس اروند | تجهیز اپن‌اسپیس',
        en: 'Arvand Persepolis Workstation Desk | Open-Space Fit-Out',
        ar: 'مكتب أرواند برسبوليس | تجهيز المساحات المفتوحة',
      },
      metaDescription: {
        fa: 'میز کارشناسی پرسپولیس با مدیریت کابل، برای تجهیز سریع فضای اداری اپن‌اسپیس.',
        en: 'Persepolis workstation desk with cable management, for fast open-plan office fit-outs.',
        ar: 'مكتب برسبوليس بإدارة كابلات، لتجهيز سريع للمكاتب المفتوحة.',
      },
    },
  },
  {
    id: 'resta-conference-desk',
    title: {
      fa: 'میز کنفرانس رستا',
      en: 'Arvand Resta Conference Table',
      ar: 'طاولة أرواند رستا للاجتماعات',
    },
    slug: { fa: 'resta-conference-desk', en: 'resta-conference-desk', ar: 'resta-conference-desk' },
    sku: 'ARV-DSK-RST-003',
    categoryId: 'desks',
    shortDescription: {
      fa: 'میز کنفرانس بیضی برای اتاق جلسات ۸ تا ۱۲ نفره.',
      en: 'Oval conference table for 8–12 person meeting rooms.',
      ar: 'طاولة اجتماعات بيضاوية لغرف اجتماعات من ٨ إلى ١٢ شخصًا.',
    },
    description: {
      fa: 'میز کنفرانس رستا با فرم بیضی، امکان عبور کابل شبکه/برق از مرکز میز از طریق دریچه‌ی تعبیه‌شده، و رویه‌ی روکش چوب طبیعی. برای اتاق جلسات متوسط تا بزرگ سازمانی مناسب است.',
      en: 'Resta is an oval conference table with a center cable pass-through for power and network cabling, finished in natural wood veneer. Suited to mid-to-large organizational meeting rooms.',
      ar: 'رستا طاولة اجتماعات بيضاوية مزودة بفتحة مرور كابلات في المنتصف للطاقة والشبكة، بتشطيب قشرة خشب طبيعي. مناسبة لغرف الاجتماعات المتوسطة إلى الكبيرة.',
    },
    images: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میز کنفرانس رستا اروند',
          en: 'Arvand Resta conference table',
          ar: 'طاولة أرواند رستا للاجتماعات',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 320, widthCm: 120, heightCm: 75 },
      material: {
        fa: 'روکش چوب طبیعی + فلز',
        en: 'Natural wood veneer + steel',
        ar: 'قشرة خشب طبيعي + فولاذ',
      },
      weightKg: 98,
      capacity: { fa: '۸ تا ۱۲ نفر', en: '8–12 people', ar: '٨ إلى ١٢ شخصًا' },
    },
    variants: [
      {
        id: 'walnut',
        label: { fa: 'گردویی', en: 'Walnut', ar: 'جوزي' },
        priceModifier: 0,
        stock: 6,
      },
    ],
    basePrice: 38_000_000,
    currency: 'IRR',
    stock: 8,
    relatedProductIds: ['vesta-conference-chair', 'alvand-managerial-desk'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'میز کنفرانس رستا اروند | اتاق جلسات',
        en: 'Arvand Resta Conference Table | Boardroom',
        ar: 'طاولة أرواند رستا للاجتماعات | قاعة المجلس',
      },
      metaDescription: {
        fa: 'میز کنفرانس بیضی رستا با روکش چوب طبیعی برای اتاق جلسات ۸ تا ۱۲ نفره.',
        en: 'Resta oval conference table in natural wood veneer, for 8–12 person meeting rooms.',
        ar: 'طاولة رستا البيضاوية بقشرة خشب طبيعي لغرف اجتماعات من ٨ إلى ١٢ شخصًا.',
      },
    },
  },
  {
    id: 'dorsa-reception-sofa-set',
    title: {
      fa: 'ست مبل پذیرایی اداری درسا',
      en: 'Arvand Dorsa Reception Sofa Set',
      ar: 'طقم أرواند دورسا لأثاث الاستقبال',
    },
    slug: {
      fa: 'dorsa-reception-sofa-set',
      en: 'dorsa-reception-sofa-set',
      ar: 'dorsa-reception-sofa-set',
    },
    sku: 'ARV-OFN-DRS-001',
    categoryId: 'office-furniture',
    shortDescription: {
      fa: 'ست مبل سه‌نفره + دو مبل تک‌نفره برای لابی و اتاق انتظار.',
      en: 'Three-seat sofa plus two single armchairs, for lobbies and waiting areas.',
      ar: 'أريكة ثلاثية مقاعد مع كرسيين فرديين، للردهات ومناطق الانتظار.',
    },
    description: {
      fa: 'ست مبل درسا شامل یک مبل سه‌نفره و دو مبل تک‌نفره با اسکلت چوب راش و فوم سردِ باکیفیت است. روکش پارچه‌ای مقاوم به سایش برای ترافیک بالای لابی و اتاق انتظار مناسب سازمان‌های متوسط تا بزرگ طراحی شده — برای تیراژ بالا/رنگ سفارشی معمولاً استعلام قیمت پروژه‌ای انجام می‌شود.',
      en: 'The Dorsa set includes one three-seat sofa and two single armchairs on a beechwood frame with high-density cold-cure foam. The abrasion-resistant fabric upholstery suits high-traffic lobbies and waiting areas for mid-to-large organizations — bulk orders or custom colors typically go through a project quote.',
      ar: 'يضم طقم دورسا أريكة ثلاثية المقاعد وكرسيين فرديين على هيكل من خشب الزان مع رغوة باردة عالية الكثافة. يناسب التنجيد القماشي المقاوم للاحتكاك الردهات ومناطق الانتظار عالية الحركة في المؤسسات المتوسطة والكبيرة — الطلبات الكبيرة أو الألوان المخصصة عادة تمر عبر عرض سعر للمشروع.',
    },
    images: [
      {
        src: '/images/mock/icon-sofa.svg',
        alt: {
          fa: 'ست مبل پذیرایی اداری درسا اروند',
          en: 'Arvand Dorsa reception sofa set',
          ar: 'طقم أرواند دورسا لأثاث الاستقبال',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 210, widthCm: 85, heightCm: 80 },
      material: {
        fa: 'چوب راش + پارچه‌ی مقاوم به سایش',
        en: 'Beechwood + abrasion-resistant fabric',
        ar: 'خشب الزان + قماش مقاوم للاحتكاك',
      },
      weightKg: 74,
    },
    variants: [
      { id: 'beige', label: { fa: 'بژ', en: 'Beige', ar: 'بيج' }, priceModifier: 0, stock: 5 },
      {
        id: 'slate-grey',
        label: { fa: 'خاکستری سربی', en: 'Slate Grey', ar: 'رمادي داكن' },
        priceModifier: 0,
        stock: 3,
      },
    ],
    basePrice: 45_000_000,
    currency: 'IRR',
    stock: 8,
    relatedProductIds: ['alvand-managerial-desk'],
    salesMode: 'quote-only',
    seo: {
      metaTitle: {
        fa: 'ست مبل پذیرایی اداری درسا اروند',
        en: 'Arvand Dorsa Reception Sofa Set',
        ar: 'طقم أرواند دورسا لأثاث الاستقبال',
      },
      metaDescription: {
        fa: 'ست مبل لابی و اتاق انتظار درسا برای سازمان‌های متوسط تا بزرگ — استعلام قیمت پروژه‌ای.',
        en: 'Dorsa lobby and waiting-area sofa set for mid-to-large organizations — project-based quote.',
        ar: 'طقم دورسا للردهات ومناطق الانتظار للمؤسسات المتوسطة والكبيرة — عرض سعر للمشروع.',
      },
    },
  },
  {
    id: 'salen-amphitheater-seating',
    title: {
      fa: 'صندلی آمفی‌تئاتر سالن',
      en: 'Arvand Salen Amphitheater Seating',
      ar: 'مقاعد أرواند سالن للمدرجات',
    },
    slug: {
      fa: 'salen-amphitheater-seating',
      en: 'salen-amphitheater-seating',
      ar: 'salen-amphitheater-seating',
    },
    sku: 'ARV-AMP-SLN-001',
    categoryId: 'amphitheater',
    shortDescription: {
      fa: 'سیستم صندلی ردیفی تاشو برای آمفی‌تئاتر دانشگاه‌ها و سالن‌های اجتماع.',
      en: 'Fold-up row seating system for university amphitheaters and assembly halls.',
      ar: 'نظام مقاعد صف قابلة للطي لمدرجات الجامعات وقاعات التجمع.',
    },
    description: {
      fa: 'سیستم صندلی سالن برای نصب ردیفی در آمفی‌تئاتر طراحی شده — نشیمن تاشوی خودکار برای صرفه‌جویی در فضای عبور، شاسی فولادی مقاوم مناسب استفاده‌ی سنگین روزانه، و امکان تعبیه‌ی میز یادداشت‌برداری تاشو در پشتی هر صندلی. طراحی، تعداد ردیف، و رنگ‌بندی برای هر پروژه به‌صورت اختصاصی مشاوره داده می‌شود.',
      en: 'Salen is a row-seating system built for amphitheater installation — a self-folding seat to preserve aisle space, a heavy-duty steel chassis for daily wear, and an optional fold-down writing tablet on the seatback. Layout, row count, and color are consulted per project.',
      ar: 'سالن نظام مقاعد صفوف مصمم للتركيب في المدرجات — مقعد قابل للطي تلقائيًا لتوفير مساحة الممر، وهيكل فولاذي متين للاستخدام اليومي المكثف، وطاولة كتابة قابلة للطي اختيارية خلف كل مقعد. يتم تحديد التخطيط وعدد الصفوف والألوان بالتشاور لكل مشروع.',
    },
    images: [
      {
        src: '/images/mock/icon-amphitheater.svg',
        alt: {
          fa: 'صندلی آمفی‌تئاتر سالن اروند',
          en: 'Arvand Salen amphitheater seating',
          ar: 'مقاعد أرواند سالن للمدرجات',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 55, widthCm: 60, heightCm: 90 },
      material: {
        fa: 'شاسی فولادی + روکش پلی‌یورتان',
        en: 'Steel chassis + polyurethane upholstery',
        ar: 'هيكل فولاذي + تنجيد بولي يوريثان',
      },
      weightKg: 14,
      capacity: {
        fa: 'قابل تنظیم بر اساس نقشه‌ی سالن',
        en: 'Configurable per hall layout',
        ar: 'قابل للتخصيص حسب مخطط القاعة',
      },
    },
    variants: [
      {
        id: 'standard',
        label: { fa: 'استاندارد', en: 'Standard', ar: 'قياسي' },
        priceModifier: 0,
        stock: 0,
      },
    ],
    basePrice: 4_800_000,
    currency: 'IRR',
    stock: 0,
    relatedProductIds: ['royal-cinema-hall-seating'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'صندلی آمفی‌تئاتر سالن اروند | پروژه‌های دانشگاهی',
        en: 'Arvand Salen Amphitheater Seating | University Projects',
        ar: 'مقاعد أرواند سالن للمدرجات | مشاريع جامعية',
      },
      metaDescription: {
        fa: 'سیستم صندلی ردیفی تاشو سالن برای آمفی‌تئاتر — طراحی اختصاصی هر پروژه.',
        en: 'Salen fold-up row seating for amphitheaters — custom design per project.',
        ar: 'مقاعد صف سالن القابلة للطي للمدرجات — تصميم مخصص لكل مشروع.',
      },
    },
  },
  {
    id: 'royal-cinema-hall-seating',
    title: {
      fa: 'صندلی سالن همایش و سینما رویال',
      en: 'Arvand Royal Cinema Hall Seating',
      ar: 'مقاعد أرواند رويال لقاعات السينما',
    },
    slug: {
      fa: 'royal-cinema-hall-seating',
      en: 'royal-cinema-hall-seating',
      ar: 'royal-cinema-hall-seating',
    },
    sku: 'ARV-CIN-RYL-001',
    categoryId: 'cinema-conference',
    shortDescription: {
      fa: 'صندلی راحت سالن سینما و همایش با بالشتک ضخیم و پشتی بلند.',
      en: 'Plush cinema and conference hall seating with a thick cushion and high back.',
      ar: 'مقاعد فاخرة لقاعات السينما والمؤتمرات بوسادة سميكة وظهر عالٍ.',
    },
    description: {
      fa: 'رویال برای سالن‌های همایش و سینما طراحی شده — بالشتک ضخیم با فوم چگالی بالا برای نشستن طولانی‌مدت، پشتی بلند برای عایق صدا و حریم بصری بین ردیف‌ها، و امکان اتصال ردیفی یا نصب مستقل. رنگ روکش و تعداد صندلی هر ردیف بر اساس نقشه‌ی سالن سفارشی‌سازی می‌شود.',
      en: 'Royal is built for conference and cinema halls — a high-density thick cushion for long sessions, a high back for sound dampening and visual privacy between rows, and either ganged-row or standalone installation. Upholstery color and row seat count are customized to the hall layout.',
      ar: 'صُمم رويال لقاعات المؤتمرات والسينما — وسادة سميكة عالية الكثافة للجلسات الطويلة، وظهر عالٍ لعزل الصوت وخصوصية بصرية بين الصفوف، مع إمكانية التركيب في صفوف متصلة أو بشكل مستقل. يتم تخصيص لون التنجيد وعدد المقاعد في كل صف حسب مخطط القاعة.',
    },
    images: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: {
          fa: 'صندلی سالن همایش و سینما رویال اروند',
          en: 'Arvand Royal cinema hall seating',
          ar: 'مقاعد أرواند رويال لقاعات السينما',
        },
      },
    ],
    model3d: null,
    specs: {
      dimensions: { lengthCm: 58, widthCm: 65, heightCm: 105 },
      material: {
        fa: 'فوم چگالی‌بالا + روکش مخمل ضدآتش',
        en: 'High-density foam + fire-retardant velvet upholstery',
        ar: 'رغوة عالية الكثافة + تنجيد مخملي مقاوم للحريق',
      },
      weightKg: 17,
      capacity: {
        fa: 'قابل تنظیم بر اساس نقشه‌ی سالن',
        en: 'Configurable per hall layout',
        ar: 'قابل للتخصيص حسب مخطط القاعة',
      },
    },
    variants: [
      {
        id: 'burgundy',
        label: { fa: 'زرشکی', en: 'Burgundy', ar: 'عنابي' },
        priceModifier: 0,
        stock: 0,
      },
      { id: 'navy', label: { fa: 'سرمه‌ای', en: 'Navy', ar: 'كحلي' }, priceModifier: 0, stock: 0 },
    ],
    basePrice: 6_200_000,
    currency: 'IRR',
    stock: 0,
    relatedProductIds: ['salen-amphitheater-seating'],
    salesMode: 'inherit-from-category',
    seo: {
      metaTitle: {
        fa: 'صندلی سالن همایش و سینما رویال اروند',
        en: 'Arvand Royal Cinema & Conference Hall Seating',
        ar: 'مقاعد أرواند رويال لقاعات المؤتمرات والسينما',
      },
      metaDescription: {
        fa: 'صندلی راحت رویال برای سالن همایش و سینما — استعلام قیمت پروژه‌ای.',
        en: 'Comfortable Royal seating for conference and cinema halls — project-based quote.',
        ar: 'مقاعد رويال المريحة لقاعات المؤتمرات والسينما — عرض سعر للمشروع.',
      },
    },
  },
]
