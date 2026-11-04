/**
 * نرمال‌سازی تصاویر صندلی public/images/products/side-guest برای نسخه‌ی «تمیز» کاروسل آزمایشی:
 * Trim حاشیه‌ی شفاف → جا دادن در بوم مربع ۹۰۰×۹۰۰ → تراز کف (لبه‌ی پایین) تا سایه‌ی کف همه‌جا درست
 * زیر پایه‌ها بنشیند. «taban» (ست دو صندلی + میز) عمداً کنار گذاشته شده است.
 *
 * اجرا: node scripts/lab/gen-chair-samples.mjs
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC = path.resolve('public/images/products/side-guest')
const OUT = path.resolve('public/images/lab/chairs')
const NAMES = ['arghavan', 'diba', 'kiana', 'mahur', 'nasim', 'parand', 'roya', 'sadaf', 'simin', 'yasna']

const SIZE = 900
const MAX_W = 860
const MAX_H = 830
const BOTTOM = 14 // فاصله‌ی کف صندلی تا لبه‌ی پایین بوم
const MAX_UPSCALE = 1.35

await mkdir(OUT, { recursive: true })
for (const [i, name] of NAMES.entries()) {
  const trimmed = await sharp(path.join(SRC, `${name}-side-guest-chair.png`)).trim().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = trimmed.info
  const k = Math.min(MAX_W / w, MAX_H / h, MAX_UPSCALE)
  const tw = Math.round(w * k)
  const th = Math.round(h * k)
  const chair = await sharp(trimmed.data).resize(tw, th, { kernel: 'lanczos3' }).toBuffer()
  const file = path.join(OUT, `chair-${i + 1}.png`)
  await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: chair, left: Math.round((SIZE - tw) / 2), top: SIZE - BOTTOM - th }])
    .png({ compressionLevel: 9 })
    .toFile(file)
  console.log(`chair-${i + 1}.png`, name, `${tw}x${th}`)
}
