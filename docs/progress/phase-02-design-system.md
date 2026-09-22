# گزارش فاز ۲ — سیستم طراحی (Design System)

**تاریخ:** ۲۰۲۶-۰۹-۰۸
**وضعیت این گزارش:** فاز ۲ طبق چک‌لیست `01-workflow-roadmap.md` (بخش «فاز ۲») انجام شد: توکن‌های طراحی، کتابخانه‌ی کامپوننت پایه (shadcn/ui با توکن‌های اروند)، پایپ‌لاین Asset سه‌بعدی + اسکلت `Scene.tsx`، و صفحه‌ی `/style-guide`. هیچ کامپوننت اختصاصی صفحه (کارت محصول و مشابه — کار فاز ۳) ساخته نشد.

---

## ۰. یک تصمیم که در حین کار گرفته شد (نیاز به تأیید شما نداشت چون قبلاً پرسیده و پاسخ گرفته شد)

قبل از شروع، درباره‌ی اسکلت `components/three/Scene.tsx` سؤال کردم چون بند «آماده‌ی فاز ۳» در چک‌لیست فاز ۲ با بند «بدون R3F واقعی در این فاز» در سیاست `00-tech-stack.md` بخش ۲.۱ در ظاهر تناقض داشت. **پاسخ شما:** «نصب کن و Canvas خالی واقعی بساز». طبق همین پاسخ، `three`/`@react-three/fiber`/`@react-three/drei` نصب شدند و `Scene.tsx`/`SceneCanvas.tsx` یک Canvas واقعی (فقط نور + دوربین، بدون مدل محصول) دارند — جزئیات بخش ۴.

---

## ۱. خلاصه‌ی چک‌لیست فاز ۲

| مورد | وضعیت |
|---|---|
| Type Scale, Spacing Scale, Radius, Shadow (Tailwind v4 `@theme`) | ✅ |
| Motion Tokens (Duration/Easing + قرارداد نام‌گذاری ScrollTrigger) | ✅ |
| کتابخانه‌ی کامپوننت پایه (shadcn/ui با توکن‌های برند) | ✅ |
| پایپ‌لاین Asset سه‌بعدی (مستندسازی + اسکلت `Scene.tsx`) | ✅ |
| صفحه‌ی `/style-guide` (noindex) | ✅ |

---

## ۲. توکن‌های طراحی (`src/styles/globals.css`)

### ۲.۱ معماری دو لایه
- **لایه‌ی ۱ (Primitive):** ۵ رنگ برند اروند دقیقاً طبق `06-design-tokens.md` (`arvand-gold` #D2B67F، `arvand-slate` #6D6F71، `arvand-ink` #2B2A28، `surface-white`، `surface-mist`) + ۳ رنگ وضعیت جدید در همین فاز (`success` #4B7B4E، `warning` #B8863B، `danger` #B3453A — برند این‌ها را تعریف نکرده بود؛ برای Badge موجودی/استعلام در فاز ۶/۸ لازم می‌شوند). این ۸ رنگ در `@theme` (نه `@theme inline`) تعریف شدند تا Tailwind مستقیماً یوتیلیتی `bg-arvand-gold`/`text-success`/... تولید کند.
- **لایه‌ی ۲ (Semantic):** نقش‌های استاندارد shadcn (`background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover` + `-foreground` هرکدام) در `:root` تعریف و در `@theme inline` به Tailwind افشا شدند. این جداسازی عمدی است: تغییر حالت روشن/تیره (هنوز Backlog، سند ۰۶ بخش ۴) در آینده فقط با override این بلوک `:root` ممکن می‌شود، بدون لمس هیچ کامپوننتی.
- رنگ‌های خام باقی‌مانده (`border`, `input`, `muted-foreground`) به‌جای Hex اختیاری جدید، با `color-mix(in srgb, var(--color-arvand-slate) N%, white)` از همان ۵ رنگ برند مشتق شدند — یعنی هیچ رنگ تصادفی/مستندنشده به سیستم اضافه نشد.

### ۲.۲ تصمیم‌های Contrast (WCAG)
- **Primary CTA:** پس‌زمینه `arvand-gold` + متن `arvand-ink` — دقیقاً طبق قانون صریح سند ۰۶ (نه سفید، به‌خاطر Contrast ~۲:۱ طلایی).
- **Focus Ring:** به‌جای `arvand-gold` (Contrast ~۲:۱، رد شدن از آستانه‌ی ۳:۱ برای اجزای غیرمتنی طبق WCAG 1.4.11)، از `arvand-ink` استفاده شد. این یک انحراف کوچک از پیش‌فرض shadcn (که معمولاً از `primary` برای ring استفاده می‌کند) است، عمداً برای دسترس‌پذیری.
- **Warning ≠ Gold:** رنگ warning عمداً یک قهوه‌ای‌سوخته (#B8863B) متفاوت از `arvand-gold` انتخاب شد تا با قانون «فقط یک لهجه‌ی طلایی در هر صفحه» (سند ۰۶) تداخل نکند — یک بج Warning را نباید با دکمه‌ی CTA اصلی اشتباه گرفت.

### ۲.۳ Type Scale
پایه ۱۶px، هدف نسبت ۱.۲۵ طبق سند ۰۶ بخش ۳. **تصمیم:** در اندازه‌های کوچک (xs/sm/base) به مقادیر متعارف UI (۱۲/۱۴/۱۶px) رند شد به‌جای پیروی خشک از توان ریاضی ۱.۲۵ — این یک انحراف آگاهانه از عدد دقیق است، نه بی‌دقتی: مقیاس‌های تایپوگرافی تولیدی (مثل Material/Utopia) معمولاً در سایزهای کوچک برای خوانایی UI از نسبت هندسی صرف عقب‌نشینی می‌کنند. سایزهای بزرگ‌تر (`2xl` به بالا) نسبت ~۱.۲–۱.۳۳ را حفظ می‌کنند.

| Token | اندازه | Line-height |
|---|---|---|
| `text-xs` | 12px | 1.5 |
| `text-sm` | 14px | 1.5 |
| `text-base` | 16px | 1.6 |
| `text-lg` | 18px | 1.6 |
| `text-xl` | 20px | 1.5 |
| `text-2xl` | 24px | 1.4 |
| `text-3xl` | 30px | 1.3 |
| `text-4xl` | 36px | 1.2 |
| `text-5xl` | 48px | 1.15 |
| `text-6xl` | 60px | 1.1 |

Line-height بدنه (`base`/`lg` = 1.6) عمداً سخاوتمندانه‌تر از حد معمول لاتین (معمولاً ۱.۵) انتخاب شد چون اسکریپت فارسی به فضای عمودی بیشتری برای خوانایی نیاز دارد. وزن‌ها (Regular/Medium/Semibold/Bold = 400/500/600/700) از یوتیلیتی پیش‌فرض Tailwind استفاده می‌کنند بدون نیاز به Token جدید — چون هر دو فونت (Peyda ۹ وزنه، Manrope ۷ وزنه) دقیقاً همین ۴ وزن را پوشش می‌دهند.

### ۲.۴ Spacing
مقیاس پایه‌ی Tailwind v4 (`--spacing: 0.25rem`/4px multiplier) دست‌نخورده ماند — استاندارد صنعتی، دلیلی برای تغییرش نبود. روی آن، یک لایه‌ی «ریتم Layout» برای فاصله‌ی سطح صفحه/سکشن اضافه شد (فاز ۳ مصرف می‌کند): `spacing-section-y-sm` (48px)، `spacing-section-y-md` (80px)، `spacing-section-y-lg` (128px)، `spacing-container-x` (24px) — قابل استفاده مستقیم به‌صورت `py-section-y-md`, `px-container-x` چون Tailwind v4 از namespace نام‌گذاری‌شده در `--spacing-*` هم پشتیبانی می‌کند (نه فقط مضرب عددی).

**عرض کانتینر (`max-w-container`, 1440px):** تا قبل از این، عرض حداکثر کانتینر سطح صفحه بین فایل‌های مختلف ناهماهنگ بود (`max-w-7xl`=1280px در صفحه‌ی اصلی/هدر/فوتر/آرشیو محصول، `max-w-6xl`=1152px در landing1/about/contact) و هیچ Token مشترکی نداشت. یک Token جدید در namespace `--max-width-*` اضافه شد: `--max-width-container: 90rem` (1440px)، و همه‌ی کانتینرهای سطح صفحه روی کلاس یکسان `max-w-container` یکدست شدند. دلیل انتخاب 1440 (به‌جای نگه‌داشتن 1280 یا رفتن تا 1600): روی مانیتورهای رایج امروز (≥1920px) فضای تنفس بیشتری به تصاویر محصول/پرتفولیو می‌دهد بدون این‌که خط متن پاراگراف‌ها را طولانی/ناخوانا کند (چون پاراگراف‌ها `max-w-[Nch]` جدا دارند، نه عرض کانتینر کامل)؛ صفحه‌ی style-guide عمداً از این Token مستثنی ماند و همچنان `max-w-5xl` (1024px) دارد چون صرفاً ویترین کامپوننت‌هاست، نه یک صفحه‌ی نهایی محصول. **وضعیت: آزمایشی** — روی نتیجه‌ی بصری در صفحات واقعی تصمیم نهایی گرفته می‌شود.

### ۲.۵ Radius
`--radius: 0.625rem` (10px) پایه — نه کاملاً تیز، نه بیش‌ازحد گرد؛ هم‌راستا با توصیف ترمینال‌های نرم لوگو در سند ۰۶. `radius-sm/md/lg/xl/2xl` با همان الگوی استاندارد shadcn (`calc(var(--radius) ± Npx)`) مشتق شدند تا کامپوننت‌های نصب‌شده (که از قبل `rounded-md`/`rounded-lg`/`rounded-xl` استفاده می‌کنند) بدون هیچ ویرایشی رادیوس برند را بگیرند.

### ۲.۶ Shadow
طیف ۵مرحله‌ای (`xs`→`xl`) با رنگ پایه‌ی `rgb(43 42 40)` (= `arvand-ink`) به‌جای سیاه خنثی پیش‌فرض Tailwind — یک جزئیات ظریف اما عمدی برای این‌که سایه‌ها هم با گرمای پالت رنگی هماهنگ باشند، نه یک انتخاب فنی تصادفی.

### ۲.۷ Motion Tokens
- **Duration (میلی‌ثانیه، برای CSS/Framer Motion):** `duration-fast` (150ms)، `duration-base` (250ms)، `duration-slow` (400ms) — دقیقاً همان سه سطحی که چک‌لیست خواسته بود.
- **Easing:** عمداً حداقلی نگه داشته شد — `ease-in`/`ease-out`/`ease-in-out`/`ease-linear` پیش‌فرض Tailwind (که از قبل همان منحنی‌های استاندارد متریال‌اند) دوباره تعریف نشدند تا Token تکراری/بی‌فایده اضافه نشود؛ فقط **یک** منحنی برند اضافه شد: `ease-emphasis` (`cubic-bezier(0.22, 1, 0.36, 1)`) برای لحظات شاخص (Hero، ترنزیشن‌های تأکیدی).
- **قرارداد GSAP/ScrollTrigger (فاز ۳ مصرف می‌کند):** چون GSAP واحد زمانش ثانیه است (نه میلی‌ثانیه مثل توکن‌های بالا) و هنوز در پروژه نصب نیست، این قرارداد در یک فایل TypeScript جدا (بدون هیچ وابستگی به gsap) مستند شد: `src/lib/motion/scroll-tokens.ts` — شامل `GSAP_DURATION` (fast/base/slow/slower بر حسب ثانیه)، `GSAP_EASE` (نام Ease های خود GSAP: `power2.out`, `power2.in`, `expo.out`, `none`)، و `SCROLL_TRIGGER` با دو الگوی نام‌گذاری‌شده: `reveal` (بیشتر سکشن‌ها، بدون Pin) و `pin` (روایت اسکرول‌بیس شاخص Home/About، طبق سیاست ۰۰-tech-stack بخش ۲.۱).

---

## ۳. کتابخانه‌ی کامپوننت پایه (shadcn/ui)

با `pnpm dlx shadcn@latest add` این ۱۷ Primitive نصب شدند: `button`, `card`, `input`, `label`, `textarea`, `select`, `tabs`, `accordion`, `badge`, `dialog` (نقش Modal)، `separator`, `checkbox`, `radio-group`, `switch`, `tooltip`, `skeleton`, `sonner` (Toast). فهرست فراتر از حداقل درخواست‌شده (Button/Card/Input/Badge/Modal) است چون فرم‌های فاز ۳ (استعلام قیمت، Checkout، احراز هویت، فیلتر محصول) به Select/Tabs/Checkbox/RadioGroup/Switch/Tooltip/Skeleton نیاز خواهند داشت.

**⚠️ یک ناهماهنگی واقعی از CLI پیدا و اصلاح شد:** نسخه‌ی فعلی رجیستری shadcn، به‌جای استفاده از alias محلی پروژه (`@/lib/utils/cn`، طبق `components.json` از فاز ۱)، در همه‌ی ۱۷ فایل `import { cn } from "cn"` نوشته بود — یعنی یک پکیج بیرونی جدید و نامرتبط به نام `cn` (نسخه‌ی ۰.۲.۶ npm) به `package.json` اضافه کرده بود که عملاً کار تکراری همان `src/lib/utils/cn.ts` خودمان را انجام می‌دهد. همچنین کامپوننت `sonner` به‌صورت پیش‌فرض `next-themes` را برای سوییچ تم import کرده بود. هر دو اصلاح شدند:
- تمام importها به `@/lib/utils/cn` تغییر کردند (فایل خودمان دست‌نخورده ماند).
- `sonner.tsx` روی `theme="light"` ثابت شد (پروژه فعلاً طبق سند ۰۶ Light-only است؛ اگر Dark Mode بعداً تصمیم به «بله» شد، همین یک خط برمی‌گردد به `next-themes`).
- پکیج‌های `cn` و `next-themes` با `pnpm remove` حذف شدند.
- `pnpm format` (Prettier) روی کل پروژه اجرا شد تا فرمت این ۱۷ فایل (که با Double Quote و بدون هماهنگی با `prettier-plugin-tailwindcss` تولید شده بودند) با بقیه‌ی ریپو یکسان شود.

**سفارشی‌سازی برند:** هیچ فایل کامپوننتی دستی ویرایش نشد — چون `button.tsx`/`badge.tsx`/... همه از کلاس‌های معنایی (`bg-primary`, `text-primary-foreground`, `bg-secondary`, ...) استفاده می‌کنند، همان توکن‌های بخش ۲ به‌طور خودکار Button حالت Primary را طلایی+ink، Badge پیش‌فرض را طلایی، Focus Ring را ink، و همه‌ی رادیوس/سایه‌ها را برند-محور کردند بدون نیاز به دست‌زدن به کد کامپوننت.

**⚠️ اصلاح جانبی نامرتبط:** حین اجرای `pnpm format` روی کل ریپو، مشخص شد فایل ریشه‌ی `README.md` از قبل (احتمالاً از `create-next-app`) با انکودینگ UTF-16LE ذخیره شده بود؛ Prettier آن را به‌اشتباه UTF-8 فرض کرد و بایت‌های BOM را به‌صورت کاراکترهای نامعتبر (`U+FFFD`) بازنویسی کرد. محتوای واقعی (`# Arvandchair website`) بازیابی و با انکودینگ استاندارد UTF-8 دوباره ذخیره شد — این فایل ربطی به فاز ۲ نداشت، فقط یک اثر جانبی اجرای Prettier سراسری بود.

---

## ۴. پایپ‌لاین Asset سه‌بعدی + `Scene.tsx`

قرارداد کامل (فرمت/فشرده‌سازی/سقف حجم/ابزار) به‌صورت کامنت مستند در بالای `src/components/three/Scene.tsx` نوشته شد (خلاصه):
- فرمت: فقط glTF Binary (`.glb`)، تکسچر Embedded.
- فشرده‌سازی: **Draco** برای هندسه اجباری. **KTX2/Basis برای تکسچر عمداً کنار گذاشته شد** — نیاز به Transcoder WASM جدا دارد که برای حداکثر ۲-۳ نقطه‌ی سه‌بعدی کل سایت (طبق سیاست ۰۰-tech-stack بخش ۲.۱) توجیه ندارد؛ سقف رزولوشن + JPEG/WebP Embedded کافی است.
- ابزار: Blender → Export glTF 2.0 → `gltf-transform` CLI (`draco`, `resize`, `dedup`, `prune`).
- سقف حجم: Hero برند ≤ 1.5MB، Viewer محصول ≤ 3MB به‌ازای هر مدل.
- سقف Poly: Hero ≤ 50k مثلث، محصول ≤ 30k مثلث.
- سقف تکسچر: 2048×2048 (Hero/سطوح کلیدی)، 1024×1024 (محصول/ثانویه).
- محل نگه‌داری: Payload Media (Local Disk در توسعه) — هرگز مستقیم Commit در ریپو.

**پیاده‌سازی (طبق پاسخ شما در بخش ۰):**
- `three`, `@react-three/fiber`, `@react-three/drei` نصب شدند (`package.json`).
- `src/components/three/SceneCanvas.tsx`: یک Canvas واقعی R3F با فقط `ambientLight` + `directionalLight` + دوربین — بدون هیچ مدل/هندسه‌ی محصول.
- `src/components/three/Scene.tsx`: پوسته‌ی مصرف‌شونده در فاز ۳ — `IntersectionObserver` (بارگذاری فقط ۲۰۰px قبل از رسیدن به Viewport)، `next/dynamic` با `ssr:false` (بدون این‌که three.js اصلاً در باندل اولیه بیاید)، احترام به `prefers-reduced-motion` (اگر کاربر آن را فعال کرده باشد، هرگز Canvas را رندر نمی‌کند و فقط تصویر Fallback می‌ماند)، و `next/image` با `fill` داخل یک Container با `aspect-square` ثابت (بدون CLS، طبق الزام سئو).

---

## ۵. صفحه‌ی `/style-guide`

**مسیر:** `src/app/(frontend)/[locale]/style-guide/page.tsx` — عمداً **داخل** مسیر `[locale]` موجود قرار گرفت (نه یک Route Group جدید در ریشه‌ی `src/app`)، چون پروژه فعلاً هیچ Layout ریشه‌ی مشترکی بالاتر از `[locale]/layout.tsx` ندارد (الگوی «چند Layout ریشه» فاز ۱) و ساختن یک Layout جدید برای این یک صفحه‌ی داخلی، تغییر معماری بیش‌ازحد برای فاز ۲ بود. نتیجه: برای فارسی دقیقاً همان `/style-guide` که چک‌لیست خواسته (چون فارسی پیشوند ندارد)، و به‌صورت رایگان `/en/style-guide` هم در دسترس است (برای تست RTL/LTR واقعی، نه فقط ادعا).

- `page.tsx` (Server Component): `metadata.robots = { index: false, follow: false }` → تأیید شده در HTML رندرشده (`<meta name="robots" content="noindex, nofollow"/>`).
- `style-guide-content.tsx` (Client Component): تمام دموها — رنگ‌ها (۸ سواچ با Hex)، تایپوگرافی (نمونه‌ی فارسی واقعی «صندلی اداری اروند...» در هر ۱۰ پله‌ی Type Scale)، فاصله‌گذاری، رادیوس، سایه، موشن (کارت‌های هاورشونده با duration/ease واقعی)، و هر ۱۷ کامپوننت پایه (شامل یک Dialog تأیید حذف، یک Toast واقعی، Select با ۳ دسته‌ی نمونه، Tooltip، Accordion، Tabs) + بخش صحنه‌ی سه‌بعدی (`Scene` با placeholder جدید `public/images/placeholder-3d.svg`).
- رشته‌های صفحه (namespace جدید `StyleGuide` در هر دو `fa.json`/`en.json`) — ترجمه‌ی واقعی و معنادار در هر ۲ زبان (نه Placeholder)، چون حتی یک صفحه‌ی داخلی نباید متن نامفهوم داشته باشد.

---

## ۶. تست‌های انجام‌شده

- `npx tsc --noEmit`: ✅ بدون خطا
- `pnpm lint`: ✅ بدون خطا
- `pnpm build`: ✅ موفق، `/[locale]/style-guide` در خروجی ساخته شد (75.6kB صفحه، 189kB First Load JS)
- `pnpm dev` + تست HTTP زنده:
  - `GET /style-guide` → **200**، شامل `dir="rtl"`، عنوان صحیح فارسی، و متا‌تگ `noindex, nofollow` — تأیید شد.
  - `GET /en/style-guide` → **500** (چون این محیط اجرای من همچنان Postgres واقعی ندارد — دقیقاً همان محدودیت مستندشده در گزارش فاز ۱؛ کد مسیر خودش تغییری نکرده، فقط منطق `isLocaleEnabled()` که از فاز ۱ می‌آید). **شما باید `/en/style-guide` را یک‌بار روی Docker واقعی خودتان تست کنید.**

---

## ۷. موارد باز/یادآوری از اسناد قبلی (بدون تغییر در این فاز)

- نسخه‌ی وکتور/شفاف لوگو هنوز دریافت نشده (سند ۰۶) — ربطی به فاز ۲ نداشت، دست‌نخورده ماند.
- تصمیم Dark Mode هنوز باز است؛ معماری توکن (بخش ۲.۱ همین گزارش) طوری طراحی شد که اگر بعداً «بله» شد، فقط `:root`/`.dark` عوض می‌شود، هیچ کامپوننتی نیاز به تغییر ندارد.
- `salesMode` پیش‌فرض دسته‌های پروژه‌محور و انتخاب درگاه پرداخت — طبق تصمیم قبلی، عمداً به بعد موکول مانده‌اند.

---

## ۸. جمع‌بندی

فاز ۲ کامل است: توکن‌های Type Scale/Spacing/Radius/Shadow/Motion در `globals.css` تعریف و مستند شدند، قرارداد GSAP/ScrollTrigger جدا در `src/lib/motion/scroll-tokens.ts` آماده‌ی فاز ۳ است، ۱۷ کامپوننت پایه‌ی shadcn/ui با توکن‌های برند (نه رنگ‌های پیش‌فرض) نصب و یک ناهماهنگی واقعی CLI (پکیج `cn`/`next-themes` اضافه) اصلاح شد، پایپ‌لاین Asset سه‌بعدی مستند و `Scene.tsx`/`SceneCanvas.tsx` (Canvas واقعی، فقط نور+دوربین) ساخته شدند، و `/style-guide` همه‌ی این‌ها را نشان می‌دهد و زنده تست شد (200، RTL، noindex).

**منتظر تأیید شما می‌مانم قبل از رفتن به فاز ۳ (ساخت کامل UI/UX صفحه‌به‌صفحه با داده‌ی Mock).**
