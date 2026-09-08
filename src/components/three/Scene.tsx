'use client'

/**
 * پایپ‌لاین Asset سه‌بعدی — قرارداد فاز ۲ (docs/00-tech-stack.md بخش ۲.۱،
 * docs/03-url-structure-seo.md بخش ۴ «عملکرد»؛ جزئیات و دلایل در
 * docs/progress/phase-02-design-system.md):
 *
 * - فرمت: فقط glTF Binary (.glb)، تکسچرها Embedded (بدون فایل .bin/تکسچر جدا).
 * - فشرده‌سازی هندسه: Draco اجباری. KTX2/Basis برای تکسچر عمداً فعلاً کنار گذاشته شد —
 *   نیاز به Transcoder WASM جدا دارد که برای حداکثر ۲-۳ نقطه‌ی سه‌بعدی کل سایت توجیه ندارد؛
 *   به‌جایش سقف رزولوشن + JPEG/WebP Embedded کافی است.
 * - ابزار پیشنهادی: مدل‌سازی در Blender → Export glTF 2.0 (.glb) → `gltf-transform`
 *   CLI با `draco`, `resize`, `dedup`, `prune`.
 * - سقف حجم فایل (بعد از فشرده‌سازی): صحنه‌ی Hero برند ≤ 1.5MB، Viewer محصول ≤ 3MB.
 * - سقف Poly Count: Hero ≤ 50k مثلث، هر مدل محصول ≤ 30k مثلث.
 * - سقف رزولوشن تکسچر: 2048×2048 برای سطوح کلیدی/Hero، 1024×1024 برای محصول/ثانویه.
 * - محل نگه‌داری: آپلود به‌عنوان Payload Media (Local Disk در توسعه، طبق فاز ۱) — هرگز
 *   مستقیم در ریپو Commit نشود.
 *
 * این کامپوننت فقط اسکلت فاز ۲ است: بارگذاری Canvas واقعی R3F (فقط نور+دوربین، بدون مدل)
 * فقط وقتی به Viewport نزدیک شود (IntersectionObserver) + Dynamic Import بدون SSR + Fallback
 * تصویر تا لود کامل (الزام LCP/CLS سند سئو) + احترام به prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { cn } from '@/lib/utils/cn'

const SceneCanvas = dynamic(() => import('./SceneCanvas'), { ssr: false })

type SceneProps = {
  fallbackSrc: string
  fallbackAlt: string
  className?: string
}

export function Scene({ fallbackSrc, fallbackAlt, className }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(query.matches)

    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches)
    query.addEventListener('change', listener)
    return () => query.removeEventListener('change', listener)
  }, [])

  const shouldRender3d = isNearViewport && !prefersReducedMotion

  return (
    <div
      ref={containerRef}
      className={cn('relative aspect-square w-full overflow-hidden rounded-lg', className)}
    >
      <Image
        src={fallbackSrc}
        alt={fallbackAlt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className={cn(
          'duration-slow object-cover transition-opacity',
          shouldRender3d ? 'opacity-0' : 'opacity-100',
        )}
      />
      {shouldRender3d && <SceneCanvas className="absolute inset-0" />}
    </div>
  )
}
