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
      fa: 'انتخاب صندلی اداری مناسب مستقیماً روی سلامت ستون فقرات و بهره‌وری کارمندان اثر می‌گذارد. در این مطلب به سه معیار کلیدی می‌پردازیم: تنظیم ارتفاع و زاویه، پشتیبانی کمری، و کیفیت پارچه/فوم.',
      en: 'Choosing the right office chair has a direct impact on spinal health and employee productivity. This article covers three key criteria: height and tilt adjustment, lumbar support, and fabric/foam quality.',
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
      fa: 'در طراحی فضای اپن‌اسپیس، مدیریت کابل زیر میز، رعایت حداقل فاصله‌ی ۱۲۰ سانتی‌متری بین ردیف میزها، و مسیر تردد آزاد برای تیم نظافت/ایمنی از نکاتی است که معمولاً در طراحی اولیه نادیده گرفته می‌شود.',
      en: 'When designing open-plan space, under-desk cable management, a minimum 120cm gap between desk rows, and a clear path for cleaning and safety staff are often overlooked in the initial layout.',
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
      fa: 'فاصله‌ی بین ردیف، عرض راهروی خروج اضطراری و ارتفاع پشتی صندلی، سه پارامتر اصلی در طراحی صندلی‌بندی آمفی‌تئاتر هستند که معمولاً در مقررات ساختمانی محلی مشخص شده‌اند.',
      en: 'Row spacing, emergency-aisle width, and backrest height are the three main parameters in amphitheater seating design, typically defined by local building codes.',
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
      fa: 'تمیزکاری دوره‌ای پارچه با مواد غیرسایشی، بازدید فصلی مکانیزم گازی صندلی، و اجتناب از قرارگیری مستقیم زیر نور آفتاب از مهم‌ترین عوامل افزایش طول عمر مبلمان اداری است.',
      en: 'Periodic fabric cleaning with non-abrasive products, seasonal inspection of the chair’s gas-lift mechanism, and avoiding direct sunlight are among the top factors in extending office furniture life.',
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
