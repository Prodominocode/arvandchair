import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { LookCarousel } from '@/components/look-carousel/look-carousel'
import { LOOKS } from '@/components/look-carousel/looks'

type Args = { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: 'آزمایشگاه: کاروسل استایل',
  // صفحه‌ی داخلی و آزمایشی — نباید ایندکس شود
  robots: { index: false, follow: false },
}

export default async function LookCarouselLabPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      {/* مدل‌های لباس — کامل (عنوان، برچسب، کنترل‌ها)؛ نسخه‌ی صندلی به صفحه‌ی اصلی منتقل شد */}
      <LookCarousel looks={LOOKS} aspect={750 / 1800} ariaLabel="امتحانش کن؛ استایل‌ها" />
    </>
  )
}
