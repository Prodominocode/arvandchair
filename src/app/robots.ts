import type { MetadataRoute } from 'next'

import { getSiteNoindex } from '@/lib/data/site-settings'

// وابسته به تنظیمات سایت در دیتابیس است؛ نباید موقع بیلد ثابت (Static) شود.
export const dynamic = 'force-dynamic'

/**
 * وقتی «noindex» در تنظیمات سایت فعال است، عمداً کل سایت را در robots.txt مسدود نمی‌کنیم:
 * اگر خزنده اجازه‌ی خواندن صفحه را نداشته باشد، متای `noindex` را نمی‌بیند و گوگل ممکن است
 * آدرس را (بدون محتوا) همچنان ایندکس کند. پس خزیدن آزاد می‌ماند و خودِ `noindex` جلوی ایندکس را می‌گیرد.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const noindex = await getSiteNoindex()
  return {
    rules: noindex
      ? { userAgent: '*', disallow: ['/admin', '/api'] }
      : { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
  }
}
