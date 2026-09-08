import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'

import { StyleGuideContent } from './style-guide-content'

export const metadata: Metadata = {
  title: 'Style Guide — اروند',
  robots: { index: false, follow: false },
}

type Args = {
  params: Promise<{ locale: string }>
}

export default async function StyleGuidePage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)

  return <StyleGuideContent />
}
