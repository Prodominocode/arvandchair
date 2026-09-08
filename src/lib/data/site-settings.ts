/**
 * لایه‌ی Data Access برای محتوای نمایشی `SiteSettings` (نام سایت، منو، شعب، شبکه‌ی اجتماعی).
 *
 * ⚠️ این با `isLocaleEnabled()` در `[locale]/layout.tsx` فرق دارد — آن تابع مستقیم از Payload
 * Global واقعی (`src/globals/SiteSettings.ts`) می‌خواند و دست‌نخورده مانده. این فایل فقط
 * محتوای نمایشی Mock را برمی‌گرداند.
 */

import {
  siteSettings,
  type NavLink,
  type Office,
  type SiteSettingsMock,
} from '@/lib/mock-data/site-settings'

export async function getSiteSettings(): Promise<SiteSettingsMock> {
  return siteSettings
}

export async function getNavMenu(): Promise<NavLink[]> {
  return siteSettings.navMenu
}

export async function getOffices(): Promise<Office[]> {
  return siteSettings.offices
}
