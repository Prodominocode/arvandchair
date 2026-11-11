'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { cn } from '@/lib/utils/cn'
import { subjectBox } from './normalize-texture'

/** حاشیه‌ی اطراف سوژه بعد از کراپ (نسبت به ابعاد خودِ سوژه) */
const PAD = 0.05
/** سقف ضلع بلند بوم خروجی (کافی برای نمایش کوچک سایدبار روی صفحه‌ی ۲x) */
const MAX_SIDE = 720

/**
 * تصویر را دور «خودِ سوژه» (پیکسل‌های غیرشفاف) کراپ می‌کند تا حاشیه‌ی شفافِ اضافه‌ی PNG فضا را هدر ندهد و
 * سوژه درشت‌تر دیده شود؛ بعد درون کادر با `object-contain` می‌نشیند (بدون کشیدگی).
 * تصویر بدون شفافیت (عکس معمولی) همان‌طور که هست می‌ماند، و در هر خطا (مثلاً CORS) به `next/image` برمی‌گردد.
 * والد باید `relative` و دارای اندازه باشد.
 */
export function TrimmedImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    let dead = false
    const img = new window.Image()
    img.onload = () => {
      if (dead) return
      try {
        const canvas = canvasRef.current
        const w = img.naturalWidth
        const h = img.naturalHeight
        if (!canvas || !w || !h) throw new Error('no-canvas')
        const box = subjectBox(img, w, h)
        const sx = Math.max(0, box.x - box.w * PAD)
        const sy = Math.max(0, box.y - box.h * PAD)
        const sw = Math.min(w - sx, box.w * (1 + PAD * 2))
        const sh = Math.min(h - sy, box.h * (1 + PAD * 2))
        const k = Math.min(1, MAX_SIDE / Math.max(sw, sh))
        canvas.width = Math.max(1, Math.round(sw * k))
        canvas.height = Math.max(1, Math.round(sh * k))
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
        setState('ready')
      } catch {
        setState('failed')
      }
    }
    img.onerror = () => {
      if (!dead) setState('failed')
    }
    img.src = src
    return () => {
      dead = true
    }
  }, [src])

  if (state === 'failed') {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 240px, 45vw"
        className={cn('object-contain', className)}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={cn(
        'absolute inset-0 h-full w-full object-contain transition-opacity duration-500',
        state === 'ready' ? 'opacity-100' : 'opacity-0',
        className,
      )}
    />
  )
}
