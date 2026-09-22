# گزارش فاز ۴‑الف — نهایی‌سازی مدل داده (کاتالوگ + محتوا + استعلام)

**تاریخ:** ۲۰۲۶-۰۹-۲۲

## ۱. چرا فقط «۴‑الف»، نه کل فاز ۴

قبل از شروع این فاز، بسته‌ی ۴ (فروشگاه، به‌جز فرم استعلام) و بسته‌ی ۵ (حساب‌کاربری/باشگاه مشتریان) در فاز ۳ عمداً طراحی نشدند و موکول شدند. فینالایز کردن `Customers`/`Orders`/`Companies`/`Loyalty*` بدون دیدن UI واقعی همان ریسکی است که خود روندمپ از ابتدا می‌خواست جلویش را بگیرد (تصمیم UI-first فاز ۰). پس فاز ۴ به دو نیمه تقسیم شد؛ این گزارش فقط نیمه‌ی اول (۴‑الف) را پوشش می‌دهد.

## ۲. چه ساخته شد

### تصمیم‌های باز که بسته شدند
1. **Slug دوزبانه:** `localized: true` + `unique: true` روی فیلد `slug` در همه‌ی Collectionهای محتوایی — یعنی یکتایی به‌ازای هر Locale جدا بررسی می‌شود، نه در کل جدول (طبق دستور صریح «Schema برای هر زبان مستقل پیاده‌سازی بشه»).
2. **`salesMode` پیش‌فرض دسته‌های پروژه‌محور** (آمفی‌تئاتر، همایش و سینما) = `quote-only`.
3. **Draft/Publish** برای `Pages`, `BlogPosts`, `PortfolioProjects` فعال شد (`versions.drafts: true`).
4. **محدودیت فایل سه‌بعدی محصول** آگاهانه موکول شد — `Products.model3d` فقط یک relation ساده به `Media` است، بدون محدودیت فرمت/حجم.

### Collection‌ها و Global (`src/collections/`, `src/globals/`)
| Collection/Global | فایل | نکته |
|---|---|---|
| `Users` | `Users.ts` | فیلد `role` اضافه شد (`superadmin`/`sales`/`content-editor`/`support`)؛ فقط سوپرادمین می‌تواند نقش را عوض کند |
| `Media` | `Media.ts` | `alt` به `localized: true` تبدیل شد |
| `Categories` | `Categories.ts` | `salesMode` پیش‌فرض دسته‌های پروژه‌محور بسته شد |
| `ProductTags` | `ProductTags.ts` | واژه‌نامه‌ی ساده |
| `ProductMaterials` | `ProductMaterials.ts` | واژه‌نامه‌ی ساده |
| `Products` | `Products.ts` | بزرگ‌ترین Collection — `specs` تودرتو، `variants[]`، `features[]` اختیاری، `description` از نوع `richText` |
| `PortfolioIndustries` | `PortfolioIndustries.ts` | Collection جدید، در Draft v1 اصلاً نبود |
| `PortfolioProjects` | `PortfolioProjects.ts` | فیلد نسبت به Draft v1 با `industryRef`, `location`, `scope`, `duration`, `completionYear`, `challenge`, `solution` تکمیل شد؛ Draft/Publish فعال |
| `BlogPosts` | `BlogPosts.ts` | `content` از نوع `richText`؛ `tags[]` رشته‌ی آزاد (نه واژه‌نامه)؛ Draft/Publish فعال |
| `Testimonials` | `Testimonials.ts` | ساده، بدون تغییر نسبت به Draft |
| `Pages` | `Pages.ts` | دامنه نسبت به Draft **کوچک‌تر** شد — فقط بلوک `rich-text` و `cta` (بقیه‌ی بلوک‌های فرضی هرگز مصرف نشدند)؛ Draft/Publish فعال |
| `QuoteRequests` | `QuoteRequests.ts` | ایجاد عمومی؛ `status`/`assignedSalesRep` حتی هنگام Create هم فقط با نقش فروش قابل مقداردهی‌اند (Field-level Access) |
| `SiteSettings` (Global) | `globals/SiteSettings.ts` | از یک فیلد (`enabledLocales`) به مدل کامل (نام سایت، لوگو روشن/تیره، شبکه‌ی اجتماعی، منو، شعب) رسید |

### زیرساخت مشترک
- `src/access/roles.ts` — `publicRead`, `isSuperAdmin`, `isContentEditor`, `isSales` (+ نسخه‌ی `FieldAccess` برای فیلدهای تکی)
- `src/collections/fields/seo.ts`, `slug.ts`, `iranAddress.ts` — فیلدهای مشترک بین Collectionها
- `localization: { locales: ['fa','en'], defaultLocale: 'fa', fallback: true }` در `payload.config.ts` — قبلاً اصلاً پیکربندی نشده بود

### نام‌گذاری فیلد متفاوت از Mock (برای فاز ۵ مهم است)
چون Mock از الگوی `xId`/`xIds` (رشته) استفاده می‌کرد ولی Payload `relationship` واقعی آبجکت برمی‌گرداند، نام‌ها به الگوی رایج Payload (بدون پسوند Id) تغییر کردند:
- `Category.parentId` → `parent`
- `Product.categoryId` → `category`، `relatedProductIds` → `relatedProducts`، `tagIds` → `tags`، `materialIds` → `materials`
- `PortfolioProject.industryId` → `industryRef` (چون `industry` قبلاً به فیلد متنی آزاد اختصاص داشت)، `productIds` → `productsUsed` (این یکی دقیقاً هم‌نام سند ۰۲ ماند)

این نگاشت باید هنگام نوشتن توابع `lib/data/*` واقعی در فاز ۵ در نظر گرفته شود.

## ۳. تست‌های انجام‌شده
- `npx tsc --noEmit`: ✅ بدون خطا
- `pnpm lint`: ✅ بدون خطا (فقط ۱ warning قدیمی و نامرتبط در `ref/`)
- `pnpm generate:types`: ✅ موفق
- `pnpm dev` روی پورت جایگزین (۳۰۰۰ در حال استفاده بود) + تست زنده روی Postgres واقعی:
  - Payload با موفقیت Schema را روی دیتابیس Push کرد (بدون Migration دستی — حالت Push خودکار فاز توسعه)
  - `GET /api/{categories,products,blog-posts,portfolio-projects,testimonials,pages,product-tags,product-materials,portfolio-industries}` → همه **۲۰۰**
  - `GET /api/globals/site-settings` → **۲۰۰**
  - `GET /api/quote-requests` بدون لاگین → **۴۰۳** (Access Control درست کار کرد)

## ۴. چه چیزی باز مانده (عمداً)
- **فاز ۴‑ب** کامل: `Customers`, `Orders`, `Companies`, `LoyaltyTiers`, `LoyaltyTransactions`, `Rewards`, `Leads`, `Interactions` — هنوز فقط Draft v1/Mock، هیچ Collection واقعی در Payload ندارند. منتظر طراحی UI بسته‌ی ۴ (سبد/Checkout/تأیید سفارش) و بسته‌ی ۵ (حساب‌کاربری/باشگاه).
- **پایپ‌لاین 3D** (فرمت/فشرده‌سازی/سقف حجم `model3d`) — آگاهانه موکول شد.
- **Seed داده‌ی واقعی** از `lib/mock-data/*` به همین Collectionها منتقل نشده — این کار فاز ۵ (اتصال داده‌ی واقعی) است؛ فاز ۴ فقط Schema را ساخت، نه Import داده.
- محتوای فعلی همه‌ی این Collectionها در Payload خالی است (تست فقط ساختار/Access را تأیید کرد، نه محتوا).

## ۵. قدم بعدی
طبق `07-execution-playbook.md`، قدم طبیعی بعدی یا **فاز ۵ محدود به همین دامنه‌ی ۴‑الف** (اتصال `lib/data/{categories,products,...}` به Payload واقعی + Seed) است، یا برگشت به فاز ۳ برای طراحی UI بسته‌ی ۴/۵ تا فاز ۴‑ب هم باز شود. تصمیم با شماست.
