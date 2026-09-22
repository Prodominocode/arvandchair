import { notFound } from 'next/navigation'

/**
 * Catch-all برای هر مسیر زیر یک لوکیل معتبر که به هیچ صفحه‌ی دیگری نمی‌خورد. بدون این فایل،
 * Next.js برای مسیرهای کاملاً نامعتبر (بدون notFound() صریح در هیچ صفحه‌ای) به‌جای
 * `[locale]/not-found.tsx` صفحه‌ی ۴۰۴ پیش‌فرض و بی‌استایل خودش را نشان می‌دهد — همان مشکلی که
 * docs/05-pages-build-order.md (بسته‌ی ۶ #۲۳) به آن اشاره کرده. با فراخوانی صریح notFound()
 * این‌جا، همان not-found.tsx سفارشی (با Header/Footer و ترجمه‌ی درست) به‌کار گرفته می‌شود.
 */
export default function CatchAllNotFound() {
  notFound()
}
