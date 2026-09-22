import { Link } from '@/i18n/navigation'
import { rtlLocales, type AppLocale } from '@/i18n/routing'
import { ALL_TAB_LABEL, type CategoryTab } from '@/lib/data/categories'
import { cn } from '@/lib/utils/cn'

type CategoryTabsProps = {
  tabs: CategoryTab[]
  locale: AppLocale
}

/**
 * ردیف Tab کنار عنوان آرشیو محصول (الگوی رفرنس: All / Office Chairs / Side & Guest Chairs / ...
 * هم‌ردیف با تیتر، نه زیر آن — چیدمان دقیق در `ProductArchiveContent`). هرکدام یک لینک واقعی
 * است (نه Tab کلاینت‌ساید) چون هر تب یک URL/دسته‌ی متفاوت را لود می‌کند — قانون سند ۰۳: فقط
 * دسته در Path می‌آید، فیلترهای دیگر (تگ/متریال) Query Param باقی می‌مانند و با سوییچ دسته پاک
 * می‌شوند (هر دسته Facet خودش را دارد).
 *
 * والد (`ProductArchiveContent`) عمداً `dir="ltr"` است تا جای فیزیکی عنوان/Tab ثابت بماند؛ ولی
 * ترتیب خود Tabها باید جهت زبان را دنبال کند (fa: «همه» اولین از راست) — پس `dir` همین `nav` را
 * طبق زبان می‌گذاریم. جای `nav` (لبه‌ی راست) با `justify-between` والد ثابت می‌ماند.
 */
export function CategoryTabs({ tabs, locale }: CategoryTabsProps) {
  if (tabs.length <= 1) return null

  return (
    <nav
      aria-label={ALL_TAB_LABEL[locale]}
      dir={rtlLocales.includes(locale) ? 'rtl' : 'ltr'}
      className="flex max-w-full flex-wrap gap-x-5 gap-y-1.5 whitespace-nowrap"
    >
      {tabs.map((tab) => {
        const href = tab.category ? `/products/${tab.category.slug[locale]}` : '/products'
        const label = tab.isAllTab ? ALL_TAB_LABEL[locale] : (tab.category?.title[locale] ?? '')
        const key = tab.category?.id ?? 'all'

        return (
          <Link
            key={key}
            href={href}
            aria-current={tab.isActive ? 'page' : undefined}
            className={cn(
              'duration-base shrink-0 text-sm transition-colors',
              tab.isActive
                ? 'text-arvand-ink font-bold'
                : 'text-arvand-ink/70 hover:text-arvand-ink font-medium',
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
