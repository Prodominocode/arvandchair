/**
 * Mock data برای سکشن «داستان محصول» صفحه‌ی اصلی (جایگزین نقل‌قول مشتریان در Stories).
 * هر استوری یک ویژگی/روایت از یک محصول موجود در `products.ts` است و فقط از تصاویر واقعی
 * همان محصول استفاده می‌کند — `productId` برای گرفتن نام و لینک محصول به Data Layer وصل می‌شود.
 */

import type { LocalizedText } from './types'

export type ProductStoryImage = {
  src: string
  /** `contain` برای Cutout روی زمینه‌ی سفید، `cover` برای عکس‌های محیطی/جزئیات. */
  fit: 'cover' | 'contain'
  /** `object-position` — فقط برای `cover` کاربرد دارد. */
  position?: string
}

export type ProductStory = {
  id: string
  productId: string
  title: LocalizedText
  text: LocalizedText
  image: ProductStoryImage
}

export const productStories: ProductStory[] = [
  {
    id: 'ara-mesh',
    productId: 'ara-managerial-chair',
    title: {
      fa: 'پشتی مش که تمام روز خنک می‌ماند',
      en: 'A mesh back that stays cool all day',
    },
    text: {
      fa: 'بافت مش هرینگ‌بون هوا را از پشتی عبور می‌دهد و در جلسات طولانی دما و رطوبت را پایین نگه می‌دارد، بی‌آنکه از حمایت کمر کم شود.',
      en: 'The herringbone-weave mesh lets air pass straight through the backrest, keeping heat and moisture down through long sessions without giving up lumbar support.',
    },
    image: { src: '/images/products/ara-managerial-chair/detail-weave.jpg', fit: 'cover' },
  },
  {
    id: 'ara-armrest',
    productId: 'ara-managerial-chair',
    title: {
      fa: 'دسته و زاویه‌ی نشستن، دقیقاً اندازه‌ی شما',
      en: 'Armrests and recline, tuned to you',
    },
    text: {
      fa: 'دسته‌های قابل‌تنظیم در سه جهت روی هر ارتفاع و عرض شانه می‌نشینند و مکانیزم Synchro-Tilt زاویه‌ی نشیمن و پشتی را هم‌زمان با جابه‌جایی وزن بدن تنظیم می‌کند.',
      en: 'Tri-directional armrests adjust to any shoulder height and width, while the synchro-tilt mechanism balances seat and backrest angle together as you shift your weight.',
    },
    image: { src: '/images/products/ara-managerial-chair/detail-armrest.jpg', fit: 'cover' },
  },
  {
    id: 'ara-executive',
    productId: 'ara-managerial-chair',
    title: {
      fa: 'ساخته‌شده برای اتاق مدیریت',
      en: 'Made for the executive office',
    },
    text: {
      fa: 'قاب کروم پشتی و خطوط ساده‌ی آرا، چه در رنگ سرمه‌ای و چه بژ، کنار میز مدیریتی یکدست و رسمی می‌نشیند و پایه‌ی آلومینیومی آن روی کف سرامیک و پارکت بدون خط‌انداختن حرکت می‌کند.',
      en: 'Ara’s chrome backrest frame and clean lines sit naturally beside an executive desk in navy or beige, and its aluminum base rolls across tile and parquet without marking the floor.',
    },
    image: {
      src: '/images/products/ara-managerial-chair/lifestyle-01.jpg',
      fit: 'cover',
      position: '30% center',
    },
  },
  {
    id: 'kiana-high-back',
    productId: 'kiana-side-guest-chair',
    title: {
      fa: 'پشتی بلند، روکش نرم، ظاهر سبک',
      en: 'High back, soft upholstery, light silhouette',
    },
    text: {
      fa: 'کیانا برای اتاق‌های کار اختصاصی و پذیرایی نیمه‌رسمی طراحی شده: روکش سرمه‌ای روی فوم متراکم، پشتی بلند برای حمایت کامل کمر و پایه‌ی سفید که صندلی را سبک نگه می‌دارد.',
      en: 'Kiana is designed for private offices and semi-formal reception areas: navy upholstery over dense foam, a high back for full lumbar support, and a white base that keeps the silhouette light.',
    },
    image: { src: '/images/products/side-guest/kiana-side-guest-chair.png', fit: 'contain' },
  },
  {
    id: 'nasim-shared-desk',
    productId: 'nasim-side-guest-chair',
    title: {
      fa: 'همراهِ میزهای کار مشترک',
      en: 'The companion for shared desks',
    },
    text: {
      fa: 'نسیم برای میزهای کنار هم و فضاهای گفت‌وگو ساخته شده: پشتی مش با خط‌دوزی ظریف، دسته‌های قابل تنظیم و پایه‌ی پنج‌پر آلومینیومی با تنظیم ارتفاع گازی.',
      en: 'Nasim is built for shared desks and collaborative zones: a finely stitched mesh back, adjustable arms, and a five-star aluminum base with gas-lift height adjustment.',
    },
    image: { src: '/images/products/side-guest/nasim-side-guest-chair.png', fit: 'contain' },
  },
]
