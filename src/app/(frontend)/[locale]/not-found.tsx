import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'

// بدون این، Next.js موقع build یک Shell استاتیک از این صفحه با لوکیل پیش‌فرض (fa) می‌سازد
// (چون در build-time هیچ Request واقعی‌ای برای تشخیص لوکیل نیست). force-dynamic این
// پیش‌رندر ایستا را غیرفعال می‌کند تا هر درخواست دقیقاً با لوکیل واقعی خودش رندر شود.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('NotFound')
  return { title: t('metaTitle') }
}

/**
 * ۴۰۴ سراسری برای هر مسیر زیر یک لوکیل معتبر (بسته‌ی ۶ #۲۳، docs/05-pages-build-order.md) —
 * چه با notFound() صریح (دسته/محصول/پست وبلاگ/نمونه‌کار ناموجود، از `[...rest]/page.tsx`) چه
 * مسیر کاملاً نامعتبر. داخل layout همین سگمنت رندر می‌شود، پس Header/Footer از قبل آماده‌اند.
 *
 * عمداً `getTranslations` را بدون locale صریح صدا می‌زنیم تا لوکیل را از context درخواستی
 * next-intl (میدل‌ور/URL تعیینش کرده) بخواند، نه از prop مربوط به `params` این فایل — چون
 * وقتی notFound() از یک صفحه‌ی فرزند (مثل `[...rest]`) صدا زده می‌شود، Next.js همیشه
 * `locale` را داخل params همین not-found.tsx پاس نمی‌دهد و باعث می‌شد صفحه همیشه با لوکیل
 * پیش‌فرض (fa) رندر شود، حتی زیر مسیر `/en/...`.
 */
export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <div className="px-container-x py-section-y-lg max-w-container mx-auto flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-arvand-gold text-7xl font-bold tracking-tight sm:text-8xl">404</p>
      <h1 className="text-arvand-ink mt-6 text-3xl font-bold text-balance sm:text-4xl">
        {t('title')}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-md text-lg">{t('subtitle')}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">{t('backHome')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products">{t('browseProducts')}</Link>
        </Button>
      </div>
    </div>
  )
}
