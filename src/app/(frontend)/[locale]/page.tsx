import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowUpRight, Star } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories } from '@/lib/data/categories'
import { getFeaturedProducts, resolveProductSalesMode } from '@/lib/data/products'
import { getFeaturedPortfolioProjects } from '@/lib/data/portfolio-projects'
import { getTestimonials } from '@/lib/data/testimonials'
import { getSiteSettings } from '@/lib/data/site-settings'
import { formatPrice } from '@/lib/utils/currency'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Scene } from '@/components/three/Scene'

type Args = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  const { canonical, languages } = buildAlternates(locale as AppLocale, '/')

  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
    alternates: { canonical, languages },
    openGraph: {
      title: t('hero.title'),
      description: t('hero.subtitle'),
      images: ['/images/mock/icon-hero-brand.svg'],
    },
  }
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  setRequestLocale(locale)
  const appLocale = locale as AppLocale

  const t = await getTranslations('Home')
  const tCommon = await getTranslations('Common')

  const [categories, featuredProducts, featuredProjects, testimonials, siteSettings] =
    await Promise.all([
      getCategories(),
      getFeaturedProducts(5),
      getFeaturedPortfolioProjects(3),
      getTestimonials(),
      getSiteSettings(),
    ])

  const productSalesModes = await Promise.all(
    featuredProducts.map((product) => resolveProductSalesMode(product)),
  )

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.siteName[appLocale],
    url: '/',
    logo: siteSettings.logo.src,
    sameAs: siteSettings.socialLinks.map((social) => social.url),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteSettings.contactPhone,
      email: siteSettings.contactEmail,
      contactType: 'sales',
    },
  }

  return (
    <>
      {/* Structured Data — Organization (docs/03-url-structure-seo.md بخش ۴) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero — سه‌بعدی + Fallback (docs/05 بسته‌ی ۱ #۲)
          data-header-tone روشن است چون این سکشن پس‌زمینه‌ی روشن دارد (هدر شفاف رویش شناور
          می‌شود)؛ mt-16- فاصله‌ی pt-16 پیش‌فرض main را لغو می‌کند تا هیرو زیر هدر تا بالای
          صفحه ادامه پیدا کند. */}
      <section
        data-header-tone="light"
        className="px-container-x pb-section-y-lg mx-auto -mt-16 grid max-w-7xl items-center gap-10 pt-[12rem] lg:grid-cols-2"
      >
        <div>
          <h1 className="text-arvand-ink text-4xl font-bold text-balance lg:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">{t('hero.subtitle')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/products">{t('hero.ctaPrimary')}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/quote-request">{t('hero.ctaSecondary')}</Link>
            </Button>
          </div>
        </div>
        <Scene
          fallbackSrc="/images/mock/icon-hero-brand.svg"
          fallbackAlt={siteSettings.siteName[appLocale]}
          className="mx-auto w-full max-w-md"
        />
      </section>

      {/* دسته‌بندی‌های شاخص */}
      <section
        data-header-tone="light"
        className="px-container-x py-section-y-md mx-auto max-w-7xl"
      >
        <header className="mb-8 max-w-2xl">
          <h2 className="text-arvand-ink text-3xl font-semibold">{t('categories.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('categories.subtitle')}</p>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.id} href={`/products/${category.slug[appLocale]}`}>
              <Card className="duration-base ease-emphasis h-full overflow-hidden py-0 transition-shadow hover:shadow-lg">
                <div className="bg-surface-mist relative aspect-square w-full">
                  <Image
                    src={category.image.src}
                    alt={category.image.alt[appLocale]}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-foreground text-center text-sm font-medium">
                    {category.title[appLocale]}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* محصولات ویژه */}
      <section data-header-tone="light" className="bg-surface-mist/60 py-section-y-md">
        <div className="px-container-x mx-auto max-w-7xl">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-arvand-ink text-3xl font-semibold">
                {t('featuredProducts.title')}
              </h2>
              <p className="text-muted-foreground mt-2">{t('featuredProducts.subtitle')}</p>
            </div>
            <Link
              href="/products"
              className="text-foreground inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              {tCommon('actions.viewAll')}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => {
              const category = categories.find((c) => c.id === product.categoryId)
              const salesMode = productSalesModes[index]
              const isDirectPurchase = salesMode === 'direct-purchase'

              return (
                <Card key={product.id} className="flex h-full flex-col overflow-hidden py-0">
                  <Link href={`/products/${category?.slug[appLocale]}/${product.slug[appLocale]}`}>
                    <div className="bg-surface-mist relative aspect-square w-full">
                      <Image
                        src={product.images[0]?.src ?? ''}
                        alt={product.images[0]?.alt[appLocale] ?? ''}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <CardContent className="flex flex-1 flex-col gap-2 p-4">
                    <Badge variant={isDirectPurchase ? 'default' : 'outline'} className="w-fit">
                      {isDirectPurchase ? tCommon('badges.inStock') : tCommon('badges.quoteOnly')}
                    </Badge>
                    <Link
                      href={`/products/${category?.slug[appLocale]}/${product.slug[appLocale]}`}
                      className="text-foreground line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {product.title[appLocale]}
                    </Link>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      {isDirectPurchase ? (
                        <p className="text-arvand-ink text-sm font-semibold">
                          {formatPrice(product.basePrice, appLocale)} {tCommon('currency')}
                        </p>
                      ) : (
                        <span />
                      )}
                      <Button size="sm" variant="secondary" asChild>
                        <Link
                          href={`/products/${category?.slug[appLocale]}/${product.slug[appLocale]}`}
                        >
                          {isDirectPurchase
                            ? tCommon('actions.viewDetails')
                            : tCommon('actions.requestQuote')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Portfolio منتخب */}
      <section
        data-header-tone="light"
        className="px-container-x py-section-y-md mx-auto max-w-7xl"
      >
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-arvand-ink text-3xl font-semibold">{t('portfolio.title')}</h2>
            <p className="text-muted-foreground mt-2">{t('portfolio.subtitle')}</p>
          </div>
          <Link
            href="/portfolio"
            className="text-foreground inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            {tCommon('actions.viewAll')}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.slug[appLocale]}`}>
              <Card className="h-full overflow-hidden py-0">
                <div className="bg-surface-mist relative aspect-video w-full">
                  <Image
                    src={project.coverImage.src}
                    alt={project.coverImage.alt[appLocale]}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-1 p-4">
                  <p className="text-muted-foreground text-xs">{project.industry[appLocale]}</p>
                  <p className="text-foreground font-medium">{project.title[appLocale]}</p>
                  <span className="text-arvand-ink inline-flex items-center gap-1 pt-1 text-sm font-medium">
                    {t('portfolio.viewProject')}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA باشگاه مشتریان */}
      <section
        data-header-tone="light"
        className="px-container-x py-section-y-md mx-auto max-w-7xl"
      >
        <div className="bg-arvand-ink flex flex-col items-start gap-4 rounded-2xl p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-white">{t('loyalty.title')}</h2>
            <p className="mt-2 text-white/80">{t('loyalty.subtitle')}</p>
          </div>
          <Button size="lg" className="shrink-0" asChild>
            <Link href="/loyalty-club">{tCommon('actions.learnMore')}</Link>
          </Button>
        </div>
      </section>

      {/* بخش اعتماد */}
      <section
        data-header-tone="light"
        className="px-container-x py-section-y-md mx-auto max-w-7xl"
      >
        <header className="mb-8 max-w-2xl">
          <h2 className="text-arvand-ink text-3xl font-semibold">{t('trust.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('trust.subtitle')}</p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < testimonial.rating
                          ? 'fill-arvand-gold text-arvand-gold size-4'
                          : 'text-muted-foreground size-4'
                      }
                    />
                  ))}
                </div>
                <p className="text-foreground flex-1 text-sm">“{testimonial.quote[appLocale]}”</p>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {testimonial.authorName[appLocale]}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.authorCompany[appLocale]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
