/**
 * لایه‌ی Data Access برای Collection `Orders`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۴ (تأیید سفارش) و ۵ (تاریخچه‌ی سفارش).
 */

import { orders, type Order } from '@/lib/mock-data/orders'

export async function getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  return orders.filter((order) => order.customerId === customerId)
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  return orders.find((order) => order.orderNumber === orderNumber) ?? null
}
