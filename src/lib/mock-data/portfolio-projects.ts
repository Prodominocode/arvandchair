/**
 * Mock data برای Collection `PortfolioProjects` (docs/02-data-model.md بخش ۳).
 * ۵ پروژه‌ی واقع‌گرایانه (نام سازمان‌های نمونه، نه واقعی) که در Home (منتخب) و بسته‌ی ۳
 * (لیست/جزئیات کامل) استفاده می‌شوند.
 */

import type { LocalizedText, MockImage, SeoFields } from './types'

export type PortfolioProject = {
  id: string
  title: LocalizedText
  slug: LocalizedText
  clientName: LocalizedText
  industry: LocalizedText
  coverImage: MockImage
  gallery: MockImage[]
  summary: LocalizedText
  productIds: string[]
  featured: boolean
  seo: SeoFields
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'tehran-exchange-hq',
    title: {
      fa: 'مجتمع اداری بورس تهران',
      en: 'Tehran Exchange Office Complex',
    },
    slug: { fa: 'tehran-exchange-hq', en: 'tehran-exchange-hq' },
    clientName: {
      fa: 'کارگزاری بورس نمونه',
      en: 'Sample Exchange Brokerage',
    },
    industry: { fa: 'خدمات مالی', en: 'Financial Services' },
    coverImage: {
      src: '/images/mock/icon-portfolio-finance.svg',
      alt: {
        fa: 'مجتمع اداری بورس تهران',
        en: 'Tehran Exchange office complex',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میزهای کارشناسی نصب‌شده',
          en: 'Installed workstation desks',
        },
      },
      {
        src: '/images/mock/icon-chair.svg',
        alt: {
          fa: 'صندلی‌های مدیریتی نصب‌شده',
          en: 'Installed managerial chairs',
        },
      },
    ],
    summary: {
      fa: 'تجهیز کامل ۴ طبقه‌ی اداری با میز کارشناسی پرسپولیس و صندلی مدیریتی آرا در بازه‌ی زمانی فشرده‌ی ۳ هفته، هماهنگ با برنامه‌ی افتتاح ساختمان جدید کارفرما.',
      en: 'Full fit-out of four office floors with Persepolis workstation desks and Ara managerial chairs, delivered within a tight three-week window ahead of the client’s new-building opening.',
    },
    productIds: ['persepolis-workstation-desk', 'ara-managerial-chair', 'sabk-task-chair'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'پروژه‌ی مجتمع اداری بورس تهران | نمونه‌کار اروند',
        en: 'Tehran Exchange Office Complex | Arvand Portfolio',
      },
      metaDescription: {
        fa: 'تجهیز اداری ۴ طبقه‌ی بورس تهران با محصولات اروند در ۳ هفته.',
        en: 'Four-floor office fit-out for a Tehran exchange brokerage with Arvand products in three weeks.',
      },
    },
  },
  {
    id: 'sharif-university-amphitheater',
    title: {
      fa: 'آمفی‌تئاتر دانشگاه صنعتی شریف',
      en: 'Sharif University of Technology Amphitheater',
    },
    slug: {
      fa: 'sharif-university-amphitheater',
      en: 'sharif-university-amphitheater',
    },
    clientName: {
      fa: 'دانشگاه صنعتی نمونه',
      en: 'Sample University of Technology',
    },
    industry: { fa: 'آموزش عالی', en: 'Higher Education' },
    coverImage: {
      src: '/images/mock/icon-portfolio-university.svg',
      alt: {
        fa: 'آمفی‌تئاتر دانشگاهی',
        en: 'University amphitheater',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-amphitheater.svg',
        alt: {
          fa: 'ردیف صندلی‌های آمفی‌تئاتر',
          en: 'Amphitheater seating rows',
        },
      },
    ],
    summary: {
      fa: 'طراحی و نصب ۳۲۰ صندلی سالن مدل سالن برای آمفی‌تئاتر اصلی دانشکده‌ی مهندسی، با در نظر گرفتن مسیر تخلیه‌ی اضطراری و استاندارد فاصله‌ی بین ردیفی.',
      en: 'Design and installation of 320 Salen row seats for the engineering faculty’s main amphitheater, accounting for emergency egress paths and row-spacing standards.',
    },
    productIds: ['salen-amphitheater-seating'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'آمفی‌تئاتر دانشگاه صنعتی شریف | نمونه‌کار اروند',
        en: 'Sharif University Amphitheater | Arvand Portfolio',
      },
      metaDescription: {
        fa: 'نصب ۳۲۰ صندلی سالن برای آمفی‌تئاتر دانشکده‌ی مهندسی.',
        en: 'Installation of 320 Salen seats for an engineering faculty amphitheater.',
      },
    },
  },
  {
    id: 'milad-tower-cinema-hall',
    title: {
      fa: 'سالن همایش و سینما برج میلاد',
      en: 'Milad Tower Cinema & Conference Hall',
    },
    slug: {
      fa: 'milad-tower-cinema-hall',
      en: 'milad-tower-cinema-hall',
    },
    clientName: {
      fa: 'مرکز همایش‌های نمونه',
      en: 'Sample Convention Center',
    },
    industry: { fa: 'رویداد و گردهمایی', en: 'Events & Hospitality' },
    coverImage: {
      src: '/images/mock/icon-portfolio-cinema-hall.svg',
      alt: {
        fa: 'سالن همایش و سینما',
        en: 'Cinema and conference hall',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: { fa: 'صندلی‌های سالن سینما', en: 'Cinema hall seating' },
      },
    ],
    summary: {
      fa: 'تعویض کامل صندلی‌های سالن چندمنظوره‌ی همایش/سینما با مدل رویال، همراه با مشاوره‌ی چیدمان برای بهبود دید به صحنه از ردیف‌های عقب.',
      en: 'Complete reseating of a multi-purpose cinema/conference hall with the Royal model, including layout consulting to improve sightlines from the back rows.',
    },
    productIds: ['royal-cinema-hall-seating'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'سالن همایش و سینما برج میلاد | نمونه‌کار اروند',
        en: 'Milad Tower Cinema & Conference Hall | Arvand Portfolio',
      },
      metaDescription: {
        fa: 'تعویض صندلی سالن چندمنظوره‌ی همایش و سینما با مدل رویال.',
        en: 'Reseating a multi-purpose cinema and conference hall with the Royal model.',
      },
    },
  },
  {
    id: 'persian-gulf-petrochemical-hq',
    title: {
      fa: 'دفتر مرکزی هلدینگ پتروشیمی خلیج فارس',
      en: 'Persian Gulf Petrochemical Holding HQ',
    },
    slug: {
      fa: 'persian-gulf-petrochemical-hq',
      en: 'persian-gulf-petrochemical-hq',
    },
    clientName: {
      fa: 'هلدینگ پتروشیمی نمونه',
      en: 'Sample Petrochemical Holding',
    },
    industry: {
      fa: 'نفت، گاز و پتروشیمی',
      en: 'Oil, Gas & Petrochemicals',
    },
    coverImage: {
      src: '/images/mock/icon-portfolio-industrial.svg',
      alt: {
        fa: 'دفتر مرکزی هلدینگ صنعتی',
        en: 'Industrial holding headquarters',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-sofa.svg',
        alt: {
          fa: 'مبلمان لابی دفتر مرکزی',
          en: 'Headquarters lobby furniture',
        },
      },
    ],
    summary: {
      fa: 'تجهیز اتاق هیئت‌مدیره با میز کنفرانس رستا و صندلی وستا، به‌همراه ست مبل درسا برای لابی ورودی ساختمان مرکزی.',
      en: 'Boardroom fit-out with the Resta conference table and Vesta chairs, plus a Dorsa sofa set for the headquarters lobby.',
    },
    productIds: ['resta-conference-desk', 'vesta-conference-chair', 'dorsa-reception-sofa-set'],
    featured: false,
    seo: {
      metaTitle: {
        fa: 'دفتر مرکزی هلدینگ پتروشیمی | نمونه‌کار اروند',
        en: 'Petrochemical Holding HQ | Arvand Portfolio',
      },
      metaDescription: {
        fa: 'تجهیز اتاق هیئت‌مدیره و لابی دفتر مرکزی یک هلدینگ پتروشیمی.',
        en: 'Boardroom and headquarters lobby fit-out for a petrochemical holding.',
      },
    },
  },
  {
    id: 'bank-melli-convention-center',
    title: {
      fa: 'مرکز همایش‌های بانک ملی',
      en: 'Bank Melli Convention Center',
    },
    slug: {
      fa: 'bank-melli-convention-center',
      en: 'bank-melli-convention-center',
    },
    clientName: {
      fa: 'شعبه‌ی مرکزی بانک نمونه',
      en: 'Sample Bank Central Branch',
    },
    industry: { fa: 'بانکداری', en: 'Banking' },
    coverImage: {
      src: '/images/mock/icon-portfolio-bank.svg',
      alt: {
        fa: 'مرکز همایش‌های بانکی',
        en: 'Banking convention center',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: {
          fa: 'صندلی‌های سالن همایش بانکی',
          en: 'Banking conference hall seating',
        },
      },
    ],
    summary: {
      fa: 'تأمین ۱۸۰ صندلی همایش رویال برای سالن آموزش و همایش شعبه‌ی مرکزی، همراه با آموزش نگهداری دوره‌ای به تیم تدارکات بانک.',
      en: 'Supply of 180 Royal conference seats for the central branch’s training and convention hall, along with periodic-maintenance training for the bank’s procurement team.',
    },
    productIds: ['royal-cinema-hall-seating'],
    featured: false,
    seo: {
      metaTitle: {
        fa: 'مرکز همایش‌های بانک ملی | نمونه‌کار اروند',
        en: 'Bank Melli Convention Center | Arvand Portfolio',
      },
      metaDescription: {
        fa: 'تأمین ۱۸۰ صندلی همایش رویال برای سالن آموزش شعبه‌ی مرکزی بانک.',
        en: 'Supply of 180 Royal conference seats for a bank’s central training hall.',
      },
    },
  },
]
