'use client'

import { useRef, useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import { rtlLocales, type AppLocale } from '@/i18n/routing'
import { cn } from '@/lib/utils/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** تاخیر کوتاه پیش از بسته‌شدن با خروج ماوس، تا هنگام جابه‌جایی نشانگر از دکمه به منو
 * (که در Portal جدا رندر می‌شود) دراپ‌داون زودتر از موعد بسته نشود. */
const HOVER_CLOSE_DELAY_MS = 150

/** نام هر زبان همیشه به خط خودش نمایش داده می‌شود (قرارداد استاندارد سوییچر زبان در همه‌جا،
 * نه یک متن قابل‌ترجمه) — به همین دلیل عمداً از next-intl عبور نمی‌کند. هر ورودی فونت مخصوص
 * به خودش را حمل می‌کند تا مستقل از جهت صفحه‌ی جاری درست نمایش داده شود (مثلاً وقتی صفحه
 * فارسی/RTL است ولی گزینه‌ی «English» داخل منو نمایش داده می‌شود)؛ جهت (rtl/ltr) از
 * `rtlLocales` مشترک با بقیه‌ی پروژه مشتق می‌شود، نه یک نگاشت جدا.
 */
const LOCALE_META: Record<AppLocale, { label: string; fontClass: string }> = {
  fa: { label: 'فارسی', fontClass: 'font-[family-name:var(--font-persian)]' },
  en: { label: 'English', fontClass: 'font-[family-name:var(--font-manrope)]' },
}

function localeDir(locale: AppLocale): 'rtl' | 'ltr' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr'
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
  const [open, setOpen] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (enabledLocales.length < 2) return null

  const otherLocales = enabledLocales.filter((locale) => locale !== currentLocale)

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }
  const openNow = () => {
    cancelClose()
    setOpen(true)
  }
  const closeWithDelay = () => {
    cancelClose()
    closeTimeoutRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS)
  }

  return (
    // ماوس روی این wrapper بیرونی رصد می‌شود، نه جدا روی trigger و content — چون رویدادهای
    // یک Portal در ری‌اکت طبق درخت کامپوننت (نه DOM واقعی) بابل می‌کنند، این تنها listener کافی
    // است و از رقابت/چشمک‌زدن باز-بسته که با دو listener جدا پیش می‌آمد جلوگیری می‌کند.
    <div onMouseEnter={openNow} onMouseLeave={closeWithDelay} className={className}>
      {/* modal={false}: پیش‌فرض Radix روی body هنگام باز بودن pointer-events:none می‌گذارد؛
          روی یک منوی hover-baz همین باعث می‌شد trigger زیر ماوس «بی‌اثر» شود، mouseleave بخورد،
          منو بسته شود، pointer-events برگردد، mouseenter دوباره بخورد و... یعنی چشمک‌زدن پیاپی. */}
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={ariaLabel}
            className={cn(
              'text-arvand-ink group-data-[tone=dark]/header:text-white',
              'duration-fast inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
              'hover:bg-black/5 group-data-[tone=dark]/header:hover:bg-white/15',
              'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
            )}
          >
            <Globe className="size-4" aria-hidden="true" />
            <span
              data-locale={currentLocale}
              lang={currentLocale}
              dir={localeDir(currentLocale)}
              className={cn('locale-label', LOCALE_META[currentLocale].fontClass)}
            >
              {LOCALE_META[currentLocale].label}
            </span>
            <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-arvand-ink border-none p-1.5 text-white">
          {otherLocales.map((locale) => (
            <DropdownMenuItem key={locale} asChild className="focus:bg-white/15 focus:text-white">
              <Link href={pathname} locale={locale}>
                <span
                  data-locale={locale}
                  lang={locale}
                  dir={localeDir(locale)}
                  className={cn('locale-label', LOCALE_META[locale].fontClass)}
                >
                  {LOCALE_META[locale].label}
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
