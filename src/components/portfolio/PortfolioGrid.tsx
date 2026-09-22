import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import { PortfolioCard } from './PortfolioCard'

type PortfolioGridProps = {
  projects: PortfolioProject[]
  locale: AppLocale
  industryLabelById: Record<string, string>
}

export function PortfolioGrid({ projects, locale, industryLabelById }: PortfolioGridProps) {
  const t = useTranslations('Portfolio')

  if (projects.length === 0) {
    return (
      <div className="border-border py-section-y-sm rounded-lg border border-dashed text-center">
        <p className="text-foreground font-medium">{t('empty.title')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{t('empty.hint')}</p>
      </div>
    )
  }

  return (
    /* همان شبکه‌ی خط‌دار `ProductGrid`/`BlogGrid` (رجوع به توضیح آن‌جا) اما عمداً حداکثر ۳ ستون
       (نه ۴) — با شکست‌نقطه‌ی ۱/۲/۳ به‌جای ۲/۳/۴ محصول/بلاگ:
       ۱) این‌جا کاتالوگ نیست، مجموعه‌ای از نمونه‌کار (Case Study) است؛ هر کارت متن بیشتری دارد
          (عنوان + کارفرما + تعداد محصول)، پس به عرض بیشتری برای خوانایی نیاز دارد.
       ۲) تصویر ۱۶:۱۰ (نه مربع) در ستون باریک‌تر بیش‌ازحد کوچک/فشرده می‌شود؛ عکس واقعی یک پروژه‌ی
          اجراشده باید جزئیات فضا/مبلمان را نشان دهد، برخلاف شات تک‌محصول که در سایز کوچک هم کار می‌کند.
       ۳) با تعداد فعلی نمونه‌کارها (Mock)، ۳ ستون دقیقاً دو ردیف کامل می‌سازد؛ ۴ ستون یک ردیف
          آخر نیمه‌خالی به‌جا می‌گذاشت. */
    <div className="border-border grid grid-cols-1 border-s border-t sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border-border group hover:bg-surface-mist-hover duration-base border-e border-b p-6 transition-colors sm:p-8"
        >
          <PortfolioCard
            project={project}
            locale={locale}
            industryLabel={industryLabelById[project.industryId] ?? project.industry[locale]}
          />
        </div>
      ))}
    </div>
  )
}
