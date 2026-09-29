import fs from 'node:fs'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// روی بیلدر لیارا (set_standalone.sh): این فایل به user.next.config.mjs کپی و با یک wrapper از نوع ESM
// (import + `output: 'standalone'`) جایگزین می‌شود. پسوند باید `.mjs` بماند: برای `next.config.js`
// لیارا wrapper از نوع CommonJS می‌سازد که با `"type": "module"` پروژه اجرا نمی‌شود.
const isLiaraBuild = fs.existsSync('/usr/local/lib/liara') || process.env.LIARA_BUILD === '1'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // بیلد لیارا سقف زمانی دارد و CPU آن محدود است؛ Type-check و ESLint آنجا تکرار نمی‌شوند
  // (لوکال: `npm run build` هر دو را اجرا می‌کند + ESLint در pre-commit).
  eslint: { ignoreDuringBuilds: isLiaraBuild },
  typescript: { ignoreBuildErrors: isLiaraBuild },
  webpack: (config, { dev }) => {
    // واچر dev کل ریشه‌ی پروژه را می‌بیند؛ ابزارهایی که خروجی/لاگ خود را داخل پروژه می‌نویسند
    // (مثل `.playwright-mcp/` که هر پیام کنسول را در یک فایل لاگ اضافه می‌کند) با هر خط لاگِ
    // Fast Refresh یک بازسازی جدید راه می‌اندازند → حلقه‌ی بی‌پایان HMR که استیت کامپوننت‌ها
    // (اسلایدر/GSAP) را مدام ریست و کش `.next` را خراب می‌کند.
    if (dev) {
      const extraIgnored = '**/.playwright-mcp/**'
      const ignored = config.watchOptions?.ignored
      // webpack فقط «یک RegExp» یا «آرایه‌ی رشته‌ی Glob» می‌پذیرد؛ پیش‌فرض Next ممکن است هر
      // کدام باشد، پس هر دو شکل را جداگانه با Glob ما ترکیب می‌کنیم.
      const nextIgnored =
        ignored instanceof RegExp
          ? new RegExp(`${ignored.source}|[\\\\/]\\.playwright-mcp[\\\\/]`)
          : [
              ...(Array.isArray(ignored) ? ignored.filter((p) => typeof p === 'string' && p) : []),
              ...(typeof ignored === 'string' && ignored ? [ignored] : []),
              extraIgnored,
            ]
      config.watchOptions = { ...config.watchOptions, ignored: nextIgnored }
    }
    return config
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
