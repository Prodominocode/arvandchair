# ۰۲ | مدل داده (Payload Collections)

> ⚠️ **وضعیت: نیمه‌Final (فاز ۴‑الف انجام شد).** چون بسته‌ی ۴ (فروشگاه، به‌جز فرم استعلام) و بسته‌ی ۵ (حساب کاربری/باشگاه مشتریان) در فاز ۳ طراحی UI نشدند و عمداً موکول شدند، فاز ۴ به دو نیمه تقسیم شد:
> - **فاز ۴‑الف (انجام‌شده):** کاتالوگ محصول، محتوای عمومی، و `QuoteRequests` — همه‌ی این‌ها اکنون به‌صورت Collection واقعی در `src/collections/*` و `src/globals/SiteSettings.ts` پیاده‌سازی شده‌اند (Postgres واقعی، نه Mock). بخش‌های مربوطه‌ی این سند در ادامه با ✅ **Final** علامت خورده‌اند.
> - **فاز ۴‑ب (باقی‌مانده):** `Customers`, `Orders`, `Companies`, `LoyaltyTiers`, `LoyaltyTransactions`, `Rewards` همچنان **Draft v1** می‌مانند — فینالایز و پیاده‌سازی واقعی‌شان به بعد از طراحی UI بسته‌ی ۴/۵ موکول شده (طبق همان فلسفه‌ی UI-first: حدس‌زدن Schema قبل از دیدن UI). `Leads`/`Interactions` هم Draft ماندند چون هنوز مصرف نشده‌اند، با اینکه کاملاً داخل پنل ادمین‌اند و ریسک کمی دارند.
>
> جزئیات کامل این تصمیم و فهرست Collection‌های هر نیمه در `docs/progress/phase-04-data-model.md`.

این سند مبنای فاز ۳ (Mock Data) و فاز ۴ (`01-workflow-roadmap.md`) است. هر Collection شامل فیلدهای کلیدی، روابط (Relationships) و Access Control پیشنهادی است. در فاز ۳ این شکل داده مبنای Typeهای TypeScript در `lib/mock-data` است؛ در فاز ۴، بعد از تکمیل/اصلاح بر اساس UI واقعی، همین ساختار به Collection Config واقعی در Payload تبدیل می‌شود.

> علامت 🌐 = فیلد Localized (باید در هر ۳+ زبان مقدار جدا داشته باشد)

---

## ۱. کاربران و نقش‌ها

### `Users` (کاربران داخلی/ادمین) ✅ Final — `src/collections/Users.ts`
- `name`, `email`, `password` (auth داخلی Payload)
- `role`: enum → `superadmin` | `sales` | `content-editor` | `support` — فقط سوپرادمین می‌تواند نقش را تغییر دهد
- **Access:** فقط خود کاربران داخلی؛ ورود به پنل ادمین محدود به این Collection

### `Customers` (مشتریان سمت فروشگاه — auth جدا) ⏸ Draft v1 — فاز ۴‑ب (منتظر طراحی UI بسته‌ی ۵)
- `name`, `email`, `password`, `phone`
- `company`: relation → `Companies` (اختیاری، فقط برای مشتریان B2B — `Companies` یک Collection سبک با `name` است؛ توضیح در پایین)
- `preferredLocale`: enum زبان‌ها
- `addresses[]`: آرایه‌ای از آدرس (عنوان، استان، شهر، خیابان، کدپستی، شماره تماس گیرنده) — فعلاً فقط آدرس داخل ایران
- `loyaltyTier`: relation → `LoyaltyTiers`
- `loyaltyPointsBalance`: number (محاسبه‌شده از `LoyaltyTransactions`)
- `customerType`: enum → `individual` | `business`
- **Access:** هر مشتری فقط به رکورد خودش دسترسی خواندن/نوشتن دارد؛ تیم فروش دسترسی خواندن به همه دارد

> **تصمیم فاز ۰:** برای MVP هر شرکت B2B فقط **یک حساب/لاگین** دارد (بدون نقش‌های داخلی). پنل چندکاربره‌ی سازمانی (چند نفر زیر یک شرکت با نقش‌های متفاوت مثل «مدیر خرید»/«کارشناس») به Backlog نسخه‌ی بعد منتقل شد. برای همین `company` (نه یک رشته‌ی ساده) به‌صورت relation به یک Collection سبک `Companies` (فقط `name` + `id`) تعریف شد؛ در v2 کافی است `CompanyTeamMembers` با relation به همان `Companies` اضافه شود، بدون Refactor سنگین.

---

## ۲. کاتالوگ محصول

### `Categories` ✅ Final — `src/collections/Categories.ts`
- `title` 🌐, `slug` 🌐 (یکتا **به‌ازای هر Locale جدا**، نه در کل جدول — تصمیم فاز ۴: «Schema مستقل هر زبان»؛ فیلد `slug` هم `localized` هم `unique` است که در Payload دقیقاً همین معنا را می‌دهد)
- `parent`: relation self (برای دسته‌بندی چندسطحی) — نام فیلد در Payload `parent` است (نه `parentId` مثل Mock؛ چون relation واقعی آبجکت برمی‌گرداند)
- `image`: relation → `Media`
- `seo`: گروه فیلد → `metaTitle` 🌐, `metaDescription` 🌐 (بدون `ogImage` — در UI واقعی فاز ۳ هرگز استفاده نشد، حذف شد)
- `salesMode`: enum → `direct-purchase` | `quote-only` | `mixed`، پیش‌فرض `direct-purchase`. **تصمیم نهایی فاز ۴:** دسته‌های پروژه‌محور (آمفی‌تئاتر، همایش و سینما) پیش‌فرض `quote-only` دارند — دقیقاً همان مقداری که در Mock فاز ۳ استفاده شده بود.

> **کاملاً داینامیک است** — این Collection از پنل ادمین توسط تیم محتوا مدیریت می‌شود؛ لیست زیر فقط داده‌ی Seed اولیه است، نه ساختار ثابت در کد.

**دسته‌بندی‌های اولیه‌ی Seed (تأییدشده در فاز ۰):**
1. صندلی (اداری/مدیریتی/کارمندی/کنفرانس — می‌تواند زیردسته بگیرد)
2. میز (اداری/مدیریتی/کارشناسی/کنفرانس)
3. مبلمان اداری (مبل و ست پذیرایی اداری)
4. آمفی‌تئاتر (صندلی و سیستم صندلی‌بندی سالن آمفی‌تئاتر)
5. همایش و سینما (صندلی و تجهیزات سالن همایش/سینما)

> دسته‌های ۴ و ۵ معمولاً **پروژه‌محور** هستند (تیراژ بالا، طراحی سفارشی سالن) برخلاف ۱ تا ۳ که می‌توانند خرید مستقیم/تکی هم داشته باشند. **تصمیم بسته شد (فاز ۴):** پیش‌فرض این دو دسته `quote-only` است؛ فیلد `salesMode` هم در سطح دسته هم در سطح محصول (قابل override) در Schema واقعی پیاده شده.

> **افزوده‌ی فاز ۳ (صفحه‌ی آرشیو محصول، `05-pages-build-order.md` بسته‌ی ۲ #۵):** دسته‌ی «صندلی» حالا در Mock ۵ زیردسته هم دارد (`chairs-office`, `chairs-side-guest`, `chairs-conference`, `chairs-stools`, `chairs-lounge`، هرکدام با `parentId: chairs`) — اولین مثال واقعی دسته‌بندی دوسطحی در داده، برای تست الگوی Tab «همه/زیردسته‌ها». ساختار `Category` تغییری نکرد، فقط داده‌ی Seed زیاد شد.

### `ProductTags` *(افزوده‌ی فاز ۳)* ✅ Final — `src/collections/ProductTags.ts`
- `label` 🌐 — واژه‌نامه‌ی کنترل‌شده‌ی برچسب ویژگی/بازاریابی محصول (پرفروش، تازه‌وارد، قابل تنظیم ارتفاع، ...)؛ `Products.tags[]` relation چندگانه به همین Collection می‌زند. برای فیلتر «تگ» در آرشیو محصول لازم شد؛ Mock در `lib/mock-data/tags.ts`.

### `ProductMaterials` *(افزوده‌ی فاز ۳)* ✅ Final — `src/collections/ProductMaterials.ts`
- `label` 🌐 — واژه‌نامه‌ی کنترل‌شده‌ی متریال، جدا از `Products.specs.material` (که متن نمایشی آزاد برای صفحه‌ی جزئیات است). `Products.materials[]` relation چندگانه به همین Collection می‌زند و مبنای فیلتر «متریال» در آرشیو است. Mock در `lib/mock-data/materials.ts`.

### `Products` ✅ Final — `src/collections/Products.ts`
- `title` 🌐, `slug` 🌐
- `sku`: string (یکتا، مشترک بین زبان‌ها)
- `category`: relation → `Categories`
- `shortDescription` 🌐, `description` (rich text) 🌐
- `images[]`: relation چندگانه → `Media`
- `model3d`: relation → `Media` (فایل glTF/GLB برای Viewer سه‌بعدی، اختیاری). **محدودیت فرمت/فشرده‌سازی/سقف حجم عمداً موکول شد** (فاز ۴ تصمیم گرفت این را الان تعریف نکند، چون هنوز هیچ مدل واقعی نداریم) — فیلد فعلاً فقط یک relation ساده به `Media` است، بدون validation خاص؛ قبل از اولین آپلود واقعی (احتمالاً فاز ۶ یا ۹) باید برگردیم اینجا.
- `specs`: گروه → ابعاد (طول/عرض/ارتفاع)، متریال، وزن، ظرفیت
- `variants[]`: آرایه → رنگ/متریال/سایز، هرکدام با `priceModifier` و `stock`
- `basePrice`: number (واحد: تومان — تک‌ارزی، چون فروش فعلاً فقط داخل ایران است) + `currency` (فیلد نگه‌داشته‌شده برای توسعه‌ی آینده، فعلاً همیشه IRR/تومان)
- `stock`: number
- `relatedProducts[]`: relation چندگانه → `Products`
- `tags[]` *(افزوده‌ی فاز ۳)*: relation چندگانه → `ProductTags` — فیلتر Facet آرشیو محصول
- `materials[]` *(افزوده‌ی فاز ۳)*: relation چندگانه → `ProductMaterials` — فیلتر Facet دیگر آرشیو؛ مستقل از `specs.material`
- `features[]` *(افزوده‌ی فاز ۳، اختیاری)*: بلوک‌های روایت تصویری/متنی صفحه‌ی جزئیات (`title`, `text`, `images[]`) — در Draft v1 نبود، از `lib/mock-data/products.ts` اضافه شد.
- `salesMode`: enum → `inherit-from-category` (پیش‌فرض) | `direct-purchase` | `quote-only`
  **تصمیم نهایی فاز ۰:** قیمت‌ها همیشه عمومی هستند (بدون نیاز به ورود/تأیید حساب برای دیدن قیمت). تفاوت B2B/B2C فقط در `salesMode` است: محصولات `direct-purchase` قیمت + دکمه‌ی «افزودن به سبد» نشان می‌دهند؛ محصولات `quote-only` به‌جای قیمت فقط دکمه‌ی «درخواست استعلام» دارند. فیلد جدای `priceVisibility`/ورود اجباری حذف شد — نیازی نبود.
- `seo`: 🌐 metaTitle/metaDescription (بدون ogImage — رجوع به توضیح `Categories`)
- `description` و `BlogPosts.content` از نوع `richText` (Lexical) هستند؛ بقیه‌ی فیلدهای متنی (`shortDescription`, `specs.material`, ...) عمداً `textarea`/`text` ساده ماندند تا پیچیدگی فاز ۴ کم بماند — فقط جایی که سند از قبل صریحاً «rich text» خواسته بود.
- **Access:** خواندن عمومی؛ نوشتن فقط `content-editor`/`superadmin`

### `Media` ✅ Final — `src/collections/Media.ts`
- `alt` 🌐 (فاز ۴ به Localized تبدیل شد — قبلاً متن ساده بود)، sizes خودکار (فعلاً پایه؛ اندازه‌های thumbnail/card/hero دقیق در فاز بعد که تصویر واقعی محصول جایگزین Placeholder شود)

---

## ۳. محتوای عمومی

### `Pages` (صفحات ساده‌ی حقوقی/متنی — حریم‌خصوصی، شرایط استفاده) ✅ Final — `src/collections/Pages.ts`
- `title` 🌐, `slug` 🌐
- `layout[]`: Block-based — فقط دو بلوک واقعاً پیاده شد: `rich-text` و `cta`. **دامنه‌ی این Collection نسبت به Draft v1 کوچک‌تر شد:** بلوک‌های `Hero3D`, `Gallery`, `ScrollStory`, `TestimonialGrid`, `FAQAccordion` حذف شدند چون تصمیم واقعی فاز ۳ این بود که صفحات با روایت خاص (About، Loyalty Club) Route اختصاصی خودشان را در کد بگیرند، نه رندر بلوکی عمومی — طبق قانون فاز ۴ («فیلد/بلوک حدسی و بلااستفاده را حذف کن»).
- `seo`: 🌐 metaTitle/metaDescription
- Draft/Publish فعال (`versions.drafts: true`)

### `PortfolioProjects` (نمونه‌کارها / پروژه‌های اجراشده) ✅ Final — `src/collections/PortfolioProjects.ts`
- `title` 🌐, `slug` 🌐, `clientName`, `industry` (متن آزاد نمایشی)
- `industryRef` *(افزوده‌ی فاز ۳، در Payload به این نام — نه `industryId`)*: relation → `PortfolioIndustries` (واژه‌نامه‌ی کنترل‌شده‌ی جدید،
  مستقل از `industry` که متن نمایشی آزاد است) — مبنای فیلتر صنعت در آرشیو `/portfolio`
  (`05-pages-build-order.md` بسته‌ی ۳ #۹)، هم‌رابطه‌ی `Product.materials[]`/`specs.material`.
- `location`, `scope`, `duration` 🌐، `completionYear` *(افزوده‌ی فاز ۳)*: «مشخصات فنی پروژه»ی
  جزئیات پروژه (`05-pages-build-order.md` بسته‌ی ۳ #۱۰)، به‌صورت لیست آیکنی زیر هیرو نمایش
  داده می‌شوند؛ در Draft اولیه نبودند.
- `coverImage`, `gallery[]`
- `summary` 🌐 (متن ساده؛ نه rich text — رجوع به یادداشت `Products.description`)
- `challenge`, `solution` 🌐 *(افزوده‌ی فاز ۳)*: خلاصه‌ی چالش/راه‌حل که سند ۰۵ برای جزئیات پروژه
  خواسته؛ در Draft اولیه نبودند.
- `productsUsed[]`: relation چندگانه → `Products`
- `featured`: checkbox
- `seo`
- Draft/Publish فعال

### `BlogPosts` ✅ Final — `src/collections/BlogPosts.ts`
- `title` 🌐, `slug` 🌐, `content` (rich text، Lexical) 🌐
- `excerpt` 🌐، `coverImage`
- `author`: relation → `Users`
- `category` 🌐 (متن آزاد)، `tags[]` (رشته‌ی آزاد، نه واژه‌نامه — طبق نیاز واقعی UI فعلی؛ اگر بعداً فیلتر تگ لازم شد می‌تواند مثل `ProductTags` به Collection جدا تبدیل شود)
- `publishedDate`
- `seo`
- Draft/Publish فعال

### `Testimonials` ✅ Final — `src/collections/Testimonials.ts`
- `authorName` 🌐, `authorCompany` 🌐, `quote` 🌐, `avatar`, `rating` (۱ تا ۵)

### `SiteSettings` (Global) ✅ Final — `src/globals/SiteSettings.ts`
- `siteName` 🌐, `tagline` 🌐, `logo`, `logoOnDark` *(افزوده‌ی فاز ۳ — سوییچ روشن/تیره هدر)*, `socialLinks[]`
- `navMenu[]` 🌐 (هر Locale منوی خودش)، هر آیتم می‌تواند `children[]` (زیرمنو) داشته باشد
- `offices[]`: آدرس/تماس شعبه‌ها (شهرهای مختلف ایران — کارخانه/نمایشگاه/دفتر فروش)، ساختار آدرس مشترک با `IranAddress` (`src/collections/fields/iranAddress.ts`)
- `contactEmail`, `contactPhone`
- `enabledLocales` (از فاز ۱ موجود بود، دست‌نخورده ماند — منبع واقعی فعال/غیرفعال‌بودن `en`)

### `PortfolioIndustries` *(افزوده‌ی فاز ۳)* ✅ Final — `src/collections/PortfolioIndustries.ts`
- `label` 🌐 — واژه‌نامه‌ی کنترل‌شده‌ی صنعت نمونه‌کار، هم‌الگوی `ProductTags`/`ProductMaterials`. در Draft v1 اصلاً وجود نداشت.

---

## ۴. فروش (E-commerce)

### `Orders` ⏸ Draft v1 — فاز ۴‑ب (منتظر طراحی UI بسته‌ی ۴: سبد خرید/Checkout/تأیید سفارش)
- `orderNumber`: auto-generated یکتا
- `customer`: relation → `Customers`
- `items[]`: `{ product: relation, variant, qty, unitPrice }`
- `shippingAddress`, `billingAddress` (ساختار آدرس ایران: استان/شهر/خیابان/کدپستی — Checkout فعلاً فقط آدرس داخل ایران را می‌پذیرد)
- `status`: enum → `pending` | `confirmed` | `shipped` | `delivered` | `cancelled`
- `paymentStatus`: enum → `unpaid` | `paid` | `refunded`
- `paymentProvider`: enum → `mock` (پیش‌فرض توسعه، طبق `00-tech-stack.md` بخش ۱.۲ — تا فاز ۱۱) | `zarinpal` | `idpay` | `zibal` | `nextpay` (فقط Production، فاز ۱۱ طبق قرارداد PSP). **Stripe از Stack حذف شد** چون برای کسب‌وکار ایرانی به‌دلیل محدودیت‌های بین‌المللی قابل‌استفاده نیست.
- `totals`: گروه → subtotal, shipping, tax, discount, total
- `locale`: زبانی که سفارش در آن ثبت شده (برای فاکتور)
- **Access:** مشتری فقط سفارش‌های خودش را می‌بیند؛ تیم فروش همه را می‌بیند/ویرایش می‌کند

### `QuoteRequests` (استعلام قیمت B2B) ✅ Final — `src/collections/QuoteRequests.ts`
- `company`, `contactName`, `email`, `phone`
- `items[]`: `{ product: relation, qty, notes }`
- `message`
- `status`: enum → `new` | `in-review` | `quoted` | `won` | `lost` — فیلد `status`/`assignedSalesRep` حتی هنگام Create عمومی هم فقط توسط تیم فروش قابل مقداردهی است (Field-level Access جدا از Collection-level)
- `assignedSalesRep`: relation → `Users`
- **Access:** ایجاد عمومی (فرم سایت)؛ مشاهده/ویرایش فقط تیم فروش (`sales`/`superadmin`)

---

## ۵. CRM *(کل این بخش ⏸ Draft v1 — کاملاً داخل پنل ادمین است، UI فرانت لازم ندارد، ولی فینالایز آن هم به فاز ۴‑ب موکول شد تا همراه بقیه‌ی فروش/CRM یک‌جا مرور شود)*

### `Leads`
- `name`, `email`, `phone`, `company`
- `source`: enum → `website` | `quote-request` | `referral` | `event` | `other`
- `stage`: enum → `new` | `contacted` | `qualified` | `proposal` | `won` | `lost`
- `estimatedValue`: number
- `assignedTo`: relation → `Users`
- `convertedToCustomer`: relation → `Customers` (پر می‌شود وقتی Lead به مشتری تبدیل شود)

### `Interactions` (لاگ فعالیت CRM)
- `relatedTo`: relation polymorphic → `Leads` یا `Customers`
- `type`: enum → `call` | `email` | `meeting` | `note`
- `date`, `notes`, `performedBy`: relation → `Users`

---

## ۶. باشگاه مشتریان (Loyalty) ⏸ Draft v1 — فاز ۴‑ب (منتظر طراحی UI بسته‌ی ۵)

### `LoyaltyTiers`
- `name` 🌐 (برنزی/نقره‌ای/طلایی)
- `minPointsRequired`
- `benefits[]` 🌐 (توضیح مزایا)

### `LoyaltyTransactions`
- `customer`: relation → `Customers`
- `type`: enum → `earn` | `redeem` | `expire` | `adjustment`
- `points`: number (مثبت یا منفی)
- `relatedOrder`: relation → `Orders` (اختیاری، اگر از خرید بوده)
- `note`

### `Rewards` (کاتالوگ جوایز قابل بازخرید)
- `title` 🌐, `description` 🌐, `pointsCost`, `image`
- `type`: enum → `discount-code` | `free-product` | `free-shipping`

---

## ۷. نمودار روابط (خلاصه)

```
Customers ──< Orders ──< OrderItems → Products
Customers ──< LoyaltyTransactions
Customers ── LoyaltyTier (LoyaltyTiers)
Leads ──< Interactions
Leads ── convertedToCustomer → Customers
QuoteRequests → Products (items)
Products ── Categories
Products ──< PortfolioProjects (productsUsed)
Pages / BlogPosts / PortfolioProjects → Media, SEO
```

---

## گام بعدی
سند بعدی: **`03-url-structure-seo.md`**
