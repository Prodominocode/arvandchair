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
  /** رفرنس به `portfolio-industries.ts` (فیلتر Facet آرشیو) — مستقل از `industry` بالا، دقیقاً
   * هم‌رابطه‌ی `Product.materialIds`/`specs.material`. */
  industryId: string
  /** افزوده‌ی جزئیات پروژه (`05-pages-build-order.md` بسته‌ی ۳ #۱۰) — چهار فیلد زیر («مشخصات
   * فنی پروژه»ی نمایش‌داده‌شده به‌صورت لیست آیکنی در هدر جزئیات) در Draft v1 سند ۰۲ نبودند؛
   * یادداشت افزودن آن‌جا هم گذاشته شد. */
  location: LocalizedText
  scope: LocalizedText
  duration: LocalizedText
  completionYear: number
  coverImage: MockImage
  gallery: MockImage[]
  summary: LocalizedText
  /** خلاصه‌ی چالش/راه‌حل — همان بخش «Case Study» که سند ۰۵ برای جزئیات پروژه خواسته. */
  challenge: LocalizedText
  solution: LocalizedText
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
    industryId: 'financial-services',
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    scope: { fa: 'تجهیز اداری — ۴ طبقه', en: 'Office fit-out — 4 floors' },
    duration: { fa: '۳ هفته', en: '3 weeks' },
    completionYear: 2024,
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
    challenge: {
      fa: 'کارفرما باید پیش از تاریخ ثابت افتتاحیه‌ی ساختمان، چهار طبقه‌ی اداری را کاملاً تجهیز می‌کرد، آن هم بدون ایجاد اختلال در نصب هم‌زمان شبکه و زیرساخت IT.',
      en: 'The client needed to fully furnish four office floors before a fixed grand-opening date, with minimal disruption to the network and IT infrastructure being installed in parallel.',
    },
    solution: {
      fa: 'اروند تحویل را به‌صورت طبقه‌به‌طبقه زمان‌بندی کرد، تیم‌های نصب را هماهنگ با برنامه‌ی پیمانکار IT هدایت کرد و ماژول‌های میز کارشناسی را از پیش در کارخانه مونتاژ کرد تا زمان نصب در محل به نصف برسد.',
      en: 'Arvand phased delivery floor by floor, coordinated installation crews around the IT contractor’s schedule, and pre-assembled workstation modules off-site — cutting on-site install time roughly in half.',
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
    industryId: 'higher-education',
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    scope: { fa: 'صندلی آمفی‌تئاتر — ۳۲۰ صندلی', en: 'Amphitheater seating — 320 seats' },
    duration: { fa: '۵ هفته', en: '5 weeks' },
    completionYear: 2023,
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
    challenge: {
      fa: 'طراحی صندلی باید هم استاندارد فاصله‌ی ردیف‌ها و مسیر تخلیه‌ی اضطراری دانشگاه را رعایت می‌کرد و هم در بودجه‌ی محدود بخش تسهیلات دانشکده می‌گنجید.',
      en: 'The seating layout had to satisfy the university’s emergency-egress and row-spacing codes while staying within the engineering faculty’s limited facilities budget.',
    },
    solution: {
      fa: 'تیم فنی اروند چیدمان صندلی‌ها را با شبیه‌سازی مسیر تخلیه بازطراحی کرد و با انتخاب مدل سالن (به‌جای یک مدل سفارشی) هزینه را حدود ۲۰ درصد کاهش داد، بدون افت کیفیت نشیمن.',
      en: 'Arvand’s technical team re-simulated the egress paths to optimize row spacing, and specified the standard Salen model instead of a custom build — cutting cost by roughly 20% with no compromise on seating quality.',
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
    industryId: 'events-hospitality',
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    scope: { fa: 'تعویض کامل صندلی سالن چندمنظوره', en: 'Full reseating — multi-purpose hall' },
    duration: { fa: '۴ هفته', en: '4 weeks' },
    completionYear: 2023,
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
    challenge: {
      fa: 'صندلی‌های قدیمی سالن باعث افت دید از ردیف‌های عقب به صحنه شده بود، در حالی‌که امکان تعطیلی طولانی سالن برای تعویض وجود نداشت.',
      en: 'The hall’s aging seats caused poor sightlines from the back rows, and the venue could not afford an extended closure for the swap.',
    },
    solution: {
      fa: 'اروند تعویض را در سه شب متوالی و خارج از ساعات برنامه انجام داد و با تنظیم زاویه و ارتفاع صندلی‌های مدل رویال، دید ردیف‌های عقب را به‌طور محسوس بهبود بخشید.',
      en: 'Arvand completed the swap across three overnight shifts outside programming hours, and tuned the Royal seats’ rake and height to visibly improve back-row sightlines.',
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
    industryId: 'oil-gas-petrochemicals',
    location: { fa: 'استان بوشهر، ایران', en: 'Bushehr Province, Iran' },
    scope: { fa: 'تجهیز اتاق هیئت‌مدیره و لابی', en: 'Boardroom + lobby fit-out' },
    duration: { fa: '۶ هفته', en: '6 weeks' },
    completionYear: 2024,
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
    challenge: {
      fa: 'کارفرما هم‌زمان به یک اتاق هیئت‌مدیره‌ی رسمی و یک لابی ورودی با حس مهمان‌نوازی نیاز داشت، آن هم در سایتی صنعتی با محدودیت‌های سخت‌گیرانه‌ی دسترسی و حمل‌ونقل.',
      en: 'The client needed both a formal boardroom and a welcoming entrance lobby delivered on an industrial site with strict access and logistics restrictions.',
    },
    solution: {
      fa: 'اروند حمل و نصب را با هماهنگی تیم HSE سایت زمان‌بندی کرد و با ترکیب میز کنفرانس رستا و صندلی وستا برای هیئت‌مدیره و ست مبل درسا برای لابی، دو حس متفاوت رسمیت و مهمان‌نوازی را در یک پروژه ایجاد کرد.',
      en: 'Arvand scheduled delivery and installation around the site’s HSE clearance windows, pairing the Resta conference table and Vesta chairs for a formal boardroom with a Dorsa sofa set to give the lobby a distinctly welcoming feel.',
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
    industryId: 'banking',
    location: { fa: 'تهران، ایران', en: 'Tehran, Iran' },
    scope: { fa: 'سالن آموزش و همایش — ۱۸۰ صندلی', en: 'Training & convention hall — 180 seats' },
    duration: { fa: '۳ هفته', en: '3 weeks' },
    completionYear: 2022,
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
    challenge: {
      fa: 'سالن آموزش شعبه‌ی مرکزی باید هم برای همایش‌های رسمی و هم دوره‌های آموزشی روزانه استفاده می‌شد، در حالی‌که تیم تدارکات بانک تجربه‌ی نگهداری این حجم از صندلی همایش را نداشت.',
      en: 'The branch’s training hall had to serve both formal conventions and daily internal courses, while the bank’s procurement team had no prior experience maintaining this volume of conference seating.',
    },
    solution: {
      fa: 'اروند علاوه بر تأمین و نصب ۱۸۰ صندلی رویال، یک دوره‌ی آموزش نگهداری دوره‌ای برای تیم تدارکات بانک برگزار کرد تا نگهداری روزانه به‌طور مستقل به عهده‌ی خود بانک باشد.',
      en: 'Alongside supplying and installing 180 Royal seats, Arvand ran a periodic-maintenance training session for the bank’s procurement team so day-to-day upkeep could be handled fully in-house.',
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
