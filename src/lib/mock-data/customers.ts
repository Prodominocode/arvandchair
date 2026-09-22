/**
 * Mock data برای Collection `Customers` (docs/02-data-model.md بخش ۱).
 * در بسته‌ی ۱ مصرف نمی‌شود؛ برای فاز‌های بعدی همین فاز ۳ (بسته‌ی ۵ — حساب کاربری) از قبل آماده شده.
 * هرگز `password` واقعی اینجا نگه‌داشته نمی‌شود (حتی جعلی) — فاز ۷ منطق Auth واقعی را اضافه می‌کند.
 */

import type { IranAddress } from './types'

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  companyId: string | null
  preferredLocale: 'fa' | 'en'
  addresses: IranAddress[]
  loyaltyTierId: string
  loyaltyPointsBalance: number
  customerType: 'individual' | 'business'
}

export const customers: Customer[] = [
  {
    id: 'customer-1',
    name: 'علی رضایی',
    email: 'ali.rezaei@example.com',
    phone: '09121234567',
    companyId: null,
    preferredLocale: 'fa',
    addresses: [
      {
        title: 'منزل',
        province: 'تهران',
        city: 'تهران',
        street: 'خیابان شریعتی، کوچه‌ی نمونه، پلاک ۱۲',
        postalCode: '1913746511',
        recipientPhone: '09121234567',
      },
    ],
    loyaltyTierId: 'silver',
    loyaltyPointsBalance: 6200,
    customerType: 'individual',
  },
  {
    id: 'customer-2',
    name: 'شرکت توسعه‌ی فناوری نمونه',
    email: 'procurement@sample-tech.example',
    phone: '02188990011',
    companyId: 'company-sample-tech',
    preferredLocale: 'fa',
    addresses: [
      {
        title: 'دفتر مرکزی',
        province: 'تهران',
        city: 'تهران',
        street: 'بزرگراه شهید همت، برج نمونه، طبقه‌ی ۸',
        postalCode: '1466617711',
        recipientPhone: '02188990011',
      },
    ],
    loyaltyTierId: 'gold',
    loyaltyPointsBalance: 18500,
    customerType: 'business',
  },
  {
    id: 'customer-3',
    name: 'نگار احمدی',
    email: 'negar.ahmadi@example.com',
    phone: '09354567890',
    companyId: null,
    preferredLocale: 'fa',
    addresses: [
      {
        title: 'منزل',
        province: 'اصفهان',
        city: 'اصفهان',
        street: 'خیابان چهارباغ پایین، کوچه‌ی نمونه، پلاک ۵',
        postalCode: '8134756312',
        recipientPhone: '09354567890',
      },
    ],
    loyaltyTierId: 'bronze',
    loyaltyPointsBalance: 850,
    customerType: 'individual',
  },
  {
    id: 'customer-4',
    name: 'مرکز همایش‌های نمونه',
    email: 'events@sample-convention.example',
    phone: '02177889900',
    companyId: 'company-sample-convention',
    preferredLocale: 'fa',
    addresses: [
      {
        title: 'دفتر مرکز همایش',
        province: 'تهران',
        city: 'تهران',
        street: 'بزرگراه چمران، مجموعه‌ی نمونه، پلاک ۳',
        postalCode: '1996734211',
        recipientPhone: '02177889900',
      },
    ],
    loyaltyTierId: 'silver',
    loyaltyPointsBalance: 7100,
    customerType: 'business',
  },
]
