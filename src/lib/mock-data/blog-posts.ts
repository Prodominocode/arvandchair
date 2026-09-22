/**
 * Mock data برای Collection `BlogPosts` (docs/02-data-model.md بخش ۳).
 * در بسته‌ی ۱ مصرف نمی‌شود (لیست/جزئیات وبلاگ کار بسته‌ی ۳ است)؛ طبق دستور همین فاز، از قبل
 * ساخته می‌شود تا لایه‌ی Data Access کامل باشد.
 */

import type { LocalizedText, MockImage, SeoFields } from './types'

export type BlogPost = {
  id: string
  title: LocalizedText
  slug: LocalizedText
  excerpt: LocalizedText
  content: LocalizedText
  coverImage: MockImage
  authorName: string
  category: LocalizedText
  tags: string[]
  publishedDate: string
  seo: SeoFields
}

export const blogPosts: BlogPost[] = [
  {
    id: 'ergonomic-chair-guide',
    title: {
      fa: 'راهنمای انتخاب صندلی ارگونومیک برای دفتر کار',
      en: 'A Guide to Choosing an Ergonomic Office Chair',
    },
    slug: { fa: 'ergonomic-chair-guide', en: 'ergonomic-chair-guide' },
    excerpt: {
      fa: 'چه ویژگی‌هایی یک صندلی اداری را واقعاً ارگونومیک می‌کند؟ نکاتی برای خرید آگاهانه.',
      en: 'What actually makes an office chair ergonomic? A few pointers for buying with confidence.',
    },
    content: {
      fa: 'انتخاب صندلی اداری مناسب مستقیماً روی سلامت ستون فقرات و بهره‌وری کارمندان اثر می‌گذارد. در این مطلب به سه معیار کلیدی می‌پردازیم: تنظیم ارتفاع و زاویه، پشتیبانی کمری، و کیفیت پارچه/فوم.\n\nارتفاع صندلی باید طوری تنظیم شود که زانوها زاویه‌ی تقریباً ۹۰ درجه داشته باشند و کف پا کامل روی زمین یا زیرپایی قرار گیرد. مکانیزم Tilt نیز باید امکان قفل‌شدن در چند زاویه‌ی مختلف را بدهد تا کاربر بین حالت نشستن مستقیم و کمی خوابیده جابه‌جا شود.\n\nپشتی کمری (Lumbar Support) باید دقیقاً در ناحیه‌ی گودی کمر قرار بگیرد، نه بالاتر یا پایین‌تر. صندلی‌های خوب معمولاً این پشتی را قابل‌تنظیم در ارتفاع و عمق عرضه می‌کنند تا با قامت‌های مختلف تطبیق پیدا کند.\n\nدر انتخاب پارچه یا فوم، دوام در برابر ساییدگی روزانه و تهویه‌ی هوا (برای جلوگیری از گرمای موضعی) دو معیار اصلی‌اند؛ مش (Mesh) معمولاً برای ساعات طولانی نشستن گزینه‌ی خنک‌تری نسبت به پارچه‌ی متراکم است.',
      en: 'Choosing the right office chair has a direct impact on spinal health and employee productivity. This article covers three key criteria: height and tilt adjustment, lumbar support, and fabric/foam quality.\n\nSeat height should let the knees rest at roughly a 90-degree angle with feet flat on the floor or a footrest. The tilt mechanism should lock at a few different angles so users can shift between sitting upright and leaning back.\n\nLumbar support needs to sit exactly at the curve of the lower back — not higher, not lower. Good chairs usually offer height and depth adjustment on this support so it fits different body types.\n\nWhen it comes to fabric or foam, daily wear resistance and airflow (to avoid localized heat buildup) are the two main factors; mesh is typically cooler than dense upholstery for long sitting hours.',
    },
    coverImage: {
      src: '/images/mock/icon-chair.svg',
      alt: { fa: 'صندلی ارگونومیک اداری', en: 'Ergonomic office chair' },
    },
    authorName: 'تیم محتوای اروند',
    category: { fa: 'راهنمای خرید', en: 'Buying Guide' },
    tags: ['ergonomics', 'chairs'],
    publishedDate: '2026-04-12',
    seo: {
      metaTitle: {
        fa: 'راهنمای خرید صندلی ارگونومیک | وبلاگ اروند',
        en: 'Ergonomic Chair Buying Guide | Arvand Blog',
      },
      metaDescription: {
        fa: 'سه معیار کلیدی برای انتخاب صندلی اداری ارگونومیک مناسب.',
        en: 'Three key criteria for choosing the right ergonomic office chair.',
      },
    },
  },
  {
    id: 'open-space-desk-layout',
    title: {
      fa: 'چیدمان میز در فضای اپن‌اسپیس؛ چند نکته‌ی عملی',
      en: 'Desk Layout in Open-Plan Offices: A Few Practical Tips',
    },
    slug: {
      fa: 'open-space-desk-layout',
      en: 'open-space-desk-layout',
    },
    excerpt: {
      fa: 'مدیریت کابل، فاصله‌ی تنفسی بین میزها و مسیر تردد — سه چیزی که کمتر دیده می‌شوند اما مهم‌اند.',
      en: 'Cable management, breathing room between desks, and walkways — three easily overlooked essentials.',
    },
    content: {
      fa: 'در طراحی فضای اپن‌اسپیس، مدیریت کابل زیر میز، رعایت حداقل فاصله‌ی ۱۲۰ سانتی‌متری بین ردیف میزها، و مسیر تردد آزاد برای تیم نظافت/ایمنی از نکاتی است که معمولاً در طراحی اولیه نادیده گرفته می‌شود.\n\nکابل‌کشی روباز زیر میز هم از نظر ایمنی مشکل‌ساز است و هم ظاهر فضا را شلوغ می‌کند؛ استفاده از میزهای دارای کانال کابل یا باکس‌های کف‌خواب، راه‌حل ساده‌ای است که از همان مرحله‌ی خرید میز قابل پیش‌بینی است.\n\nفاصله‌ی کمتر از ۱۲۰ سانتی‌متر بین پشت دو صندلی روبه‌روی هم، هم رفت‌وآمد را سخت می‌کند و هم حس شلوغی به فضا می‌دهد؛ این فاصله باید در نقشه‌ی اولیه‌ی چیدمان، نه بعد از نصب میزها، لحاظ شود.\n\nمسیر اصلی تردد (برای تیم نظافت، حمل تجهیزات، یا خروج اضطراری) باید حداقل ۹۰ سانتی‌متر عرض داشته باشد و هرگز با صندلی یا کشوی باز میزها مسدود نشود.',
      en: 'When designing open-plan space, under-desk cable management, a minimum 120cm gap between desk rows, and a clear path for cleaning and safety staff are often overlooked in the initial layout.\n\nExposed cabling under desks is both a safety hazard and visual clutter; desks with built-in cable channels or under-floor boxes solve this from the moment desks are purchased, rather than as an afterthought.\n\nLess than 120cm between the backs of two facing chairs makes movement difficult and makes the space feel cramped; this gap should be part of the initial floor plan, not adjusted after desks are already installed.\n\nThe main walkway (for cleaning staff, equipment transport, or emergency exit) should be at least 90cm wide and never blocked by chairs or open desk drawers.',
    },
    coverImage: {
      src: '/images/mock/icon-desk-workstation.svg',
      alt: {
        fa: 'چیدمان میز اپن‌اسپیس',
        en: 'Open-plan desk layout',
      },
    },
    authorName: 'تیم محتوای اروند',
    category: { fa: 'راهنمای طراحی', en: 'Design Guide' },
    tags: ['desks', 'office-design'],
    publishedDate: '2026-05-03',
    seo: {
      metaTitle: {
        fa: 'چیدمان میز اپن‌اسپیس | وبلاگ اروند',
        en: 'Open-Plan Desk Layout | Arvand Blog',
      },
      metaDescription: {
        fa: 'نکات عملی مدیریت کابل، فاصله‌گذاری و تردد در فضای اپن‌اسپیس.',
        en: 'Practical tips on cable management, spacing, and walkways in open-plan offices.',
      },
    },
  },
  {
    id: 'amphitheater-seating-standards',
    title: {
      fa: 'استانداردهای فاصله‌گذاری صندلی در سالن‌های آمفی‌تئاتر',
      en: 'Seat-Spacing Standards for Amphitheater Halls',
    },
    slug: {
      fa: 'amphitheater-seating-standards',
      en: 'amphitheater-seating-standards',
    },
    excerpt: {
      fa: 'قبل از سفارش صندلی سالن، این استانداردهای ایمنی و راحتی را بشناسید.',
      en: 'Know these safety and comfort standards before ordering hall seating.',
    },
    content: {
      fa: 'فاصله‌ی بین ردیف، عرض راهروی خروج اضطراری و ارتفاع پشتی صندلی، سه پارامتر اصلی در طراحی صندلی‌بندی آمفی‌تئاتر هستند که معمولاً در مقررات ساختمانی محلی مشخص شده‌اند.\n\nفاصله‌ی بین ردیف‌ها باید حداقل فضای کافی برای عبور راحت افراد بدون بلندشدن کل ردیف را فراهم کند؛ استانداردهای متداول معمولاً بین ۸۵ تا ۱۰۰ سانتی‌متر (از نقطه‌ی مشابه دو ردیف پشت‌سرهم) را پیشنهاد می‌دهند.\n\nعرض راهرو باید بر اساس ظرفیت سالن و تعداد صندلی هر ردیف محاسبه شود، نه یک عدد ثابت؛ راهروهای باریک‌تر از حد مجاز در بازرسی ایمنی رد می‌شوند و اصلاح آن‌ها بعد از نصب صندلی‌ها هزینه‌بر است.\n\nارتفاع پشتی صندلی هم روی راحتی و هم روی دید ردیف پشت‌سر اثر می‌گذارد؛ برای سالن‌های با شیب کم، پشتی‌های کوتاه‌تر معمولاً دید بهتری برای ردیف‌های عقب‌تر فراهم می‌کنند.',
      en: 'Row spacing, emergency-aisle width, and backrest height are the three main parameters in amphitheater seating design, typically defined by local building codes.\n\nRow spacing needs to leave enough room for people to pass without the whole row having to stand; common standards suggest roughly 85 to 100cm (measured between the same point on two consecutive rows).\n\nAisle width should be calculated from hall capacity and the number of seats per row, not a fixed number; aisles narrower than the code minimum fail safety inspections, and fixing that after seats are installed is costly.\n\nBackrest height affects both comfort and the sightline of the row behind; in halls with a shallow slope, shorter backrests usually give rear rows a better view of the stage.',
    },
    coverImage: {
      src: '/images/mock/icon-amphitheater.svg',
      alt: {
        fa: 'استاندارد صندلی آمفی‌تئاتر',
        en: 'Amphitheater seating standard',
      },
    },
    authorName: 'تیم محتوای اروند',
    category: { fa: 'راهنمای پروژه', en: 'Project Guide' },
    tags: ['amphitheater', 'standards'],
    publishedDate: '2026-05-20',
    seo: {
      metaTitle: {
        fa: 'استانداردهای صندلی آمفی‌تئاتر | وبلاگ اروند',
        en: 'Amphitheater Seating Standards | Arvand Blog',
      },
      metaDescription: {
        fa: 'سه پارامتر اصلی طراحی صندلی‌بندی آمفی‌تئاتر مطابق مقررات ساختمانی.',
        en: 'Three main design parameters for amphitheater seating per building codes.',
      },
    },
  },
  {
    id: 'office-furniture-maintenance',
    title: {
      fa: 'نگهداری صحیح مبلمان اداری برای افزایش عمر مفید',
      en: 'Proper Office Furniture Maintenance to Extend Service Life',
    },
    slug: {
      fa: 'office-furniture-maintenance',
      en: 'office-furniture-maintenance',
    },
    excerpt: {
      fa: 'چند عادت ساده‌ی نگهداری که عمر صندلی و مبل اداری را چند سال بیشتر می‌کند.',
      en: 'A few simple maintenance habits that add years to your office chairs and sofas.',
    },
    content: {
      fa: 'تمیزکاری دوره‌ای پارچه با مواد غیرسایشی، بازدید فصلی مکانیزم گازی صندلی، و اجتناب از قرارگیری مستقیم زیر نور آفتاب از مهم‌ترین عوامل افزایش طول عمر مبلمان اداری است.\n\nبرای تمیزکاری پارچه، همیشه از مواد شوینده‌ی توصیه‌شده‌ی سازنده استفاده کنید؛ مواد قوی یا سایشی می‌توانند رنگ و بافت پارچه را طی چند ماه از بین ببرند، حتی اگر آسیب در نگاه اول دیده نشود.\n\nمکانیزم گازی و چرخ‌های صندلی باید هر فصل یک‌بار بازدید شوند؛ صدای غیرعادی هنگام تنظیم ارتفاع معمولاً اولین نشانه‌ی نیاز به تعویض است، نه زمانی که مکانیزم کاملاً از کار می‌افتد.\n\nنور مستقیم آفتاب، به‌خصوص از پنجره‌های جنوبی، رنگ پارچه و فوم را طی یک تا دو سال محو می‌کند؛ پرده‌ی نوری یا فاصله‌گذاری مبلمان از پنجره، ساده‌ترین راه پیشگیری است.',
      en: 'Periodic fabric cleaning with non-abrasive products, seasonal inspection of the chair’s gas-lift mechanism, and avoiding direct sunlight are among the top factors in extending office furniture life.\n\nFor fabric cleaning, always use the products recommended by the manufacturer; harsh or abrasive cleaners can strip color and texture within a few months, even when the damage isn’t visible right away.\n\nThe gas-lift mechanism and casters should be checked once each season; an unusual sound when adjusting height is usually the first sign it needs servicing, not the moment the mechanism fails outright.\n\nDirect sunlight, especially through south-facing windows, fades fabric and foam color within one to two years; light-filtering blinds or simply keeping furniture away from windows is the easiest prevention.',
    },
    coverImage: {
      src: '/images/mock/icon-sofa.svg',
      alt: {
        fa: 'نگهداری مبلمان اداری',
        en: 'Office furniture maintenance',
      },
    },
    authorName: 'تیم محتوای اروند',
    category: { fa: 'نگهداری', en: 'Maintenance' },
    tags: ['maintenance', 'furniture'],
    publishedDate: '2026-06-02',
    seo: {
      metaTitle: {
        fa: 'نگهداری مبلمان اداری | وبلاگ اروند',
        en: 'Office Furniture Maintenance | Arvand Blog',
      },
      metaDescription: {
        fa: 'عادت‌های ساده‌ی نگهداری برای افزایش عمر مفید مبلمان اداری.',
        en: 'Simple maintenance habits to extend the service life of office furniture.',
      },
    },
  },
]
