/**
 * Mock data برای Collection `LoyaltyTransactions` (docs/02-data-model.md بخش ۶).
 * در بسته‌ی ۱ مصرف نمی‌شود؛ برای بسته‌ی ۵ (تاریخچه‌ی امتیاز) از قبل آماده شده.
 */

export type LoyaltyTransaction = {
  id: string
  customerId: string
  type: 'earn' | 'redeem' | 'expire' | 'adjustment'
  points: number
  relatedOrderId: string | null
  note: string
  date: string
}

export const loyaltyTransactions: LoyaltyTransaction[] = [
  {
    id: 'lt-1',
    customerId: 'customer-1',
    type: 'earn',
    points: 85,
    relatedOrderId: 'ARV-100234',
    note: 'خرید صندلی مدیریتی آرا',
    date: '2026-03-02',
  },
  {
    id: 'lt-2',
    customerId: 'customer-1',
    type: 'redeem',
    points: -50,
    relatedOrderId: null,
    note: 'بازخرید کد تخفیف ۱۰٪',
    date: '2026-04-10',
  },
  {
    id: 'lt-3',
    customerId: 'customer-2',
    type: 'earn',
    points: 1450,
    relatedOrderId: 'ARV-100198',
    note: 'خرید میز کارشناسی پرسپولیس (تیراژ سازمانی)',
    date: '2026-02-18',
  },
  {
    id: 'lt-4',
    customerId: 'customer-3',
    type: 'earn',
    points: 32,
    relatedOrderId: 'ARV-100301',
    note: 'خرید صندلی کارمندی سبک',
    date: '2026-05-01',
  },
  {
    id: 'lt-5',
    customerId: 'customer-4',
    type: 'earn',
    points: 620,
    relatedOrderId: 'ARV-100310',
    note: 'تسویه‌ی فاکتور صندلی سالن همایش رویال',
    date: '2026-05-15',
  },
]
