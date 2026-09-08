'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

export const SHOWCASE_LEFT_IMAGES = [
  '/images/landing1/product_slide01_pc.webp',
  '/images/landing1/product_slide02_pc.webp',
  '/images/landing1/product_slide03_pc.webp',
  '/images/landing1/product_slide04_pc.webp',
]

export const SHOWCASE_RIGHT_IMAGES = [
  '/images/landing1/product_01_03_pc.webp',
  '/images/landing1/product_02_03_pc.webp',
  '/images/landing1/product_03_03_pc.webp',
  '/images/landing1/product_04_03_pc.webp',
]

// قرارداد اسکرول‌بیس این سکشن، برخلاف بقیه‌ی صفحه، الگوی `pin` توکن‌های
// src/lib/motion/scroll-tokens.ts نیست — یک Pin+Snap+Handoff دستی و تک‌منظوره است (طبق تصمیم
// «دقیقاً مثل رفرنس»)، چون هندسه‌ی آن (اسنپ بین N فریم، Handoff دستی روی wheel) با پیش‌فرض
// ساده‌ی SCROLL_TRIGGER.pin سازگار نیست؛ اعداد پایین مستقیماً از ref/html/app.js برداشته شده‌اند.
const VH_PER_FRAME = 175
const SCRUB_SMOOTHNESS = 0.5
const SNAP_DELAY = 0.05
const HANDOFF_DURATION = 0.9
const REST_DRIFT = 10
const FEATHER_PX = 8
const DIM_MAX = 0.3

export type ShowcaseProduct = { id: string; title: string; description: string; href: string }

type Props = { products: ShowcaseProduct[]; eyebrow: string; linkLabel: string; locale: AppLocale }

/**
 * ویترین محصولات با Pin+Snap — سکشن این سکشن روی اسکرول پین می‌شود و بین N فریم (محصول) روی
 * دو صحنه (چپ: تصویر اتمسفریک، راست: برش تمیز محصول + کارت اطلاعات) Snap می‌کند، بعد با یک
 * Handoff نرم به سکشن بعدی تحویل می‌دهد — پیاده‌سازی از app.js رفرنس پورت شده به React/Refs.
 * فقط دسکتاپ (lg+)؛ موبایل در Landing1Content یک Grid ساده و بدون Scroll-jacking می‌بیند
 * (هم برای سادگی تعامل لمسی، هم چون CSS رفرنس در موبایل ۳ از ۴ محصول را کامل مخفی می‌کرد).
 *
 * چیدمان دو ستون (صحنه‌ی چپ/راست) عمداً `dir="ltr"` دارد و در fa/ar جابه‌جا نمی‌شود — طبق
 * بازخورد، فقط خودِ متن باید راست‌به‌چپ بشود، نه ترتیب فیزیکی دو صحنه؛ متن پنل هر محصول با
 * `dir` مطابق زبان صفحه رندر می‌شود تا شکل/چینش نوشتار درست بماند.
 */
export function ShowcaseSection({ products, eyebrow, linkLabel, locale }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const leftFramesRef = useRef<(HTMLDivElement | null)[]>([])
  const rightFramesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

    const track = trackRef.current
    const pinEl = pinRef.current
    if (!track || !pinEl || products.length === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const leftFrames = leftFramesRef.current.filter((el): el is HTMLDivElement => Boolean(el))
    const rightFrames = rightFramesRef.current.filter((el): el is HTMLDivElement => Boolean(el))
    const N = products.length
    const TRANSITIONS = Math.max(N - 1, 1)

    let mainST: ScrollTrigger | null = null
    let sectionTransitioning = false
    let handoffArmed = false

    function layout(progress: number) {
      const activeFloat = progress * TRANSITIONS

      leftFrames.forEach((frame, i) => {
        const offset = activeFloat - i
        const t = offset <= 0 ? gsap.utils.clamp(-1, 0, offset) : 0
        const amount = offset <= 0 ? gsap.utils.clamp(0, 100, -offset * 100) : 0
        gsap.set(frame, { xPercent: amount })

        const img = frame.querySelector<HTMLImageElement>('.frame__img')
        if (img) {
          const featherPx = FEATHER_PX * gsap.utils.clamp(0, 1, -t / 0.1)
          const maskCss =
            featherPx > 0.5
              ? `linear-gradient(to right, transparent 0px, #000 ${featherPx.toFixed(0)}px)`
              : 'none'
          img.style.maskImage = maskCss
          img.style.webkitMaskImage = maskCss
        }
      })

      rightFrames.forEach((frame, i) => {
        const offset = activeFloat - i
        const hasNext = i < N - 1
        const amount =
          offset <= 0
            ? gsap.utils.clamp(0, 100, -offset * 100)
            : hasNext
              ? -REST_DRIFT * gsap.utils.clamp(0, 1, offset)
              : 0
        gsap.set(frame, { yPercent: amount })

        const dim = frame.querySelector<HTMLElement>('.frame__dim')
        if (dim) {
          dim.style.opacity = String(
            hasNext && offset > 0 ? DIM_MAX * gsap.utils.clamp(0, 1, offset) : 0,
          )
        }
      })
    }

    layout(0)

    function runHandoff(triggerEnd: number) {
      if (reduceMotion || sectionTransitioning) return
      sectionTransitioning = true
      gsap.to(window, {
        scrollTo: { y: triggerEnd + window.innerHeight, autoKill: true },
        duration: HANDOFF_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          sectionTransitioning = false
        },
      })
    }

    function onHandoffWheel(e: WheelEvent) {
      if (e.deltaY <= 0 || !mainST) return
      e.preventDefault()
      disarmHandoff()
      runHandoff(mainST.end)
    }

    function armHandoff() {
      if (handoffArmed) return
      handoffArmed = true
      window.addEventListener('wheel', onHandoffWheel, { passive: false })
    }

    function disarmHandoff() {
      if (!handoffArmed) return
      handoffArmed = false
      window.removeEventListener('wheel', onHandoffWheel)
    }

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      track.style.height = `${VH_PER_FRAME * TRANSITIONS}vh`

      mainST = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinEl,
        pinSpacing: false,
        scrub: reduceMotion ? false : SCRUB_SMOOTHNESS,
        snap: reduceMotion
          ? undefined
          : {
              snapTo: gsap.utils.snap(1 / TRANSITIONS),
              duration: 0.35,
              delay: SNAP_DELAY,
              ease: 'power1.inOut',
            },
        onUpdate: (self) => {
          layout(self.progress)
          if (self.progress >= 1) armHandoff()
          else disarmHandoff()
        },
      })

      return () => {
        disarmHandoff()
        mainST?.kill()
        mainST = null
        track.style.height = ''
      }
    })

    return () => {
      mm.revert()
    }
  }, [products])

  if (products.length === 0) return null

  return (
    <section id="showcase" className="bg-surface-mist hidden lg:block" aria-label={eyebrow}>
      <div ref={trackRef} className="relative">
        <div ref={pinRef} className="relative flex h-svh flex-col overflow-hidden">
          <div dir="ltr" className="relative flex flex-1">
            {/* صحنه‌ی چپ — تصویر اتمسفریک محصول در استودیو */}
            <div className="border-border relative h-full w-1/2 overflow-hidden border-e">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  ref={(el) => {
                    leftFramesRef.current[i] = el
                  }}
                  className="absolute inset-0"
                  data-index={i}
                >
                  <Image
                    src={SHOWCASE_LEFT_IMAGES[i % SHOWCASE_LEFT_IMAGES.length]!}
                    alt=""
                    fill
                    sizes="50vw"
                    className="frame__img object-cover"
                    style={{ objectPosition: 'center 78%' }}
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {/* صحنه‌ی راست — برش تمیز محصول + کارت اطلاعات */}
            <div className="relative h-full w-1/2 overflow-hidden">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  ref={(el) => {
                    rightFramesRef.current[i] = el
                  }}
                  className="bg-surface-mist absolute inset-0 flex flex-col"
                  data-index={i}
                >
                  <div className="relative min-h-0 flex-1 p-8 md:p-12">
                    <Image
                      src={SHOWCASE_RIGHT_IMAGES[i % SHOWCASE_RIGHT_IMAGES.length]!}
                      alt={product.title}
                      fill
                      sizes="40vw"
                      className="object-contain"
                      priority={i === 0}
                    />
                  </div>
                  <div
                    dir={locale === 'en' ? 'ltr' : 'rtl'}
                    className="relative z-[3] flex flex-col gap-2 px-8 pb-8 md:px-11 md:pb-9"
                  >
                    <span className="text-arvand-gold font-mono text-xs tracking-widest uppercase">
                      {eyebrow}
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-arvand-ink text-2xl font-bold text-balance md:text-3xl">
                          {product.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 max-w-[38ch] text-sm">
                          {product.description}
                        </p>
                      </div>
                      <Link
                        href={product.href}
                        className="border-border hover:bg-background inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors"
                      >
                        {linkLabel}
                        <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                  <div className="frame__dim pointer-events-none absolute inset-0 z-[6] bg-black opacity-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
