import { getTranslations } from 'next-intl/server'
import { Mail, Phone } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data/site-settings'
import { Separator } from '@/components/ui/separator'

type FooterProps = {
  locale: AppLocale
}

const SOCIAL_LABELS: Record<'instagram' | 'linkedin' | 'telegram', string> = {
  instagram: 'اینستاگرام / Instagram',
  linkedin: 'لینکدین / LinkedIn',
  telegram: 'تلگرام / Telegram',
}

export async function Footer({ locale }: FooterProps) {
  const [t, tContact, siteSettings] = await Promise.all([
    getTranslations('Footer'),
    getTranslations('Contact'),
    getSiteSettings(),
  ])
  const year = new Date().getFullYear()

  return (
    <footer
      id="site-footer"
      className="bg-surface-mist mt-auto"
      style={{ paddingTop: 'var(--footer-top-clear, 0px)' }}
    >
      <div className="px-container-x py-section-y-md mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-arvand-ink text-lg font-bold">{siteSettings.siteName[locale]}</p>
          <p className="text-muted-foreground mt-2 max-w-xs text-sm">
            {siteSettings.tagline[locale]}
          </p>

          <p className="text-foreground mt-6 text-sm font-semibold">{t('socialTitle')}</p>
          <ul className="mt-2 space-y-1">
            {siteSettings.socialLinks.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {SOCIAL_LABELS[social.platform]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-foreground text-sm font-semibold">{t('quickLinksTitle')}</p>
          <ul className="mt-3 space-y-2">
            {siteSettings.navMenu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {item.label[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-foreground text-sm font-semibold">{t('officesTitle')}</p>
          <ul className="mt-3 space-y-3">
            {siteSettings.offices.map((office) => (
              <li key={office.id} className="text-muted-foreground text-sm">
                <p className="text-foreground font-medium">{office.title[locale]}</p>
                <p>{tContact(`officeType.${office.type}`)}</p>
                <p dir="ltr" className="text-end sm:text-start">
                  {office.phone}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-foreground text-sm font-semibold">{t('contactTitle')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span dir="ltr">{siteSettings.contactEmail}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteSettings.contactPhone}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span dir="ltr">{siteSettings.contactPhone}</span>
              </a>
            </li>
          </ul>

          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                {t('privacyLink')}
              </Link>
            </li>
            <li>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-foreground"
              >
                {t('termsLink')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <Separator />

      <div className="px-container-x mx-auto max-w-7xl py-4">
        <p className="text-muted-foreground text-center text-xs">
          © {year} {siteSettings.siteName[locale]} — {t('rightsReserved')}
        </p>
      </div>
    </footer>
  )
}
