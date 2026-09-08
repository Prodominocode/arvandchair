'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { NavLink } from '@/lib/mock-data/site-settings'
import { useHeaderTone } from '@/lib/hooks/use-header-tone'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
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
  const tone = useHeaderTone(HEADER_HEIGHT_PX)

  const navItemClass = cn(
    navigationMenuTriggerStyle(),
    'bg-transparent',
    toneAwareText,
    toneAwareHover,
    'data-[active=true]:bg-black/5 group-data-[tone=dark]/header:data-[active=true]:bg-white/15',
    'focus:bg-transparent focus-visible:bg-transparent',
  )

  return (
    // هدر در همه‌ی زبان‌ها همیشه چیدمان LTR دارد (لوگو ابتدای خط/چپ، منو و سوییچر زبان انتهای
    // خط/راست) — جهت خواندن متن هر زبان (فارسی/عربی) مستقل از این چیدمان و طبق الگوریتم
    // bidi یونیکد صحیح باقی می‌ماند.
    <header dir="ltr" data-tone={tone} className="group/header fixed inset-x-0 top-0 z-40 h-16">
      <a
        href="#main-content"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-md px-3 py-2 focus:not-sr-only focus-visible:fixed focus-visible:start-2 focus-visible:top-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {t('skipToContent')}
      </a>

      <div className="px-container-x mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
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

        <div className="flex items-center gap-2 lg:gap-6">
          <NavigationMenu
            viewport={false}
            aria-label={t('navAriaLabel')}
            className="hidden lg:flex"
          >
            <NavigationMenuList>
              {navMenu.map((item) => {
                const isActive = pathname === item.href
                if (item.children?.length) {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger className={navItemClass}>
                        {item.label[locale]}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-56 gap-1 p-2">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link href={child.href}>{child.label[locale]}</Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                }
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild active={isActive} className={navItemClass}>
                      <Link href={item.href}>{item.label[locale]}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

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
                className={cn('lg:hidden', toneAwareText, toneAwareHover)}
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
    </header>
  )
}
