/**
 * Mock data برای Collection `Categories` (docs/02-data-model.md بخش ۲).
 * ۵ دسته‌ی Seed تأییدشده‌ی فاز ۰ — طبق همان سند، این Collection در واقعیت کاملاً داینامیک
 * و مدیریت‌شده از پنل ادمین است؛ این فقط داده‌ی نمونه برای فاز ۳ است.
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
    title: { fa: 'صندلی', en: 'Chairs', ar: 'الكراسي' },
    slug: { fa: 'chairs', en: 'chairs', ar: 'chairs' },
    parentId: null,
    image: {
      src: '/images/mock/icon-chair.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی اداری اروند',
        en: 'Arvand office chairs category icon',
        ar: 'أيقونة تصنيف الكراسي المكتبية أرواند',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'صندلی اداری | فروشگاه اروند',
        en: 'Office Chairs | Arvand Store',
        ar: 'الكراسي المكتبية | متجر أرواند',
      },
      metaDescription: {
        fa: 'خرید انواع صندلی مدیریتی، کارمندی و کنفرانس اروند با ارگونومی استاندارد و ضمانت اصالت.',
        en: 'Shop Arvand managerial, task, and conference chairs with certified ergonomics and warranty.',
        ar: 'تسوّق كراسي أرواند الإدارية والمكتبية وكراسي الاجتماعات بمعايير أرغونوميكية معتمدة.',
      },
    },
  },
  {
    id: 'desks',
    title: { fa: 'میز', en: 'Desks', ar: 'المكاتب' },
    slug: { fa: 'desks', en: 'desks', ar: 'desks' },
    parentId: null,
    image: {
      src: '/images/mock/icon-desk.svg',
      alt: {
        fa: 'آیکون دسته‌بندی میز اداری اروند',
        en: 'Arvand office desks category icon',
        ar: 'أيقونة تصنيف المكاتب أرواند',
      },
    },
    salesMode: 'direct-purchase',
    seo: {
      metaTitle: {
        fa: 'میز اداری | فروشگاه اروند',
        en: 'Office Desks | Arvand Store',
        ar: 'المكاتب المكتبية | متجر أرواند',
      },
      metaDescription: {
        fa: 'میز مدیریتی و میز کارشناسی اروند با طراحی مدرن، مدیریت کابل و تحویل سریع.',
        en: 'Arvand managerial and workstation desks with modern design, cable management, and fast delivery.',
        ar: 'مكاتب أرواند الإدارية ومكاتب العمل بتصميم عصري وإدارة كابلات وتوصيل سريع.',
      },
    },
  },
  {
    id: 'office-furniture',
    title: { fa: 'مبلمان اداری', en: 'Office Furniture', ar: 'الأثاث المكتبي' },
    slug: { fa: 'office-furniture', en: 'office-furniture', ar: 'office-furniture' },
    parentId: null,
    image: {
      src: '/images/mock/icon-sofa.svg',
      alt: {
        fa: 'آیکون دسته‌بندی مبلمان اداری اروند',
        en: 'Arvand office furniture category icon',
        ar: 'أيقونة تصنيف الأثاث المكتبي أرواند',
      },
    },
    salesMode: 'mixed',
    seo: {
      metaTitle: {
        fa: 'مبلمان اداری و ست پذیرایی | فروشگاه اروند',
        en: 'Office Furniture & Reception Sets | Arvand Store',
        ar: 'الأثاث المكتبي وأطقم الاستقبال | متجر أرواند',
      },
      metaDescription: {
        fa: 'ست مبل و مبلمان پذیرایی اداری اروند برای لابی، اتاق مدیریت و فضاهای مشترک.',
        en: 'Arvand reception and lounge furniture sets for lobbies, executive offices, and shared spaces.',
        ar: 'أطقم أثاث الاستقبال والصالات من أرواند للردهات ومكاتب الإدارة والمساحات المشتركة.',
      },
    },
  },
  {
    id: 'amphitheater',
    title: { fa: 'آمفی‌تئاتر', en: 'Amphitheater', ar: 'المدرجات' },
    slug: { fa: 'amphitheater', en: 'amphitheater', ar: 'amphitheater' },
    parentId: null,
    image: {
      src: '/images/mock/icon-amphitheater.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی‌بندی آمفی‌تئاتر اروند',
        en: 'Arvand amphitheater seating category icon',
        ar: 'أيقونة تصنيف مقاعد المدرجات أرواند',
      },
    },
    /** پروژه‌محور طبق توصیف خود سند ۰۲؛ برای Mock UI فاز ۳ quote-only در نظر گرفته شده —
     * تصمیم نهایی پیش‌فرض هر دسته همچنان به بعد موکول است (docs/README.md «هنوز باز»). */
    salesMode: 'quote-only',
    seo: {
      metaTitle: {
        fa: 'صندلی آمفی‌تئاتر | پروژه‌های اروند',
        en: 'Amphitheater Seating | Arvand Projects',
        ar: 'مقاعد المدرجات | مشاريع أرواند',
      },
      metaDescription: {
        fa: 'طراحی و اجرای صندلی‌بندی آمفی‌تئاتر دانشگاه‌ها و سالن‌های اجتماع با استعلام قیمت پروژه‌ای.',
        en: 'Design and installation of amphitheater seating for universities and assembly halls — project-based quotes.',
        ar: 'تصميم وتنفيذ مقاعد المدرجات للجامعات وقاعات التجمع — عروض أسعار حسب المشروع.',
      },
    },
  },
  {
    id: 'cinema-conference',
    title: { fa: 'همایش و سینما', en: 'Cinema & Conference', ar: 'المؤتمرات والسينما' },
    slug: { fa: 'cinema-conference', en: 'cinema-conference', ar: 'cinema-conference' },
    parentId: null,
    image: {
      src: '/images/mock/icon-cinema.svg',
      alt: {
        fa: 'آیکون دسته‌بندی صندلی سالن همایش و سینما اروند',
        en: 'Arvand cinema and conference hall seating category icon',
        ar: 'أيقونة تصنيف مقاعد قاعات المؤتمرات والسينما أرواند',
      },
    },
    salesMode: 'quote-only',
    seo: {
      metaTitle: {
        fa: 'صندلی سالن همایش و سینما | پروژه‌های اروند',
        en: 'Cinema & Conference Hall Seating | Arvand Projects',
        ar: 'مقاعد قاعات المؤتمرات والسينما | مشاريع أرواند',
      },
      metaDescription: {
        fa: 'تجهیز سالن همایش، سینما و مراکز کنفرانس با صندلی‌های راحت و بادوام اروند.',
        en: 'Equip conference centers and cinema halls with Arvand comfortable, durable seating.',
        ar: 'تجهيز قاعات المؤتمرات والسينما بمقاعد أرواند المريحة وطويلة العمر.',
      },
    },
  },
]
