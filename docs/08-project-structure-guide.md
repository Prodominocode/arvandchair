# ۰۸ | راهنمای ساختار پروژه و نحوه‌ی کدنویسی صفحات UI

این سند، برخلاف `00` تا `07` که اسناد **برنامه‌ریزی پیش از شروع کد** بودند، یک **راهنمای مرجع** برای کدی است که واقعاً تا الان (پایان فاز ۲) نوشته شده — یعنی «کجا باید دنبال چی بگردم» و «فایل جدید را کجا بسازم». هر وقت ساختار تغییر کرد (مثلاً فاز ۴ که مدل داده نهایی می‌شود)، این سند هم باید به‌روز شود.

---

## ۱. نقشه‌ی کلی پوشه‌ها

```
src/
  app/
    (frontend)/[locale]/   → همه‌ی صفحات عمومی سایت (فارسی/انگلیسی/عربی)
    (payload)/             → پنل ادمین + API پیلود (بدون locale)
  collections/              → تعریف مدل‌های داده‌ی Payload (فاز ۴ کامل می‌شود)
  globals/                  → تنظیمات سراسری Payload (مثل SiteSettings)
  components/
    ui/                      → کامپوننت‌های پایه (shadcn/ui) — فاز ۲
    layout/                  → Header/Footer/LocaleSwitcher و ناوبری سراسری سایت — فاز ۳
    scroll/                  → کامپوننت‌های GSAP/ScrollTrigger — فاز ۳
    three/                   → صحنه‌های React Three Fiber — اسکلتش فاز ۲، محتوا فاز ۳
  lib/
    data/                    → لایه‌ی Data Access (فاز ۳: از mock-data، فاز ۵: از Payload)
    mock-data/               → داده‌ی نمونه‌ی TypeScript (فاز ۳)
    payload-client/          → کمک‌تابع‌های ارتباط با Payload Local API
    payment-gateway/         → Providerهای پرداخت (Mock فعلاً، فاز ۶)
    meilisearch/             → اتصال به موتور جستجو
    motion/                  → قرارداد GSAP (scroll-tokens.ts) — فاز ۲
    utils/                   → ابزارهای عمومی (مثل cn.ts)
  i18n/                     → پیکربندی next-intl + فایل‌های ترجمه
  styles/                   → globals.css (همه‌ی توکن‌های طراحی) + fonts.ts
  middleware.ts              → مسیریابی زبان (next-intl)
  payload.config.ts          → پیکربندی مرکزی Payload (Collections/Globals ثبت می‌شوند اینجا)
docs/
  progress/                  → گزارش پایان هر فاز (وضعیت واقعی پروژه)
public/
  fonts/, images/            → فایل‌های استاتیک Self-hosted
```

قانون کلی: **کامپوننت‌های `app/` نازک‌اند** (فقط چیدمان صفحه + خواندن از `lib/data` یا `i18n`)؛ منطق و داده در `lib/` و `collections/` زندگی می‌کنند. این جداسازی همان چیزی است که فاز ۵ (اتصال داده‌ی واقعی) را بدون تغییر UI ممکن می‌کند.

---

## ۲. Route ها کجا تعریف می‌شوند؟

پروژه از **Next.js App Router** استفاده می‌کند: هر URL مستقیماً از مسیر پوشه‌ها زیر `src/app/` مشتق می‌شود — یک فایل جدا برای «تعریف Route» مثل Express/React Router وجود ندارد.

### ۲.۱ دو Route Group مجزا

```
src/app/(frontend)/[locale]/...   →  /, /products, /style-guide, ...
src/app/(payload)/...             →  /admin, /api/*
```

پرانتز دور `(frontend)` و `(payload)` یعنی **Route Group** — این اسم‌ها در URL نهایی ظاهر نمی‌شوند، فقط برای سازمان‌دهی کدند. نتیجه‌ی عملی: این پروژه **دو Layout ریشه‌ی مستقل** دارد (نه یک `src/app/layout.tsx` مشترک):
- `(frontend)/[locale]/layout.tsx` → `<html>`/`<body>` سایت عمومی (فونت، جهت RTL/LTR، Provider ترجمه).
- `(payload)/layout.tsx` → `<html>`/`<body>` مخصوص پنل ادمین (خودش را Payload می‌سازد).

این یعنی هر صفحه‌ی جدید سایت باید زیر `(frontend)/[locale]/` باشد تا فونت/جهت/ترجمه را رایگان بگیرد؛ اگر بیرون آن ساخته شود (مثلاً مستقیم زیر `src/app/`)، هیچ `<html>`/فونتی نخواهد داشت.

### ۲.۲ سگمنت پویا `[locale]`

هر پوشه‌ی زیر `(frontend)` باید زیر `[locale]` برود، چون next-intl همان بخش اول URL را به‌عنوان زبان می‌خواند. جدول واقعی از پروژه:

| فایل | URL (فارسی، پیش‌فرض) | URL (انگلیسی) |
|---|---|---|
| `(frontend)/[locale]/page.tsx` | `/` | `/en` |
| `(frontend)/[locale]/style-guide/page.tsx` | `/style-guide` | `/en/style-guide` |
| `(payload)/admin/[[...segments]]/page.tsx` | `/admin` | (بدون locale — عمداً) |

فارسی چون `defaultLocale` است، پیشوند نمی‌گیرد (`localePrefix: 'as-needed'` در `src/i18n/routing.ts` — طبق تصمیم `03-url-structure-seo.md`). این منطق در سه‌جا با هم هماهنگ کار می‌کنند:
1. **`src/i18n/routing.ts`** — لیست زبان‌ها (`fa`/`en`/`ar`) و این‌که کدام پیش‌فرض است.
2. **`src/middleware.ts`** — روی هر درخواست (به‌جز `/admin`, `/api`, فایل‌های استاتیک) اجرا می‌شود و URL را به locale درست map می‌کند.
3. **`(frontend)/[locale]/layout.tsx`** — علاوه‌بر تشخیص خود next-intl، یک چک اضافه هم دارد: اگر locale غیر از فارسی باشد، از Payload (`SiteSettings.enabledLocales`) می‌پرسد آیا این زبان واقعاً «فعال» شده یا نه؛ اگر نه → `notFound()`.

### ۲.۳ چطور یک صفحه‌ی جدید بسازیم؟ (مثال: `/about`)

۱. پوشه بساز: `src/app/(frontend)/[locale]/about/page.tsx`
۲. داخلش یک Server Component بنویس که locale را از `params` بگیرد و `setRequestLocale` را صدا بزند (دقیقاً مثل `style-guide/page.tsx` یا `page.tsx` فعلی):

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Args = { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('About')

  return <main>{t('title')}</main>
}
```

۳. اگر بخش‌های تعاملی (فرم، تب، مودال) لازم است، یک فایل جدا کنارش با `'use client'` بساز (مثل الگوی `style-guide/page.tsx` + `style-guide-content.tsx`) — صفحه Server می‌ماند، فقط قسمت تعاملی Client می‌شود.
۴. namespace ترجمه (`About`) را به هر سه `src/i18n/messages/fa.json`, `en.json`, `ar.json` اضافه کن (بخش ۳ همین سند).
۵. اگر صفحه در نقشه‌ی سئوی `03-url-structure-seo.md` است، `canonical`/`hreflang`/Structured Data طبق چک‌لیست همان سند اضافه شود (فاز ۹ کامل می‌شود، ولی ساختار پایه از همین الان رعایت شود).

نتیجه خودکار: `/about` (فارسی)، `/en/about`، `/ar/about` — بدون نوشتن هیچ Route جداگانه‌ای.

---

## ۳. زبان و محتوای متنی

### ۳.۱ فایل‌های کلیدی i18n

| فایل | نقش |
|---|---|
| `src/i18n/routing.ts` | تعریف لیست زبان‌ها، پیش‌فرض، جهت RTL |
| `src/middleware.ts` | اجرای Routing next-intl روی هر درخواست |
| `src/i18n/request.ts` | مشخص می‌کند برای هر درخواست کدام فایل JSON ترجمه لود شود |
| `src/i18n/navigation.ts` | نسخه‌ی locale-آگاه از `Link`/`redirect`/`usePathname` — همیشه از این‌ها استفاده کن، نه از `next/link` خام |
| `src/i18n/messages/fa.json`, `en.json`, `ar.json` | خود متن‌ها |

### ۳.۲ کجا از ترجمه استفاده کنیم؟

- **Server Component:** `const t = await getTranslations('Namespace')` (از `next-intl/server`)
- **Client Component:** `const t = useTranslations('Namespace')` (از `next-intl`) — نیاز به `NextIntlClientProvider` دارد که از قبل در `layout.tsx` سایت کل را پوشانده، پس هر Client Component داخل `(frontend)` رایگان به آن دسترسی دارد.

### ۳.۳ ساختار فایل پیام‌ها

هر فایل یک شیء تخت با namespace های سطح بالا است (`Placeholder`, `StyleGuide`, ...). داخل هر namespace می‌توان تودرتو رفت (مثلاً `StyleGuide.sections.colors`). **قانون:** هیچ رشته‌ی فارسی/انگلیسی/عربی مستقیم در JSX نوشته نشود — همیشه از `t('key')` بخوان، حتی برای متن‌های ظاهراً بی‌اهمیت (مثل placeholder یک Input) — نمونه‌اش را در `style-guide-content.tsx` ببین.

### ۳.۴ فعال/غیرفعال‌بودن en/ar

این یک قانون تجاری است، نه فقط UI: `SiteSettings.enabledLocales` (یک Global در `src/globals/SiteSettings.ts`، مدیریت‌شده از پنل ادمین `/admin`) تعیین می‌کند آیا `/en` و `/ar` اصلاً باید ساخته شوند یا `404` بدهند. اگر صفحه‌ای تازه اضافه کردی و در انگلیسی/عربی «کار نکرد»، اول این تنظیم را در `/admin` چک کن، نه کد را.

---

## ۴. محتوا کجا قرار می‌گیرد؟ (بسته به فاز فعلی پروژه)

الان (بعد از فاز ۲، قبل از فاز ۳) هنوز هیچ داده‌ی محصول/portfolio/وبلاگی وجود ندارد. وقتی فاز ۳ شروع شود:

1. **`src/lib/mock-data/`** — داده‌ی نمونه‌ی TypeScript (چند محصول واقعی‌نما، نه Lorem Ipsum) — فقط برای این فاز و فاز‌های بعد تا قبل از فاز ۵.
2. **`src/lib/data/`** — توابعی مثل `getProducts()`, `getProductBySlug()` که کامپوننت‌های UI **فقط از این‌جا** داده می‌گیرند، هرگز مستقیم از `mock-data` import نمی‌کنند. در فاز ۵، فقط داخل همین توابع عوض می‌شود (از خواندن فایل JS به فراخوانی Payload Local API) — کامپوننت‌های صفحه دست‌نخورده می‌مانند.
3. **`src/collections/*.ts`** — مدل داده‌ی واقعی (Products, Orders, ...) که در پنل ادمین Payload قابل‌مدیریت است؛ الان فقط `Users` (احراز هویت ادمین) و `Media` (آپلود فایل) وجود دارند؛ فاز ۴ بقیه را اضافه می‌کند.
4. **`src/globals/*.ts`** — تنظیمات Singleton (نه لیستی) مثل `SiteSettings`؛ فاز ۴ ممکن است فیلدهای بیشتری (نام سایت، لوگو، منو) اضافه کند.

---

## ۵. استایل و توکن‌های طراحی کجاست؟

### ۵.۱ منبع واحد توکن‌ها

`src/styles/globals.css` — **تنها فایلی** که رنگ، Type Scale، Spacing سطح صفحه، Radius، Shadow، و Motion Duration/Easing در آن تعریف می‌شود (Tailwind v4، بدون `tailwind.config.js` جدا؛ همه‌چیز با دستور `@theme` داخل همین CSS). دو لایه دارد:
- **Primitive** (بالای فایل، در `@theme`): ۵ رنگ برند + ۳ رنگ وضعیت — این‌ها هیچ‌وقت مستقیم عوض نمی‌شوند مگر برند رسماً تغییر کند.
- **Semantic** (در `:root` + `@theme inline`): نقش‌هایی مثل `primary`, `border`, `muted` که از رنگ‌های Primitive مشتق می‌شوند — اگر روزی Dark Mode اضافه شد، فقط همین بخش override می‌شود.

جزئیات کامل و دلیل هر عدد در [phase-02-design-system.md](./progress/phase-02-design-system.md) است.

### ۵.۲ فونت

`src/styles/fonts.ts` — تعریف دو فونت Self-hosted (Peyda فارسی/عربی، Manrope انگلیسی) با `next/font/local`؛ فایل‌های واقعی در `public/fonts/`. سوییچ بین این دو بر اساس `dir` صفحه در همان `globals.css` انجام می‌شود، نه در جاوااسکریپت.

### ۵.۳ کامپوننت‌های پایه (shadcn/ui)

`src/components/ui/` — کامپوننت‌های عمومی (Button, Card, Input, ...). این‌ها را دستی نمی‌نویسیم؛ برای افزودن یک کامپوننت جدید:

```bash
pnpm dlx shadcn@latest add <نام-کامپوننت>
```

⚠️ بعد از هر اجرا چک کن که import داخلی‌اش `from '@/lib/utils/cn'` باشد نه `from "cn"` — رجیستری فعلی shadcn گاهی یک پکیج بیرونی به همین اسم می‌نویسد (در فاز ۲ این اتفاق افتاد و اصلاح شد؛ به `phase-02-design-system.md` بخش ۳ نگاه کن). این فایل‌ها را با کلاس‌های معنایی (`bg-primary`, `text-muted-foreground`, ...) می‌نویسند، پس با تغییر توکن در `globals.css`، ظاهرشان خودکار عوض می‌شود — نیازی به ویرایش دستی این فایل‌ها برای تغییر رنگ/رادیوس نیست.

کامپوننت‌های اختصاصیِ یک صفحه (مثلاً کارت محصول) اینجا نمی‌روند — آن‌ها مستقیم کنار همان صفحه یا در یک پوشه‌ی مخصوص خودشان ساخته می‌شوند (فاز ۳).

### ۵.۴ ترکیب className

همیشه از `cn(...)` در `src/lib/utils/cn.ts` استفاده کن (نه رشته‌چسبانی دستی) — این تابع کلاس‌های Tailwind متناقض را درست ادغام می‌کند.

---

## ۶. موشن، اسکرول، سه‌بعدی

| نیاز | فایل | وضعیت |
|---|---|---|
| ترنزیشن ساده‌ی UI (هاور، فید) | کلاس‌های Tailwind (`duration-fast`, `ease-emphasis`, ...) از `globals.css` | آماده، همین الان قابل‌استفاده |
| روایت اسکرول‌بیس (GSAP ScrollTrigger) | `src/components/scroll/` (فاز ۳ محتوا می‌سازد) + قرارداد نام‌گذاری در `src/lib/motion/scroll-tokens.ts` | فقط قرارداد آماده است، GSAP هنوز نصب نیست |
| صحنه‌ی سه‌بعدی (Hero/Viewer محصول) | `src/components/three/Scene.tsx` (پوسته‌ی IntersectionObserver+Fallback آماده) + `SceneCanvas.tsx` (Canvas واقعی، فقط نور/دوربین) | کتابخانه نصب شده؛ محتوای واقعی مدل، فاز ۳ |

هرکدام از این سه کتابخانه (GSAP، Framer Motion، R3F) فقط داخل همین پوشه‌های اختصاصی و همیشه با `next/dynamic` (بدون SSR) استفاده شوند — هرگز در `layout.tsx` سراسری import نشوند (قانون `00-tech-stack.md` بخش ۲.۱).

---

## ۷. جدول مرجع سریع

| «کجاست؟» | مسیر |
|---|---|
| تعریف URL/Route هر صفحه | `src/app/(frontend)/[locale]/**/page.tsx` |
| Layout سراسری سایت (فونت، جهت، Provider ترجمه) | `src/app/(frontend)/[locale]/layout.tsx` |
| متن‌های هر زبان | `src/i18n/messages/{fa,en,ar}.json` |
| تنظیم لیست زبان‌ها/پیش‌فرض | `src/i18n/routing.ts` |
| رنگ/فونت/Spacing/Radius/Shadow/Motion | `src/styles/globals.css` |
| فونت‌های Self-hosted | `src/styles/fonts.ts` + `public/fonts/` |
| کامپوننت پایه (Button, Card, ...) | `src/components/ui/` |
| کامپوننت اسکرول/سه‌بعدی | `src/components/scroll/`, `src/components/three/` |
| داده‌ی نمونه (فاز ۳) | `src/lib/mock-data/` |
| تابع خواندن داده (UI فقط از این‌جا می‌خواند) | `src/lib/data/` |
| مدل داده‌ی واقعی CMS | `src/collections/*.ts`, `src/globals/*.ts` |
| تنظیمات مرکزی Payload | `src/payload.config.ts` |
| پنل ادمین/API | `src/app/(payload)/` |
| گزارش وضعیت واقعی هر فاز | `docs/progress/phase-XX-*.md` |

---

## گام بعدی

با این سند، ساختار پروژه تا پایان فاز ۲ کامل مستند شده. فاز ۳ (`01-workflow-roadmap.md`) وقتی شروع شود، همین سند به‌روز می‌شود تا الگوهای واقعی `lib/mock-data` و `lib/data` را هم نشان دهد.
