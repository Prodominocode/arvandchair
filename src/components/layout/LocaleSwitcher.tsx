'use client'

import { Link, usePathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'

/** نام هر زبان همیشه به خط خودش نمایش داده می‌شود (قرارداد استاندارد سوییچر زبان در همه‌جا،
 * نه یک متن قابل‌ترجمه) — به همین دلیل عمداً از next-intl عبور نمی‌کند. */
const LOCALE_LABELS: Record<AppLocale, string> = {
  fa: 'فارسی',
  en: 'English',
  ar: 'العربية',
}

type LocaleSwitcherProps = {
  currentLocale: AppLocale
  enabledLocales: AppLocale[]
  ariaLabel: string
  className?: string
}

export function LocaleSwitcher({
  currentLocale,
  enabledLocales,
  ariaLabel,
  className,
}: LocaleSwitcherProps) {
  const pathname = usePathname()

  if (enabledLocales.length < 2) return null

  return (
    <nav aria-label={ariaLabel} className={cn('flex items-center gap-1 text-sm', className)}>
      {enabledLocales.map((locale) => {
        const isActive = locale === currentLocale
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'duration-fast rounded-md px-2 py-1 transition-colors',
              isActive
                ? 'bg-secondary text-secondary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {LOCALE_LABELS[locale]}
          </Link>
        )
      })}
    </nav>
  )
}
