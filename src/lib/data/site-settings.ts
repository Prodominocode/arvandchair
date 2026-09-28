/**
 * لایه‌ی Data Access برای محتوای نمایشی Global `SiteSettings` (نام سایت، لوگو، منو، شعب، شبکه‌ی
 * اجتماعی، تماس) — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock (`SiteSettingsMock`) Adapt می‌شود.
 * نگاشت فیلدها: `logoOnDark` (upload) → رشته‌ی `src`، `navMenu[].children` خالی → `undefined`.
 *
 * `enabledLocales` همین Global را `getEnabledLocales()` در `[locale]/layout.tsx` جدا می‌خواند
 * (با Fallback خودش به فارسی هنگام قطعی دیتابیس) و این فایل به آن کاری ندارد.
 */

import { cache } from 'react'

import type { NavLink, Office, SiteSettingsMock } from '@/lib/mock-data/site-settings'
import type { SiteSetting } from '@/payload-types'
import { getPayloadClient, toImage, toLocalized, type LocalizedValue } from './payload'

/** لوگوی خالی در پنل → همان فایل‌های برند فاز ۳ (در `public/images/brand/`). */
const FALLBACK_LOGO_SRC = '/images/brand/arvand-logo-bl.png'
const FALLBACK_LOGO_ON_DARK_SRC = '/images/brand/arvand-logo-wh.png'

type LocalizedNavLink = {
  label: LocalizedValue
  href: string
  children?: { label: LocalizedValue; href: string }[] | null
}

type LocalizedSettingsDoc = Omit<
  SiteSetting,
  'siteName' | 'tagline' | 'navMenu' | 'offices' | 'logo' | 'logoOnDark'
> & {
  siteName: LocalizedValue
  tagline?: LocalizedValue
  logo?: unknown
  logoOnDark?: unknown
  navMenu?: LocalizedNavLink[] | null
  offices?:
    | (Omit<NonNullable<SiteSetting['offices']>[number], 'title' | 'hours'> & {
        title: LocalizedValue
        hours?: LocalizedValue
      })[]
    | null
}

function toNavLink(link: LocalizedNavLink): NavLink {
  const children = (link.children ?? []).map((child) => ({
    label: toLocalized(child.label),
    href: child.href,
  }))
  return {
    label: toLocalized(link.label),
    href: link.href,
    ...(children.length ? { children } : {}),
  }
}

function toOffice(
  office: NonNullable<LocalizedSettingsDoc['offices']>[number],
  index: number,
): Office {
  return {
    id: office.id ?? String(index),
    title: toLocalized(office.title),
    type: office.type,
    address: {
      title: office.address?.title ?? '',
      province: office.address?.province ?? '',
      city: office.address?.city ?? '',
      street: office.address?.street ?? '',
      postalCode: office.address?.postalCode ?? '',
      recipientPhone: office.address?.recipientPhone ?? '',
    },
    phone: office.phone,
    hours: toLocalized(office.hours),
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsMock> => {
  const payload = await getPayloadClient()
  const doc = (await payload.findGlobal({
    slug: 'site-settings',
    locale: 'all',
    depth: 1,
  })) as unknown as LocalizedSettingsDoc

  const siteName = toLocalized(doc.siteName)
  return {
    siteName,
    tagline: toLocalized(doc.tagline),
    logo: toImage(doc.logo, siteName, FALLBACK_LOGO_SRC),
    logoOnDark: toImage(doc.logoOnDark, siteName, FALLBACK_LOGO_ON_DARK_SRC).src,
    socialLinks: (doc.socialLinks ?? []).map(({ platform, url }) => ({ platform, url })),
    navMenu: (doc.navMenu ?? []).map(toNavLink),
    offices: (doc.offices ?? []).map(toOffice),
    contactEmail: doc.contactEmail ?? '',
    contactPhone: doc.contactPhone ?? '',
  }
})

export async function getNavMenu(): Promise<NavLink[]> {
  return (await getSiteSettings()).navMenu
}

export async function getOffices(): Promise<Office[]> {
  return (await getSiteSettings()).offices
}
