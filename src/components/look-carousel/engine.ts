import gsap from 'gsap'

/**
 * موتور حرکت کاروسل — منبع واحد حقیقت برای `pos` (موقعیت پیوسته بر حسب «واحد اسلاید») و `focus` (۰..۱).
 * GSAP تنها مالک این دو عدد است؛ صحنه‌ی R3F فقط می‌خواند و رندر می‌کند، DOM فقط رویدادها را می‌فرستد.
 *
 * - درگ: pos با یک tween کوتاه (power3.out) پشت نشانگر می‌آید → نرم، بدون پرش.
 * - رها کردن: سرعت پنجره‌ی ۱۰۰ms آخر اندازه‌گیری می‌شود؛ مقصد = موقعیت + سرعت×۰٫۳ و به نزدیک‌ترین
 *   اسلاید می‌چسبد. مدت tween طوری حساب می‌شود که سرعت اولیه‌ی power3.out (=3·d/T) با سرعت دست
 *   یکی شود → حرکت تند ماوس = چرخش تند و پیوسته، بدون «ترمز» ناگهانی.
 */
export type Engine = ReturnType<typeof createEngine>

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
export const mod = (n: number, m: number) => ((n % m) + m) % m

export function createEngine(count: number) {
  const state = {
    pos: 0,
    /**
     * موقعیت محلی در لیست عکس‌های صندلی فوکوس‌شده (اصلی + جزئی)، وقتی `focusOn(m)` با m > 0 صدا زده شود.
     * در حالت فوکوس، درگ/گام/goTo روی این محور کار می‌کنند و `pos` (دایره‌ی صندلی‌ها) ثابت می‌ماند.
     */
    lpos: 0,
    localCount: 0,
    focus: 0,
    focusIndex: -1,
    focused: false,
    dragging: false,
    /** پهنای یک گام اسلاید بر حسب px (صحنه هر فریم به‌روز می‌کند) */
    unitPx: 260,
    reduced: false,
  }

  let startPos = 0
  let target = 0
  let dest = 0
  let samples: Array<[number, number]> = []
  let wheelAcc = 0
  let wheelTimer: ReturnType<typeof setTimeout> | undefined

  const listeners = new Set<() => void>()
  let lastPos = Number.NaN
  let lastFocus = Number.NaN
  let lastLpos = Number.NaN
  const tick = () => {
    if (state.pos !== lastPos || state.focus !== lastFocus || state.lpos !== lastLpos) {
      lastPos = state.pos
      lastFocus = state.focus
      lastLpos = state.lpos
      listeners.forEach((fn) => fn())
    }
  }
  // ticker در start() وصل و در destroy() جدا می‌شود. Strict Mode (و remount) افکت را «mount → cleanup →
  // mount» می‌کند؛ اگر ticker فقط یک بار در createEngine وصل می‌شد، بعد از cleanup دیگر هیچ‌وقت
  // برنمی‌گشت و (با frameloop="demand") هیچ فریمی رندر نمی‌شد.
  function start() {
    gsap.ticker.remove(tick)
    gsap.ticker.add(tick)
  }

  const dur = (s: number) => (state.reduced ? 0.001 : s)

  /** محور فعال: در فوکوسِ «عکس‌های صندلی» محلی (`lpos`)، وگرنه دایره‌ی صندلی‌ها (`pos`) */
  const local = () => state.focused && state.localCount > 0
  const axis = () => (local() ? 'lpos' : 'pos')
  const size = () => (local() ? state.localCount : count)

  function settle(to: number, velocity = 0) {
    dest = to
    const d = Math.abs(to - state.pos)
    const seconds = clamp((3 * d) / Math.max(Math.abs(velocity), 2.5), 0.55, 2.4)
    gsap.to(state, { [axis()]: to, duration: dur(seconds), ease: 'power3.out', overwrite: 'auto' })
  }

  /** allowFocused: در حالت فوکوس هم درگ مجاز باشد (نسخه‌ی B سایدبار: درگ روی نماهای همان محصول) */
  function dragStart(allowFocused = false) {
    if (state.focused && !allowFocused) return false
    gsap.killTweensOf(state, axis())
    state.dragging = true
    startPos = state[axis()]
    target = startPos
    samples = [[performance.now(), startPos]]
    return true
  }

  function dragBy(dxPx: number) {
    if (!state.dragging) return
    target = startPos - dxPx / state.unitPx
    const now = performance.now()
    samples.push([now, target])
    while (samples.length > 2 && now - samples[0]![0] > 100) samples.shift()
    gsap.to(state, {
      [axis()]: target,
      duration: dur(0.35),
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  function dragEnd() {
    if (!state.dragging) return
    state.dragging = false
    const now = performance.now()
    const first = samples[0]!
    const last = samples[samples.length - 1]!
    const dt = (last[0] - first[0]) / 1000
    let v = 0
    if (dt > 0.012 && now - last[0] < 90) v = (last[1] - first[1]) / dt
    v = clamp(v, -14, 14)
    settle(state.reduced ? Math.round(target) : Math.round(target + v * 0.3), v)
  }

  function wheel(deltaX: number) {
    if (state.focused) return
    if (!state.dragging) {
      if (!dragStart()) return
      wheelAcc = 0
    }
    wheelAcc -= deltaX * 1.1
    dragBy(wheelAcc)
    clearTimeout(wheelTimer)
    wheelTimer = setTimeout(dragEnd, 130)
  }

  function goTo(index: number) {
    const n = size()
    const base = Math.round(state[axis()])
    let diff = mod(index - base, n)
    if (diff > n / 2) diff -= n
    settle(base + diff, 0)
  }

  function step(dir: 1 | -1) {
    const from = state.dragging ? Math.round(target) : Math.round(dest || state[axis()])
    settle(from + dir, 0)
  }

  /**
   * localCount = تعداد عکس‌های صندلی فوکوس‌شده (اصلی + جزئی). اگر > 0 باشد، در فوکوس همین عکس‌ها
   * می‌چرخند (محور `lpos` از ۰ = عکس اصلی)؛ اگر ۰ باشد رفتار قدیمی: صندلی‌های مجاور روی `pos`.
   */
  function focusOn(localCount = 0) {
    if (state.focused) return
    state.dragging = false
    const snapped = Math.round(state.pos)
    state.focusIndex = mod(snapped, count)
    gsap.to(state, { pos: snapped, duration: dur(0.55), ease: 'power3.out', overwrite: 'auto' })
    gsap.killTweensOf(state, 'lpos')
    state.lpos = 0
    state.localCount = Math.max(0, Math.floor(localCount))
    dest = state.localCount > 0 ? 0 : snapped
    state.focused = true
    gsap.to(state, { focus: 1, duration: dur(1.05), ease: 'expo.out', overwrite: 'auto' })
  }

  function unfocus() {
    if (!state.focused) return
    state.dragging = false
    gsap.killTweensOf(state, 'lpos')
    state.focused = false
    dest = Math.round(state.pos)
    gsap.to(state, {
      focus: 0,
      duration: dur(0.8),
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        if (!state.focused) {
          state.focusIndex = -1
          state.localCount = 0
          state.lpos = 0
        }
      },
    })
  }

  function destroy() {
    clearTimeout(wheelTimer)
    gsap.ticker.remove(tick)
    gsap.killTweensOf(state)
    listeners.clear()
  }

  return {
    state,
    start,
    subscribe(fn: () => void) {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
    dragStart,
    dragBy,
    dragEnd,
    wheel,
    goTo,
    step,
    focusOn,
    unfocus,
    destroy,
  }
}
