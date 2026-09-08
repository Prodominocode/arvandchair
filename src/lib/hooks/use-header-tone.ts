'use client'

import { useEffect, useState } from 'react'

export type HeaderTone = 'light' | 'dark'

const TONE_ATTRIBUTE = 'data-header-tone'

/**
 * هدر شفاف/شناور روی سکشن‌های صفحه قرار می‌گیرد؛ این هوک با IntersectionObserver مشخص می‌کند
 * سکشنی که همین حالا زیر لبه‌ی هدر است چه ویژگی `data-header-tone` دارد (docs: سکشن‌های
 * پس‌زمینه‌تیره «dark» و سکشن‌های روشن «light» را علامت می‌زنند) تا رنگ متن/آیکن/لوگوی هدر
 * متناسب با آن (سفید روی تیره، تیره روی روشن) تنظیم شود.
 */
export function useHeaderTone(headerHeightPx: number, fallback: HeaderTone = 'light'): HeaderTone {
  const [tone, setTone] = useState<HeaderTone>(fallback)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(`[${TONE_ATTRIBUTE}]`))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const next = entering[0]?.target.getAttribute(TONE_ATTRIBUTE)
        if (next === 'dark' || next === 'light') setTone(next)
      },
      {
        // نوار نازک تشخیص، درست زیر لبه‌ی پایین هدر
        rootMargin: `-${headerHeightPx}px 0px -70% 0px`,
        threshold: 0,
      },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [headerHeightPx])

  return tone
}
