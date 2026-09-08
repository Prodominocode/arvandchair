'use client'

import { Globe, ChevronDown } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

  const otherLocales = enabledLocales.filter((locale) => locale !== currentLocale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            'text-arvand-ink group-data-[tone=dark]/header:text-white',
            'duration-fast inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
            'hover:bg-black/5 group-data-[tone=dark]/header:hover:bg-white/15',
            'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
            className,
          )}
        >
          <Globe className="size-4" aria-hidden="true" />
          {LOCALE_LABELS[currentLocale]}
          <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {otherLocales.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link href={pathname} locale={locale}>
              {LOCALE_LABELS[locale]}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
