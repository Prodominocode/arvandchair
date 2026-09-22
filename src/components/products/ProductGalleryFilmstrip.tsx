'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { MockImage } from '@/lib/mock-data/types'
import { cn } from '@/lib/utils/cn'

type ProductGalleryFilmstripProps = {
  images: MockImage[]
  locale: AppLocale
}

/** فاصله‌ی بین کارت‌ها (gap-1.5 = 6px، مثل رفرنس) — با کلاس `gap-1.5` و `0.375rem` در محاسبه‌ی
 * جای فلش‌ها هماهنگ نگه دارید. */
const CARD_GAP_PX = 6
/** حداقل جابه‌جایی ماوس (px) که یک Drag کوتاه را «ورق زدن به کارت بعدی/قبلی» حساب می‌کند. */
const DRAG_FLICK_THRESHOLD_PX = 40
/** مکث (ms) بعد از آخرین رویداد اسکرول که اسلاید را «نشسته» حساب می‌کند و حلقه را بازتنظیم می‌کند. */
const SETTLE_DELAY_MS = 120

type DragState = { startX: number; startScrollLeft: number }

/**
 * سکشن مستقل «Gallery» — الگوی رفرنس Okamura: نوار افقی بزرگ با Scroll-snap که کارت فعال وسط
 * است و تصویر بعدی/قبلی کمی از لبه‌ی صفحه معلوم است (Peek). جابه‌جایی به سه روش:
 *  ۱. Drag با ماوس (لمس/Trackpad همان اسکرول افقی بومی مرورگر است)،
 *  ۲. فلش‌های قبلی/بعدی روی تصویر همسایه،
 *  ۳. نوار ناوبری زیر گالری — عیناً مثل `ProductOverviewCarousel` (فلش نازک + خط‌های ۲۵×۳px).
 * کاروسل کوچک بالای صفحه از این جدا است — آن یکی تصویر محصول را نشان می‌دهد، این یکی
 * عکاسی محیطی/جزئیات را با فرمت بزرگ‌تر.
 *
 * **حلقه‌ای (Infinite):** وقتی بیش از یک تصویر هست، فهرست سه بار پشت هم رندر می‌شود
 * (`[کپی۰][اصلی][کپی۲]`) و اسکرول همیشه روی کپی وسط باقی می‌ماند؛ شروع از اولین تصویرِ کپی وسط
 * است، پس سمت چپ خالی نیست (آخرین تصویر همان‌جا دیده می‌شود). وقتی اسلاید روی کپی اول/سوم
 * «نشست» (بعد از SETTLE_DELAY_MS)، اسکرول بدون انیمیشن به همان تصویرِ کپی وسط منتقل می‌شود —
 * چون کپی‌ها یکسان‌اند، این جهش دیده نمی‌شود.
 *
 * ارتفاع هر تصویر `۱۰۰svh − ارتفاع هدر (۴rem = h-16 در HeaderNav)` است تا وقتی گالری زیر هدر
 * ثابت قرار می‌گیرد، «تصویر + هدر» دقیقاً یک صفحه‌ی نمایش شود. مسیر اسلاید همیشه LTR است تا
 * `scrollLeft` در صفحات RTL (فارسی) هم درست محاسبه شود.
 */
export function ProductGalleryFilmstrip({ images, locale }: ProductGalleryFilmstripProps) {
  const t = useTranslations('ProductDetail.carousel')
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const settleTimerRef = useRef<number | null>(null)

  const count = images.length
  const isLoop = count > 1
  const copies = isLoop ? 3 : 1
  // اندیس اولین تصویرِ «کپی وسط» در فهرست سه‌برابری — نقطه‌ی شروع و ناحیه‌ی امن حلقه
  const baseIndex = isLoop ? count : 0
  const slides = Array.from({ length: copies }, (_, copy) =>
    images.map((image) => ({ image, copy })),
  ).flat()

  /** اندیس کارتِ وسط در فهرست سه‌برابری (نه اندیس تصویر واقعی). */
  const [slideIndex, setSlideIndex] = useState(baseIndex)
  const [isDragging, setIsDragging] = useState(false)
  /** تا قبل از انتقال اولیه به کپی وسط، نوار مخفی می‌ماند تا لحظه‌ی جهش دیده نشود. */
  const [isReady, setIsReady] = useState(false)

  /** اندیس تصویر واقعی (۰..count-1) — برای خط‌های ناوبری. */
  const activeIndex = count > 0 ? ((slideIndex % count) + count) % count : 0

  /** فاصله‌ی مرکز تا مرکز دو کارت مجاور (عرض کارت + gap)؛ از DOM و با دقت اعشاری خوانده می‌شود
   * چون عرض کارت با breakpoint عوض می‌شود و مقدار صحیح (offsetWidth) در اندیس‌های بالا خطای
   * تجمعی می‌سازد. */
  const getStep = useCallback(() => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('[data-gallery-card]')
    const width = card?.getBoundingClientRect().width ?? track?.clientWidth ?? 0
    return width + CARD_GAP_PX
  }, [])

  const syncSlideIndex = useCallback(() => {
    const track = trackRef.current
    const step = getStep()
    if (!track || step === CARD_GAP_PX) return
    setSlideIndex(Math.round(track.scrollLeft / step))
  }, [getStep])

  /** اگر اسلاید روی کپی اول/سوم نشسته، بی‌صدا به تصویر یکسانِ کپی وسط می‌پرد. */
  const recenterLoop = useCallback(() => {
    const track = trackRef.current
    const step = getStep()
    if (!isLoop || !track || step === CARD_GAP_PX || dragRef.current) return
    const index = Math.round(track.scrollLeft / step)
    if (index < count) {
      track.scrollTo({ left: (index + count) * step, behavior: 'instant' })
    } else if (index >= count * 2) {
      track.scrollTo({ left: (index - count) * step, behavior: 'instant' })
    }
  }, [count, getStep, isLoop])

  const handleScroll = () => {
    syncSlideIndex()
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(recenterLoop, SETTLE_DELAY_MS)
  }

  // شروع از کپی وسط (قبل از اولین Paint پس از Hydration) تا سمت چپِ اولین تصویر خالی نباشد
  useLayoutEffect(() => {
    const track = trackRef.current
    if (track && baseIndex > 0) {
      track.scrollTo({ left: baseIndex * getStep(), behavior: 'instant' })
    }
    setSlideIndex(baseIndex)
    setIsReady(true)
  }, [baseIndex, getStep])

  useEffect(() => {
    const track = trackRef.current
    const handleResize = () => {
      // عرض کارت عوض می‌شود؛ همان کارت فعال را با گام جدید دوباره وسط بگذار
      if (track) track.scrollTo({ left: slideIndex * getStep(), behavior: 'instant' })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getStep, slideIndex])

  useEffect(
    () => () => {
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current)
    },
    [],
  )

  if (count === 0) return null

  const scrollToSlide = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1)
    trackRef.current?.scrollTo({ left: clamped * getStep(), behavior: 'smooth' })
  }

  /** قبلی/بعدی نسبت به کارت وسط؛ چون اسکرول همیشه روی کپی وسط می‌نشیند، هیچ‌وقت به انتهای
   * فهرست سه‌برابری نمی‌رسد و از آخر به اول (و برعکس) بدون برگشت طولانی می‌چرخد. */
  const goBy = (delta: number) => scrollToSlide(slideIndex + delta)

  /** خط ناوبری: نزدیک‌ترین مسیر (حداکثر نصف تعداد تصاویر) به تصویر مقصد، نه برگشت از ابتدا. */
  const goToImage = (imageIndex: number) => {
    const half = Math.floor(count / 2)
    const delta = ((imageIndex - activeIndex + count + half) % count) - half
    goBy(delta)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // فقط ماوس؛ لمس با اسکرول افقی بومی کار می‌کند و نباید با Drag دستی تداخل کند
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const track = trackRef.current
    if (!track) return
    dragRef.current = { startX: event.clientX, startScrollLeft: track.scrollLeft }
    track.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    track.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return
    dragRef.current = null
    setIsDragging(false)
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)

    const step = getStep()
    if (step === CARD_GAP_PX) return
    const dragDistance = event.clientX - drag.startX
    const startIndex = Math.round(drag.startScrollLeft / step)
    let target = Math.round(track.scrollLeft / step)
    // Drag کوتاه هم باید کارت را عوض کند (Flick)، نه اینکه به همان کارت قبلی برگردد
    if (target === startIndex && Math.abs(dragDistance) > DRAG_FLICK_THRESHOLD_PX) {
      target = startIndex + (dragDistance < 0 ? 1 : -1)
    }
    scrollToSlide(target)
    // اگر Drag دقیقاً روی همان موقعیت تمام شود، رویداد اسکرول جدیدی نمی‌آید؛ بازتنظیم حلقه را
    // صریحاً زمان‌بندی می‌کنیم تا اسلاید روی کپی اول/سوم گیر نکند
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = window.setTimeout(recenterLoop, SETTLE_DELAY_MS)
  }

  // دایره‌ی نیمه‌شفاف با شورون سفید نازک (رفرنس Okamura) — روی تصویرِ کم‌نورشده‌ی همسایه می‌نشیند
  const arrowClass =
    'duration-base absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/35 sm:size-11'

  return (
    <div dir="ltr" className="flex flex-col gap-10">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onDragStart={(event) => event.preventDefault()}
          className={cn(
            'flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-[15vw] select-none [-ms-overflow-style:none] sm:px-[18vw] [&::-webkit-scrollbar]:hidden',
            isReady ? 'opacity-100' : 'opacity-0',
            // در حین Drag دستی، Snap و Smooth-scroll با تنظیم مستقیم scrollLeft تداخل می‌کنند
            isDragging
              ? 'cursor-grabbing snap-none scroll-auto'
              : 'cursor-grab snap-x snap-mandatory scroll-smooth',
          )}
        >
          {slides.map(({ image, copy }, index) => (
            <div
              key={`${copy}-${image.src}`}
              data-gallery-card
              // کپی‌های اول/سوم فقط برای حلقه‌اند؛ خواننده‌ی صفحه فقط کپی وسط (اصلی) را می‌خواند
              aria-hidden={isLoop && copy !== 1 ? true : undefined}
              className="bg-surface-mist relative h-[calc(100svh-4rem)] min-h-[360px] w-[70vw] shrink-0 snap-center overflow-hidden sm:w-[64vw]"
            >
              <Image
                src={image.src}
                alt={image.alt[locale]}
                fill
                draggable={false}
                sizes="(min-width: 640px) 64vw, 70vw"
                // تصاویر غیرفعال (Peek دو طرف) مثل رفرنس سیاه‌وسفید و کم‌نور می‌شوند تا تصویر
                // فعال برجسته باشد و فلش‌های سفید روی آن‌ها خوانا بماند.
                className={cn(
                  'duration-slow object-cover transition-[filter]',
                  index !== slideIndex && 'brightness-50 grayscale',
                )}
              />
            </div>
          ))}
        </div>

        {isLoop ? (
          <>
            {/* کارت فعال همیشه وسط است (Snap مرکزی)؛ فلش‌ها مثل رفرنس روی تصویرِ همسایه (Peek)
                می‌نشینند، دقیقاً وسط نوار دیده‌شده‌ی آن: از لبه‌ی صفحه تا لبه‌ی کارت فعال
                (پدینگ ۱۵vw / ۱۸vw منهای gap ۶px). */}
            <button
              type="button"
              aria-label={t('previous')}
              onClick={() => goBy(-1)}
              className={cn(
                arrowClass,
                'left-[calc((15vw-0.375rem)/2)] -translate-x-1/2 sm:left-[calc((18vw-0.375rem)/2)]',
              )}
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
            <button
              type="button"
              aria-label={t('next')}
              onClick={() => goBy(1)}
              className={cn(
                arrowClass,
                'right-[calc((15vw-0.375rem)/2)] translate-x-1/2 sm:right-[calc((18vw-0.375rem)/2)]',
              )}
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
          </>
        ) : null}
      </div>

      {isLoop ? (
        <div className="flex items-center justify-center gap-12">
          <button
            type="button"
            aria-label={t('previous')}
            onClick={() => goBy(-1)}
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
                onClick={() => goToImage(index)}
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
            onClick={() => goBy(1)}
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
