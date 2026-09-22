'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { MockImage } from '@/lib/mock-data/types'
import { cn } from '@/lib/utils/cn'

type ProductOverviewCarouselProps = {
  images: MockImage[]
  locale: AppLocale
}

/** Cutout محصول (PNG بدون پس‌زمینه) روی زمینه‌ی صفحه معلق می‌ماند؛ عکس‌های محیطی/جزئیات
 * قاب را پر می‌کنند تا لبه‌ی مستطیلشان روی زمینه‌ی خاکستری دیده نشود. */
const isCutout = (image: MockImage) => image.src.includes('/cutout')

/**
 * کاروسل اصلی سکشن Overview — الگوی رفرنس Okamura: تصویر بزرگِ محصول مستقیم روی زمینه‌ی صفحه
 * (بدون کارت/قاب) که با Scroll-snap افقی اسلاید می‌شود (لمس/Trackpad هم کار می‌کند)، و زیرش
 * نوار ناوبری: فلش نازک قبلی/بعدی در دو طرف و خط‌های کوتاه (۲۵×۳px) به‌جای نقطه؛ خط فعال تیره،
 * بقیه خاکستری روشن. مسیر اسلاید همیشه LTR است تا `scrollLeft` در صفحات RTL (فارسی) هم
 * درست محاسبه شود؛ جهت متن هیچ ارتباطی با چیدمان اسلایدها ندارد.
 */
export function ProductOverviewCarousel({ images, locale }: ProductOverviewCarouselProps) {
  const t = useTranslations('ProductDetail.carousel')
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const syncActiveIndex = useCallback(() => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth))
  }, [])

  useEffect(() => {
    window.addEventListener('resize', syncActiveIndex)
    return () => window.removeEventListener('resize', syncActiveIndex)
  }, [syncActiveIndex])

  if (images.length === 0) return null

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const next = (index + images.length) % images.length
    track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div
        ref={trackRef}
        dir="ltr"
        onScroll={syncActiveIndex}
        className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto scroll-smooth [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className="relative h-[clamp(320px,72svh,680px)] w-full shrink-0 snap-center"
          >
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={isCutout(image) ? 'object-contain' : 'object-cover'}
            />
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div dir="ltr" className="flex items-center justify-center gap-12">
          <button
            type="button"
            aria-label={t('previous')}
            onClick={() => goTo(activeIndex - 1)}
            className="text-arvand-slate/60 hover:text-arvand-ink duration-base -m-3 p-3 transition-colors"
          >
            <svg
              viewBox="0 0 10 18"
              className="h-[18px] w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <path d="M9 1 1 9l8 8" />
            </svg>
          </button>

          <div className="flex items-center gap-[5px]">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={t('goTo', { index: index + 1 })}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className="-my-3 py-3"
              >
                <span
                  className={cn(
                    'duration-base block h-[3px] w-[25px] transition-colors',
                    index === activeIndex ? 'bg-arvand-ink' : 'bg-accordion-border',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={t('next')}
            onClick={() => goTo(activeIndex + 1)}
            className="text-arvand-slate/60 hover:text-arvand-ink duration-base -m-3 p-3 transition-colors"
          >
            <svg
              viewBox="0 0 10 18"
              className="h-[18px] w-2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <path d="m1 1 8 8-8 8" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  )
}
