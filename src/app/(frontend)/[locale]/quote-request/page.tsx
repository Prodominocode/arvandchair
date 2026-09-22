import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getProductBySlug, getProducts } from '@/lib/data/products'
import { QuoteRequestContent } from './quote-request-content'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ product?: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'QuoteRequest' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/quote-request')

  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical, languages },
    openGraph: { title: t('title'), description: t('subtitle') },
  }
}

/**
 * `/{locale}/quote-request` — فرم درخواست استعلام قیمت (`05-pages-build-order.md` بسته‌ی ۴ #۱۶).
 * تنها ورودی این صفحه، دکمه‌ی «درخواست استعلام» صفحه‌ی جزئیات محصول است
 * (`components/products/ProductOverviewPanel.tsx` → `?product={slug}`)؛ اگر با این Query Param
 * باز شود، همان محصول از قبل به‌عنوان ردیف اول فرم انتخاب شده است. طبق فاز ۳ («فقط UI و State»،
 * دقیقاً هم‌الگوی `contact/contact-content.tsx`)، Submit فعلاً بدون اتصال واقعی به CRM/ایمیل است
 * — آن منطق فاز ۶ (`docs/01-workflow-roadmap.md`) است.
 */
export default async function QuoteRequestPage({ params, searchParams }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale

  const { product: productSlug } = await searchParams
  const [products, initialProduct] = await Promise.all([
    getProducts(),
    productSlug ? getProductBySlug(appLocale, productSlug) : Promise.resolve(null),
  ])

  return (
    <QuoteRequestContent
      products={products}
      locale={appLocale}
      initialProductId={initialProduct?.id ?? null}
    />
  )
}
