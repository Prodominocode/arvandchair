/**
 * لایه‌ی Data Access برای Collection `Customers`. توضیح کلی معماری در `lib/data/categories.ts`.
 * در بسته‌ی ۱ مصرف نمی‌شود؛ از قبل آماده شده برای بسته‌ی ۵ (حساب کاربری).
 */

import { customers, type Customer } from '@/lib/mock-data/customers'

export async function getCustomerById(id: string): Promise<Customer | null> {
  return customers.find((customer) => customer.id === id) ?? null
}
