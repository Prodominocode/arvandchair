import { getTranslations, setRequestLocale } from 'next-intl/server'

type Args = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Placeholder')

  return (
    <main style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>{t('title')}</h1>
      <p>{t('body')}</p>
    </main>
  )
}
