import { Link } from '@/i18n/navigation'
import { rtlLocales, type AppLocale } from '@/i18n/routing'
import { ALL_INDUSTRY_TAB_LABEL, type PortfolioIndustryTab } from '@/lib/data/portfolio-projects'
import { cn } from '@/lib/utils/cn'

type PortfolioIndustryTabsProps = {
  tabs: PortfolioIndustryTab[]
  locale: AppLocale
}

/**
 * ردیف Tab صنعت بالای آرشیو نمونه‌کارها — هم‌الگوی `CategoryTabs` (تب واقعی/لینک، نه
 * کلاینت‌ساید) با یک تفاوت: فیلتر صنعت طبق قانون Query Param در `03-url-structure-seo.md`
 * بخش ۳ («فقط دسته‌بندی اصلی در Path می‌آید») در Query String (`?industry=`) می‌رود نه Path،
 * چون صنعت یک منبع محتوایی مستقل با URL خودش نیست، فقط یک Facet روی همان آرشیو است.
 */
export function PortfolioIndustryTabs({ tabs, locale }: PortfolioIndustryTabsProps) {
  if (tabs.length <= 1) return null

  return (
    <nav
      aria-label={ALL_INDUSTRY_TAB_LABEL[locale]}
      dir={rtlLocales.includes(locale) ? 'rtl' : 'ltr'}
      className="flex max-w-full flex-wrap gap-x-5 gap-y-1.5"
    >
      {tabs.map((tab) => {
        const href = tab.industry ? `/portfolio?industry=${tab.industry.id}` : '/portfolio'
        const label = tab.industry ? tab.industry.label[locale] : ALL_INDUSTRY_TAB_LABEL[locale]
        const key = tab.industry?.id ?? 'all'

        return (
          <Link
            key={key}
            href={href}
            aria-current={tab.isActive ? 'page' : undefined}
            className={cn(
              'duration-base shrink-0 text-sm whitespace-nowrap transition-colors',
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
