'use client'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'

import { Link } from '@/i18n/navigation'
import type { ProductStoryImage } from '@/lib/mock-data/product-stories'
import { SCROLL_DATA_ATTR } from '@/lib/motion/scroll-tokens'

/** استوری آماده‌ی نمایش — همه‌ی متن‌ها از قبل به زبان جاری حل شده‌اند (نگاشت در page.tsx). */
export type StoryItem = {
  id: string
  productName: string
  title: string
  text: string
  /** مسیر بدون پیشوند زبان — `Link` پیشوند را خودش اضافه می‌کند. */
  href: string
  image: ProductStoryImage
}

type Texts = {
  title: string
  subtitle: string
  badge: string
  linkLabel: string
  prev: string
  next: string
}
type Props = { stories: StoryItem[]; texts: Texts }

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

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

/**
 * کاروسل «داستان محصول» — ساختار/موشن Stack سه‌عکسی رفرنس (ref/html/app.js: SLOTS/applySlot/
 * goNext/goPrev/renderText؛ ۳ عکس هم‌زمان روی صفحه با نقش top/center/bottom و جابه‌جایی نقش‌ها با
 * GSAP).
 *
 * رفرنس با ۳ المان بازچرخانی‌شده کار می‌کرد و `src` را هنگام چرخش عوض می‌کرد. اینجا به‌ازای هر
 * استوری یک قاب مستقل با تصویر واقعی خودش رندر می‌شود (N قاب): موقعیت/اندازه/z-index هر قاب
 * همچنان Imperative و مستقیم روی DOM با gsap ست می‌شود (نه Re-render)، و قاب‌های خارج از سه
 * اسلات با opacity صفر بیرون از باکس نگه داشته می‌شوند. فقط متن (عنوان/توضیح/محصول) با state
 * رندر می‌شود تا لینک محصول از `Link` سمت‌کلاینتِ next-intl بگذرد.
 */
export function StoriesSection({ stories, texts }: Props) {
  const N = stories.length
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const copyRef = useRef<HTMLDivElement>(null)
  const prevBtnRef = useRef<HTMLButtonElement>(null)
  const nextBtnRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (N < 3) return
    const frames = frameRefs.current.slice(0, N)
    if (frames.length !== N || frames.some((el) => !el)) return
    const els = frames as HTMLDivElement[]
    const copyEl = copyRef.current

    let center = 0
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

    /** اسلات استراحت هر قاب نسبت به قاب مرکزی فعلی؛ بقیه بیرون از باکس و نامرئی‌اند. */
    function slotFor(index: number): Slot {
      const rel = mod(index - center, N)
      if (rel === 0) return SLOTS.center
      if (rel === 1) return SLOTS.bottom
      if (rel === N - 1) return SLOTS.top
      return SLOTS.offBelow
    }

    function renderText() {
      if (!copyEl) {
        setActive(center)
        return
      }
      gsap.to(copyEl, {
        autoAlpha: 0,
        y: 8,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          flushSync(() => setActive(center))
          gsap.to(copyEl, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' })
        },
      })
    }

    function setLock(locked: boolean) {
      animating = locked
      if (prevBtnRef.current) prevBtnRef.current.disabled = locked
      if (nextBtnRef.current) nextBtnRef.current.disabled = locked
    }

    /** یک گام چرخش: قاب خروجی از سمت مقابل بیرون می‌رود و قاب ورودی از بیرون باکس می‌آید.
     * با N=3 قاب خروجی و ورودی یکی است (همان بازچرخانی رفرنس): بدون انیمیشن ناپدید می‌شود
     * و از سمت مقابل وارد می‌شود. */
    function step(dir: 1 | -1) {
      if (animating) return
      setLock(true)

      const leaving = mod(center - dir, N)
      const incoming = mod(center + 2 * dir, N)
      center = mod(center + dir, N)

      applySlot(els[leaving]!, dir === 1 ? SLOTS.offAbove : SLOTS.offBelow, leaving !== incoming)
      applySlot(els[incoming]!, dir === 1 ? SLOTS.offBelow : SLOTS.offAbove, false)

      applySlot(els[mod(center - 1, N)]!, SLOTS.top, true)
      applySlot(els[center]!, SLOTS.center, true)
      applySlot(els[mod(center + 1, N)]!, SLOTS.bottom, true)

      renderText()
      gsap.delayedCall(0.75, () => setLock(false))
    }

    const goNext = () => step(1)
    const goPrev = () => step(-1)

    // نقاشی اولیه — بدون انیمیشن
    els.forEach((el, i) => applySlot(el, slotFor(i), false))

    const nextBtn = nextBtnRef.current
    const prevBtn = prevBtnRef.current
    nextBtn?.addEventListener('click', goNext)
    prevBtn?.addEventListener('click', goPrev)

    return () => {
      nextBtn?.removeEventListener('click', goNext)
      prevBtn?.removeEventListener('click', goPrev)
      gsap.killTweensOf(copyEl)
      gsap.killTweensOf(els)
    }
  }, [N])

  if (N < 3) return null
  const current = stories[active]!

  return (
    <section
      id="stories"
      data-header-tone="light"
      className="bg-surface-mist py-section-y-lg"
      {...{ [SCROLL_DATA_ATTR]: 'reveal' }}
    >
      <div className="px-container-x max-w-container mx-auto">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-8 md:mb-4">
          <h2 className="text-arvand-ink max-w-[14ch] text-3xl leading-tight font-bold text-balance md:text-4xl">
            {texts.title}
          </h2>
          <p className="text-muted-foreground max-w-[34ch] text-sm md:pt-2">{texts.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          {/* متن — اسلات اول در ترتیب DOM، طبق dir صفحه خودش را می‌چیند */}
          <div className="order-2 flex max-w-[400px] flex-col items-center gap-5 justify-self-center text-center md:order-1 md:items-start md:justify-self-end md:text-start">
            <span className="text-arvand-gold inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              {texts.badge}
            </span>
            <div
              ref={copyRef}
              aria-live="polite"
              className="flex flex-col items-center gap-5 md:items-start"
            >
              <h3 className="text-arvand-ink text-xl leading-snug font-semibold text-balance md:text-2xl">
                {current.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{current.text}</p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
                <span className="text-foreground text-sm font-bold">{current.productName}</span>
                <Link
                  href={current.href}
                  className="border-border hover:bg-background inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
                >
                  {texts.linkLabel}
                  <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </div>
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
              {stories.map((story, i) => (
                <div
                  key={story.id}
                  ref={(el) => {
                    frameRefs.current[i] = el
                  }}
                  className="border-background absolute overflow-hidden border-4 bg-white shadow-xl"
                >
                  <Image
                    src={story.image.src}
                    alt=""
                    fill
                    aria-hidden="true"
                    sizes="(min-width: 768px) 340px, 60vw"
                    className={
                      story.image.fit === 'contain' ? 'object-contain p-3' : 'object-cover'
                    }
                    style={
                      story.image.fit === 'cover' && story.image.position
                        ? { objectPosition: story.image.position }
                        : undefined
                    }
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
            <span dir="ltr" className="text-muted-foreground text-xs">
              {pad(active + 1)} / {pad(N)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
