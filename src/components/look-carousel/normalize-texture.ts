import * as THREE from 'three'

/** حداکثر عرض خروجی بعد از کراپ (کافی برای صفحه‌ی ۲x؛ از بزرگ‌تر شدنِ بی‌دلیل تکسچر جلوگیری می‌کند) */
const MAX_OUT_WIDTH = 1200
/** اختلاف نسبیِ مجاز با نسبت هدف؛ کمتر از آن تصویر «هم‌نسبت» حساب می‌شود و دست نمی‌خورد */
const TOLERANCE = 0.01
/** آستانه‌ی آلفا برای تشخیص پیکسلِ «خودِ سوژه» (نه پس‌زمینه‌ی شفاف) */
const SUBJECT_ALPHA = 24
/** اندازه‌ی ضلع بلند برای نمونه‌برداریِ جعبه‌ی سوژه */
const PROBE = 160

type Source = CanvasImageSource & { naturalWidth?: number; naturalHeight?: number }

const sizeOf = (img: Source) => ({
  w: img.naturalWidth || (img as HTMLCanvasElement).width || 0,
  h: img.naturalHeight || (img as HTMLCanvasElement).height || 0,
})

/**
 * جعبه‌ی دربرگیرنده‌ی سوژه (پیکسل‌های غیرشفاف) در مختصات تصویر اصلی. اگر تصویر شفافیت ندارد
 * (یا چیزی پیدا نشد) کل تصویر برمی‌گردد → کراپ وسط‌چین می‌شود.
 */
function subjectBox(img: Source, w: number, h: number) {
  const k = PROBE / Math.max(w, h)
  const pw = Math.max(1, Math.round(w * k))
  const ph = Math.max(1, Math.round(h * k))
  const c = document.createElement('canvas')
  c.width = pw
  c.height = ph
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, pw, ph)
  const px = ctx.getImageData(0, 0, pw, ph).data
  let x0 = pw
  let y0 = ph
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      if ((px[(y * pw + x) * 4 + 3] ?? 0) > SUBJECT_ALPHA) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (x1 < 0) return { x: 0, y: 0, w, h }
  return {
    x: (x0 / pw) * w,
    y: (y0 / ph) * h,
    w: ((x1 - x0 + 1) / pw) * w,
    h: ((y1 - y0 + 1) / ph) * h,
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * تصویر را به نسبتِ دقیقِ `aspect` (عرض/ارتفاع) می‌رساند — فقط با کراپ، هرگز کشیدن/فشردن:
 *  - اگر تصویر از قبل هم‌نسبت است همان Texture اصلی برمی‌گردد (بدون هیچ پردازش یا افت کیفیت).
 *  - اگر پهن‌تر است از طرفین و اگر بلندتر است از بالا/پایین کراپ می‌شود؛ پنجره‌ی کراپ دور
 *    «جعبه‌ی سوژه» (پیکسل‌های غیرشفاف) وسط‌چین می‌شود تا صندلی بریده نشود.
 *  - در هر خطایی (مثلاً Canvas آلوده‌ی CORS) همان Texture اصلی برمی‌گردد.
 * `created` = آیا Texture تازه ساخته شده (برای Dispose در مصرف‌کننده).
 */
export function normalizeTexture(
  texture: THREE.Texture,
  aspect: number,
): { texture: THREE.Texture; created: boolean } {
  try {
    const img = texture.image as Source
    const { w, h } = sizeOf(img)
    if (!w || !h) return { texture, created: false }
    if (Math.abs(w / h / aspect - 1) <= TOLERANCE) return { texture, created: false }

    // بزرگ‌ترین پنجره‌ی هم‌نسبت درون تصویر
    const cropW = w / h > aspect ? h * aspect : w
    const cropH = w / h > aspect ? h : w / aspect

    const box = subjectBox(img, w, h)
    const sx = clamp(box.x + box.w / 2 - cropW / 2, 0, w - cropW)
    const sy = clamp(box.y + box.h / 2 - cropH / 2, 0, h - cropH)

    const outW = Math.round(Math.min(cropW, MAX_OUT_WIDTH))
    const outH = Math.round(outW / aspect)
    const c = document.createElement('canvas')
    c.width = outW
    c.height = outH
    const ctx = c.getContext('2d')!
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, outW, outH)

    return { texture: new THREE.CanvasTexture(c), created: true }
  } catch {
    return { texture, created: false }
  }
}
