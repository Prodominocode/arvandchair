/**
 * Mock data برای Collection `SiteSettings` (Global، docs/02-data-model.md بخش ۳).
 *
 * ⚠️ توجه مهم: این با Global واقعی Payload در `src/globals/SiteSettings.ts` (که فعلاً فقط
 * `enabledLocales` دارد و فاز ۴ کامل می‌شود) فرق دارد — همان یکی همچنان منبع واقعی تشخیص
 * فعال/غیرفعال بودن en است و در `[locale]/layout.tsx` دست‌نخورده مانده. این فایل فقط
 * محتوای نمایشی (نام سایت، منو، شعب، شبکه‌های اجتماعی) را برای فاز ۳ شبیه‌سازی می‌کند.
 *
 * لوگو: دو نسخه‌ی PNG شفاف موجود است — `arvand-logo-bl.png` (متن تیره، برای پس‌زمینه‌ی روشن)
 * و `arvand-logo-wh.png` (متن سفید، برای پس‌زمینه‌ی تیره)؛ هدر بر اساس `data-header-tone`
 * سکشن زیرش بین این دو سوییچ می‌کند (رجوع به `HeaderNav.tsx`).
 */

import type { IranAddress, LocalizedText, MockImage } from './types'

export type NavLink = {
  label: LocalizedText
  /** مسیر بدون پیشوند locale — با next-intl Link ترکیب می‌شود. */
  href: string
  children?: NavLink[]
}

export type SocialLink = {
  platform: 'instagram' | 'linkedin' | 'telegram'
  url: string
}

export type Office = {
  id: string
  title: LocalizedText
  type: 'factory' | 'showroom' | 'sales-office'
  address: IranAddress
  phone: string
  /** ساعات کاری، برای Structured Data آینده (LocalBusiness، سند ۰۳) */
  hours: LocalizedText
}

export type SiteSettingsMock = {
  siteName: LocalizedText
  tagline: LocalizedText
  logo: MockImage
  /** نسخه‌ی متن‌سفید لوگو، برای وقتی هدر روی سکشن پس‌زمینه‌تیره شناور است. */
  logoOnDark: string
  socialLinks: SocialLink[]
  navMenu: NavLink[]
  offices: Office[]
  contactEmail: string
  contactPhone: string
}

export const siteSettings: SiteSettingsMock = {
  siteName: { fa: 'اروند', en: 'Arvand' },
  tagline: {
    fa: 'مبلمان اداری برای فضای کاری امروز',
    en: 'Office furniture for the modern workplace',
  },
  logo: {
    src: '/images/brand/arvand-logo-bl.png',
    alt: { fa: 'لوگوی اروند', en: 'Arvand logo' },
  },
  logoOnDark: '/images/brand/arvand-logo-wh.png',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/arvand.furniture' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/arvand-furniture' },
    { platform: 'telegram', url: 'https://t.me/arvand_furniture' },
  ],
  navMenu: [
    {
      label: { fa: 'محصولات', en: 'Products' },
      href: '/products',
      children: [
        { label: { fa: 'صندلی', en: 'Chairs' }, href: '/products/chairs' },
        { label: { fa: 'میز', en: 'Desks' }, href: '/products/desks' },
        {
          label: { fa: 'مبلمان اداری', en: 'Office Furniture' },
          href: '/products/office-furniture',
        },
        {
          label: { fa: 'آمفی‌تئاتر', en: 'Amphitheater' },
          href: '/products/amphitheater',
        },
        {
          label: { fa: 'همایش و سینما', en: 'Cinema & Conference' },
          href: '/products/cinema-conference',
        },
      ],
    },
    { label: { fa: 'نمونه‌کارها', en: 'Portfolio' }, href: '/portfolio' },
    { label: { fa: 'وبلاگ', en: 'Blog' }, href: '/blog' },
    { label: { fa: 'درباره‌ی ما', en: 'About' }, href: '/about' },
    { label: { fa: 'تماس با ما', en: 'Contact' }, href: '/contact' },
    {
      label: { fa: 'باشگاه مشتریان', en: 'Loyalty Club' },
      href: '/loyalty-club',
    },
  ],
  offices: [
    {
      id: 'tehran-factory',
      title: { fa: 'کارخانه‌ی تهران', en: 'Tehran Factory' },
      type: 'factory',
      address: {
        title: 'کارخانه‌ی تهران',
        province: 'تهران',
        city: 'تهران',
        street: 'جاده‌ی مخصوص کرج، شهرک صنعتی نمونه، خیابان دوازدهم، پلاک ۴۵',
        postalCode: '1398715477',
        recipientPhone: '02144667788',
      },
      phone: '02144667788',
      hours: {
        fa: 'شنبه تا چهارشنبه، ۸ تا ۱۷',
        en: 'Saturday–Wednesday, 8 AM–5 PM',
      },
    },
    {
      id: 'tehran-showroom',
      title: {
        fa: 'نمایشگاه ولیعصر تهران',
        en: 'Tehran Valiasr Showroom',
      },
      type: 'showroom',
      address: {
        title: 'نمایشگاه ولیعصر',
        province: 'تهران',
        city: 'تهران',
        street: 'خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۰۴',
        postalCode: '1969734567',
        recipientPhone: '02188112233',
      },
      phone: '02188112233',
      hours: {
        fa: 'همه‌روزه، ۹ تا ۲۰',
        en: 'Daily, 9 AM–8 PM',
      },
    },
    {
      id: 'isfahan-sales-office',
      title: { fa: 'دفتر فروش اصفهان', en: 'Isfahan Sales Office' },
      type: 'sales-office',
      address: {
        title: 'دفتر فروش اصفهان',
        province: 'اصفهان',
        city: 'اصفهان',
        street: 'خیابان چهارباغ بالا، ساختمان نمونه، طبقه‌ی سوم',
        postalCode: '8158735614',
        recipientPhone: '03136223344',
      },
      phone: '03136223344',
      hours: {
        fa: 'شنبه تا پنجشنبه، ۹ تا ۱۸',
        en: 'Saturday–Thursday, 9 AM–6 PM',
      },
    },
  ],
  contactEmail: 'info@arvand-furniture.example',
  contactPhone: '02188112233',
}
