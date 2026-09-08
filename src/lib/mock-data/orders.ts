/**
 * Mock data برای Collection `Orders` (docs/02-data-model.md بخش ۴).
 * در بسته‌ی ۱ مصرف نمی‌شود؛ برای بسته‌ی ۴ (تأیید سفارش) و بسته‌ی ۵ (تاریخچه‌ی سفارش) آماده شده.
 */

import type { IranAddress } from './types'

export type OrderItem = {
  productId: string
  variantId: string
  qty: number
  unitPrice: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  items: OrderItem[]
  shippingAddress: IranAddress
  billingAddress: IranAddress
  status: OrderStatus
  paymentStatus: PaymentStatus
  /** فقط `mock` تا فاز ۱۱ (docs/00-tech-stack.md بخش ۱.۲) */
  paymentProvider: 'mock'
  totals: { subtotal: number; shipping: number; tax: number; discount: number; total: number }
  locale: 'fa' | 'en' | 'ar'
  createdAt: string
}

export const orders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ARV-100234',
    customerId: 'customer-1',
    items: [
      { productId: 'ara-managerial-chair', variantId: 'black', qty: 1, unitPrice: 8_500_000 },
    ],
    shippingAddress: {
      title: 'منزل',
      province: 'تهران',
      city: 'تهران',
      street: 'خیابان شریعتی، کوچه‌ی نمونه، پلاک ۱۲',
      postalCode: '1913746511',
      recipientPhone: '09121234567',
    },
    billingAddress: {
      title: 'منزل',
      province: 'تهران',
      city: 'تهران',
      street: 'خیابان شریعتی، کوچه‌ی نمونه، پلاک ۱۲',
      postalCode: '1913746511',
      recipientPhone: '09121234567',
    },
    status: 'delivered',
    paymentStatus: 'paid',
    paymentProvider: 'mock',
    totals: { subtotal: 8_500_000, shipping: 0, tax: 0, discount: 0, total: 8_500_000 },
    locale: 'fa',
    createdAt: '2026-03-02',
  },
  {
    id: 'order-2',
    orderNumber: 'ARV-100301',
    customerId: 'customer-3',
    items: [{ productId: 'sabk-task-chair', variantId: 'charcoal', qty: 2, unitPrice: 3_200_000 }],
    shippingAddress: {
      title: 'منزل',
      province: 'اصفهان',
      city: 'اصفهان',
      street: 'خیابان چهارباغ پایین، کوچه‌ی نمونه، پلاک ۵',
      postalCode: '8134756312',
      recipientPhone: '09354567890',
    },
    billingAddress: {
      title: 'منزل',
      province: 'اصفهان',
      city: 'اصفهان',
      street: 'خیابان چهارباغ پایین، کوچه‌ی نمونه، پلاک ۵',
      postalCode: '8134756312',
      recipientPhone: '09354567890',
    },
    status: 'shipped',
    paymentStatus: 'paid',
    paymentProvider: 'mock',
    totals: { subtotal: 6_400_000, shipping: 350_000, tax: 0, discount: 0, total: 6_750_000 },
    locale: 'fa',
    createdAt: '2026-05-01',
  },
]
