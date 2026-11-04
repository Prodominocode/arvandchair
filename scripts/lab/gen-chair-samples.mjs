/**
 * آماده‌سازی تصاویر صندلی نسخه‌ی «تمیز» کاروسل آزمایشی.
 * منبع: public/images/lab/chairs/new/{1..8}.png — یک صندلی از ۸ زاویه‌ی چرخش (۵…۸ آینه‌ی ۴…۱).
 * اندازه/مقیاس هر زاویه دست‌نخورده می‌ماند (تا اندازه‌ی نسبی نماها واقعی بماند)؛ فقط حاشیه‌ی خالی
 * زیر پایه‌ها با یک برش یکسان روی همه حذف می‌شود تا سایه‌ی کف نزدیک چرخ‌ها بنشیند.
 * خروجی: public/images/lab/chairs/chair-{1..8}.png
 *
 * اجرا: node scripts/lab/gen-chair-samples.mjs
 */
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.resolve('public/images/lab/chairs')
const CROP_BOTTOM = 56

for (let i = 1; i <= 8; i++) {
  const src = path.join(DIR, 'new', `${i}.png`)
  const { width, height } = await sharp(src).metadata()
  await sharp(src)
    .extract({ left: 0, top: 0, width, height: height - CROP_BOTTOM })
    .png({ compressionLevel: 9 })
    .toFile(path.join(DIR, `chair-${i}.png`))
  console.log(`chair-${i}.png`, `${width}x${height - CROP_BOTTOM}`)
}
