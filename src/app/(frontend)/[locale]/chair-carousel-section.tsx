'use client'

import { useTranslations } from 'next-intl'

import type { AppLocale } from '@/i18n/routing'
import type { Look } from '@/components/look-carousel/looks'
import { LookCarousel, type SidebarVariant } from '@/components/look-carousel/look-carousel'

/** رنگ زمینه‌ی سایت (`--color-surface-mist` در globals.css)؛ باید با Shader کاروسل یکی باشد */
const SURFACE_MIST = '#ececec'

/** کاروسل سه‌بعدی صندلی (نسخه‌ی clean: فقط تصویر) — بین Philosophy و Stories صفحه‌ی اصلی. */
export function ChairCarouselSection({
  locale,
  chairs,
  sidebarVariant,
}: {
  locale: AppLocale
  chairs: Look[]
  sidebarVariant?: SidebarVariant
}) {
  const t = useTranslations('Landing1.chairCarousel')

  return (
    <LookCarousel
      variant="clean"
      looks={chairs}
      aspect={600 / 853}
      heightFrac={0.66}
      gap={0.9}
      bg={SURFACE_MIST}
      flat
      headerTone="light"
      heading={t('heading')}
      textDir={locale === 'fa' ? 'rtl' : 'ltr'}
      ariaLabel={t('ariaLabel')}
      thumbnails={4}
      controls
      autoplay={5}
      sidebarVariant={sidebarVariant}
      panelCta={t('panelCta')}
      labels={{
        loading: t('loading'),
        stage: t('stage'),
        panel: t('panel'),
        close: t('close'),
        views: t('views'),
        details: t('details'),
        prev: t('prev'),
        next: t('next'),
        play: t('play'),
        pause: t('pause'),
        goTo: t('goTo'),
      }}
    />
  )
}
