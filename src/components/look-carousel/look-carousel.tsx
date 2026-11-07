'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChevronLeft, ChevronRight, Plus, ShoppingBag, X } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { createEngine, mod } from './engine'
import type { Look } from './looks'

// Three/R3F فقط سمت کلاینت و بعد از Hydrate بارگذاری می‌شود (قرارداد Scene.tsx فاز ۲)
const LookScene = dynamic(() => import('./look-scene'), { ssr: false })

/** رنگ زمینه؛ همین مقدار به Shader هم داده می‌شود تا اسلایدهای دور دقیقاً در زمینه حل شوند */
const BG = '#f3f1ed'

const fa = new Intl.NumberFormat('fa-IR')
const toNum = (s: string) =>
  Number(s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776)).replace(/[^\d]/g, ''))

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
}: LookCarouselProps) {
  const full = variant === 'full'
  const count = looks.length
  const srcs = useMemo(() => looks.map((l) => l.src), [looks])
  const engine = useMemo(() => createEngine(count), [count])

  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const [ready, setReady] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const focusedRef = useRef(false)
  focusedRef.current = focused

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    engine.state.reduced = mq.matches
    const onChange = () => (engine.state.reduced = mq.matches)
    mq.addEventListener('change', onChange)
    engine.start()
    const off = engine.subscribe(() => setActive(mod(Math.round(engine.state.pos), count)))
    return () => {
      mq.removeEventListener('change', onChange)
      off()
      engine.destroy()
    }
  }, [engine, count])

  const enterFocus = useCallback(() => {
    engine.focusOn()
    setFocused(true)
  }, [engine])
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
        if (Math.abs(e.clientX - x0) < 8) return
        if (focusedRef.current) exitFocus()
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
      if (!focusedRef.current) {
        if (!engine.dragStart()) return
        dragging = true
        el.dataset.drag = 'true'
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    }
    const wheel = (e: WheelEvent) => {
      if (focusedRef.current) {
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
  }, [engine, exitFocus])

  const onSlideClick = useCallback(
    (index: number, solid: boolean) => {
      if (focusedRef.current) {
        // کلیک روی ناحیه‌ی خالی = بازگشت؛ کلیک روی نمای مجاور = آوردنش به مرکز
        if (!solid) exitFocus()
        else if (index !== mod(Math.round(engine.state.pos), count)) engine.goTo(index)
        return
      }
      if (!solid) return
      if (index === mod(Math.round(engine.state.pos), count)) enterFocus()
      else engine.goTo(index)
    },
    [engine, count, enterFocus, exitFocus],
  )
  const onMiss = useCallback(() => {
    if (focusedRef.current) exitFocus()
  }, [exitFocus])
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

  // با ورود به حالت فوکوس، فوکوس کیبورد به دکمه‌ی بستن می‌رود
  useEffect(() => {
    if (focused) closeRef.current?.focus({ preventScroll: true })
  }, [focused])

  const look = looks[active] ?? looks[0]!
  const priced = look.items.every((it) => it.price)
  const total = look.items.reduce((sum, it) => sum + toNum(it.price ?? ''), 0)

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      dir="ltr"
      onKeyDown={(e) => {
        // Esc از هرجای بخش (از جمله دکمه‌ی بستن که فوکوس کیبورد را در حالت فوکوس دارد)
        if (e.key === 'Escape' && focused) exitFocus()
      }}
      className="relative isolate h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden select-none"
      style={{
        background: `radial-gradient(120% 70% at 50% 100%, #e9e5de 0%, ${BG} 62%)`,
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

      {/* صحنه‌ی سه‌بعدی + درگ */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="کاروسل استایل‌ها؛ با کلیدهای چپ و راست بچرخانید، Enter برای مشاهده‌ی جزئیات"
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
          srcs={srcs}
          bg={BG}
          aspect={aspect}
          heightFrac={heightFrac}
          gap={gap}
          yOffset={yOffset ?? (full ? undefined : 0)}
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
        style={{ background: BG }}
      >
        <span className="text-arvand-slate text-sm">در حال بارگذاری استایل‌ها…</span>
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
        <p className="sr-only" aria-live="polite">
          {look.name}؛ {look.caption}
        </p>
      )}

      {/* پنل «در این استایل» — راست در دسکتاپ، Bottom-sheet در موبایل */}
      <aside
        aria-label="اجزای این استایل"
        aria-hidden={!focused}
        inert={!focused}
        dir="rtl"
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
            aria-label="بستن و بازگشت به کاروسل"
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
    </section>
  )
}
