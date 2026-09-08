'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import gsap from 'gsap'

import type { AppLocale } from '@/i18n/routing'
import type { Testimonial } from '@/lib/mock-data/testimonials'
import { SCROLL_DATA_ATTR } from '@/lib/motion/scroll-tokens'

type Texts = { title: string; subtitle: string; trusted: string; prev: string; next: string }
type Props = { testimonials: Testimonial[]; locale: AppLocale; texts: Texts }

type Slot = {
  left: string
  top: string
  width: string
  height: string
  radius: string
  z: number
  opacity: number
}

// هندسه‌ی پایه از ref/html/app.js (SLOTS) — به‌صورت درصدی از باکس .stories-visual. left هر پنج
// اسلات با +5.7% نسبت به رفرنس شیفت داده شده: باکس بصریِ حاصل از سه اسلات استراحت (top/center/
// bottom) در رفرنس بین -4% تا 92.6% است (مرکز ≈44.3%، نه 50%) و همین Skew چپ باعث می‌شد استک
// در باکس/صفحه وسط ننشیند؛ +5.7% این باکس را دقیقاً حول 50% مرکز می‌کند، بدون تغییر عرض/فاصله‌ی
// نسبی اسلات‌ها از هم.
const SLOTS: Record<'center' | 'top' | 'bottom' | 'offBelow' | 'offAbove', Slot> = {
  center: {
    left: '14.4%',
    top: '18.3%',
    width: '65.2%',
    height: '63.3%',
    radius: '28px',
    z: 2,
    opacity: 1,
  },
  top: {
    left: '1.7%',
    top: '0%',
    width: '28.3%',
    height: '21.7%',
    radius: '24px',
    z: 1,
    opacity: 1,
  },
  bottom: {
    left: '65.7%',
    top: '75%',
    width: '32.6%',
    height: '25%',
    radius: '24px',
    z: 4,
    opacity: 1,
  },
  offBelow: {
    left: '93.7%',
    top: '113%',
    width: '32.6%',
    height: '25%',
    radius: '24px',
    z: 4,
    opacity: 0,
  },
  offAbove: {
    left: '-28.3%',
    top: '-24%',
    width: '28.3%',
    height: '21.7%',
    radius: '24px',
    z: 1,
    opacity: 0,
  },
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * کاروسل نظرات مشتریان — پورت دقیق ساختار/موشن Stack سه‌عکسی رفرنس (ref/html/app.js:
 * SLOTS/applySlot/goNext/goPrev/renderText؛ ۳ عکس هم‌زمان روی صفحه با نقش top/center/bottom،
 * با هر Next/Prev سه‌تایی می‌چرخند و نقش‌ها/موقعیت‌ها با GSAP جابه‌جا می‌شوند).
 *
 * کاملاً Imperative است — نه از طریق React state — دقیقاً مثل رفرنس، چون موقعیت/اندازه/z-index
 * هر عکس مستقیم با gsap.to/gsap.set روی DOM ست می‌شود، نه با Re-render. تصویر آواتار هر سه اسلات
 * از ابتدا ثابت است (داده‌ی lib/mock-data/testimonials برای همه‌ی مشتریان یک آیکون Placeholder
 * یکسان دارد)، پس برخلاف رفرنس نیازی به عوض‌کردن src هنگام چرخش نیست — فقط موقعیت/متن می‌چرخد.
 */
export function StoriesSection({ testimonials, locale, texts }: Props) {
  const N = testimonials.length
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const roleRef = useRef<HTMLSpanElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (N === 0) return
    const photoEls = photoRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (photoEls.length < 3) return

    let elTop = photoEls[0]!
    let elCenter = photoEls[1]!
    let elBottom = photoEls[2]!
    let centerIndex = 0
    let animating = false

    function applySlot(el: HTMLDivElement, spec: Slot, animate: boolean) {
      const vars = {
        left: spec.left,
        top: spec.top,
        width: spec.width,
        height: spec.height,
        borderRadius: spec.radius,
        zIndex: spec.z,
        opacity: spec.opacity,
      }
      if (animate) gsap.to(el, { duration: 0.75, ease: 'power3.inOut', ...vars })
      else gsap.set(el, vars)
    }

    function renderText(item: Testimonial, animate: boolean) {
      const quoteEl = quoteRef.current
      const nameEl = nameRef.current
      const roleEl = roleRef.current
      const countEl = countRef.current
      if (!quoteEl || !nameEl || !roleEl || !countEl) return
      const count = `${pad(centerIndex + 1)} / ${pad(N)}`

      const apply = () => {
        quoteEl.textContent = `“${item.quote[locale]}”`
        nameEl.textContent = item.authorName[locale]
        roleEl.textContent = item.authorCompany[locale]
        countEl.textContent = count
      }

      if (!animate) {
        apply()
        return
      }
      gsap.to([quoteEl, nameEl, roleEl], {
        autoAlpha: 0,
        y: 8,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          apply()
          gsap.to([quoteEl, nameEl, roleEl], {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          })
        },
      })
    }

    function setLock(locked: boolean) {
      animating = locked
      if (prevBtnRef.current) prevBtnRef.current.disabled = locked
      if (nextBtnRef.current) nextBtnRef.current.disabled = locked
    }

    function goNext() {
      if (animating) return
      setLock(true)
      centerIndex = (centerIndex + 1) % N

      const incoming = elTop
      applySlot(incoming, SLOTS.offBelow, false)
      applySlot(elCenter, SLOTS.top, true)
      applySlot(elBottom, SLOTS.center, true)
      applySlot(incoming, SLOTS.bottom, true)

      elTop = elCenter
      elCenter = elBottom
      elBottom = incoming

      renderText(testimonials[centerIndex]!, true)
      gsap.delayedCall(0.75, () => setLock(false))
    }

    function goPrev() {
      if (animating) return
      setLock(true)
      centerIndex = (centerIndex - 1 + N) % N

      const incoming = elBottom
      applySlot(incoming, SLOTS.offAbove, false)
      applySlot(elCenter, SLOTS.bottom, true)
      applySlot(elTop, SLOTS.center, true)
      applySlot(incoming, SLOTS.top, true)

      elBottom = elCenter
      elCenter = elTop
      elTop = incoming

      renderText(testimonials[centerIndex]!, true)
      gsap.delayedCall(0.75, () => setLock(false))
    }

    // نقاشی اولیه — بدون انیمیشن
    applySlot(elTop, SLOTS.top, false)
    applySlot(elCenter, SLOTS.center, false)
    applySlot(elBottom, SLOTS.bottom, false)
    renderText(testimonials[centerIndex]!, false)

    const nextBtn = nextBtnRef.current
    const prevBtn = prevBtnRef.current
    nextBtn?.addEventListener('click', goNext)
    prevBtn?.addEventListener('click', goPrev)

    return () => {
      nextBtn?.removeEventListener('click', goNext)
      prevBtn?.removeEventListener('click', goPrev)
    }
  }, [testimonials, locale, N])

  if (N === 0) return null
  const first = testimonials[0]!

  return (
    <section
      id="stories"
      data-header-tone="light"
      className="bg-surface-white py-section-y-lg"
      {...{ [SCROLL_DATA_ATTR]: 'reveal' }}
    >
      <div className="px-container-x mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-8 md:mb-4">
          <h2 className="text-arvand-ink max-w-[14ch] text-3xl leading-tight font-bold text-balance md:text-4xl">
            {texts.title}
          </h2>
          <p className="text-muted-foreground max-w-[34ch] text-sm md:pt-2">{texts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          {/* متن — اسلات اول در ترتیب DOM، طبق dir صفحه خودش را می‌چیند */}
          <div className="order-2 flex max-w-[400px] flex-col items-center gap-5 justify-self-center text-center md:order-1 md:items-start md:justify-self-end md:text-start">
            <span className="text-arvand-ink inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
              <Check className="size-3.5" aria-hidden="true" />
              {texts.trusted}
            </span>
            <blockquote
              ref={quoteRef}
              className="text-arvand-ink text-xl leading-snug font-semibold text-balance md:text-2xl"
            >
              &ldquo;{first.quote[locale]}&rdquo;
            </blockquote>
            <div className="flex flex-col gap-0.5">
              <span ref={nameRef} className="text-foreground text-sm font-bold">
                {first.authorName[locale]}
              </span>
              <span ref={roleRef} className="text-muted-foreground text-xs">
                {first.authorCompany[locale]}
              </span>
            </div>
          </div>

          {/* عکس‌ها — Stack سه‌تایی، هندسه‌ی مطلق طبق SLOTS، بدون تغییر روی باکس داخلی (relative).
              باکس بیرونی فقط برای Clip موبایل اضافه شده: اسلات‌های گذرا (offAbove/offBelow) هنگام
              حرکت prev/next تا -34%/-24% از باکس بیرون می‌زنند و چون این Stack روی موبایل بلافاصله
              زیر هدر Fixed/شفاف قرار می‌گیرد، بدون Clip چند صدم ثانیه از پشت هدر پیدا می‌شوند و
              چیدمان صفحه را به‌هم می‌ریزند. بافر padding/-margin (نامتقارن: کم در بالا تا به هدر
              نرسد، زیاد در پایین برای سایه‌ی shadow-xl و کم در چپ/راست برای Peek لبه‌ی SLOTS.top/
              bottom) طوری انتخاب شده که چیدمان استراحت (Peek چپِ عکس بالا، سایه‌ی عکس پایین) هرگز
              Clip نشود ولی نشتِ حین انیمیشن مهار شود؛ margin منفی هم‌اندازه‌ی padding یعنی این باکس
              فضای گرید را بیشتر از قبل اشغال نمی‌کند. دسکتاپ فاصله‌ی کافی دارد و visible می‌ماند تا
              دقیقاً مطابق رفرنس بماند. */}
          <div className="order-1 -mx-6 -mt-8 -mb-20 justify-self-center overflow-hidden px-6 pt-8 pb-20 md:order-2 md:m-0 md:overflow-visible md:p-0">
            <div
              className="relative h-auto w-[min(380px,86vw)] md:h-[min(71.5vh,660px)] md:w-auto"
              style={{ aspectRatio: '460 / 600' }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  ref={(el) => {
                    photoRefs.current[i] = el
                  }}
                  className="border-background bg-surface-white absolute overflow-hidden border-4 shadow-xl"
                >
                  <Image
                    src="/images/mock/icon-avatar.svg"
                    alt=""
                    fill
                    aria-hidden="true"
                    className="object-contain p-6"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ناوبری */}
          <div className="order-3 flex flex-col items-center gap-3 justify-self-center md:items-start md:justify-self-start">
            <div className="flex gap-2">
              <button
                ref={prevBtnRef}
                type="button"
                aria-label={texts.prev}
                className="border-border bg-background hover:bg-accent flex size-12 items-center justify-center rounded-full border shadow-md transition-colors disabled:opacity-40"
              >
                <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <button
                ref={nextBtnRef}
                type="button"
                aria-label={texts.next}
                className="border-border bg-background hover:bg-accent flex size-12 items-center justify-center rounded-full border shadow-md transition-colors disabled:opacity-40"
              >
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </button>
            </div>
            {/* dir="ltr" عمدی: شمارنده‌ی «۰۱ / ۰۵» یک رشته‌ی خنثی از ارقام لاتین است — بدون این،
                الگوریتم Bidi داخل والد RTL جای دو عدد را با هم عوض می‌کند («۰۵ / ۰۱»). */}
            <span ref={countRef} dir="ltr" className="text-muted-foreground text-xs">
              {pad(1)} / {pad(N)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
