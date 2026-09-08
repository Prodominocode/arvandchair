import { getSiteSettings } from '@/lib/data/site-settings'
import { rtlLocales, type AppLocale } from '@/i18n/routing'
import { HeaderNav } from './HeaderNav'

type HeaderProps = {
  locale: AppLocale
  enabledLocales: AppLocale[]
}

export async function Header({ locale, enabledLocales }: HeaderProps) {
  const siteSettings = await getSiteSettings()
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

  return (
    <HeaderNav
      locale={locale}
      dir={dir}
      enabledLocales={enabledLocales}
      siteName={siteSettings.siteName[locale]}
      logoSrc={siteSettings.logo.src}
      logoAlt={siteSettings.logo.alt[locale]}
      navMenu={siteSettings.navMenu}
    />
  )
}
