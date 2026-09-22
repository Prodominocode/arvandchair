'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, Search, X } from 'lucide-react'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { NavLink } from '@/lib/mock-data/site-settings'
import { useHeaderTone } from '@/lib/hooks/use-header-tone'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { LocaleSwitcher } from './LocaleSwitcher'
import { cn } from '@/lib/utils/cn'

type HeaderNavProps = {
  locale: AppLocale
  enabledLocales: AppLocale[]
  siteName: string
  logoSrc: string
  logoOnDarkSrc: string
  logoAlt: string
  navMenu: NavLink[]
}

/** ارتفاع هدر (h-16) — هم برای نوار تشخیص IntersectionObserver و هم برای جبران فاصله‌ی
 * محتوای صفحات فاقد هیرو در layout.tsx (`pt-16` روی main) لازم است. */
const HEADER_HEIGHT_PX = 64

/** رنگ متن/آیکن‌های هدر روی سکشن روشن؛ نسخه‌ی «dark» با group-data-[tone=dark]/header اعمال می‌شود. */
const toneAwareText =
  'text-arvand-ink group-data-[tone=dark]/header:text-white transition-colors duration-base'
const toneAwareHover =
  'hover:bg-black/5 group-data-[tone=dark]/header:hover:bg-white/15 group-data-[tone=dark]/header:hover:text-white'

export function HeaderNav({
  locale,
  enabledLocales,
  siteName,
  logoSrc,
  logoOnDarkSrc,
  logoAlt,
  navMenu,
}: HeaderNavProps) {
  const t = useTranslations('Layout')
  const pathname = usePathname()
  const router = useRouter()
  const tone = useHeaderTone(HEADER_HEIGHT_PX, pathname)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    setIsSearchOpen(false)
    setSearchQuery('')
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  const navLinkClass = cn(
    'duration-fast inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors',
    toneAwareText,
    toneAwareHover,
    'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
  )
  const iconButtonClass = cn(toneAwareText, toneAwareHover)

  return (
    // هدر در همه‌ی زبان‌ها همیشه چیدمان LTR دارد (لوگو ابتدای خط/چپ، منو و سوییچر زبان انتهای
    // خط/راست) — جهت خواندن متن هر زبان (فارسی/عربی) مستقل از این چیدمان و طبق الگوریتم
    // bidi یونیکد صحیح باقی می‌ماند.
    // صفحاتی که یک المان با `data-header-solid` دارند (مثل جزئیات محصول) هدر را با پس‌زمینه‌ی
    // اصلی سایت (`bg-background`) می‌خواهند، نه شفاف؛ تشخیصش با CSS `:has()` روی <body> است
    // (layout.tsx: `group/body`) تا بدون State/JS و با هر ناوبری کلاینتی خودکار به‌روز شود.
    <header
      dir="ltr"
      data-tone={tone}
      className="group/header group-has-[[data-header-solid]]/body:bg-background fixed inset-x-0 top-0 z-40 h-16"
    >
      <a
        href="#main-content"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-md px-3 py-2 focus:not-sr-only focus-visible:fixed focus-visible:start-2 focus-visible:top-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {t('skipToContent')}
      </a>

      <div className="px-container-x max-w-container mx-auto flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={tone === 'dark' ? logoOnDarkSrc : logoSrc}
            alt={logoAlt}
            width={120}
            height={30}
            className="h-7 w-auto"
            priority
          />
          <span className="sr-only">{siteName}</span>
        </Link>

        <div className="flex items-center gap-1 lg:gap-2">
          <nav aria-label={t('navAriaLabel')} className="hidden items-center gap-1 lg:flex">
            <Link
              href="/products"
              data-active={pathname === '/products'}
              className={cn(
                navLinkClass,
                'data-[active=true]:bg-black/5 group-data-[tone=dark]/header:data-[active=true]:bg-white/15',
              )}
            >
              {t('navProducts')}
            </Link>
            <span
              aria-disabled="true"
              className={cn(navLinkClass, 'cursor-default opacity-60 hover:bg-transparent')}
            >
              {t('navPhilosophy')}
            </span>
            <Link
              href="/contact"
              data-active={pathname === '/contact'}
              className={cn(
                navLinkClass,
                'data-[active=true]:bg-black/5 group-data-[tone=dark]/header:data-[active=true]:bg-white/15',
              )}
            >
              {t('navContact')}
            </Link>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            aria-label={t('searchLabel')}
            aria-expanded={isSearchOpen}
            onClick={() => setIsSearchOpen((open) => !open)}
            className={iconButtonClass}
          >
            <Search />
          </Button>

          <LocaleSwitcher
            currentLocale={locale}
            enabledLocales={enabledLocales}
            ariaLabel={t('languageLabel')}
            className="hidden sm:inline-flex"
          />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('openMenu')}
                className={iconButtonClass}
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t('mobileNavTitle')}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 pb-6" aria-label={t('navAriaLabel')}>
                {navMenu.map((item) => (
                  <div key={item.href} className="border-border/60 border-b py-2 last:border-b-0">
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className="text-foreground block py-1.5 text-base font-medium"
                      >
                        {item.label[locale]}
                      </Link>
                    </SheetClose>
                    {item.children?.length ? (
                      <ul className="mt-1 flex flex-col gap-1 ps-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <SheetClose asChild>
                              <Link
                                href={child.href}
                                className="text-muted-foreground hover:text-foreground block py-1 text-sm"
                              >
                                {child.label[locale]}
                              </Link>
                            </SheetClose>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}

                <LocaleSwitcher
                  currentLocale={locale}
                  enabledLocales={enabledLocales}
                  ariaLabel={t('languageLabel')}
                  className="mt-4"
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isSearchOpen ? (
        <form
          role="search"
          onSubmit={handleSearchSubmit}
          className="bg-surface-mist absolute end-6 top-16 flex w-72 max-w-[calc(100vw-3rem)] items-center gap-2 rounded-lg px-4 py-2.5 shadow-sm sm:w-80"
        >
          <Search className="text-arvand-ink/60 size-4 shrink-0" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            name="q"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('searchPlaceholder')}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setIsSearchOpen(false)
            }}
            className="text-arvand-ink placeholder:text-arvand-ink/50 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            aria-label={t('closeSearch')}
            onClick={() => setIsSearchOpen(false)}
            className="text-arvand-ink/60 hover:text-arvand-ink shrink-0"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </form>
      ) : null}
    </header>
  )
}
