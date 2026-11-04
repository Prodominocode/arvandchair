import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { CHAIRS } from './chairs'
import { LookCarousel } from './look-carousel'
import { LOOKS } from './looks'

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
      {/* نسخه‌ی ۱: مدل‌های لباس — کامل (عنوان، برچسب، کنترل‌ها) */}
      <LookCarousel looks={LOOKS} aspect={750 / 1800} ariaLabel="امتحانش کن؛ استایل‌ها" />
      {/* نسخه‌ی ۲: صندلی‌ها — تمیز، فقط تصویر */}
      <LookCarousel
        variant="clean"
        looks={CHAIRS}
        aspect={1}
        heightFrac={0.6}
        gap={0.65}
        ariaLabel="صندلی‌های مهمان"
        panelHeading="جزئیات صندلی"
        panelCta="مشاهده‌ی صفحه‌ی محصول"
      />
    </>
  )
}
