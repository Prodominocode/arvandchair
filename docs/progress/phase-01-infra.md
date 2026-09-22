# گزارش فاز ۱ — راه‌اندازی زیرساخت

**تاریخ:** ۲۰۲۶-۰۹-۰۷ (به‌روزرسانی: ۲۰۲۶-۰۹-۰۷ — اصلاحات Local-First)
**وضعیت این گزارش:** فاز ۱ طبق چک‌لیست `01-workflow-roadmap.md` (بخش «فاز ۱») و دستورالعمل تکمیلی در همان گفتگو انجام شد. فقط زیرساخت خام ساخته شد — هیچ صفحه‌ی محتوایی واقعی (فاز ۳) و هیچ Collection کسب‌وکاری واقعی (فاز ۴) اضافه نشده است.

---

## ۰. اصلاحات بعد از تصمیم Local-First (`00-tech-stack.md` بخش ۱.۱ و ۱.۲)

بعد از نوشتن نسخه‌ی اول این گزارش، `00-tech-stack.md` با تحقیق تحریمی به‌روزرسانی شد: Vercel/Neon/Supabase/Cloudflare R2/Resend/Sentry همگی به‌دلیل الزامات OFAC برای کسب‌وکار ایرانی کنار گذاشته شدند و یک تصمیم **Local-First** جدید اضافه شد (هیچ سرویس ابری تا فاز ۱۱). فاز ۱ با این تصمیم هماهنگ شد:

| مورد | قبل (نسخه‌ی اول این گزارش) | الان |
|---|---|---|
| هاست | Vercel + Preview Deployments | ⛔ **منتفی.** هیچ اقدامی برای Vercel انجام نشد؛ هیچ فایل/کانفیگ نصفه‌کاره‌ای هم برایش وجود نداشت که حذف شود (بخش ۵ زیر همچنان به‌عنوان سابقه نگه داشته شده، با یادداشت انصراف). طبق تصمیم جدید، هاست فقط در **فاز ۱۱** روی **Liara** وصل می‌شود. |
| دیتابیس Staging | **Neon** (بخش ۳ زیر) | ⛔ **منتفی.** طبق Local-First، در فاز ۱ تا ۱۰ اصلاً دیتابیس ابری/Staging وصل نمی‌شود — فقط Postgres لوکال روی Docker. دیتابیس Production فقط در **فاز ۱۱** روی **Liara Managed Postgres** خواهد بود، نه Neon. بخش ۳ زیر به‌عنوان سابقه‌ی تصمیم نگه داشته شده، با علامت منتفی. |
| `docker-compose.yml` | فقط Postgres | Meilisearch و Mailhog هم اضافه شدند، دقیقاً طبق YAML مرجع در `00-tech-stack.md` بخش ۱.۲ (بخش ۲.۲ زیر). |
| ذخیره‌سازی مدیا | (هنوز چیزی ساخته نشده بود) | یک Collection حداقلی `Media` با **Payload Local Disk Storage** (پوشه‌ی `media/`، بدون هیچ S3/R2) اضافه شد (بخش ۲.۸ زیر). |
| فونت | (هنوز چیزی ساخته نشده بود) | **Peyda** (فارسی) + **Manrope** (انگلیسی) Self-hosted با `next/font/local` وایر شدند. در همین مسیر یک باگ واقعی هم پیدا و رفع شد: فایل‌های Manrope که در `public/fonts/` بودند در واقع فونت نبودند (صفحه‌ی HTML خراب با پسوند اشتباه) — با نسخه‌ی معتبر Open-Source جایگزین شدند (بخش ۲.۹ زیر). |
| `.env.example` | کلیدهای Resend/R2/Vercel/Sentry.io | بازنویسی شد: `PAYMENT_PROVIDER=mock`، SMTP برای Mailhog، Meilisearch لوکال؛ کلیدهای Vercel حذف، بقیه به سرویس‌های جدید (SMTP عمومی/Liara Object Storage/GlitchTip) اشاره می‌کنند (بخش ۲.۶ زیر). |

بعد از این اصلاحات، `npx tsc --noEmit`، `pnpm lint`، و `pnpm build` هرسه دوباره اجرا و تأیید شدند (بدون خطا) — بخش ۴ به‌روز شد.

---

## ۱. خلاصه‌ی چک‌لیست فاز ۱ (از `01-workflow-roadmap.md`)

| مورد | وضعیت |
|---|---|
| Init پروژه‌ی Next.js 15 + TypeScript strict | ✅ |
| نصب و پیکربندی Payload CMS (Embedded) | ✅ |
| اتصال PostgreSQL (فقط لوکال Docker، طبق Local-First) | ✅ کانفیگ آماده — تست زنده را خودتان انجام می‌دهید (بخش ۴) |
| پیکربندی next-intl و مسیر `[locale]` | ✅ |
| پیکربندی Tailwind v4 + پایه‌ی shadcn/ui | ✅ |
| ESLint + Prettier + Husky (pre-commit) | ✅ |
| متغیرهای محیطی (`.env.example`) | ✅ (بازنویسی‌شده طبق Local-First) |
| Docker Compose: Postgres + Meilisearch + Mailhog | ✅ |
| Payload Local Disk Storage برای مدیا | ✅ |
| فونت‌های Peyda + Manrope (Self-hosted) | ✅ |
| اتصال Vercel + Preview Deployments | ⛔ **منتفی طبق Local-First** — فقط فاز ۱۱، روی Liara |

---

## ۲. چه چیزی ساخته شد

### ۲.۱ Next.js 15 + Payload CMS 3 (Embedded)
- `next@15.4.11` (بالاترین نسخه‌ی ۱۵.x سازگار با بازه‌ی peerDependency پکیج `@payloadcms/next@3.88.0`؛ نسخه‌ی ۱۶ عمداً رد شد چون `00-tech-stack.md` صراحتاً Next.js 15 را مشخص کرده).
- `payload@3.88.0` با آداپتور `@payloadcms/db-postgres` و ادیتور `@payloadcms/richtext-lexical`.
- ساختار استاندارد Payload 3 روی App Router: `src/app/(payload)` برای پنل ادمین (`/admin`) و مسیرهای API (`/api/*`, `/api/graphql*`)، `src/app/(frontend)/[locale]` برای فرانت.
- `src/payload.config.ts`: فقط یک Collection حداقلی `users` (فقط برای احراز هویت پنل ادمین — نه یک Collection کسب‌وکاری فاز ۴) و یک Global حداقلی `site-settings` (فقط فیلد `enabledLocales`، توضیح بخش ۲.۳).
- `TypeScript strict: true` در `tsconfig.json` (به‌همراه `noUncheckedIndexedAccess`).
- **نکته‌ی فنی مهم:** `package.json` روی `"type": "module"` تنظیم شده. بدون آن، دستور `pnpm generate:types` (CLI خود Payload) با خطای `ERR_REQUIRE_ASYNC_MODULE` شکست می‌خورد (ناسازگاری شناخته‌شده‌ی بین لودر CJS این نسخه از Payload CLI و وابستگی‌های ESM-only آن روی Node 22). این تنظیم را حذف نکنید مگر اینکه علت اصلی باگ را جدا بررسی کرده باشید. `src/payload-types.ts` با موفقیت تولید و در ریپو Commit شده (نه gitignore) — چون هم Payload، هم `importMap.js` پنل ادمین، برای Build اولیه (حتی روی یک Clone تازه، قبل از هر اجرای دستی) به وجود همین دو فایل نیاز دارند؛ بعد از هر تغییر در Collections/Globals باید دوباره `pnpm generate:types` اجرا و Commit شود.

### ۲.۲ پایگاه‌داده PostgreSQL + Meilisearch + Mailhog (Docker Compose)
- `docker-compose.yml` در ریشه‌ی ریپو، سه سرویس:
  - `postgres:16-alpine` با کاربر/دیتابیس `arvand`/`arvandchair` روی پورت `5432` (از قبل بود).
  - `meilisearch` (`getmeili/meilisearch:v1.10`) با `MEILI_MASTER_KEY: localdev-key` روی پورت `7700` — **جدید**.
  - `mailhog` روی پورت‌های `1025` (SMTP) و `8025` (وب UI) — **جدید**.
- ⛔ **تصمیم Neon برای Staging منتفی شد** — جزئیات در بخش ۰ و ۳.

### ۲.۳ next-intl و مسیر `[locale]`
- `src/i18n/routing.ts`: هر ۲ زبان (`fa` پیش‌فرض، `en`) با `localePrefix: 'as-needed'` طبق `03-url-structure-seo.md` (فارسی بدون پیشوند، en با پیشوند). `localeDetection: false` تا هیچ ریدایرکت خودکار بر اساس Accept-Language رخ ندهد (طبق تصمیم صریح همان سند).
- `src/middleware.ts`: میدل‌ور next-intl برای Routing، با matcher که مسیرهای `/admin` و `/api` را دست‌نخورده می‌گذارد.
- **فعال/غیرفعال‌بودن en (`enabledLocales`):** یک Global جدید `site-settings` در Payload اضافه شد با فیلد `enabledLocales` (چندانتخابی: en؛ فارسی همیشه فعال است). در `src/app/(frontend)/[locale]/layout.tsx`، برای هر لوکیل غیر از فارسی، این Global از طریق Local API پیلود خوانده می‌شود؛ اگر لوکیل در لیست نباشد، `notFound()` صدا زده می‌شود (یعنی آن مسیر واقعاً ۴۰۴ می‌شود، نه فقط مخفی در سوییچر).
  - **یک تصمیم پیاده‌سازی که باید بدانید:** این بررسی در سطح Layout (Node.js runtime، نه Edge Middleware) انجام می‌شود، چون خواندن از Postgres در Edge Middleware نیاز به فعال‌سازی `experimental.nodeMiddleware` دارد که برای فاز زیرساخت زودهنگام است. یعنی سوییچر زبان در Header (که در فاز ۳ ساخته می‌شود) باید همین Global را جداگانه بخواند تا گزینه‌های غیرفعال را از UI هم حذف کند — این نکته را در فاز ۳ یادآوری می‌کنم.
  - فیلدهای دیگر `SiteSettings` (مثل `siteName`, `logo`, `navMenu`) عمداً اضافه نشدند — آن‌ها بخشی از مدل داده‌ی کسب‌وکاری فاز ۴ هستند؛ اینجا فقط همان یک فیلد زیرساختی لازم برای فاز ۱ ساخته شد.
- `src/i18n/messages/{fa,en}.json`: فقط یک namespace ساده (`Placeholder`) برای تست لود صحیح هر ۲ زبان — نه محتوای واقعی فاز ۳.
- صفحه‌ی `src/app/(frontend)/[locale]/page.tsx`: یک صفحه‌ی Placeholder ساده (بدون طراحی، بدون GSAP/Framer/R3F) که فقط پیام‌های بالا را نشان می‌دهد.

### ۲.۴ Tailwind v4 + shadcn/ui
- Tailwind v4 با کانفیگ CSS-first (`src/styles/globals.css`، بدون نیاز به `tailwind.config.js` جدا).
- `components.json` برای CLI شادسیان تنظیم شد (style: `new-york`, baseColor: `neutral`, alias یوتیلیتی روی `src/lib/utils/cn.ts`) — **هیچ کامپوننتی هنوز تولید نشده**، طبق دستور صریح فاز ۱ («بدون ساخت کامپوننت اختصاصی»). اجرای `pnpm dlx shadcn@latest add button` (و مشابه) کار فاز ۲ است.

### ۲.۵ ابزار کیفیت کد
- ESLint 9 (Flat Config) با `eslint-config-next@15.4.11` (پین‌شده هم‌نسخه با Next، نه آخرین نسخه‌ی عمومی که با Next 16 هماهنگ است).
- Prettier + `prettier-plugin-tailwindcss` (مرتب‌سازی خودکار کلاس‌های Tailwind).
- Husky + lint-staged: pre-commit روی فایل‌های Stage‌شده `eslint --fix` و `prettier --write` اجرا می‌کند.
- `pnpm lint` و `npx tsc --noEmit` هر دو تمیز اجرا شدند (بدون خطا).

### ۲.۶ متغیرهای محیطی (بازنویسی‌شده طبق Local-First)
`.env.example` با ساختار جدید:
- `DATABASE_URI` — فقط لوکال (Docker)؛ کامنت دیگر به Neon/Supabase اشاره نمی‌کند، به‌جایش می‌گوید نسخه‌ی نهایی فقط در فاز ۱۱ روی Liara Managed Postgres است.
- `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` — بدون تغییر.
- `SMTP_HOST=localhost`, `SMTP_PORT=1025`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL` — **جدید**، جایگزین بخش قبلی `RESEND_*` (چون Resend طبق `00-tech-stack.md` کنار گذاشته شد). همین متغیرها هم برای Mailhog لوکال کار می‌کنند، هم در فاز ۱۱ فقط مقدارشان به SMTP واقعی Liara عوض می‌شود — کد بین این دو حالت فرقی نمی‌کند.
- `PAYMENT_PROVIDER=mock` — **جدید**، دقیقاً طبق طراحی «Mock Payment Provider» در `00-tech-stack.md` بخش ۱.۲ (سوییچ بین Mock و درگاه واقعی). `PAYMENT_GATEWAY_MERCHANT_ID`/`PAYMENT_GATEWAY_API_KEY` برای زمانی که `PAYMENT_PROVIDER` به یک درگاه واقعی تغییر کند نگه داشته شدند.
- بخش ذخیره‌سازی مدیا از `R2_*` به `S3_*` (نام عمومی‌تر) تغییر نام گرفت، با کامنت صریح که فاز ۱ تا ۱۰ اصلاً استفاده نمی‌شود (Local Disk Storage کافی است) و نسخه‌ی نهایی Liara Object Storage است، نه Cloudflare R2.
- `MEILISEARCH_HOST=http://localhost:7700` و `MEILISEARCH_API_KEY=localdev-key` — مقداردهی شد تا دقیقاً با سرویس جدید در `docker-compose.yml` (بخش ۲.۲) هماهنگ باشد.
- `SENTRY_DSN` تنها متغیر مانیتورینگ باقی ماند (کامنت به‌روز شد: GlitchTip Self-hosted در فاز ۱۱، همان SDK `@sentry/nextjs`).
- بخش `VERCEL_URL` **کامل حذف شد**.

### ۲.۷ ساختار پوشه‌بندی
دقیقاً طبق `00-tech-stack.md` بخش ۵ (با یک تطبیق جزئی: Payload در Next.js 15 مسیرهای ادمین/API را زیر `src/app/(payload)` می‌سازد، همان‌طور که خود آن سند پیش‌بینی کرده بود). پوشه‌های `lib/data`, `lib/mock-data`, `lib/payload-client`, `lib/payment-gateway`, `lib/meilisearch`, `components/ui`, `components/scroll`, `components/three` همگی ساخته شدند (خالی، با `.gitkeep`) و آماده‌ی فاز ۲/۳ هستند.

### ۲.۸ Payload Local Disk Storage (تأیید صریح)
یک Collection حداقلی جدید `src/collections/Media.ts` اضافه و در `payload.config.ts` رجیستر شد:
- `upload: { staticDir: <ریشه‌ی پروژه>/media }` — یعنی فایل‌های آپلودی مستقیماً روی دیسک لوکال، در پوشه‌ی `media/` ریشه‌ی ریپو ذخیره می‌شوند.
- **هیچ پلاگین S3/R2/Cloud Storage نصب یا import نشده** — نه در `payload.config.ts`، نه در `package.json`. یعنی رفتار پیش‌فرض Payload (دیسک لوکال) دست‌نخورده مانده؛ این دقیقاً همان چیزی است که Local-First برای فاز ۱ تا ۱۰ می‌خواهد.
- `media/` قبلاً (از همان نسخه‌ی اول این فاز) در `.gitignore` بود (`/media`) — فایل‌های آپلودی کاربر هیچ‌وقت Commit نمی‌شوند.
- این Collection مثل `Users`، یک ضرورت زیرساختی حداقلی است (برای اینکه اصلاً «آپلود» در پنل قابل تست باشد)، نه بخشی از مدل داده‌ی کسب‌وکاری فاز ۴ — فیلدهای واقعی (مثل چند Variant/زاویه‌ی عکس محصول) در فاز ۴ طبق `02-data-model.md` اضافه می‌شوند.
- در فاز ۵ به بعد، فقط با نصب پلاگین `@payloadcms/storage-s3` (یا معادل) و اشاره‌ی آن به `S3_*` در `.env` (بخش ۲.۶)، بدون تغییر در تعریف فیلدهای Collection، سوییچ به Liara Object Storage ممکن است.

### ۲.۹ فونت‌های Self-hosted — Peyda + Manrope (تمام‌شده)
طبق `00-tech-stack.md` بخش ۱.۲ و `06-design-tokens.md`، هیچ فونتی نباید از Google Fonts CDN لود شود (از قبل هم لینکی به آن اضافه نشده بود). `src/styles/fonts.ts` با `next/font/local` نوشته شد و در `src/app/(frontend)/[locale]/layout.tsx` وایر شد (کلاس فونت روی `<html>`، انتخاب فونت فارسی در برابر Manrope بر اساس `dir` در `globals.css`).

**درباره‌ی Peyda:** در نسخه‌ی قبلی این گزارش نوشته بودم فایل قانونی/Open-Source معتبری برای Peyda پیدا نکردم (نه در npm، نه در مخازن متن‌باز شناخته‌شده) و به‌جایش موقتاً Vazirmatn وایر کرده بودم. **شما تأیید کردید که فایل‌های واقعی PeydaWeb از قبل در اختیار پروژه بوده‌اند** (در `public/fonts/` قرار داشتند، من قبل از جست‌وجوی خودم متوجه‌شان نشده بودم). با فایل‌های واقعی جایگزین شد؛ پوشه‌های موقت `public/fonts/vazirmatn/` و `public/fonts/manrope/` (ساخته‌ی خودم) حذف شدند.

- **PeydaWeb (فارسی):** ۹ وزن استاتیک (`Thin`۱۰۰ تا `Black`۹۰۰) از `public/fonts/PeydaWeb-*.woff2` استفاده شد (`ExtraBlack` عمداً کنار گذاشته شد چون در مقیاس استاندارد CSS `font-weight` جایی بالاتر از ۹۰۰ ندارد و با `Black` هم‌پوشانی می‌داشت). یک نسخه‌ی Variable هم موجود است (`PeydaWebVF.woff2`) که فعلاً استفاده نشد — وزن‌های استاتیک صریح‌تر و قابل‌پیش‌بینی‌ترند.
- **Manrope (انگلیسی):** ۷ وزن (`Thin`۲۰۰ تا `ExtraBold`۸۰۰، مطابق بازه‌ی رسمی خود فونت Manrope که از ۲۰۰ شروع می‌شود نه ۱۰۰) از `public/fonts/Manrope-*.woff2`.

**⚠️ یک باگ واقعی پیدا و رفع شد:** موقع Build، Next.js روی همه‌ی ۷ فایل `Manrope-*` خطای «Unknown font format» داد. بررسی کردم و معلوم شد این فایل‌ها اصلاً فونت نبودند — محتوایشان یک صفحه‌ی `<!DOCTYPE html>` بود (احتمالاً دانلود ناموفق/صفحه‌ی خطا که با پسوند `.woff2` ذخیره شده بود)، نه بایت‌های باینری واقعی فونت. چون `next/font/local` این خطا را Fatal نمی‌کند (فقط Warning در کنسول Build و Fallback خاموش به فونت سیستم)، اگر رفع نمی‌شد **فونت Manrope در کل سایت به‌صورت نامرئی از کار می‌افتاد بدون هیچ خطای واضحی** — دقیقاً همان نوع باگی که فقط با دیدن خروجی کامل Build پیدا می‌شود. تمام ۷ فایل با نسخه‌ی معتبر از بسته‌ی رسمی Open-Source `@fontsource/manrope` (مجوز SIL OFL 1.1؛ `public/fonts/Manrope-LICENSE`) جایگزین شدند و Build دوباره بدون هیچ خطای فونت تأیید شد. فایل‌های PeydaWeb را هم جداگانه از نظر Magic Bytes چک کردم (`wOF2`/`wOFF` معتبر) — سالم بودند.

---

## ۳. ⛔ منتفی — تصمیم قبلی: Neon به‌جای Supabase (برای Staging)

> **این بخش دیگر معتبر نیست، فقط به‌عنوان سابقه‌ی تصمیم نگه داشته شده.** بعد از تصمیم Local-First در `00-tech-stack.md`، اصلاً هیچ دیتابیس ابری/Staging در فاز ۱ تا ۱۰ وصل نمی‌شود — فقط Postgres لوکال روی Docker Compose (بخش ۲.۲). Neon هم جزو سرویس‌های آمریکایی کنار‌گذاشته‌شده در بخش ۱.۱ همان سند است (تحریم OFAC). دیتابیس Production فقط در فاز ۱۱ روی **Liara Managed Postgres** وصل خواهد شد. هیچ اقدامی برای Neon انجام نشده بود (نه حساب، نه Connection String)، پس چیزی برای Rollback لازم نبود.

دلیل تصمیم قبلی (منسوخ):
1. پروژه فقط به **Postgres خالص** نیاز دارد — Auth، Storage و Realtime همگی قبلاً در جای دیگری از Stack تصمیم‌گیری شده‌اند (Auth از خود Payload، مدیا از Cloudflare R2). امکانات اضافه‌ی Supabase (Auth/Storage/Realtime) در این معماری استفاده نمی‌شوند و فقط پیچیدگی/سطح حمله‌ی اضافه هستند.
2. **یکپارچگی رسمی Neon–Vercel:** یک Branch مجزای دیتابیس به‌ازای هر Preview Deployment در Vercel می‌سازد — دقیقاً همان چیزی که بند «Preview Deployments برای هر مرحله از کار AI» در `00-tech-stack.md` به‌دنبالش است؛ یعنی هر Preview یک دیتابیس تمیز و ایزوله می‌گیرد بدون کار دستی.
3. Autosuspend روی Tier رایگان Neon یعنی هزینه‌ی محیط Staging برای پروژه‌ای که هنوز محصول واقعی راه‌اندازی نکرده عملاً صفر است.

**اقدام لازم از طرف شما (نمی‌توانم این را جایتان انجام دهم چون نیاز به حساب/ایمیل شما دارد):**
1. یک پروژه‌ی جدید در [neon.tech](https://neon.tech) بسازید (یا Neon Integration را مستقیماً از داخل داشبورد Vercel نصب کنید — که Connection String را خودکار به Environment Variables پروژه اضافه می‌کند).
2. `DATABASE_URI` را در Vercel → Project Settings → Environment Variables (برای Preview و Production جدا) ست کنید.

---

## ۴. تست‌های انجام‌شده و محدودیت مهم این محیط اجرا

**بعد از اصلاحات Local-First (دور دوم، شامل Media Collection و فونت‌ها):**
- `pnpm generate:types` (بعد از اضافه‌شدن Media Collection): ✅ موفق، `src/payload-types.ts` به‌روز شد.
- `npx tsc --noEmit`: ✅ بدون خطا
- `pnpm lint`: ✅ بدون خطا
- `pnpm build` (اولین تلاش، با فایل‌های اصلی Manrope): ❌ ۷ خطای «Unknown font format» — همان باگ فونت خراب که در بخش ۲.۹ توضیح داده شد.
- `pnpm build` (بعد از جایگزینی فایل‌های Manrope، پاک‌سازی کامل `.next`): ✅ Build کامل و موفق، بدون هیچ خطا/Warning — همه‌ی مسیرها (`/[locale]`, `/admin/[[...segments]]`, `/api/*`) کامپایل شدند.

**دور اول (پیش از اصلاحات Local-First):**
- `pnpm dev` + تست HTTP مسیر `/` (فارسی، بدون نیاز به DB برای این مسیر خاص چون فارسی همیشه فعال است): ✅ **200**

**⚠️ محدودیت صریح این محیط (سندباکس اجرای من):** این محیط توسعه Docker یا هیچ نمونه‌ی PostgreSQL واقعی در دسترس ندارد (`docker` و `psql` هیچ‌کدام نصب نیستند). برای اینکه کورکورانه ادعا نکنم مسیرهای وابسته به دیتابیس (`/en`, `/admin`) کار می‌کنند، یک سرور موقت شبیه‌ساز پروتکل Postgres (PGlite) به‌صورت جداگانه (خارج از پروژه، فقط برای تست خودم) راه‌اندازی کردم. نتیجه:
- کد مسیر درست تا لایه‌ی اتصال به Postgres واقعی پیش رفت (Payload موفق شد Handshake پروتکل Postgres را شروع کند و شروع به Pull کردن Schema کرد) — یعنی سیم‌کشی env/config/کد درست است.
- خودِ شبیه‌ساز PGlite زیر بار Query های هم‌زمان (Concurrent) که Next.js/Drizzle در حالت Dev ارسال می‌کنند پایدار نماند (`ECONNRESET`) — این محدودیتِ شبیه‌ساز است، نه یک باگ در کد پروژه؛ Postgres واقعی (لوکال با Docker) این مشکل را ندارد.

**نتیجه:** مسیرهای `/en`, `/admin` (و حالا Media Upload، Meilisearch، Mailhog) را **شما باید یک‌بار لوکال با Docker واقعی تست کنید** تا کاملاً تأیید شوند — همان‌طور که در پیام آخرتان گفتید بعد از این گزارش انجام می‌دهید. مراحل دقیق:
```bash
docker compose up -d
cp .env.example .env   # و PAYLOAD_SECRET را با `openssl rand -base64 32` پر کنید
pnpm install
pnpm dev
```
چک‌لیست پیشنهادی برای تست دستی شما:
- `/`, `/en` — هر ۲ باید ۲۰۰ برگردانند (چون `enabledLocales` پیش‌فرض شامل `en` است).
- `/admin` — باید فرم «ساخت اولین کاربر ادمین» Payload را نشان دهد (چون هنوز هیچ کاربری ساخته نشده)؛ بعد از ساخت کاربر، یک آیتم در Collection «Media» آپلود کنید و مطمئن شوید فایل داخل پوشه‌ی `media/` ریشه‌ی پروژه ظاهر می‌شود (نه هیچ درخواستی به سمت اینترنت/S3).
- `http://localhost:8025` — پنل Mailhog (فعلاً چیزی داخلش نیست چون هنوز هیچ ایمیلی از کد ارسال نشده — طبیعی است).
- `http://localhost:7700` — Meilisearch باید یک پاسخ JSON بدهد (بدون Health UI خاصی، صرفاً برای اطمینان از بالا بودن سرویس).

---

## ۵. ⛔ منتفی — تصمیم قبلی: اتصال Vercel

> **این بخش دیگر معتبر نیست.** طبق تحقیق تحریمی در `00-tech-stack.md` بخش ۱.۱، Vercel هم کنار گذاشته شد. هیچ اقدامی فراتر از چک‌کردن نصب CLI (`npx vercel --version`) انجام نشده بود — نه لاگین، نه ساخت پروژه، نه هیچ فایل کانفیگی (`vercel.json` وجود نداشت). یعنی چیزی برای Rollback لازم نبود؛ فقط ردیف مربوطه در `.gitignore` (`.vercel`) که برای احتیاط اضافه شده بود حذف شد. طبق تصمیم Local-First، هاست فقط در **فاز ۱۱** روی **Liara** وصل می‌شود، نه الان.

متن اصلی (منسوخ، فقط سابقه):

طبق دستور صریح («اگر به مشکل دسترسی خوردی، در گزارش پایان فاز صریح بنویس»): این محیط اجرای من به هیچ حساب Vercel دسترسی/لاگین ندارد. نصب CLI را چک کردم و تا مرحله‌ی `vercel login` (که نیاز به تأیید مرورگر/ایمیل شماست) درست پیش رفت، اما فراتر از آن اکشنی از طرف من انجام نشد.

---

## ۶. یادآوری موارد باز از فاز ۰ (طبق تعهد آن گزارش) — به‌روزشده

طبق `docs/progress/phase-00-discovery.md` بخش ۵، بررسی در‌دسترس‌بودن سرویس‌های خارجی برای کسب‌وکار ایرانی یک Open Item بود. **این بررسی الان انجام شده** — نتیجه‌اش دقیقاً همان تحقیق تحریمی است که در `00-tech-stack.md` بخش ۱.۱ آمده (Vercel/Neon/Supabase/R2/Resend/Sentry به‌دلیل الزامات OFAC کنار گذاشته شدند، جایگزین Liara/GlitchTip Self-hosted شد). یعنی آن Open Item فاز ۰ عملاً با این تصمیم بسته شد؛ چیزی که باقی می‌ماند فقط تأیید نهایی قیمت/محدودیت فعلی Liara و ArvanCloud پیش از فاز ۱۱ است (طبق یادداشت خود `00-tech-stack.md`).

---

## ۷. جمع‌بندی

از نظر ساختاری، فاز ۱ الان کاملاً با تصمیم Local-First هماهنگ است: پروژه Init شد، Payload و Postgres لوکال سیم‌کشی شدند (بدون هیچ دیتابیس ابری)، next-intl هر ۲ مسیر زبان را با منطق فعال/غیرفعال‌سازی از CMS پیاده کرده، Tailwind v4 و پایه‌ی shadcn/ui نصب است، ابزار کیفیت کد (ESLint/Prettier/Husky) فعال است، `docker-compose.yml` هر سه سرویس (Postgres/Meilisearch/Mailhog) را دارد، آپلود مدیا صراحتاً روی دیسک لوکال است، و هر دو فونت (Peyda فارسی + Manrope انگلیسی) کامل Self-hosted و تست‌شده‌اند.

**یک مورد باز واقعی باقی مانده:** تأیید نهایی اجرای زنده روی Docker واقعی (بخش ۴) — طبق پیام آخرتان، خودتان بعد از این گزارش انجام می‌دهید (شامل چک `/`, `/en`, `/admin`، آپلود یک Media نمونه، و پنل Mailhog روی `localhost:8025`).

اتصال Vercel و تصمیم Neon (بخش‌های ۳ و ۵ قبلی) به‌طور کامل **منتفی** شدند و دیگر بخشی از فاز ۱ نیستند. فونت فارسی Peyda هم دیگر باز نیست — با فایل‌های واقعی‌تان وایر و تأیید شد (بخش ۲.۹).

**منتظر تأیید شما می‌مانم قبل از رفتن به فاز ۲ (سیستم طراحی).**
