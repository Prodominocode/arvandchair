/**
 * Mock data برای Collection `Rewards` (docس/02-data-model.md بخش ۶) — کاتالوگ جوایز بازخریدنی.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ برای بسته‌ی ۵ و صفحه‌ی عمومی باشگاه مشتریان آماده شده.
 */

import type { LocalizedText, MockImage } from './types'

export type Reward = {
  id: string
  title: LocalizedText
  description: LocalizedText
  pointsCost: number
  image: MockImage
  type: 'discount-code' | 'free-product' | 'free-shipping'
}

export const rewards: Reward[] = [
  {
    id: 'reward-discount-10',
    title: { fa: 'کد تخفیف ۱۰٪', en: '10% Discount Code', ar: 'كود خصم ١٠٪' },
    description: {
      fa: 'یک کد تخفیف ۱۰٪ برای استفاده در خرید بعدی شما.',
      en: 'A 10% discount code for your next purchase.',
      ar: 'كود خصم ١٠٪ لاستخدامه في عملية الشراء القادمة.',
    },
    pointsCost: 500,
    image: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'کد تخفیف', en: 'Discount code', ar: 'كود خصم' },
    },
    type: 'discount-code',
  },
  {
    id: 'reward-free-shipping',
    title: { fa: 'ارسال رایگان', en: 'Free Shipping', ar: 'شحن مجاني' },
    description: {
      fa: 'ارسال رایگان برای یک سفارش، مستقل از مبلغ خرید.',
      en: 'Free shipping on one order, regardless of amount.',
      ar: 'شحن مجاني لطلب واحد بغض النظر عن المبلغ.',
    },
    pointsCost: 300,
    image: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'ارسال رایگان', en: 'Free shipping', ar: 'شحن مجاني' },
    },
    type: 'free-shipping',
  },
  {
    id: 'reward-desk-organizer',
    title: {
      fa: 'سازمان‌دهنده‌ی رومیزی رایگان',
      en: 'Free Desk Organizer',
      ar: 'منظم مكتب مجاني',
    },
    description: {
      fa: 'یک سازمان‌دهنده‌ی چوبی رومیزی اروند، رایگان همراه سفارش بعدی شما.',
      en: 'A free Arvand wooden desk organizer, included with your next order.',
      ar: 'منظم مكتب خشبي من أرواند، مجانًا مع طلبك القادم.',
    },
    pointsCost: 1200,
    image: {
      src: '/images/mock/icon-desk.svg',
      alt: { fa: 'سازمان‌دهنده‌ی رومیزی', en: 'Desk organizer', ar: 'منظم مكتب' },
    },
    type: 'free-product',
  },
  {
    id: 'reward-discount-20',
    title: { fa: 'کد تخفیف ۲۰٪', en: '20% Discount Code', ar: 'كود خصم ٢٠٪' },
    description: {
      fa: 'یک کد تخفیف ۲۰٪ ویژه‌ی اعضای سطح طلایی.',
      en: 'A 20% discount code, exclusive to Gold-tier members.',
      ar: 'كود خصم ٢٠٪ حصري لأعضاء المستوى الذهبي.',
    },
    pointsCost: 2500,
    image: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'کد تخفیف ویژه', en: 'Exclusive discount code', ar: 'كود خصم حصري' },
    },
    type: 'discount-code',
  },
]
