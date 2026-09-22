'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  GSAP_DURATION,
  GSAP_EASE,
  SCROLL_DATA_ATTR,
  SCROLL_TRIGGER,
} from '@/lib/motion/scroll-tokens'

type Milestone = { year: string; text: string }
type ValueItem = { title: string; text: string }

/**
 * روایت اسکرول‌بیس درباره‌ی ما — طبق docs/00-tech-stack.md بخش ۲.۱ (GSAP ابزار غالب روایت
 * اسکرول) و docs/05-pages-build-order.md بسته‌ی ۱ #۳. الگوی `reveal` از
 * `lib/motion/scroll-tokens.ts` استفاده شده (بدون Pin — این صفحه نیاز به پین‌کردن سکشن ندارد،
 * فقط ورود تدریجی هر بخش هنگام اسکرول).
 */
export function AboutContent() {
  const t = useTranslations('About')
  const rootRef = useRef<HTMLDivElement>(null)

  const milestones = t.raw('history.milestones') as Milestone[]
  const values = t.raw('values.items') as ValueItem[]
  const revealProps = { [SCROLL_DATA_ATTR]: 'reveal' } as const

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const sections = gsap.utils.toArray<HTMLElement>(`[${SCROLL_DATA_ATTR}="reveal"]`, root)

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: GSAP_DURATION.slow,
            ease: GSAP_EASE.enter,
            scrollTrigger: { trigger: section, ...SCROLL_TRIGGER.reveal },
          },
        )
      })

      return () => {
        sections.forEach((section) => gsap.set(section, { clearProps: 'all' }))
      }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const sections = gsap.utils.toArray<HTMLElement>(`[${SCROLL_DATA_ATTR}="reveal"]`, root)
      gsap.set(sections, { autoAlpha: 1, y: 0 })
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className="px-container-x py-section-y-lg mx-auto max-w-3xl text-center">
        <p className="text-arvand-gold text-sm font-semibold tracking-wide uppercase">
          {t('hero.eyebrow')}
        </p>
        <h1 className="text-arvand-ink mt-3 text-4xl font-bold text-balance lg:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="text-muted-foreground mt-5 text-lg">{t('hero.intro')}</p>
      </section>

      {/* مسیر ما — Timeline */}
      <section {...revealProps} className="px-container-x py-section-y-md mx-auto max-w-4xl">
        <h2 className="text-arvand-ink mb-8 text-center text-3xl font-semibold">
          {t('history.title')}
        </h2>
        <ol className="border-border grid gap-8 border-s-2 ps-6 sm:grid-cols-2 sm:gap-x-8 sm:border-s-0 sm:ps-0">
          {milestones.map((milestone) => (
            <li key={milestone.year} className="sm:border-border sm:border-s-2 sm:ps-6">
              <p className="text-arvand-gold text-2xl font-bold">{milestone.year}</p>
              <p className="text-foreground mt-1">{milestone.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ارزش‌های ما */}
      <section {...revealProps} className="bg-surface-mist/60 py-section-y-md">
        <div className="px-container-x max-w-container mx-auto">
          <h2 className="text-arvand-ink mb-8 text-center text-3xl font-semibold">
            {t('values.title')}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="h-full">
                <CardContent className="p-6">
                  <p className="text-foreground text-lg font-semibold">{value.title}</p>
                  <p className="text-muted-foreground mt-2 text-sm">{value.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* تیم ما */}
      <section
        {...revealProps}
        className="px-container-x py-section-y-md mx-auto max-w-3xl text-center"
      >
        <h2 className="text-arvand-ink mb-4 text-3xl font-semibold">{t('team.title')}</h2>
        <p className="text-muted-foreground text-lg">{t('team.text')}</p>
      </section>

      {/* CTA پایانی */}
      <section
        {...revealProps}
        className="px-container-x py-section-y-lg mx-auto max-w-3xl text-center"
      >
        <h2 className="text-arvand-ink text-3xl font-semibold">{t('closing.title')}</h2>
        <p className="text-muted-foreground mt-3 text-lg">{t('closing.text')}</p>
        <Button size="lg" className="mt-6" asChild>
          <Link href="/contact">{t('closing.cta')}</Link>
        </Button>
      </section>
    </div>
  )
}
