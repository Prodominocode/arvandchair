# ۰۲ | مدل داده (Payload Collections)

> ⚠️ **وضعیت: Draft v1.** طبق تصمیم UI-first در `01-workflow-roadmap.md`، این سند هنوز Schema نهایی نیست — نقشه‌ی اولیه‌ی داده است که در فاز ۳ فقط برای ساخت لایه‌ی Mock Data استفاده می‌شود. نسخه‌ی نهایی (Final) در فاز ۴، بعد از تأیید کامل UI/UX، با اضافه/حذف فیلد بر اساس نیاز واقعی صفحات نوشته می‌شود. تا آن زمان، هیچ Collection ای مستقیم در Payload پیاده‌سازی نمی‌شود.

این سند مبنای فاز ۳ (Mock Data) و فاز ۴ (`01-workflow-roadmap.md`) است. هر Collection شامل فیلدهای کلیدی، روابط (Relationships) و Access Control پیشنهادی است. در فاز ۳ این شکل داده مبنای Typeهای TypeScript در `lib/mock-data` است؛ در فاز ۴، بعد از تکمیل/اصلاح بر اساس UI واقعی، همین ساختار به Collection Config واقعی در Payload تبدیل می‌شود.

> علامت 🌐 = فیلد Localized (باید در هر ۳+ زبان مقدار جدا داشته باشد)

---

## ۱. کاربران و نقش‌ها

### `Users` (کاربران داخلی/ادمین)
- `name`, `email`, `password` (auth داخلی Payload)
- `role`: enum → `superadmin` | `sales` | `content-editor` | `support`
- **Access:** فقط خود کاربران داخلی؛ ورود به پنل ادمین محدود به این Collection

### `Customers` (مشتریان سمت فروشگاه — auth جدا)
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

### `Categories`
- `title` 🌐, `slug` 🌐 (یکتا در سطح هر Locale)
- `parent`: relation self (برای دسته‌بندی چندسطحی)
- `image`: relation → `Media`
- `seo`: گروه فیلد → `metaTitle` 🌐, `metaDescription` 🌐
- `salesMode`: enum → `direct-purchase` | `quote-only` | `mixed` (تعیین می‌کند آیا محصولات این دسته مستقیم قابل‌خرید هستند یا فقط از مسیر استعلام — پیش‌فرض روی هر دسته قابل‌override در سطح محصول)

> **کاملاً داینامیک است** — این Collection از پنل ادمین توسط تیم محتوا مدیریت می‌شود؛ لیست زیر فقط داده‌ی Seed اولیه است، نه ساختار ثابت در کد.

**دسته‌بندی‌های اولیه‌ی Seed (تأییدشده در فاز ۰):**
1. صندلی (اداری/مدیریتی/کارمندی/کنفرانس — می‌تواند زیردسته بگیرد)
2. میز (اداری/مدیریتی/کارشناسی/کنفرانس)
3. مبلمان اداری (مبل و ست پذیرایی اداری)
4. آمفی‌تئاتر (صندلی و سیستم صندلی‌بندی سالن آمفی‌تئاتر)
5. همایش و سینما (صندلی و تجهیزات سالن همایش/سینما)

> دسته‌های ۴ و ۵ معمولاً **پروژه‌محور** هستند (تیراژ بالا، طراحی سفارشی سالن) برخلاف ۱ تا ۳ که می‌توانند خرید مستقیم/تکی هم داشته باشند. **تصمیم دقیق پیش‌فرض هر دسته عمداً به بعد موکول شده** — فیلد `salesMode` هم در سطح دسته هم در سطح محصول (قابل override) از همین حالا در مدل وجود دارد، پس وقتی تصمیم گرفته شد فقط مقداردهی می‌شود، نیازی به تغییر Schema نیست.

> **افزوده‌ی فاز ۳ (صفحه‌ی آرشیو محصول، `05-pages-build-order.md` بسته‌ی ۲ #۵):** دسته‌ی «صندلی» حالا در Mock ۵ زیردسته هم دارد (`chairs-office`, `chairs-side-guest`, `chairs-conference`, `chairs-stools`, `chairs-lounge`، هرکدام با `parentId: chairs`) — اولین مثال واقعی دسته‌بندی دوسطحی در داده، برای تست الگوی Tab «همه/زیردسته‌ها». ساختار `Category` تغییری نکرد، فقط داده‌ی Seed زیاد شد.

### `ProductTags` *(افزوده‌ی فاز ۳)*
- `label` 🌐 — واژه‌نامه‌ی کنترل‌شده‌ی برچسب ویژگی/بازاریابی محصول (پرفروش، تازه‌وارد، قابل تنظیم ارتفاع، ...)؛ `Products.tags[]` relation چندگانه به همین Collection می‌زند. برای فیلتر «تگ» در آرشیو محصول لازم شد؛ Mock در `lib/mock-data/tags.ts`.

### `ProductMaterials` *(افزوده‌ی فاز ۳)*
- `label` 🌐 — واژه‌نامه‌ی کنترل‌شده‌ی متریال، جدا از `Products.specs.material` (که متن نمایشی آزاد برای صفحه‌ی جزئیات است). `Products.materials[]` relation چندگانه به همین Collection می‌زند و مبنای فیلتر «متریال» در آرشیو است. Mock در `lib/mock-data/materials.ts`.

### `Products`
- `title` 🌐, `slug` 🌐
- `sku`: string (یکتا، مشترک بین زبان‌ها)
- `category`: relation → `Categories`
- `shortDescription` 🌐, `description` (rich text) 🌐
- `images[]`: relation → `Media`
- `model3d`: relation → `Media` (فایل glTF/GLB برای Viewer سه‌بعدی، اختیاری)
- `specs`: گروه → ابعاد (طول/عرض/ارتفاع)، متریال، وزن، ظرفیت
- `variants[]`: آرایه → رنگ/متریال/سایز، هرکدام با `priceModifier` و `stock`
- `basePrice`: number (واحد: تومان — تک‌ارزی، چون فروش فعلاً فقط داخل ایران است) + `currency` (فیلد نگه‌داشته‌شده برای توسعه‌ی آینده، فعلاً همیشه IRR/تومان)
- `stock`: number
- `relatedProducts[]`: relation چندگانه → `Products`
- `tags[]` *(افزوده‌ی فاز ۳)*: relation چندگانه → `ProductTags` — فیلتر Facet آرشیو محصول
- `materials[]` *(افزوده‌ی فاز ۳)*: relation چندگانه → `ProductMaterials` — فیلتر Facet دیگر آرشیو؛ مستقل از `specs.material`
- `salesMode`: enum → `inherit-from-category` (پیش‌فرض) | `direct-purchase` | `quote-only`
  **تصمیم نهایی فاز ۰:** قیمت‌ها همیشه عمومی هستند (بدون نیاز به ورود/تأیید حساب برای دیدن قیمت). تفاوت B2B/B2C فقط در `salesMode` است: محصولات `direct-purchase` قیمت + دکمه‌ی «افزودن به سبد» نشان می‌دهند؛ محصولات `quote-only` به‌جای قیمت فقط دکمه‌ی «درخواست استعلام» دارند. فیلد جدای `priceVisibility`/ورود اجباری حذف شد — نیازی نبود.
- `seo`: 🌐 metaTitle/metaDescription/ogImage
- **Access:** خواندن عمومی؛ نوشتن فقط `content-editor`/`superadmin`

### `Media`
- استاندارد Payload: `alt` 🌐, `caption` 🌐, sizes خودکار (thumbnail/card/hero)

---

## ۳. محتوای عمومی

### `Pages` (صفحات پویا: درباره‌ما، لندینگ باشگاه مشتریان، ...)
- `title` 🌐, `slug` 🌐
- `layout[]`: Block-based — بلوک‌های موجود: `Hero3D`, `RichText`, `Gallery`, `ScrollStory`, `TestimonialGrid`, `CTA`, `FAQAccordion`
- `seo`: 🌐 metaTitle/metaDescription/ogImage

### `PortfolioProjects` (نمونه‌کارها / پروژه‌های اجراشده)
- `title` 🌐, `slug` 🌐, `clientName`, `industry`
- `industryId` *(افزوده‌ی فاز ۳)*: relation → `PortfolioIndustries` (واژه‌نامه‌ی کنترل‌شده‌ی جدید،
  مستقل از `industry` که متن نمایشی آزاد است) — مبنای فیلتر صنعت در آرشیو `/portfolio`
  (`05-pages-build-order.md` بسته‌ی ۳ #۹)، هم‌رابطه‌ی `Product.materials[]`/`specs.material`.
- `location`, `scope`, `duration` 🌐، `completionYear` *(افزوده‌ی فاز ۳)*: «مشخصات فنی پروژه»ی
  جزئیات پروژه (`05-pages-build-order.md` بسته‌ی ۳ #۱۰)، به‌صورت لیست آیکنی زیر هیرو نمایش
  داده می‌شوند؛ در Draft اولیه نبودند.
- `coverImage`, `gallery[]`
- `summary` 🌐 (rich text)
- `challenge`, `solution` 🌐 *(افزوده‌ی فاز ۳)*: خلاصه‌ی چالش/راه‌حل که سند ۰۵ برای جزئیات پروژه
  خواسته؛ در Draft اولیه نبودند.
- `productsUsed[]`: relation → `Products`
- `seo`

### `BlogPosts`
- `title` 🌐, `slug` 🌐, `content` (rich text) 🌐
- `author`: relation → `Users`
- `category/tags[]`
- `publishedDate`
- `seo`

### `Testimonials`
- `authorName`, `authorCompany`, `quote` 🌐, `avatar`, `rating`

### `SiteSettings` (Global)
- `siteName` 🌐, `logo`, `socialLinks[]`
- `navMenu[]` 🌐 (هر Locale منوی خودش)
- `offices[]`: آدرس/تماس شعبه‌ها (شهرهای مختلف ایران — کارخانه/نمایشگاه/دفتر فروش)

---

## ۴. فروش (E-commerce)

### `Orders`
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

### `QuoteRequests` (استعلام قیمت B2B)
- `company`, `contactName`, `email`, `phone`
- `items[]`: `{ product: relation, qty, notes }`
- `message`
- `status`: enum → `new` | `in-review` | `quoted` | `won` | `lost`
- `assignedSalesRep`: relation → `Users`
- **Access:** ایجاد عمومی (فرم سایت)؛ مشاهده/ویرایش فقط تیم فروش

---

## ۵. CRM

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

## ۶. باشگاه مشتریان (Loyalty)

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
