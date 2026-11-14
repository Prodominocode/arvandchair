'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, Plus, ShoppingBag, X } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { createEngine, mod } from './engine'
import type { Look } from './looks'
import { CarouselControls, type CarouselControlLabels } from './carousel-controls'
import type { SceneItem } from './look-scene'
import { TrimmedImage } from './trimmed-image'

// Three/R3F فقط سمت کلاینت و بعد از Hydrate بارگذاری می‌شود (قرارداد Scene.tsx فاز ۲)
const LookScene = dynamic(() => import('./look-scene'), { ssr: false })

/** رنگ زمینه‌ی پیش‌فرض؛ همین مقدار به Shader هم داده می‌شود تا اسلایدهای دور دقیقاً در زمینه حل شوند */
/** موبایل: ارتفاع Bottom-sheet سایدبار (باید با `h-[42%]` کلاس پنل یکی باشد) و ارتفاع هدر ثابت */
const SHEET_LAYOUT = { top: 64, sheetFrac: 0.42 }

const DEFAULT_BG = '#f3f1ed'

/** متن‌های رابط؛ پیش‌فرض فارسی است و صفحه‌ی میزبان می‌تواند برای هر زبان بازنویسی کند */
export type LookCarouselLabels = {
  loading: string
  stage: string
  panel: string
  close: string
  views: string
  /** عنوان دسترسی‌پذیری لیست عکس‌های جزئی */
  details: string
} & CarouselControlLabels
const DEFAULT_LABELS: LookCarouselLabels = {
  loading: 'در حال بارگذاری استایل‌ها…',
  stage: 'کاروسل استایل‌ها؛ با کلیدهای چپ و راست بچرخانید، Enter برای مشاهده‌ی جزئیات',
  panel: 'اجزای این استایل',
  close: 'بستن و بازگشت به کاروسل',
  views: 'نماهای صندلی',
  details: 'عکس‌های جزئی',
  prev: 'اسلاید قبلی',
  next: 'اسلاید بعدی',
  play: 'پخش خودکار',
  pause: 'توقف پخش خودکار',
  goTo: 'رفتن به اسلاید',
}

const fa = new Intl.NumberFormat('fa-IR')
const toNum = (s: string) =>
  Number(s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776)).replace(/[^\d]/g, ''))

/** نسخه‌ی سایدبار جزئیات (نسخه‌ی clean) برای A/B تست؛ a = نسخه‌ی فعلی صفحه‌ی اصلی */
export type SidebarVariant = 'a' | 'b'

type LookCarouselProps = {
  looks: Look[]
  /** full = عنوان، برچسب، فلش و نقطه؛ clean = فقط تصاویر (و پنل جزئیات بعد از کلیک) */
  variant?: 'full' | 'clean'
  /** نسبت عرض/ارتفاع تصاویر این مجموعه (همه باید یک نسبت داشته باشند) */
  aspect: number
  /** ارتفاع اسلاید مرکزی نسبت به ارتفاع Viewport صحنه */
  heightFrac?: number
  /** فاصله‌ی اسلایدهای مجاور بر حسب عرض اسلاید */
  gap?: number
  /** جابه‌جایی عمودی صحنه؛ در نسخه‌ی clean صفر (وسط‌چین) */
  yOffset?: number
  ariaLabel: string
  panelHeading?: string
  panelCta?: string
  /** رنگ زمینه‌ی بخش (و Tint دور شدن اسلایدها) */
  bg?: string
  /** true = زمینه‌ی تخت و هم‌رنگ bg (بدون گرادیان کف) تا با صفحه‌ی میزبان یکی شود */
  flat?: boolean
  /** جهت متن پنل جزئیات؛ خودِ صحنه همیشه ltr است */
  textDir?: 'rtl' | 'ltr'
  labels?: Partial<LookCarouselLabels>
  /** رنگ نوار هدر شناور روی این بخش */
  headerTone?: 'light' | 'dark'
  /** تعداد تصاویر بندانگشتیِ قابل‌کلیک زیر مشخصات سایدبار (۲ ستونه)؛ از ابتدای looks برداشته می‌شود */
  thumbnails?: number
  sidebarVariant?: SidebarVariant
  /** نوار کنترل زیر کاروسل (فلش‌ها، نوار بخش‌بندی‌شده، توقف/پخش)؛ فقط در نسخه‌ی clean */
  controls?: boolean
  /** مدت هر اسلاید به ثانیه برای پخش خودکار (نیازمند `controls`)؛ ۰ = خاموش */
  autoplay?: number
  /** عنوان تبلیغاتی گوشه‌ی بالا-چپ (سبک، حروف بزرگ، رنگ تیره‌ی عنوان‌ها)؛ `
` = خط جدید */
  heading?: string
}

export function LookCarousel({
  looks,
  variant = 'full',
  aspect,
  heightFrac = 0.68,
  gap = 0.9,
  yOffset,
  ariaLabel,
  panelHeading = 'در این استایل',
  panelCta = 'افزودن کل استایل به سبد',
  bg = DEFAULT_BG,
  flat = false,
  textDir = 'rtl',
  labels,
  headerTone,
  heading,
  thumbnails = 0,
  sidebarVariant = 'a',
  controls = false,
  autoplay = 0,
}: LookCarouselProps) {
  const full = variant === 'full'
  const ltr = textDir === 'ltr'
  /** full: کلیک/درگ روی فضای خالی از فوکوس خارج می‌کند؛ clean: فقط دکمه‌ی X (یا Esc) */
  const exitOnInteract = full
  /** clean: در حالت فوکوس هم با درگ می‌شود اسلایدها را چرخاند (full با درگ از فوکوس خارج می‌شود) */
  const dragInFocus = !full
  /** نسخه‌ی B سایدبار: درگ در فوکوس روی نماهای همان محصول، اسکرول صفحه تصاویر را جابه‌جا نمی‌کند، سایدبار روی هدر و با اسکرول صفحه بسته می‌شود */
  const isB = !full && sidebarVariant === 'b'
  const L = { ...DEFAULT_LABELS, ...labels }
  const count = looks.length
  /** صندلی‌هایی که عکس‌های جزئی‌شان وارد صحنه شده (تنبل: فقط بعد از اولین فوکوس روی هر صندلی) */
  const [detailChairs, setDetailChairs] = useState<number[]>([])
  const items = useMemo<SceneItem[]>(() => {
    const list: SceneItem[] = looks.map((l, chair) => ({ src: l.src, chair, slot: 0 }))
    for (const chair of detailChairs) {
      ;(looks[chair]?.gallery ?? []).forEach((g, k) =>
        list.push({ src: g.src, chair, slot: k + 1 }),
      )
    }
    return list
  }, [looks, detailChairs])
  const engine = useMemo(() => createEngine(count), [count])

  const [active, setActive] = useState(0)
  /** عکس فعال در لیست محلی صندلی فوکوس‌شده (۰ = عکس اصلی، k = k‌امین عکس جزئی) */
  const [localActive, setLocalActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const [ready, setReady] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollTween = useRef<gsap.core.Tween | null>(null)
  /** true تا وقتی اسکرول نرمِ تراز کردن سکشن تمام نشده؛ اسکرول‌های خودمان نباید سایدبار را ببندند */
  const aligningRef = useRef(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const focusedRef = useRef(false)
  focusedRef.current = focused

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    engine.state.reduced = mq.matches
    const onChange = () => (engine.state.reduced = mq.matches)
    mq.addEventListener('change', onChange)
    engine.start()
    const off = engine.subscribe(() => {
      setActive(mod(Math.round(engine.state.pos), count))
      const { localCount, lpos, focused } = engine.state
      setLocalActive(focused && localCount > 0 ? mod(Math.round(lpos), localCount) : 0)
    })
    return () => {
      mq.removeEventListener('change', onChange)
      off()
      engine.destroy()
      scrollTween.current?.kill()
    }
  }, [engine, count])

  const enterFocus = useCallback(() => {
    // clean: در فوکوس، عکس‌های همین صندلی (اصلی + جزئی) می‌چرخند؛ full: همان صندلی‌های مجاور
    const idx = mod(Math.round(engine.state.pos), count)
    if (!full) {
      engine.focusOn(1 + (looks[idx]?.gallery?.length ?? 0))
      setDetailChairs((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
    } else engine.focusOn()
    setFocused(true)
    if (full) return
    // با باز شدن سایدبار، صفحه نرم اسکرول می‌شود تا این سکشن (هم‌ارتفاع صفحه) دقیقاً تمام‌قد دیده شود
    const section = sectionRef.current
    if (!section) return
    scrollTween.current?.kill()
    const from = window.scrollY
    const to = Math.round(from + section.getBoundingClientRect().top)
    const dist = Math.abs(to - from)
    if (dist < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pos = { y: from }
    const cancel = () => {
      scrollTween.current?.kill()
      aligningRef.current = false
    }
    window.addEventListener('wheel', cancel, { passive: true, once: true })
    window.addEventListener('touchstart', cancel, { passive: true, once: true })
    aligningRef.current = true
    scrollTween.current = gsap.to(pos, {
      y: to,
      duration: reduced ? 0 : Math.min(1.5, 0.8 + dist / 2500),
      ease: 'power3.inOut',
      overwrite: true,
      onUpdate: () => window.scrollTo(0, pos.y),
      onComplete: () => {
        aligningRef.current = false
        window.removeEventListener('wheel', cancel)
        window.removeEventListener('touchstart', cancel)
      },
    })
  }, [engine, full, looks, count])
  const exitFocus = useCallback(() => {
    engine.unfocus()
    setFocused(false)
    stageRef.current?.focus({ preventScroll: true })
  }, [engine])

  // — درگ (ماوس/لمس/قلم). بدون setPointerCapture تا کلیک به Raycaster R3F برسد.
  // در حالت فوکوس، شروع درگ روی تصاویر = بازگشت به حالت «همه‌ی تصاویر» و ادامه‌ی همان درگ.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const el: HTMLDivElement = stage
    let id = -1
    let x0 = 0
    let dragging = false
    let wheelLock = 0
    let wheelAcc = 0

    const stop = () => {
      id = -1
      dragging = false
      el.dataset.drag = 'false'
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    function move(e: PointerEvent) {
      if (e.pointerId !== id) return
      if (!dragging) {
        // هنوز در حالت فوکوس: بعد از ~۸px حرکت افقی، از فوکوس خارج و درگ را شروع کن
        // (نسخه‌ی clean: درگ در حالت فوکوس نادیده گرفته می‌شود؛ بازگشت فقط با دکمه‌ی X)
        if (Math.abs(e.clientX - x0) < 8) return
        if (focusedRef.current) {
          if (!exitOnInteract) return
          exitFocus()
        }
        if (!engine.dragStart()) return
        dragging = true
        el.dataset.drag = 'true'
      }
      engine.dragBy(e.clientX - x0)
    }
    function up(e: PointerEvent) {
      if (e.pointerId !== id) return
      const was = dragging
      stop()
      if (was) engine.dragEnd()
    }
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || id !== -1) return
      id = e.pointerId
      x0 = e.clientX
      if (!focusedRef.current || dragInFocus) {
        if (!engine.dragStart(dragInFocus)) return
        dragging = true
        el.dataset.drag = 'true'
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    }
    const wheel = (e: WheelEvent) => {
      if (focusedRef.current) {
        // نسخه‌ی B: اسکرول در فوکوس نه تصاویر را جابه‌جا می‌کند و نه صفحه را قفل (اسکرول صفحه = بستن)
        if (isB) return
        // حالت فوکوس: هر «ضربه»‌ی اسکرول (افقی یا عمودی) = یک نما جلو/عقب
        e.preventDefault()
        wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        const now = performance.now()
        if (Math.abs(wheelAcc) > 30 && now - wheelLock > 420) {
          engine.step(wheelAcc > 0 ? 1 : -1)
          wheelLock = now
          wheelAcc = 0
        }
        return
      }
      // فقط اسکرول افقی (تاچ‌پد/Shift+چرخ) را می‌گیریم؛ اسکرول عمودی صفحه دست‌نخورده می‌ماند
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      engine.wheel(e.deltaX)
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('wheel', wheel)
      stop()
    }
  }, [engine, exitFocus, exitOnInteract, isB, dragInFocus])

  const onSlideClick = useCallback(
    (meshIndex: number, solid: boolean) => {
      const it = items[meshIndex]
      if (!it) return
      if (focusedRef.current) {
        if (!solid) {
          if (exitOnInteract) exitFocus()
        } else if (!full) {
          // عکس کلیک‌شده را در لیست محلی صندلی فوکوس‌شده به مرکز می‌آورد
          if (it.slot !== mod(Math.round(engine.state.lpos), engine.state.localCount))
            engine.goTo(it.slot)
        } else if (it.chair !== mod(Math.round(engine.state.pos), count)) engine.goTo(it.chair)
        return
      }
      if (!solid || it.slot !== 0) return
      if (it.chair === mod(Math.round(engine.state.pos), count)) enterFocus()
      else engine.goTo(it.chair)
    },
    [engine, items, full, count, enterFocus, exitFocus, exitOnInteract],
  )
  const onMiss = useCallback(() => {
    if (focusedRef.current && exitOnInteract) exitFocus()
  }, [exitFocus, exitOnInteract])
  const onReady = useCallback(() => setReady(true), [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (focused) {
      if (e.key === 'ArrowRight') engine.step(1)
      else if (e.key === 'ArrowLeft') engine.step(-1)
      return
    }
    // کلیدها در فضای فیزیکی: راست = اسلاید بعدی (ناحیه‌ی Stage همیشه ltr است)
    if (e.key === 'ArrowRight') engine.step(1)
    else if (e.key === 'ArrowLeft') engine.step(-1)
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      enterFocus()
    }
  }

  // نسخه‌ی B: اگر بعد از تراز شدن، صفحه بیش از ۱۰px از سکشن جابه‌جا شد، سایدبار نرم محو و بسته می‌شود
  useEffect(() => {
    if (!isB || !focused) return
    const onScroll = () => {
      if (aligningRef.current) return
      const top = sectionRef.current?.getBoundingClientRect().top ?? 0
      if (Math.abs(top) > 10) exitFocus()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isB, focused, exitFocus])

  // با ورود به حالت فوکوس، فوکوس کیبورد به دکمه‌ی بستن می‌رود
  useEffect(() => {
    if (focused) closeRef.current?.focus({ preventScroll: true })
  }, [focused])

  const look = looks[active] ?? looks[0]!
  const thumbs = looks.slice(0, thumbnails)
  const gallery = look.gallery ?? []
  const priced = look.items.every((it) => it.price)
  const total = look.items.reduce((sum, it) => sum + toNum(it.price ?? ''), 0)

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      dir="ltr"
      data-header-tone={headerTone}
      data-sidebar-variant={full ? undefined : sidebarVariant}
      onKeyDown={(e) => {
        // Esc از هرجای بخش (از جمله دکمه‌ی بستن که فوکوس کیبورد را در حالت فوکوس دارد)
        if (e.key === 'Escape' && focused) exitFocus()
      }}
      className={cn(
        // B: بدون isolate تا z-index سایدبار در Stacking Context صفحه (بالاتر از هدر) معنا داشته باشد
        isB ? 'relative' : 'relative isolate',
        'min-h-[560px] w-full overflow-hidden select-none',
        // full: زیر هدر ثابت (۴rem)؛ clean: دقیقاً به اندازه‌ی ارتفاع صفحه‌ی نمایش
        full ? 'h-[calc(100svh-4rem)]' : 'h-svh',
      )}
      style={{
        background: flat ? bg : `radial-gradient(120% 70% at 50% 100%, #e9e5de 0%, ${bg} 62%)`,
      }}
    >
      {full && (
        <div
          className={cn(
            'pointer-events-none absolute start-0 top-0 z-10 p-6 text-start transition-opacity duration-500 md:p-10',
            focused && 'opacity-0',
          )}
          dir="rtl"
        >
          <h1 className="text-arvand-ink text-2xl font-black tracking-tight md:text-4xl">
            استایل را امتحان کن.
          </h1>
        </div>
      )}

      {heading && (
        <div
          className={cn(
            'pointer-events-none absolute start-0 top-0 z-10 max-w-[min(92%,44rem)] px-6 pt-20 text-start transition-opacity duration-500 md:px-10 md:pt-24',
            focused && 'opacity-0',
          )}
        >
          <p className="text-arvand-ink text-4xl leading-tight font-light tracking-tight whitespace-pre-line uppercase lg:text-5xl">
            {heading}
          </p>
        </div>
      )}

      {/* صحنه‌ی سه‌بعدی + درگ */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label={L.stage}
        onKeyDown={onKeyDown}
        data-drag="false"
        className={cn(
          'absolute inset-0 touch-pan-y outline-none',
          'cursor-grab data-[drag=true]:cursor-grabbing',
          'focus-visible:ring-arvand-ink focus-visible:ring-2 focus-visible:ring-inset',
          focused && 'cursor-default',
        )}
      >
        <LookScene
          engine={engine}
          items={items}
          detailFocus={!full}
          bg={bg}
          aspect={aspect}
          heightFrac={heightFrac}
          gap={gap}
          yOffset={yOffset ?? (full ? undefined : 0)}
          sheetLayout={full ? undefined : SHEET_LAYOUT}
          onSlideClick={onSlideClick}
          onMiss={onMiss}
          onReady={onReady}
        />
      </div>

      {/* لودینگ — تا آماده‌شدن تکسچرها */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none absolute inset-0 z-20 grid place-items-center transition-opacity duration-500',
          ready ? 'opacity-0' : 'opacity-100',
        )}
        style={{ background: bg }}
      >
        <span className="text-arvand-slate text-sm">{L.loading}</span>
      </div>

      {full ? (
        <div
          className={cn(
            'absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-3 transition-all duration-500 md:bottom-6',
            focused && 'pointer-events-none translate-y-4 opacity-0',
          )}
        >
          <div className="text-center" dir="rtl" aria-live="polite">
            <p className="text-arvand-ink text-base font-bold">{look.name}</p>
            <p className="text-arvand-slate text-xs">
              {fa.format(active + 1)} / {fa.format(count)} · {look.caption}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="استایل قبلی"
              onClick={() => engine.step(-1)}
              className="text-arvand-ink grid size-11 place-items-center rounded-full bg-white/70 shadow-sm backdrop-blur transition-[transform,background-color] duration-200 hover:bg-white active:scale-95 motion-reduce:transition-none"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <div className="flex items-center gap-1" role="tablist" aria-label="انتخاب استایل">
              {looks.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`استایل ${fa.format(i + 1)}: ${l.name}`}
                  onClick={() => engine.goTo(i)}
                  className="grid h-6 w-5 place-items-center"
                >
                  <span
                    className={cn(
                      'h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none',
                      i === active ? 'bg-arvand-ink w-5' : 'bg-arvand-slate/40 w-1.5',
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="استایل بعدی"
              onClick={() => engine.step(1)}
              className="text-arvand-ink grid size-11 place-items-center rounded-full bg-white/70 shadow-sm backdrop-blur transition-[transform,background-color] duration-200 hover:bg-white active:scale-95 motion-reduce:transition-none"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
          <button
            type="button"
            onClick={enterFocus}
            className="text-arvand-ink hidden rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-black/5 md:block"
          >
            مشاهده‌ی جزئیات استایل
          </button>
        </div>
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            {look.name} — {look.caption}
          </p>
          {controls && (
            <CarouselControls
              engine={engine}
              names={looks.map((l) => l.name)}
              active={active}
              autoplay={autoplay}
              hidden={focused}
              ready={ready}
              sectionRef={sectionRef}
              labels={L}
              persianDigits={!ltr}
            />
          )}
        </>
      )}

      {full ? (
        <>
          {/* پنل «در این استایل» — راست در دسکتاپ، Bottom-sheet در موبایل */}
          <aside
            aria-label={L.panel}
            aria-hidden={!focused}
            inert={!focused}
            dir={textDir}
            className={cn(
              'absolute z-20 flex flex-col rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur-xl',
              'inset-x-3 bottom-3 max-h-[44%] md:inset-x-auto md:top-20 md:right-6 md:bottom-auto md:max-h-none md:w-[340px]',
              'transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
              focused
                ? 'translate-x-0 translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-10 opacity-0 md:translate-x-10 md:translate-y-0',
            )}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-arvand-slate text-xs">{panelHeading}</p>
                <h2 className="text-arvand-ink text-lg font-bold">{look.name}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label={L.close}
                onClick={exitFocus}
                className="text-arvand-ink grid size-10 shrink-0 place-items-center rounded-full bg-black/5 transition-[transform,background-color] hover:bg-black/10 active:scale-95"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-2 overflow-y-auto md:flex-none">
              {look.items.map((it, i) => (
                <li
                  key={it.name}
                  className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{
                    transitionDelay: focused ? `${180 + i * 90}ms` : '0ms',
                    transform: focused ? 'none' : 'translateY(12px)',
                    opacity: focused ? 1 : 0,
                  }}
                >
                  {it.swatch && (
                    <span
                      aria-hidden
                      className="size-12 shrink-0 rounded-xl border border-black/10"
                      style={{ background: it.swatch }}
                    />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="text-arvand-slate block text-[11px]">{it.kind}</span>
                    <span className="text-arvand-ink block truncate text-sm font-semibold">
                      {it.name}
                    </span>
                    {it.price && (
                      <span className="text-arvand-slate block text-xs">{it.price} تومان</span>
                    )}
                  </span>
                  {it.price && (
                    <button
                      type="button"
                      aria-label={`افزودن ${it.name} به سبد`}
                      className="text-arvand-ink grid size-10 shrink-0 place-items-center rounded-full border border-black/15 transition-[transform,background-color] hover:bg-black/5 active:scale-95"
                    >
                      <Plus className="size-4" aria-hidden />
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {priced && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-arvand-slate">جمع کل استایل</span>
                <span className="text-arvand-ink font-bold">{fa.format(total)} تومان</span>
              </div>
            )}
            <button
              type="button"
              className="bg-arvand-ink mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.98]"
            >
              <ShoppingBag className="size-4" aria-hidden />
              {panelCta}
            </button>
          </aside>
        </>
      ) : (
        <>
          {/* دکمه‌ی بستن: بیرون از سایدبار، گوشه‌ی بالا-راستِ اسلایدر (در دسکتاپ، بالا-چپِ سایدبار) */}
          <button
            ref={closeRef}
            type="button"
            aria-label={L.close}
            inert={!focused}
            onClick={exitFocus}
            className={cn(
              'text-arvand-ink absolute top-20 right-4 grid size-10 place-items-center rounded-full border border-black/10 transition-[opacity,background-color] duration-500 hover:bg-black/5 md:top-24 md:right-[calc(264px+1.25rem)]',
              isB ? 'z-[100]' : 'z-30',
              focused ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <X className="size-5" aria-hidden />
          </button>

          {/* سایدبار جزئیات — تمام‌قد، بدون سایه و بدون بردر (دسکتاپ)، با پس‌زمینه‌ی دقیقاً هم‌رنگ
              زمینه‌ی صفحه (`bg`)؛ موبایل: Bottom-sheet */}
          <aside
            aria-label={L.panel}
            aria-hidden={!focused}
            inert={!focused}
            dir={textDir}
            className={cn(
              'absolute flex [scrollbar-width:none] flex-col overflow-y-auto border-black/10 px-6 pt-6 pb-6 md:px-5 md:pb-8 [&::-webkit-scrollbar]:hidden',
              // B: سایدبار از زیر هدر ثابت (h-16) شروع می‌شود و وارد آن نمی‌شود؛ عنوان هم‌تراز دکمه‌ی بستن می‌ماند
              isB ? 'md:top-16 md:bottom-0 md:pt-8' : 'md:inset-y-0 md:pt-24',
              isB ? 'z-[100]' : 'z-20',
              'inset-x-0 bottom-0 rounded-t-3xl border-t',
              // ارتفاع ثابت (هم‌خوان با SHEET_FRAC صحنه) تا اسلاید فوکوس‌شده دقیق بالای آن جا شود
              'h-[42%] md:h-auto',
              'md:right-0 md:left-auto md:max-h-none md:w-[264px] md:rounded-none md:border-t-0 md:border-l',
              'transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
              focused
                ? 'translate-x-0 translate-y-0 opacity-100'
                : 'pointer-events-none translate-y-10 opacity-0 md:translate-x-10 md:translate-y-0',
            )}
            style={{ background: bg }}
          >
            <h2
              className={cn(
                'text-arvand-ink shrink-0 text-xl leading-tight font-light',
                ltr && 'tracking-tight',
              )}
            >
              {look.name}
            </h2>

            <dl className="mt-8 flex shrink-0 flex-col gap-4 md:mt-10 md:gap-5">
              {look.items.map((it, i) => (
                <div
                  key={`${it.kind}-${it.name}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                  style={{
                    transitionDelay: focused ? `${180 + i * 70}ms` : '0ms',
                    transform: focused ? 'none' : 'translateY(10px)',
                    opacity: focused ? 1 : 0,
                  }}
                >
                  <dt className="text-arvand-slate shrink-0 text-sm">{it.kind}</dt>
                  <dd className="text-arvand-ink text-sm font-light">{it.name}</dd>
                </div>
              ))}
            </dl>

            {gallery.length > 0 ? (
              <ul
                aria-label={L.details}
                className="mt-8 grid shrink-0 grid-cols-1 gap-y-6 md:mt-10 md:gap-y-8"
              >
                {gallery.map((g, i) => (
                  <li
                    key={`${g.src}-${i}`}
                    className="transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                    style={{
                      transitionDelay: focused ? `${420 + i * 70}ms` : '0ms',
                      transform: focused ? 'none' : 'translateY(10px)',
                      opacity: focused ? 1 : 0,
                    }}
                  >
                    {(() => {
                      // کلیک: همین عکس در کاروسل بالا (حالت فوکوس) به مرکز می‌آید
                      const current = localActive === i + 1
                      return (
                        <button
                          type="button"
                          aria-label={g.alt}
                          aria-pressed={current}
                          onClick={() => engine.goTo(i + 1)}
                          className="group block w-full cursor-pointer text-start"
                        >
                          <span
                            className={cn(
                              'mb-2 block text-left text-[11px] tracking-wider uppercase transition-colors duration-500',
                              current ? 'text-arvand-ink' : 'text-arvand-slate',
                            )}
                          >
                            {g.title ?? g.alt}
                          </span>
                          <span
                            className={cn(
                              'relative block aspect-square w-full transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
                              current ? 'opacity-100' : 'opacity-60 group-hover:opacity-100',
                            )}
                          >
                            <TrimmedImage src={g.src} alt="" />
                          </span>
                        </button>
                      )
                    })()}
                  </li>
                ))}
              </ul>
            ) : (
              thumbs.length > 0 && (
                <ul
                  aria-label={L.views}
                  className="mt-8 grid shrink-0 grid-cols-1 gap-y-6 md:mt-10 md:gap-y-8"
                >
                  {thumbs.map((t, i) => {
                    // چرخ‌میز متقارن: دومین نیمه‌ی اسلایدها آینه‌ی نیمه‌ی اول است، پس نمای هم‌ارز هم فعال حساب می‌شود
                    const current =
                      active === i || (count === thumbs.length * 2 && active === count - 1 - i)
                    return (
                      <li
                        key={t.id}
                        className="transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                        style={{
                          transitionDelay: focused ? `${420 + i * 70}ms` : '0ms',
                          transform: focused ? 'none' : 'translateY(10px)',
                          opacity: focused ? 1 : 0,
                        }}
                      >
                        <button
                          type="button"
                          aria-label={t.caption}
                          aria-pressed={current}
                          onClick={() => {
                            exitFocus()
                            engine.goTo(i)
                          }}
                          className="block w-full"
                        >
                          <span
                            className={cn(
                              'mb-2 block text-left text-[11px] tracking-wider uppercase transition-colors duration-300',
                              current ? 'text-arvand-ink' : 'text-arvand-slate',
                            )}
                          >
                            {t.caption}
                          </span>
                          <span className="relative block aspect-square w-full">
                            <TrimmedImage src={t.src} alt="" />
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )
            )}

            <div className="mt-auto shrink-0 pt-10">
              <button
                type="button"
                className="bg-arvand-ink flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.98]"
              >
                {panelCta}
              </button>
            </div>
          </aside>
        </>
      )}
    </section>
  )
}
