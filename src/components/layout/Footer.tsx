import type { ComponentProps, ComponentType } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Mail, Phone, Send } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/data/site-settings'
import { Separator } from '@/components/ui/separator'

type FooterProps = {
  locale: AppLocale
}

type SocialPlatform = 'instagram' | 'linkedin' | 'telegram'

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'اینستاگرام / Instagram',
  linkedin: 'لینکدین / LinkedIn',
  telegram: 'تلگرام / Telegram',
}

// لینک‌های سریع فوتر — ۴ صفحه‌ی اصلی از منوی هدر (بلاگ و باشگاه مشتریان فقط در هدر می‌مانند).
const QUICK_LINK_HREFS = ['/products', '/portfolio', '/about', '/contact']

// lucide-react آیکن برند ندارد (Instagram/Linkedin در نسخه‌های جدید حذف شده‌اند)، پس SVG ساده.
function InstagramIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function LinkedinIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.5 9.5v8.5M6.5 6v.01M11 18v-8.5M11 13c0-2 1.5-3.5 3.5-3.5S18 11 18 13v5" />
    </svg>
  )
}

function TelegramIcon(props: ComponentProps<typeof Send>) {
  return <Send strokeWidth={1.75} aria-hidden="true" {...props} />
}

const SOCIAL_ICONS: Record<SocialPlatform, ComponentType<ComponentProps<'svg'>>> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
}

export async function Footer({ locale }: FooterProps) {
  const [t, siteSettings] = await Promise.all([getTranslations('Footer'), getSiteSettings()])
  const year = new Date().getFullYear()
  const quickLinks = QUICK_LINK_HREFS.flatMap((href) =>
    siteSettings.navMenu.filter((item) => item.href === href),
  )

  return (
    <footer
      id="site-footer"
      className="bg-surface-mist mt-auto"
      style={{ paddingTop: 'var(--footer-top-clear, 0px)' }}
    >
      <div className="px-container-x py-section-y-md max-w-container mx-auto grid grid-cols-[35fr_65fr] gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="inline-block">
            <Image
              src={siteSettings.logo.src}
              alt={siteSettings.logo.alt[locale]}
              width={120}
              height={30}
              className="h-8 w-auto"
            />
          </Link>
          <p className="text-muted-foreground mt-3 max-w-56 text-sm leading-relaxed">
            {siteSettings.tagline[locale]}
          </p>

          <ul aria-label={t('socialTitle')} className="mt-5 flex items-center gap-3">
            {siteSettings.socialLinks.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform]
              return (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={SOCIAL_LABELS[social.platform]}
                    className="border-border text-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring flex size-10 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="text-foreground text-sm font-semibold">{t('quickLinksTitle')}</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
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
          <p className="text-foreground text-sm font-semibold">{t('contactTitle')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span dir="ltr" className="min-w-0 break-all">
                  {siteSettings.contactEmail}
                </span>
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

      <div className="px-container-x max-w-container mx-auto py-4">
        <p className="text-muted-foreground text-center text-xs">
          © {year} {siteSettings.siteName[locale]} — {t('rightsReserved')}
        </p>
      </div>
    </footer>
  )
}
