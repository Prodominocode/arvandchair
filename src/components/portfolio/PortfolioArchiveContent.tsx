import type { AppLocale } from '@/i18n/routing'
import type { PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import type { PortfolioIndustryTab } from '@/lib/data/portfolio-projects'
import { PortfolioIndustryTabs } from './PortfolioIndustryTabs'
import { PortfolioGrid } from './PortfolioGrid'

type PortfolioArchiveContentProps = {
  locale: AppLocale
  title: string
  subtitle: string
  tabs: PortfolioIndustryTab[]
  projects: PortfolioProject[]
  industryLabelById: Record<string, string>
}

/**
 * قالب آرشیو نمونه‌کارها — هم‌الگوی `ProductArchiveContent` (تیتر+شمارش سمت چپ، Tab فیلتر سمت
 * راست، چیدمان فیزیکی ثابت با `dir="ltr"` مستقل از جهت زبان؛ توضیح کامل دلیل در همان فایل) اما
 * بدون صفحه‌بندی «نمایش بیشتر»: این‌جا یک کاتالوگ بزرگ نیست (مثل محصولات)، مجموعه‌ای محدود از
 * Case Study است — هم‌الگوی `BlogArchiveContent` که برای همین نوع محتوا صفحه‌بندی ندارد.
 * زیرتیتر (که در آرشیو محصول/بلاگ نیست) عمداً این‌جا اضافه شد چون این صفحه نقش اعتمادسازی B2B
 * دارد (`05-pages-build-order.md` بسته‌ی ۳ #۹: «پیش‌نیاز طبیعی #۱۰ / Case Study»)، نه فقط
 * فهرست محصول — یک جمله‌ی زمینه (طراحی تا نصب) به بازدیدکننده می‌گوید این پروژه‌های واقعی
 * اجراشده‌اند، پیش از آنکه وارد جزئیات هر کارت شود.
 */
export function PortfolioArchiveContent({
  locale,
  title,
  subtitle,
  tabs,
  projects,
  industryLabelById,
}: PortfolioArchiveContentProps) {
  return (
    <div className="px-container-x py-section-y-sm max-w-container mx-auto">
      {/* فقط ردیف تیتر+Tab نیاز به قفل چیدمان فیزیکی دارد (توضیح در `ProductArchiveContent`)؛
          زیرتیتر بیرون از این `dir="ltr"` می‌ماند تا جهت/ترازبندی متن طبیعی زبان صفحه (که از
          Layout ریشه می‌آید) را بگیرد، نه چیدمان اجباری این بخش. */}
      <div dir="ltr">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-arvand-ink flex items-baseline gap-2 text-2xl font-bold text-nowrap sm:text-3xl">
            {title}
            <span className="text-muted-foreground text-lg font-normal">({projects.length})</span>
          </h1>
          <PortfolioIndustryTabs tabs={tabs} locale={locale} />
        </div>
      </div>

      <p className="text-muted-foreground max-w-xl pb-4 text-sm sm:text-base">{subtitle}</p>

      <div className="mt-4">
        <PortfolioGrid projects={projects} locale={locale} industryLabelById={industryLabelById} />
      </div>
    </div>
  )
}
