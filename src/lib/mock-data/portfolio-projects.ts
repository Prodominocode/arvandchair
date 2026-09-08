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
      ar: 'مجمع مكاتب بورصة طهران',
    },
    slug: { fa: 'tehran-exchange-hq', en: 'tehran-exchange-hq', ar: 'tehran-exchange-hq' },
    clientName: {
      fa: 'کارگزاری بورس نمونه',
      en: 'Sample Exchange Brokerage',
      ar: 'شركة وساطة بورصة نموذجية',
    },
    industry: { fa: 'خدمات مالی', en: 'Financial Services', ar: 'الخدمات المالية' },
    coverImage: {
      src: '/images/mock/icon-portfolio-finance.svg',
      alt: {
        fa: 'مجتمع اداری بورس تهران',
        en: 'Tehran Exchange office complex',
        ar: 'مجمع مكاتب بورصة طهران',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-desk.svg',
        alt: {
          fa: 'میزهای کارشناسی نصب‌شده',
          en: 'Installed workstation desks',
          ar: 'مكاتب العمل المركبة',
        },
      },
      {
        src: '/images/mock/icon-chair.svg',
        alt: {
          fa: 'صندلی‌های مدیریتی نصب‌شده',
          en: 'Installed managerial chairs',
          ar: 'الكراسي الإدارية المركبة',
        },
      },
    ],
    summary: {
      fa: 'تجهیز کامل ۴ طبقه‌ی اداری با میز کارشناسی پرسپولیس و صندلی مدیریتی آرا در بازه‌ی زمانی فشرده‌ی ۳ هفته، هماهنگ با برنامه‌ی افتتاح ساختمان جدید کارفرما.',
      en: 'Full fit-out of four office floors with Persepolis workstation desks and Ara managerial chairs, delivered within a tight three-week window ahead of the client’s new-building opening.',
      ar: 'تجهيز كامل لأربعة طوابق مكتبية بمكاتب برسبوليس وكراسي آرا الإدارية، خلال فترة زمنية ضيقة مدتها ثلاثة أسابيع تزامنًا مع افتتاح المبنى الجديد للعميل.',
    },
    productIds: ['persepolis-workstation-desk', 'ara-managerial-chair', 'sabk-task-chair'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'پروژه‌ی مجتمع اداری بورس تهران | نمونه‌کار اروند',
        en: 'Tehran Exchange Office Complex | Arvand Portfolio',
        ar: 'مشروع مجمع مكاتب بورصة طهران | أعمال أرواند',
      },
      metaDescription: {
        fa: 'تجهیز اداری ۴ طبقه‌ی بورس تهران با محصولات اروند در ۳ هفته.',
        en: 'Four-floor office fit-out for a Tehran exchange brokerage with Arvand products in three weeks.',
        ar: 'تجهيز مكتبي لأربعة طوابق لبورصة طهران بمنتجات أرواند خلال ثلاثة أسابيع.',
      },
    },
  },
  {
    id: 'sharif-university-amphitheater',
    title: {
      fa: 'آمفی‌تئاتر دانشگاه صنعتی شریف',
      en: 'Sharif University of Technology Amphitheater',
      ar: 'مدرج جامعة شريف للتكنولوجيا',
    },
    slug: {
      fa: 'sharif-university-amphitheater',
      en: 'sharif-university-amphitheater',
      ar: 'sharif-university-amphitheater',
    },
    clientName: {
      fa: 'دانشگاه صنعتی نمونه',
      en: 'Sample University of Technology',
      ar: 'جامعة تكنولوجيا نموذجية',
    },
    industry: { fa: 'آموزش عالی', en: 'Higher Education', ar: 'التعليم العالي' },
    coverImage: {
      src: '/images/mock/icon-portfolio-university.svg',
      alt: {
        fa: 'آمفی‌تئاتر دانشگاهی',
        en: 'University amphitheater',
        ar: 'مدرج جامعي',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-amphitheater.svg',
        alt: {
          fa: 'ردیف صندلی‌های آمفی‌تئاتر',
          en: 'Amphitheater seating rows',
          ar: 'صفوف مقاعد المدرج',
        },
      },
    ],
    summary: {
      fa: 'طراحی و نصب ۳۲۰ صندلی سالن مدل سالن برای آمفی‌تئاتر اصلی دانشکده‌ی مهندسی، با در نظر گرفتن مسیر تخلیه‌ی اضطراری و استاندارد فاصله‌ی بین ردیفی.',
      en: 'Design and installation of 320 Salen row seats for the engineering faculty’s main amphitheater, accounting for emergency egress paths and row-spacing standards.',
      ar: 'تصميم وتركيب ٣٢٠ مقعدًا من طراز سالن للمدرج الرئيسي لكلية الهندسة، مع مراعاة مسارات الإخلاء الطارئ ومعايير التباعد بين الصفوف.',
    },
    productIds: ['salen-amphitheater-seating'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'آمفی‌تئاتر دانشگاه صنعتی شریف | نمونه‌کار اروند',
        en: 'Sharif University Amphitheater | Arvand Portfolio',
        ar: 'مدرج جامعة شريف | أعمال أرواند',
      },
      metaDescription: {
        fa: 'نصب ۳۲۰ صندلی سالن برای آمفی‌تئاتر دانشکده‌ی مهندسی.',
        en: 'Installation of 320 Salen seats for an engineering faculty amphitheater.',
        ar: 'تركيب ٣٢٠ مقعد سالن لمدرج كلية الهندسة.',
      },
    },
  },
  {
    id: 'milad-tower-cinema-hall',
    title: {
      fa: 'سالن همایش و سینما برج میلاد',
      en: 'Milad Tower Cinema & Conference Hall',
      ar: 'قاعة برج ميلاد للمؤتمرات والسينما',
    },
    slug: {
      fa: 'milad-tower-cinema-hall',
      en: 'milad-tower-cinema-hall',
      ar: 'milad-tower-cinema-hall',
    },
    clientName: {
      fa: 'مرکز همایش‌های نمونه',
      en: 'Sample Convention Center',
      ar: 'مركز مؤتمرات نموذجي',
    },
    industry: { fa: 'رویداد و گردهمایی', en: 'Events & Hospitality', ar: 'الفعاليات والضيافة' },
    coverImage: {
      src: '/images/mock/icon-portfolio-cinema-hall.svg',
      alt: {
        fa: 'سالن همایش و سینما',
        en: 'Cinema and conference hall',
        ar: 'قاعة مؤتمرات وسينما',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: { fa: 'صندلی‌های سالن سینما', en: 'Cinema hall seating', ar: 'مقاعد قاعة السينما' },
      },
    ],
    summary: {
      fa: 'تعویض کامل صندلی‌های سالن چندمنظوره‌ی همایش/سینما با مدل رویال، همراه با مشاوره‌ی چیدمان برای بهبود دید به صحنه از ردیف‌های عقب.',
      en: 'Complete reseating of a multi-purpose cinema/conference hall with the Royal model, including layout consulting to improve sightlines from the back rows.',
      ar: 'إعادة تجهيز كاملة لمقاعد قاعة متعددة الأغراض للمؤتمرات والسينما بطراز رويال، مع استشارة تخطيط لتحسين خطوط الرؤية من الصفوف الخلفية.',
    },
    productIds: ['royal-cinema-hall-seating'],
    featured: true,
    seo: {
      metaTitle: {
        fa: 'سالن همایش و سینما برج میلاد | نمونه‌کار اروند',
        en: 'Milad Tower Cinema & Conference Hall | Arvand Portfolio',
        ar: 'قاعة برج ميلاد | أعمال أرواند',
      },
      metaDescription: {
        fa: 'تعویض صندلی سالن چندمنظوره‌ی همایش و سینما با مدل رویال.',
        en: 'Reseating a multi-purpose cinema and conference hall with the Royal model.',
        ar: 'إعادة تجهيز قاعة متعددة الأغراض للمؤتمرات والسينما بطراز رويال.',
      },
    },
  },
  {
    id: 'persian-gulf-petrochemical-hq',
    title: {
      fa: 'دفتر مرکزی هلدینگ پتروشیمی خلیج فارس',
      en: 'Persian Gulf Petrochemical Holding HQ',
      ar: 'المقر الرئيسي لحيازة الخليج الفارسي للبتروكيماويات',
    },
    slug: {
      fa: 'persian-gulf-petrochemical-hq',
      en: 'persian-gulf-petrochemical-hq',
      ar: 'persian-gulf-petrochemical-hq',
    },
    clientName: {
      fa: 'هلدینگ پتروشیمی نمونه',
      en: 'Sample Petrochemical Holding',
      ar: 'حيازة بتروكيماويات نموذجية',
    },
    industry: {
      fa: 'نفت، گاز و پتروشیمی',
      en: 'Oil, Gas & Petrochemicals',
      ar: 'النفط والغاز والبتروكيماويات',
    },
    coverImage: {
      src: '/images/mock/icon-portfolio-industrial.svg',
      alt: {
        fa: 'دفتر مرکزی هلدینگ صنعتی',
        en: 'Industrial holding headquarters',
        ar: 'المقر الرئيسي لحيازة صناعية',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-sofa.svg',
        alt: {
          fa: 'مبلمان لابی دفتر مرکزی',
          en: 'Headquarters lobby furniture',
          ar: 'أثاث ردهة المقر الرئيسي',
        },
      },
    ],
    summary: {
      fa: 'تجهیز اتاق هیئت‌مدیره با میز کنفرانس رستا و صندلی وستا، به‌همراه ست مبل درسا برای لابی ورودی ساختمان مرکزی.',
      en: 'Boardroom fit-out with the Resta conference table and Vesta chairs, plus a Dorsa sofa set for the headquarters lobby.',
      ar: 'تجهيز قاعة مجلس الإدارة بطاولة رستا وكراسي فيستا، بالإضافة إلى طقم دورسا لردهة المقر الرئيسي.',
    },
    productIds: ['resta-conference-desk', 'vesta-conference-chair', 'dorsa-reception-sofa-set'],
    featured: false,
    seo: {
      metaTitle: {
        fa: 'دفتر مرکزی هلدینگ پتروشیمی | نمونه‌کار اروند',
        en: 'Petrochemical Holding HQ | Arvand Portfolio',
        ar: 'المقر الرئيسي لحيازة بتروكيماويات | أعمال أرواند',
      },
      metaDescription: {
        fa: 'تجهیز اتاق هیئت‌مدیره و لابی دفتر مرکزی یک هلدینگ پتروشیمی.',
        en: 'Boardroom and headquarters lobby fit-out for a petrochemical holding.',
        ar: 'تجهيز قاعة مجلس الإدارة وردهة المقر الرئيسي لحيازة بتروكيماويات.',
      },
    },
  },
  {
    id: 'bank-melli-convention-center',
    title: {
      fa: 'مرکز همایش‌های بانک ملی',
      en: 'Bank Melli Convention Center',
      ar: 'مركز مؤتمرات بنك ملي',
    },
    slug: {
      fa: 'bank-melli-convention-center',
      en: 'bank-melli-convention-center',
      ar: 'bank-melli-convention-center',
    },
    clientName: {
      fa: 'شعبه‌ی مرکزی بانک نمونه',
      en: 'Sample Bank Central Branch',
      ar: 'الفرع المركزي لبنك نموذجي',
    },
    industry: { fa: 'بانکداری', en: 'Banking', ar: 'الخدمات المصرفية' },
    coverImage: {
      src: '/images/mock/icon-portfolio-bank.svg',
      alt: {
        fa: 'مرکز همایش‌های بانکی',
        en: 'Banking convention center',
        ar: 'مركز مؤتمرات مصرفي',
      },
    },
    gallery: [
      {
        src: '/images/mock/icon-cinema.svg',
        alt: {
          fa: 'صندلی‌های سالن همایش بانکی',
          en: 'Banking conference hall seating',
          ar: 'مقاعد قاعة المؤتمرات المصرفية',
        },
      },
    ],
    summary: {
      fa: 'تأمین ۱۸۰ صندلی همایش رویال برای سالن آموزش و همایش شعبه‌ی مرکزی، همراه با آموزش نگهداری دوره‌ای به تیم تدارکات بانک.',
      en: 'Supply of 180 Royal conference seats for the central branch’s training and convention hall, along with periodic-maintenance training for the bank’s procurement team.',
      ar: 'توريد ١٨٠ مقعد رويال لقاعة التدريب والمؤتمرات في الفرع المركزي، مع تدريب فريق المشتريات بالبنك على الصيانة الدورية.',
    },
    productIds: ['royal-cinema-hall-seating'],
    featured: false,
    seo: {
      metaTitle: {
        fa: 'مرکز همایش‌های بانک ملی | نمونه‌کار اروند',
        en: 'Bank Melli Convention Center | Arvand Portfolio',
        ar: 'مركز مؤتمرات بنك ملي | أعمال أرواند',
      },
      metaDescription: {
        fa: 'تأمین ۱۸۰ صندلی همایش رویال برای سالن آموزش شعبه‌ی مرکزی بانک.',
        en: 'Supply of 180 Royal conference seats for a bank’s central training hall.',
        ar: 'توريد ١٨٠ مقعد رويال لقاعة تدريب مركزية لبنك.',
      },
    },
  },
]
