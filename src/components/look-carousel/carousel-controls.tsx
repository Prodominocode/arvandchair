'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import type { Engine } from './engine'

export type CarouselControlLabels = {
  prev: string
  next: string
  play: string
  pause: string
  /** پیشوند برچسب هر بخش نوار؛ مثلاً «رفتن به نمای» */
  goTo: string
}

type Props = {
  engine: Engine
  /** نام هر اسلاید (برای برچسب بخش فعال) */
  names: string[]
  active: number
  /** مدت هر اسلاید به ثانیه؛ ۰ = بدون پخش خودکار */
  autoplay: number
  /** سایدبار باز است؛ کنترل‌ها محو می‌شوند و پخش خودکار می‌ایستد */
  hidden: boolean
  /** تکسچرهای صحنه بارگذاری شده‌اند؛ تا آن موقع پخش خودکار شروع نمی‌شود */
  ready: boolean
  sectionRef: RefObject<HTMLElement | null>
  labels: CarouselControlLabels
  /** ارقام فارسی برای متن راست‌به‌چپ */
  persianDigits?: boolean
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'

/**
 * نوار کنترل زیر کاروسل: فلش قبلی، نوار بخش‌بندی‌شده (بخش فعال پهن‌تر و در طول پخش خودکار پر می‌شود)،
 * دکمه‌ی توقف/پخش و فلش بعدی.
 *
 * پخش خودکار فقط وقتی جلو می‌رود که: کاربر متوقف نکرده، سایدبار بسته است، سکشن دیده می‌شود، تب فعال است،
 * کاربر درگ نمی‌کند و `prefers-reduced-motion` نیست. پر شدن نوار یک Tween خطی GSAP است و
 * با توقف/ادامه همان‌جا می‌ایستد/ادامه می‌دهد.
 */
export function CarouselControls({
  engine,
  names,
  active,
  autoplay,
  hidden,
  ready,
  sectionRef,
  labels,
  persianDigits,
}: Props) {
  const [userPaused, setUserPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const [tabActive, setTabActive] = useState(true)
  const [reduced, setReduced] = useState(false)
  /** برای شروع‌دوباره‌ی نوار وقتی پایان Tween با درگ/فوکوس هم‌زمان شد */
  const [cycle, setCycle] = useState(0)

  const fills = useRef<Array<HTMLSpanElement | null>>([])
  const tween = useRef<gsap.core.Tween | null>(null)

  const playing =
    autoplay > 0 && !reduced && !userPaused && !hidden && ready && visible && tabActive

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    const onVis = () => setTabActive(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => {
      mq.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [sectionRef])

  const advance = useCallback(() => {
    if (engine.state.dragging || engine.state.focused) {
      setCycle((c) => c + 1)
      return
    }
    engine.step(1)
  }, [engine])

  // نوار پر‌شونده‌ی بخش فعال؛ بخش‌های قبلی نرم محو می‌شوند
  useEffect(() => {
    fills.current.forEach((el, i) => {
      if (!el || i === active) return
      gsap.to(el, {
        opacity: 0,
        duration: 0.4,
        overwrite: true,
        onComplete: () => {
          gsap.set(el, { scaleX: 0 })
        },
      })
    })
    const el = fills.current[active]
    if (!el) return
    gsap.killTweensOf(el)
    if (autoplay <= 0 || reduced) {
      gsap.set(el, { scaleX: 1, opacity: 1 })
      return
    }
    gsap.set(el, { scaleX: 0, opacity: 1 })
    const t = gsap.to(el, { scaleX: 1, duration: autoplay, ease: 'none', onComplete: advance })
    tween.current = t
    return () => {
      t.kill()
      if (tween.current === t) tween.current = null
    }
  }, [active, autoplay, reduced, cycle, advance])

  useEffect(() => {
    tween.current?.paused(!playing)
  }, [playing, active, autoplay, reduced, cycle])

  const num = (i: number) => {
    const s = String(i + 1).padStart(2, '0')
    return persianDigits ? s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]!) : s
  }

  const iconBtn =
    'text-arvand-ink grid size-10 shrink-0 place-items-center rounded-full opacity-80 transition-[opacity,transform] duration-300 hover:opacity-100 active:scale-90 motion-reduce:transition-none'

  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        'absolute inset-x-0 bottom-5 z-10 flex items-start justify-between gap-4 px-4 transition-[opacity,transform] duration-500 md:bottom-8 md:px-10',
        EASE,
        hidden && 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <div className="flex min-w-0 items-start gap-2 md:gap-4">
        <button
          type="button"
          aria-label={labels.prev}
          onClick={() => engine.step(-1)}
          className={iconBtn}
        >
          <ArrowLeft className="size-6" strokeWidth={1.25} aria-hidden />
        </button>

        <div role="tablist" className="flex min-w-0 items-start gap-1 pt-[1.1rem] md:gap-2">
          {names.map((name, i) => {
            const on = i === active
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={`${labels.goTo} ${i + 1}: ${name}`}
                onClick={() => engine.goTo(i)}
                className={cn(
                  'group flex shrink-0 flex-col gap-2 text-start transition-[width] duration-700 motion-reduce:transition-none',
                  EASE,
                  on ? 'w-24 md:w-44' : 'w-4 md:w-9',
                )}
              >
                <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-black/15 transition-colors duration-300 group-hover:bg-black/30">
                  <span
                    ref={(node) => {
                      fills.current[i] = node
                    }}
                    className="bg-arvand-ink absolute inset-0 origin-left scale-x-0"
                  />
                </span>
                <span
                  className={cn(
                    'flex items-baseline gap-2 overflow-hidden text-[11px] leading-none whitespace-nowrap transition-colors duration-500',
                    on ? 'text-arvand-ink' : 'text-arvand-slate/70 group-hover:text-arvand-ink',
                  )}
                >
                  <span className="tabular-nums">{num(i)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1 md:gap-3">
        {autoplay > 0 && !reduced && (
          <button
            type="button"
            aria-label={userPaused ? labels.play : labels.pause}
            aria-pressed={userPaused}
            onClick={() => setUserPaused((p) => !p)}
            className={iconBtn}
          >
            {userPaused ? (
              <Play className="size-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <Pause className="size-4" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        )}
        <button
          type="button"
          aria-label={labels.next}
          onClick={() => engine.step(1)}
          className={iconBtn}
        >
          <ArrowRight className="size-6" strokeWidth={1.25} aria-hidden />
        </button>
      </div>
    </div>
  )
}
