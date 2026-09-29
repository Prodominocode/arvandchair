/**
 * `prebuild` — فقط روی بیلدر لیارا کاری انجام می‌دهد (لوکال بی‌اثر است).
 *
 * پلتفرم Next لیارا بعد از نصب پکیج‌ها و قبل از `npm run build` فایل next.config.js را با یک
 * wrapper از نوع CommonJS (`require`/`module.exports`) جایگزین می‌کند تا `output: 'standalone'`
 * را اضافه کند. با `"type": "module"` این wrapper اجرا نمی‌شود و build می‌شکند. npm این اسکریپت را
 * بعد از آن تغییر و قبل از `next build` اجرا می‌کند؛ پس next.config.js را به کانفیگ خودمان
 * (config/next.mjs، که standalone را دارد) برمی‌گردانیم.
 */
import fs from 'node:fs'
import path from 'node:path'

const LIARA_DIR = '/usr/local/lib/liara'
const onLiara = fs.existsSync(LIARA_DIR) || process.env.LIARA_PREBUILD_FORCE === '1'
if (!onLiara) process.exit(0)

const root = process.cwd()
const configFiles = fs.readdirSync(root).filter((f) => /^next\.config\./.test(f))

// گزارش در لاگ بیلد: اسکریپت‌های لیارا و کانفیگی که ساخته‌اند (برای عیب‌یابی).
console.log('[liara-prebuild] root files:', fs.readdirSync(root).join(' '))
for (const f of configFiles) {
  console.log(`[liara-prebuild] ---- ${f} (as modified by Liara) ----`)
  console.log(fs.readFileSync(path.join(root, f), 'utf8'))
}
if (fs.existsSync(LIARA_DIR)) {
  for (const f of fs.readdirSync(LIARA_DIR)) {
    const p = path.join(LIARA_DIR, f)
    if (!fs.statSync(p).isFile()) continue
    console.log(`[liara-prebuild] ---- ${p} ----`)
    console.log(fs.readFileSync(p, 'utf8'))
  }
}

for (const f of configFiles) fs.rmSync(path.join(root, f))
fs.writeFileSync(
  path.join(root, 'next.config.js'),
  "// کانفیگ اصلی در config/next.mjs است — توضیح همان‌جا.\nexport { default } from './config/next.mjs'\n",
)
console.log('[liara-prebuild] next.config.js restored -> config/next.mjs')
