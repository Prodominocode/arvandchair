/**
 * Mock data برای Collection `LoyaltyTiers` (docs/02-data-model.md بخش ۶).
 * در بسته‌ی ۵ (داشبورد وفاداری) و صفحه‌ی عمومی باشگاه مشتریان مصرف می‌شود.
 */

import type { LocalizedText } from './types'

export type LoyaltyTier = {
  id: 'bronze' | 'silver' | 'gold'
  name: LocalizedText
  minPointsRequired: number
  benefits: LocalizedText[]
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: { fa: 'برنزی', en: 'Bronze' },
    minPointsRequired: 0,
    benefits: [
      {
        fa: 'کسب ۱ امتیاز به‌ازای هر ۱۰۰٬۰۰۰ تومان خرید',
        en: 'Earn 1 point for every 100,000 Toman spent',
      },
      {
        fa: 'دسترسی به کاتالوگ جوایز پایه',
        en: 'Access to the base rewards catalog',
      },
    ],
  },
  {
    id: 'silver',
    name: { fa: 'نقره‌ای', en: 'Silver' },
    minPointsRequired: 5000,
    benefits: [
      {
        fa: 'کسب ۱٫۲۵ برابر امتیاز نسبت به سطح برنزی',
        en: '1.25× the points of the Bronze tier',
      },
      {
        fa: 'ارسال رایگان برای سفارش‌های بالای ۱۰ میلیون تومان',
        en: 'Free shipping on orders above 10,000,000 Toman',
      },
    ],
  },
  {
    id: 'gold',
    name: { fa: 'طلایی', en: 'Gold' },
    minPointsRequired: 15000,
    benefits: [
      {
        fa: 'کسب ۱٫۵ برابر امتیاز نسبت به سطح برنزی',
        en: '1.5× the points of the Bronze tier',
      },
      {
        fa: 'مشاور فروش اختصاصی برای درخواست‌های استعلام',
        en: 'A dedicated sales advisor for quote requests',
      },
      {
        fa: 'دعوت اولویت‌دار به رویدادهای معرفی محصول جدید',
        en: 'Priority invitations to new-product launch events',
      },
    ],
  },
]
