import { getSiteSettings } from '@/lib/data/site-settings'
import { type AppLocale } from '@/i18n/routing'
import { HeaderNav } from './HeaderNav'

type HeaderProps = {
  locale: AppLocale
  enabledLocales: AppLocale[]
}

export async function Header({ locale, enabledLocales }: HeaderProps) {
  const siteSettings = await getSiteSettings()

  return (
    <HeaderNav
      locale={locale}
      enabledLocales={enabledLocales}
      siteName={siteSettings.siteName[locale]}
      logoSrc={siteSettings.logo.src}
      logoOnDarkSrc={siteSettings.logoOnDark}
      logoAlt={siteSettings.logo.alt[locale]}
      navMenu={siteSettings.navMenu}
    />
  )
}
