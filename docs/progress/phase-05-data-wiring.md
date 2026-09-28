# گزارش فاز ۵ — اتصال داده‌ی واقعی (فقط دامنه‌ی ۴‑الف)

**تاریخ:** ۲۰۲۶-۰۹-۲۸

## ۱. دامنه و تصمیم معماری

- **دامنه:** فقط Collectionهای فاز ۴‑الف — `Categories`, `Products`, `ProductTags`, `ProductMaterials`, `PortfolioIndustries`, `PortfolioProjects`, `BlogPosts`, `Testimonials`, `Pages`, `QuoteRequests` و Global `SiteSettings`. `Customers`/`Orders`/`Loyalty*`/`Rewards` هنوز Mock‌اند (فاز ۴‑ب).
- **تصمیم بسته‌شده (کارفرما):** لایه‌ی `lib/data/*` خروجی Payload را به **همان شکل Mock فاز ۳** Adapt می‌کند (`LocalizedText`، نام فیلدهای قدیمی مثل `categoryId`/`tagIds`/`industryId`). کامپوننت‌های UI دست نخوردند — تنها استثنا یک خط مسیر import در `CategoryTabs.tsx` است (بخش ۴).
- `product-stories` (استوری‌های صفحه‌ی اصلی) Collection ندارد و عمداً Mock ماند.

## ۲. Seed

**اجرا:** `pnpm seed` (فایل `src/seed/index.ts`). Idempotent است: هر بار ۱۱ Collection دامنه را کامل خالی و از `lib/mock-data/*` از نو پر می‌کند.

> ⚠️ **از این به بعد `pnpm seed` را فقط وقتی اجرا کنید که عمداً بخواهید همه‌چیز به داده‌ی Mock برگردد** — هر ویرایشی که در پنل انجام شده پاک می‌شود. به `users` دست نمی‌زند.

- **ترتیب وابستگی:** Media → واژه‌نامه‌ها (Tags/Materials/Industries) → Categories (والد قبل از فرزند) → Products (دو مرحله: اول بدون `relatedProducts`، بعد relationهای خودارجاع) → PortfolioProjects → BlogPosts → Testimonials → Pages → QuoteRequests → Global SiteSettings.
- **Media:** هر `src` یکتای Mock یک سند Media (۳۳ فایل، در `media/` که gitignore است). alt دوزبانه؛ اگر یک فایل در چند جا با alt متفاوت استفاده شده بود، alt اولین استفاده ماند (تصمیم تأییدشده).
- **دوزبانه:** هر سند با `locale: 'fa'` ساخته و با `'en'` به‌روز می‌شود؛ در آرایه‌ها/بلوک‌های دارای فیلد Localized، id ردیف‌های نسخه‌ی fa دوباره فرستاده می‌شود (`withRowIds`) — وگرنه Payload ردیف‌ها را از نو می‌سازد و مقدار fa از بین می‌رود.
- **richText (Lexical):** `plainTextToLexical()` در `src/lib/data/lexical.ts` — متن Mock روی `\n\n` به پاراگراف‌های Lexical شکسته می‌شود؛ `lexicalToPlainText()` برعکسش در Adapterها.
- **Draft/Publish:** Pages/BlogPosts/PortfolioProjects با `_status: published` Seed می‌شوند.
- **کاربر نویسنده‌ی بلاگ:** Seed کاربر `content-team@arvand.local` («تیم محتوای اروند»، نقش content-editor، رمز تصادفی) را می‌سازد/پیدا می‌کند.
- **`pnpm create-admin <email> [password]`** (افزوده): ساخت/بازنشانی سوپرادمین. لازم شد چون کاربر نویسنده‌ی بالا صفحه‌ی «ساخت اولین کاربر» Payload را از کار می‌اندازد؛ Seed حالا اگر سوپرادمینی نباشد هشدار می‌دهد.
- **رفع پایداری `payload run`:** bin پکیج payload اسکریپت را با `void start()` از Loader ناهمگام tsx اجرا می‌کند و در تست حدود نصف اجراها بی‌صدا با کد ۰ و بدون هیچ خروجی بسته می‌شد. `src/seed/keep-alive.mjs` (Preload) این را در اسکریپت‌های `seed`/`create-admin` برطرف کرد (۹ از ۹ اجرای پیاپی موفق). ⚠️ برای اسکریپت‌های Ad-hoc هنوز گاهی گیر می‌کند — برای کارهای موقت، REST API سرور در حال اجرا قابل‌اتکاتر بود.
- **ناسازگاری Mock که Seed کشف کرد:** ۷ محصول به تگ `upholstered` ارجاع می‌دادند که در `mock-data/tags.ts` تعریف نشده بود (UI فاز ۳ بی‌صدا نادیده‌اش می‌گرفت). تگ «رویه‌دار» اضافه شد — نتیجه: یک Chip جدید در فیلتر آرشیو.

## ۳. تغییرات Schema (نسبت به فاز ۴)

| تغییر | دلیل |
|---|---|
| فیلد `key` (لاتین، یکتا، غیر Localized) روی `ProductTags`, `ProductMaterials`, `PortfolioIndustries` — `src/collections/fields/key.ts` | URL فیلترها (`?tag=bestseller`, `?industry=banking`) و `tagIds`/`materialIds`/`industryId` روی همین مقدار کار می‌کنند؛ id عددی Postgres با هر Seed عوض می‌شود. |
| فیلد `key` (غیر یکتا) روی `Products.variants[]` | رنگ Swatch در `lib/utils/variant-swatch.ts` از id واریانت (`black`, `graphite`, ...) می‌آید؛ id ردیف آرایه در Payload تصادفی است. |

## ۴. لایه‌ی Data Access

| فایل | نکته‌ی Adapter |
|---|---|
| `payload.ts` (جدید) | ابزار مشترک: `getPayloadClient`، `toLocalized` (همه‌ی خواندن‌ها با `locale: 'all'` → `{fa,en}`؛ en خالی → fa)، `toImage` (Media خالی → تصویر جایگزین)، `loadVocabulary` (`id` = `key`)، `toTehranDate` |
| `categories.ts` + `categories.shared.ts` (جدید) | `parent` → `parentId`. ثابت/Type مشترک UI به `categories.shared.ts` رفت چون `CategoryTabs` داخل Client Component رندر می‌شود — بدون این، Payload/Postgres وارد Bundle مرورگر می‌شد (تنها تغییر UI: مسیر import) |
| `products.ts` | `category`→`categoryId`، `tags`/`materials`→ `key`ها، `variants[].key`→`id`، Lexical → متن ساده، `capacity` خالی → `undefined`، مرتب‌سازی «جدیدترین» با `createdAt` واقعی. `getProductIdByMockId()`: ترجمه‌ی id Mock → id واقعی از طریق `sku` (برای `product-stories`) |
| `tags.ts`, `materials.ts`, `portfolio-industries.ts` | `loadVocabulary` |
| `portfolio-projects.ts` | `industryRef`→`industryId` (key)، `productsUsed`→`productIds`؛ فقط `_status: published` |
| `blog-posts.ts` | `author.name`→`authorName` (پیش‌فرض «تیم محتوای اروند»)؛ `publishedDate` → `YYYY-MM-DD` **به وقت تهران** (برش ساده‌ی UTC روزِ انتخاب‌شده در پنل را یک روز عقب نشان می‌داد)؛ فقط published |
| `testimonials.ts` | آواتار خالی → آیکون عمومی آواتار |
| `pages.ts` | بلوک‌ها `blockType`→`type`؛ جست‌وجوی slug در خود کوئری؛ فقط published — **هیچ مصرف‌کننده‌ای ندارد** (بخش ۶) |
| `site-settings.ts` | `logoOnDark` (upload) → رشته‌ی src؛ لوگوی خالی → فایل‌های برند فاز ۳؛ `enabledLocales` همچنان جدا در `[locale]/layout.tsx` |
| `quote-requests.ts` | ⚠️ داده‌ی حساس؛ Local API پیش‌فرض Access Control را دور می‌زند — هرگز از صفحه‌ی عمومی صدا زده نشود. فعلاً مصرف‌کننده ندارد |
| `product-stories.ts` | Mock می‌ماند؛ `productId` از طریق sku به id واقعی ترجمه می‌شود |

هر فایل کل Collection را با `cache()` یک بار در هر Request می‌خواند و فیلتر/مرتب‌سازی را در حافظه انجام می‌دهد — دقیقاً همان منطق فاز ۳، برای کاتالوگ فعلی (۲۰ محصول) کاملاً کافی.

## ۵. تست‌های انجام‌شده

- **Seed:** مقایسه‌ی رفت‌وبرگشتی همه‌ی اسناد با Mock در هر دو زبان (با `fallbackLocale: false` تا جای خالی en پشت fa پنهان نشود) — بدون اختلاف؛ ۳۳ فایل Media همه HTTP 200.
- **بدون تغییر ظاهری:** نسخه‌ی فاز ۳ (Mock خالص) در یک git worktree جدا با دیتابیس جدا اجرا و **۴۷ صفحه** (هر دو زبان: خانه، آرشیو/زیردسته/فیلتر/مرتب‌سازی محصول، جزئیات محصول، نمونه‌کارها + هر ۵ پروژه، وبلاگ + هر ۴ پست، جست‌وجو، استعلام، تماس، درباره، حقوقی، style-guide، ۴۰۴) از نظر متن، لینک و فایل تصاویر مقایسه شد — تنها اختلاف‌ها: آدرس تصاویر (`/images/...` → `/api/media/file/...`، همان فایل) و دو ویرایش خود کارفرما در پنل (قیمت آرا، عنوان یک پست).
- **ویرایش پنل → سایت:** برای هر فایل یک ویرایش آزمایشی (عنوان محصول، برچسب تگ، خلاصه‌ی پست، نقل‌قول، شماره‌ی تماس) بلافاصله در سایت دیده و سپس برگردانده شد.
- **Draft:** سند فقط-Draft در پروژه/پست/صفحه در سایت دیده نشد (۴۰۴ / null).
- **Fallbackها:** لوگوی تیره‌ی خالی، عنوان en ذخیره‌نشده، تاریخ `...T20:30Z`.
- `npx tsc --noEmit` ✅، `pnpm lint` ✅ (همان ۱ warning قدیمی در `ref/`).

## ۶. بازبینی صفحات با داده‌ی واقعی — مشکلات پیدا‌شده (برای رفع با هم)

تست با اسناد موقت `edge-*` (عنوان/متن بسیار بلند، کلمه‌ی بلند بدون فاصله، محصول بدون تصویر/واریانت/تگ، دسته‌ی خالی، پروژه با حداقل فیلد، سند فقط فارسی) در عرض ۳۷۵px + قطع موقت دیتابیس. اسناد تست بعداً حذف شدند.

| # | اولویت | مشکل | کجا | منشأ |
|---|---|---|---|---|
| 1 | 🔴 بالا | **فرم استعلام قیمت هیچ‌چیز ثبت نمی‌کند** — فقط Toast موفقیت نشان می‌دهد (`setTimeout`)؛ درخواست مشتری گم می‌شود. همین برای فرم استعلام صفحه‌ی محصول و فرم تماس | `quote-request-content.tsx`, `ProductQuoteInquiry.tsx`, `contact-content.tsx` | فاز ۳ (عمداً؛ طبق roadmap کار فاز ۶) |
| 2 | 🔴 بالا | **قطع دیتابیس → همه‌ی صفحات ۵۰۰**، حتی «درباره/حقوقی» که داده‌ی دیتابیسی ندارند (هدر/فوتر حالا SiteSettings را از Payload می‌خوانند). پیش از فاز ۵ این صفحات بدون دیتابیس بالا می‌ماندند. بعد از برگشت دیتابیس خودبه‌خود درست می‌شود | `site-settings.ts` + Layout | **فاز ۵ (Regression)** |
| 3 | 🔴 بالا | **صفحه‌ی خطای سفارشی وجود ندارد** — هیچ `error.tsx`/`global-error.tsx` در کل app نیست؛ کاربر صفحه‌ی خام Next را می‌بیند (در roadmap فاز ۳ «خطا» تیک خورده بود ولی ساخته نشده) | `src/app` | فاز ۳ |
| 4 | 🟠 متوسط | **کلمه‌ی بلند بدون فاصله (مثلاً URL) صفحه را افقی اسکرول می‌کند:** جزئیات پست (۸۴۲px در عرض ۳۶۰؛ عنوان سفید روی زمینه‌ی روشن ← صفحه خالی به نظر می‌رسد)، گرید کارت‌های `/blog` (۸۳۴px)، و **انتخاب محصول در فرم استعلام با نام بلند (۲۱۲۲px)** — `overflow-wrap`/`min-width: 0` ندارند | blog hero/intro، BlogCard، quote-request select | فاز ۳ (با داده‌ی واقعی آشکار شد) |
| 5 | 🟠 متوسط | پیام دسته‌ی خالی می‌گوید «محصولی با این فیلتر پیدا نشد — فیلترها را پاک کنید» در حالی که فیلتری فعال نیست | آرشیو محصول | فاز ۳ |
| 6 | 🟡 پایین | عنوان خیلی بلند محصول در موبایل کل صفحه‌ی اول را می‌گیرد (h1 ≈ ۷۰۰px) — سقف طول در Schema یا clamp در UI؟ (تصمیم طراحی) | جزئیات محصول | — |
| 7 | 🟡 پایین | سرریز افقی ۶px در موبایل از تصویر Hero (مستقل از داده، با Mock هم هست) | `/`, `/en`, `/landing1-white` | فاز ۳ |
| 8 | 🟡 پایین | `favicon.ico` → ۴۰۴ | ریشه | فاز ۱/۳ |

**رفتارهای درست تأییدشده:** محصول بدون تصویر → Hero متنی (`hero-fallback`) بدون قاب خالی؛ محصول/پروژه‌ی فقط-فارسی در `/en` با عنوان/slug فارسی باز می‌شود؛ فیلتر بی‌نتیجه/صنعت ناموجود → پیام خالی بدون خطا؛ `/blog/ناموجود` → ۴۰۴.

## ۷. موارد باز و تصمیم‌ها

- **صفحات حقوقی ← CMS (تصمیم کارفرما: گزینه‌ی ۲):** `/privacy-policy` و `/terms-of-service` متن را از پیام‌های next-intl می‌گیرند، نه `Pages` — ویرایش Pages در پنل اثری ندارد. در roadmap فاز ۵ به‌عنوان کار بعدی ثبت شد.
- **قالب‌بندی richText در سایت دیده نمی‌شود:** bold/لیست/لینک در پنل فقط متن ساده در سایت است (هزینه‌ی آگاهانه‌ی «UI دست نخورد»). رندر واقعی Lexical کار بعدی است.
- **آواتار نظرات مشتری در هیچ صفحه‌ای نمایش داده نمی‌شود** — آپلودش در پنل اثری ندارد.
- **ترتیب دستی دسته‌ها** فیلد ندارد (فعلاً ترتیب ساخت).
- **مقیاس:** فیلتر/مرتب‌سازی محصول در حافظه است؛ با کاتالوگ بزرگ باید به کوئری دیتابیس (و در نهایت Meilisearch) منتقل شود.
- **`Pages` Draft:** ویرایش Draft یک سند منتشرشده، نسخه‌ی منتشرشده را در سایت عوض نمی‌کند تا Publish شود (رفتار صحیح Payload).

## ۸. نکات عملیاتی (برای کل تیم)

- **فقط یک `pnpm dev` هم‌زمان.** دو سرور dev روی یک پوشه `.next` مشترک را خراب می‌کنند → `__webpack_modules__[moduleId] is not a function` / ۴۰۴ کاذب. این دو بار در همین فاز رخ داد. رفع: بستن همه، حذف `.next`، اجرای یک سرور.
- **هرگز نسخه‌ی قدیمی کد را روی همین دیتابیس اجرا نکنید:** Push خودکار Schema در حالت dev پیشنهاد حذف ستون‌های جدید (`key`) را داد (با Prompt؛ رد شد، داده‌ای از بین نرفت). برای مقایسه از دیتابیس جدا استفاده شد.
- در Git Bash ویندوز، متن فارسی در آرگومان `curl -d` به `???` تبدیل می‌شود — برای تست API با متن فارسی، بدنه را از فایل UTF-8 بفرستید.
- پشتیبان دیتابیس پیش از تست‌های بخش ۶: `%TEMP%\backup\arvandchair-before-edge.dump` (فرمت `pg_dump -Fc`).

## ۹. قدم بعدی

۱) رفع مشکلات جدول بخش ۶ با هم (پیشنهاد ترتیب: ۲ و ۳ ← ۴ ← ۵ ← بقیه؛ مورد ۱ طبق roadmap فاز ۶ است مگر بخواهید جلو بیفتد). ۲) انتقال صفحات حقوقی به `Pages`. ۳) Commit فاز ۵.
