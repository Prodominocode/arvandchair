/**
 * Mock data برای Collection `Categories` (docs/02-data-model.md بخش ۲).
 * ۵ دسته‌ی Seed تأییدشده‌ی فاز ۰ — طبق همان سند، این Collection در واقعیت کاملاً داینامیک
 * و مدیریت‌شده از پنل ادمین است؛ این فقط داده‌ی نمونه برای فاز ۳ است.
 *
 * زیردسته‌های «صندلی»: برای صفحه‌ی آرشیو محصول (`05-pages-build-order.md` بسته‌ی ۲ #۵) به یک
 * مثال واقعی از دسته‌بندی دوسطحی نیاز بود تا الگوی Tab «همه / زیردسته‌ها» به‌صورت عمومی
 * (نه فقط برای «صندلی») تست شود؛ همین چند خط زیر اضافه شدند، ساختار Category بدون تغییر
 * ماند (`parentId` از همان ابتدا در سند ۰۲ پیش‌بینی شده بود).
 */

import type { LocalizedText, MockImage, SeoFields } from './types'

/** دقیقاً همان enum سند ۰۲: تعیین می‌کند محصولات این دسته پیش‌فرض چطور فروخته می‌شوند. */
export type CategorySalesMode = 'direct-purchase' | 'quote-only' | 'mixed'

export type Category = {
  id: string
  title: LocalizedText
  /** یادداشت تصمیم: چون انتخاب نهایی فارسی/لاتین‌بودن Slug فارسی هنوز باز است
   * (docs/03-url-structure-seo.md بخش ۵)، در Mock فاز ۳ عمداً یک Slug لاتین ساده و یکسان
   * بین هر سه زبان استفاده شده — نه یک تصمیم نهایی، فقط برای کار کردن URLها در این فاز. */
  slug: LocalizedText
  parentId: string | null
  image: MockImage
  salesMode: CategorySalesMode
  seo: SeoFields
}

export const categories: Category[] = [
  {
    id: 'chairs',
    title: { fa: 'صندلی', en: 'Chairs' },
    slug: { fa: 'chairs', en: 'chairs' },
    parentId: null,
    image: {
      src: '/images/mock/icon-chair.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی اداری اروند',
        en: 'Arvand office chairs category icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'صندلی اداری | فروشگاه اروند',
        en: 'Office Chairs | Arvand Store',
      },
      metaDescription: {
        fa: 'خرید انواع صندلی مدیریتی، کارمندی و کنفرانس اروند با ارگونومی استاندارد و ضمانت اصالت.',
        en: 'Shop Arvand managerial, task, and conference chairs with certified ergonomics and warranty.',
      },
    },
  },
  {
    id: 'chairs-office',
    title: { fa: 'صندلی اداری', en: 'Office Chairs' },
    slug: { fa: 'chairs-office', en: 'chairs-office' },
    parentId: 'chairs',
    image: {
      src: '/images/mock/icon-chair.svg',
      alt: {
        fa: 'آیکون زیردسته‌ی صندلی اداری اروند',
        en: 'Arvand office chairs subcategory icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'صندلی اداری و مدیریتی | فروشگاه اروند',
        en: 'Office & Managerial Chairs | Arvand Store',
      },
      metaDescription: {
        fa: 'صندلی مدیریتی و کارمندی اروند برای استفاده‌ی روزانه‌ی پشت میز.',
        en: 'Arvand managerial and task chairs for everyday desk use.',
      },
    },
  },
  {
    id: 'chairs-side-guest',
    title: { fa: 'صندلی همراه و مهمان', en: 'Side & Guest Chairs' },
    slug: { fa: 'chairs-side-guest', en: 'chairs-side-guest' },
    parentId: 'chairs',
    image: {
      src: '/images/products/side-guest/nasim-side-guest-chair.png',
      alt: {
        fa: 'آیکون زیردسته‌ی صندلی همراه و مهمان اروند',
        en: 'Arvand side & guest chairs subcategory icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'صندلی همراه و مهمان | فروشگاه اروند',
        en: 'Side & Guest Chairs | Arvand Store',
      },
      metaDescription: {
        fa: 'صندلی همراه، مهمان و انتظار اروند — مناسب اتاق کار، لابی و فضای مشترک.',
        en: 'Arvand side, guest, and waiting-area chairs — for desks, lobbies, and shared spaces.',
      },
    },
  },
  {
    id: 'chairs-conference',
    title: { fa: 'صندلی کنفرانس', en: 'Conference Chairs' },
    slug: { fa: 'chairs-conference', en: 'chairs-conference' },
    parentId: 'chairs',
    image: {
      src: '/images/mock/icon-chair-conference.svg',
      alt: {
        fa: 'آیکون زیردسته‌ی صندلی کنفرانس اروند',
        en: 'Arvand conference chairs subcategory icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'صندلی کنفرانس | فروشگاه اروند',
        en: 'Conference Chairs | Arvand Store',
      },
      metaDescription: {
        fa: 'صندلی کنفرانس اروند برای اتاق جلسات و هیئت‌مدیره.',
        en: 'Arvand conference chairs for boardrooms and meeting rooms.',
      },
    },
  },
  {
    id: 'chairs-stools',
    title: { fa: 'چهارپایه', en: 'Stools' },
    slug: { fa: 'chairs-stools', en: 'chairs-stools' },
    parentId: 'chairs',
    image: {
      src: '/images/mock/icon-chair.svg',
      alt: {
        fa: 'آیکون زیردسته‌ی چهارپایه اروند',
        en: 'Arvand stools subcategory icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'چهارپایه‌ی اداری | فروشگاه اروند',
        en: 'Office Stools | Arvand Store',
      },
      metaDescription: {
        fa: 'چهارپایه‌ی کانتر و ایستگاه کار ایستاده اروند.',
        en: 'Arvand counter and standing-desk stools.',
      },
    },
  },
  {
    id: 'chairs-lounge',
    title: { fa: 'صندلی و مبل استراحت', en: 'Lounge Seating' },
    slug: { fa: 'chairs-lounge', en: 'chairs-lounge' },
    parentId: 'chairs',
    image: {
      src: '/images/mock/icon-sofa.svg',
      alt: {
        fa: 'آیکون زیردسته‌ی صندلی و مبل استراحت اروند',
        en: 'Arvand lounge seating subcategory icon',
      },
    },
    salesMode: 'mixed',
    seo: {
      metaTitle: {
        fa: 'صندلی و مبل استراحت | فروشگاه اروند',
        en: 'Lounge Seating | Arvand Store',
      },
      metaDescription: {
        fa: 'صندلی و مبل استراحت اروند برای لابی، اتاق استراحت و فضای غیررسمی.',
        en: 'Arvand lounge seating for lobbies, break rooms, and informal spaces.',
      },
    },
  },
  {
    id: 'desks',
    title: { fa: 'میز', en: 'Desks' },
    slug: { fa: 'desks', en: 'desks' },
    parentId: null,
    image: {
      src: '/images/mock/icon-desk.svg',
      alt: {
        fa: 'آیکون دسته‌بندی میز اداری اروند',
        en: 'Arvand office desks category icon',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'میز اداری | فروشگاه اروند',
        en: 'Office Desks | Arvand Store',
      },
      metaDescription: {
        fa: 'میز مدیریتی و میز کارشناسی اروند با طراحی مدرن، مدیریت کابل و تحویل سریع.',
        en: 'Arvand managerial and workstation desks with modern design, cable management, and fast delivery.',
      },
    },
  },
  {
    id: 'office-furniture',
    title: { fa: 'مبلمان اداری', en: 'Office Furniture' },
    slug: { fa: 'office-furniture', en: 'office-furniture' },
    parentId: null,
    image: {
      src: '/images/mock/icon-sofa.svg',
      alt: {
        fa: 'آیکون دسته‌بندی مبلمان اداری اروند',
        en: 'Arvand office furniture category icon',
      },
    },
    salesMode: 'mixed',
    seo: {
      metaTitle: {
        fa: 'مبلمان اداری و ست پذیرایی | فروشگاه اروند',
        en: 'Office Furniture & Reception Sets | Arvand Store',
      },
      metaDescription: {
        fa: 'ست مبل و مبلمان پذیرایی اداری اروند برای لابی، اتاق مدیریت و فضاهای مشترک.',
        en: 'Arvand reception and lounge furniture sets for lobbies, executive offices, and shared spaces.',
      },
    },
  },
  {
    id: 'amphitheater',
    title: { fa: 'آمفی‌تئاتر', en: 'Amphitheater' },
    slug: { fa: 'amphitheater', en: 'amphitheater' },
    parentId: null,
    image: {
      src: '/images/mock/icon-amphitheater.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی‌بندی آمفی‌تئاتر اروند',
        en: 'Arvand amphitheater seating category icon',
      },
    },
    /** پروژه‌محور طبق توصیف خود سند ۰۲؛ برای Mock UI فاز ۳ quote-only در نظر گرفته شده —
     * تصمیم نهایی پیش‌فرض هر دسته همچنان به بعد موکول است (docs/README.md «هنوز باز»). */
    salesMode: 'quote-only',
    seo: {
      metaTitle: {
        fa: 'صندلی آمفی‌تئاتر | پروژه‌های اروند',
        en: 'Amphitheater Seating | Arvand Projects',
      },
      metaDescription: {
        fa: 'طراحی و اجرای صندلی‌بندی آمفی‌تئاتر دانشگاه‌ها و سالن‌های اجتماع با استعلام قیمت پروژه‌ای.',
        en: 'Design and installation of amphitheater seating for universities and assembly halls — project-based quotes.',
      },
    },
  },
  {
    id: 'cinema-conference',
    title: { fa: 'همایش و سینما', en: 'Cinema & Conference' },
    slug: { fa: 'cinema-conference', en: 'cinema-conference' },
    parentId: null,
    image: {
      src: '/images/mock/icon-cinema.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی سالن همایش و سینما اروند',
        en: 'Arvand cinema and conference hall seating category icon',
      },
    },
    salesMode: 'quote-only',
    seo: {
      metaTitle: {
        fa: 'صندلی سالن همایش و سینما | پروژه‌های اروند',
        en: 'Cinema & Conference Hall Seating | Arvand Projects',
      },
      metaDescription: {
        fa: 'تجهیز سالن همایش، سینما و مراکز کنفرانس با صندلی‌های راحت و بادوام اروند.',
        en: 'Equip conference centers and cinema halls with Arvand comfortable, durable seating.',
      },
    },
  },
]
