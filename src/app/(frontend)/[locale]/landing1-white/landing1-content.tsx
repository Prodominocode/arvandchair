'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { Testimonial } from '@/lib/mock-data/testimonials'
import {
  GSAP_DURATION,
  GSAP_EASE,
  SCROLL_DATA_ATTR,
  SCROLL_TRIGGER,
} from '@/lib/motion/scroll-tokens'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShowcaseSection, SHOWCASE_RIGHT_IMAGES, type ShowcaseProduct } from './showcase-section'
import { StoriesSection } from './stories-section'

type Props = {
  locale: AppLocale
  products: ShowcaseProduct[]
  testimonials: Testimonial[]
}

/** هر کلمه را در یک span مجزا برای Stagger می‌پیچد، اما خودِ حروف داخل هر کلمه دست‌نخورده
 * می‌ماند — برخلاف رفرنس که تک‌تک حروف را می‌پیچید (`splitChars` در app.js)، آن روش برای
 * فارسی/عربی نادرست است: اتصال حروف در اسکریپت فارسی/عربی به پیوستگی متن در یک گره وابسته
 * است، پس جدا کردن هر حرف در یک عنصر مستقل شکل اتصال حروف را می‌شکند و کلمه را نامفهوم
 * می‌کند. Stagger روی واحد کلمه هم افکت مشابهی می‌دهد بدون این مشکل. */
function splitWords(el: HTMLElement) {
  const words: HTMLElement[] = []
  const frag = document.createDocumentFragment()
  const text = el.textContent ?? ''
  text.split(' ').forEach((word, i, arr) => {
    const span = document.createElement('span')
    span.textContent = word
    span.style.display = 'inline-block'
    frag.appendChild(span)
    words.push(span)
    if (i < arr.length - 1) frag.appendChild(document.createTextNode(' '))
  })
  el.textContent = ''
  el.appendChild(frag)
  return words
}

export function Landing1Content({ locale, products, testimonials }: Props) {
  const t = useTranslations('Landing1')

  const rootRef = useRef<HTMLDivElement>(null)
  const heroBackdropRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroEyebrowRef = useRef<HTMLSpanElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null)
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const scrollLineRef = useRef<HTMLSpanElement>(null)
  const introMediaRef = useRef<HTMLDivElement>(null)
  const introTitleRef = useRef<HTMLHeadingElement>(null)
  const introBodyRef = useRef<HTMLDivElement>(null)
  const introCtaRef = useRef<HTMLDivElement>(null)
  const philoMediaRef = useRef<HTMLDivElement>(null)
  const catalogCardRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const root = rootRef.current
    if (!root) return

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const heroEls = [
        heroEyebrowRef.current,
        heroTitleRef.current,
        heroSubtitleRef.current,
        heroScrollRef.current,
      ].filter(Boolean)

      const heroTl = gsap.timeline({ defaults: { ease: GSAP_EASE.enter } })
      if (heroBackdropRef.current) {
        heroTl.fromTo(
          heroBackdropRef.current,
          { scale: 1.14 },
          { scale: 1, duration: 2.6, ease: 'power2.out' },
          0,
        )
      }
      if (heroEyebrowRef.current)
        heroTl.fromTo(
          heroEyebrowRef.current,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.35,
        )
      if (heroTitleRef.current)
        heroTl.fromTo(
          heroTitleRef.current,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 1.1 },
          0.5,
        )
      if (heroSubtitleRef.current)
        heroTl.fromTo(
          heroSubtitleRef.current,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          0.78,
        )
      if (heroScrollRef.current)
        heroTl.fromTo(heroScrollRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.1)

      if (heroBackdropRef.current) {
        gsap.to(heroBackdropRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, {
          autoAlpha: 0,
          y: -40,
          scale: 0.96,
          ease: 'none',
          scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        })
      }
      if (scrollLineRef.current) {
        gsap.fromTo(
          scrollLineRef.current,
          { yPercent: -100 },
          { yPercent: 100, duration: 1.3, ease: 'power1.inOut', repeat: -1, repeatDelay: 0.9 },
        )
      }

      // Intro reveal
      if (introTitleRef.current) {
        const words = splitWords(introTitleRef.current)
        gsap.set(words, { autoAlpha: 0, yPercent: 70 })
        const revealTargets = [introBodyRef.current, introCtaRef.current].filter(
          (el): el is HTMLDivElement => Boolean(el),
        )
        gsap.set(revealTargets.map((el) => el.firstElementChild).filter(Boolean), { yPercent: 110 })

        const introTl = gsap.timeline({ scrollTrigger: { trigger: '#intro', start: 'top 72%' } })
        if (introMediaRef.current) {
          introTl.to(
            introMediaRef.current,
            { clipPath: 'inset(0 0% 0 0)', duration: 1.3, ease: 'power4.inOut' },
            0,
          )
        }
        introTl.to(
          words,
          { autoAlpha: 1, yPercent: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
          0.2,
        )
        revealTargets.forEach((el, i) => {
          introTl.to(
            el.firstElementChild,
            { yPercent: 0, duration: 0.9, ease: 'power3.out' },
            0.5 + i * 0.12,
          )
        })
      }

      // Philosophy media reveal
      if (philoMediaRef.current) {
        gsap
          .timeline({ scrollTrigger: { trigger: '#philosophy', start: 'top 72%' } })
          .to(
            philoMediaRef.current,
            { clipPath: 'inset(0 0 0 0)', duration: 1.3, ease: 'power4.inOut' },
            0,
          )
      }

      // سکشن‌های ساده — همان الگوی reveal مشترک پروژه (About/…)
      const sections = gsap.utils.toArray<HTMLElement>(`[${SCROLL_DATA_ATTR}="reveal"]`, root)
      sections.forEach((section, i) => {
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: GSAP_DURATION.slow,
            ease: GSAP_EASE.enter,
            scrollTrigger: { trigger: section, ...SCROLL_TRIGGER.reveal },
            delay: (i % 3) * 0.08,
          },
        )
      })

      return () => {
        heroEls.forEach((el) => el && gsap.set(el, { clearProps: 'all' }))
        sections.forEach((section) => gsap.set(section, { clearProps: 'all' }))
      }
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (introMediaRef.current) gsap.set(introMediaRef.current, { clipPath: 'inset(0 0% 0 0)' })
      if (philoMediaRef.current) gsap.set(philoMediaRef.current, { clipPath: 'inset(0 0 0 0)' })
      const sections = gsap.utils.toArray<HTMLElement>(`[${SCROLL_DATA_ATTR}="reveal"]`, root)
      gsap.set(sections, { autoAlpha: 1, y: 0 })
    })

    return () => mm.revert()
  }, [])

  /** کارت catalog-cta باید نصف ارتفاع واقعیِ رندرشده‌اش روی فوتر (سراسری، خارج از این
   * درخت) اورلپ کند — عددی ثابت جواب نمی‌دهد چون ارتفاع کارت به عرض صفحه/طول متن بستگی
   * دارد. مطابق ref/html/app.js (syncCatalogCta): ارتفاع کارت اندازه‌گیری و نصفش به‌صورت
   * margin-bottom منفی روی خودِ کارت نوشته می‌شود (فوتر را از پایین بالا می‌کشد بدون آنکه
   * لبه‌ی بالای کارت جابه‌جا شود)، و همان مقدار به‌عنوان padding-top اضافه‌ی فوتر ست می‌شود
   * تا محتوای فوتر هیچ‌وقت زیر کارت شروع نشود. چون فوتر در layout.tsx مشترک است و بین
   * صفحات با ناوبری سمت کلاینت باقی می‌ماند، مقدار ست‌شده روی آن باید هنگام unmount پاک شود.
   */
  useLayoutEffect(() => {
    const card = catalogCardRef.current
    if (!card) return

    function syncCatalogOverlap() {
      if (!card) return
      const footer = document.querySelector('footer')
      const fraction = window.innerWidth <= 860 ? 0.34 : 0.5
      const overlap = Math.ceil(card.getBoundingClientRect().height * fraction)
      card.style.setProperty('--catalog-overlap', `${overlap}px`)
      footer?.style.setProperty('--footer-top-clear', `${overlap}px`)
    }

    syncCatalogOverlap()
    window.addEventListener('resize', syncCatalogOverlap)
    document.fonts?.ready.then(syncCatalogOverlap)

    const resizeObserver = new ResizeObserver(syncCatalogOverlap)
    resizeObserver.observe(card)

    return () => {
      window.removeEventListener('resize', syncCatalogOverlap)
      resizeObserver.disconnect()
      document.querySelector('footer')?.style.removeProperty('--footer-top-clear')
    }
  }, [])

  const revealProps = { [SCROLL_DATA_ATTR]: 'reveal' } as const

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section
        id="hero"
        className="bg-arvand-ink relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
      >
        <div ref={heroBackdropRef} className="absolute -inset-[6%]">
          <Image
            src="/images/landing1/hero-img1.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 100%)',
          }}
        />

        <div
          ref={heroContentRef}
          className="relative z-[2] flex flex-col items-center gap-4 px-6 text-center text-white sm:gap-5"
        >
          <span
            ref={heroEyebrowRef}
            className="font-mono text-xs tracking-[0.16em] text-white/70 uppercase"
          >
            {t('hero.eyebrow')}
          </span>
          <h1
            ref={heroTitleRef}
            className="text-5xl leading-[0.96] font-extrabold text-balance sm:text-7xl lg:text-8xl"
          >
            {t('hero.titleLine1')}{' '}
            <span className="font-light text-white/70">{t('hero.titleLine2')}</span>
          </h1>
          <p ref={heroSubtitleRef} className="max-w-[34ch] text-base text-white/80 sm:text-lg">
            {t('hero.subtitle')}
          </p>
        </div>

        <div
          ref={heroScrollRef}
          className="absolute inset-x-0 bottom-8 z-[2] flex flex-col items-center gap-2 text-white/70"
        >
          <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase">
            {t('hero.scroll')}
          </span>
          <span className="relative h-8 w-px overflow-hidden bg-white/40">
            <span ref={scrollLineRef} className="absolute inset-x-0 top-0 h-full bg-white" />
          </span>
        </div>
      </section>

      {/* Intro / About */}
      <section id="intro" className="bg-surface-white flex min-h-[100svh] items-center">
        <div className="px-container-x mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            ref={introMediaRef}
            className="border-border relative aspect-[3/2] overflow-hidden rounded-sm border shadow-xl"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            <Image
              src="/images/landing1/intro-about.png"
              alt={t('intro.title')}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <span className="text-arvand-slate font-mono text-xs tracking-[0.16em] uppercase">
              {t('intro.eyebrow')}
            </span>
            <h2
              ref={introTitleRef}
              className="text-arvand-ink text-4xl leading-tight font-bold text-balance lg:text-5xl"
            >
              {t('intro.title')}
            </h2>
            <div ref={introBodyRef} className="overflow-hidden">
              <p className="text-arvand-slate max-w-[46ch] text-base">{t('intro.body')}</p>
            </div>
            <div ref={introCtaRef} className="overflow-hidden">
              <Button asChild className="rounded-full">
                <Link href="/about">{t('intro.cta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase — دسکتاپ: Pin+Snap */}
      <ShowcaseSection
        products={products}
        eyebrow={t('showcase.eyebrow')}
        linkLabel={t('showcase.linkLabel')}
        locale={locale}
      />

      {/* Showcase — موبایل: Grid ساده بدون Scroll-jacking */}
      <section className="bg-surface-white py-section-y-md lg:hidden">
        <div className="px-container-x mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {products.map((product, i) => (
            <Card key={product.id} {...revealProps} className="overflow-hidden py-0">
              <div className="bg-surface-white relative aspect-square w-full">
                <Image
                  src={SHOWCASE_RIGHT_IMAGES[i % SHOWCASE_RIGHT_IMAGES.length]!}
                  alt={product.title}
                  fill
                  className="object-contain p-6"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
              <CardContent className="flex flex-col items-start gap-2 p-5">
                <span className="text-arvand-gold font-mono text-xs tracking-widest uppercase">
                  {t('showcase.eyebrow')}
                </span>
                <h3 className="text-arvand-ink text-xl font-bold">{product.title}</h3>
                <p className="text-muted-foreground text-sm">{product.description}</p>
                <Link
                  href={product.href}
                  className="text-arvand-ink mt-1 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  {t('showcase.linkLabel')}
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="bg-surface-white flex min-h-[100svh] items-center">
        <div className="px-container-x mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div {...revealProps} className="order-2 flex flex-col gap-6 lg:order-1">
            <span className="text-arvand-gold font-mono text-xs tracking-[0.16em] uppercase">
              {t('philosophy.eyebrow')}
            </span>
            <h2 className="text-arvand-ink text-4xl leading-tight font-bold lg:text-5xl">
              {t('philosophy.title')}
            </h2>
            <p className="text-arvand-slate max-w-[46ch] text-base">{t('philosophy.body')}</p>
          </div>
          <div
            ref={philoMediaRef}
            className="border-border relative order-1 aspect-[3/2] overflow-hidden rounded-sm border shadow-xl lg:order-2"
            style={{ clipPath: 'inset(0 0 0 100%)' }}
          >
            <Image
              src="/images/landing1/hero-img2.jpg"
              alt={t('philosophy.title')}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Stories */}
      <StoriesSection
        testimonials={testimonials}
        locale={locale}
        texts={{
          title: t('stories.title'),
          subtitle: t('stories.subtitle'),
          trusted: t('stories.trusted'),
          prev: t('stories.prev'),
          next: t('stories.next'),
        }}
      />

      {/* Catalog CTA — نصف بالا در این سکشن (bg-surface-white مثل سکشن‌های قبل)، نصف پایین
          روی فوتر اورلپ می‌شود؛ اندازه‌گیری و margin منفی در افکت syncCatalogOverlap بالا */}
      <section
        className="bg-surface-white px-container-x pt-section-y-lg relative z-10"
        {...revealProps}
      >
        <div className="mx-auto max-w-5xl">
          <Link
            ref={catalogCardRef}
            href="/products"
            style={{ marginBottom: 'calc(-1 * var(--catalog-overlap, 0px))' }}
            className="bg-card group flex flex-col items-center gap-8 overflow-hidden rounded-2xl border p-8 shadow-lg transition-shadow hover:shadow-2xl sm:flex-row md:p-12"
          >
            <div className="relative aspect-[3/4] w-full max-w-[220px] shrink-0 overflow-hidden rounded-sm">
              <Image
                src="/images/landing1/intro-about.png"
                alt=""
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="text-arvand-slate font-mono text-xs tracking-[0.16em] uppercase">
                {t('catalog.eyebrow')}
              </span>
              <h3 className="text-arvand-ink text-2xl font-bold text-balance sm:text-3xl">
                {t('catalog.title')}
              </h3>
              <p className="text-muted-foreground max-w-[42ch] text-sm">{t('catalog.body')}</p>
              <span className="bg-arvand-ink mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform group-hover:-translate-y-0.5">
                {t('catalog.cta')}
                <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
