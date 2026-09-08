'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, ShoppingCart, User } from 'lucide-react'

import { Link, usePathname } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { NavLink } from '@/lib/mock-data/site-settings'
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
  dir: 'rtl' | 'ltr'
  enabledLocales: AppLocale[]
  siteName: string
  logoSrc: string
  logoAlt: string
  navMenu: NavLink[]
}

export function HeaderNav({
  locale,
  dir,
  enabledLocales,
  siteName,
  logoSrc,
  logoAlt,
  navMenu,
}: HeaderNavProps) {
  const t = useTranslations('Layout')
  const pathname = usePathname()
  // منوی موبایل همیشه از سمت انتهای خط (end) باز می‌شود؛ در LTR این «راست» و در RTL «چپ» است —
  // چون همبرگر همیشه در سمت مقابل لوگو (ابتدای خط) قرار می‌گیرد.
  const sheetSide = dir === 'rtl' ? 'left' : 'right'

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <a
        href="#main-content"
        className="bg-background text-foreground focus-visible:ring-ring sr-only rounded-md px-3 py-2 focus:not-sr-only focus-visible:fixed focus-visible:start-2 focus-visible:top-2 focus-visible:z-50 focus-visible:ring-2"
      >
        {t('skipToContent')}
      </a>

      <div className="px-container-x mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={120}
            height={30}
            className="h-7 w-auto"
            priority
          />
          <span className="sr-only">{siteName}</span>
        </Link>

        <NavigationMenu viewport={false} aria-label={t('navAriaLabel')} className="hidden lg:flex">
          <NavigationMenuList>
            {navMenu.map((item) => {
              const isActive = pathname === item.href
              if (item.children?.length) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger>{item.label[locale]}</NavigationMenuTrigger>
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
                  <NavigationMenuLink
                    asChild
                    active={isActive}
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href={item.href}>{item.label[locale]}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <LocaleSwitcher
            currentLocale={locale}
            enabledLocales={enabledLocales}
            ariaLabel={t('languageLabel')}
            className="hidden sm:flex"
          />

          <Button variant="ghost" size="icon" asChild aria-label={t('cart')}>
            <Link href="/cart">
              <ShoppingCart />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label={t('account')}
            className="hidden sm:inline-flex"
          >
            <Link href="/account">
              <User />
            </Link>
          </Button>

          <Button asChild className="hidden lg:inline-flex">
            <Link href="/quote-request">{t('quoteRequestCta')}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('openMenu')} className="lg:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side={sheetSide} className="flex flex-col overflow-y-auto">
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

                <SheetClose asChild>
                  <Link href="/quote-request" className={cn('text-primary mt-3 block font-medium')}>
                    {t('quoteRequestCta')}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/account" className="text-foreground mt-2 block text-sm">
                    {t('account')}
                  </Link>
                </SheetClose>

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
