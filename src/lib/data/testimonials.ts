/**
 * لایه‌ی Data Access برای Collection `Testimonials`. توضیح کلی معماری در `lib/data/categories.ts`.
 */

import { testimonials, type Testimonial } from '@/lib/mock-data/testimonials'

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials
}
