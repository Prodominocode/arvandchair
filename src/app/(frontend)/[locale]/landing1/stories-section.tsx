'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check, Star } from 'lucide-react'
import gsap from 'gsap'

import type { AppLocale } from '@/i18n/routing'
import type { Testimonial } from '@/lib/mock-data/testimonials'
import { SCROLL_DATA_ATTR } from '@/lib/motion/scroll-tokens'

type Texts = { title: string; subtitle: string; trusted: string; prev: string; next: string }
type Props = { testimonials: Testimonial[]; locale: AppLocale; texts: Texts }

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * کاروسل نظرات مشتریان — به‌جای Stack سه‌عکسی رفرنس (که به عکاسی واقعی و متفاوت هر مشتری
 * نیاز دارد)، یک کارت Spotlight با آواتار/امتیاز/نقل‌قول واقعی هر مشتری (lib/mock-data/testimonials)
 * و همان جابه‌جایی نرم متن هنگام رفتن به روایت بعدی/قبلی رفرنس را نگه می‌دارد — چون داده‌ی پروژه
 * برای همه‌ی مشتریان یک آیکون Placeholder یکسان دارد، نه عکس شخصی متفاوت.
 */
export function StoriesSection({ testimonials, locale, texts }: Props) {
  const [index, setIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const animatingRef = useRef(false)
  const N = testimonials.length

  function go(nextIndex: number, direction: 1 | -1) {
    if (animatingRef.current || !contentRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setIndex(nextIndex)
      return
    }

    animatingRef.current = true
    gsap.to(contentRef.current, {
      autoAlpha: 0,
      y: direction * -8,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setIndex(nextIndex)
        gsap.fromTo(
          contentRef.current,
          { autoAlpha: 0, y: direction * 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              animatingRef.current = false
            },
          },
        )
      },
    })
  }

  if (N === 0) return null
  const item = testimonials[index]!

  return (
    <section id="stories" className="py-section-y-lg" {...{ [SCROLL_DATA_ATTR]: 'reveal' }}>
      <div className="px-container-x mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-8">
          <h2 className="text-arvand-ink max-w-[14ch] text-3xl leading-tight font-bold text-balance md:text-4xl">
            {texts.title}
          </h2>
          <p className="text-muted-foreground max-w-[34ch] text-sm md:pt-2">{texts.subtitle}</p>
        </div>

        <div className="bg-card grid gap-8 rounded-2xl border p-8 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center md:p-12">
          <div className="border-border bg-surface-mist relative size-20 shrink-0 overflow-hidden rounded-full border md:size-24">
            <Image src={item.avatar.src} alt="" fill className="object-cover p-3" />
          </div>

          <div ref={contentRef}>
            <span className="text-arvand-ink mb-3 inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
              <Check className="size-3.5" aria-hidden="true" />
              {texts.trusted}
            </span>
            <blockquote className="text-arvand-ink text-xl leading-snug font-semibold text-balance md:text-2xl">
              &ldquo;{item.quote[locale]}&rdquo;
            </blockquote>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < item.rating
                        ? 'fill-arvand-gold text-arvand-gold size-4'
                        : 'text-muted-foreground size-4'
                    }
                  />
                ))}
              </div>
              <span className="text-foreground text-sm font-semibold">
                {item.authorName[locale]}
              </span>
              <span className="text-muted-foreground text-xs">— {item.authorCompany[locale]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={texts.prev}
                onClick={() => go((index - 1 + N) % N, -1)}
                className="border-border hover:bg-accent flex size-11 items-center justify-center rounded-full border transition-colors"
              >
                <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={texts.next}
                onClick={() => go((index + 1) % N, 1)}
                className="border-border hover:bg-accent flex size-11 items-center justify-center rounded-full border transition-colors"
              >
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </button>
            </div>
            <span className="text-muted-foreground font-mono text-xs">
              {pad(index + 1)} / {pad(N)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
