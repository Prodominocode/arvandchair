import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import { getCategories, getCategoryBySlug } from '@/lib/data/categories'
import { getProductBySlug, getRelatedProducts, resolveProductSalesMode } from '@/lib/data/products'
import { getProductTagsByIds } from '@/lib/data/tags'
import { getProductMaterialsByIds } from '@/lib/data/materials'
import { ProductOverviewCarousel } from '@/components/products/ProductOverviewCarousel'
import { ProductOverviewPanel } from '@/components/products/ProductOverviewPanel'
import { ProductGalleryFilmstrip } from '@/components/products/ProductGalleryFilmstrip'
import { ProductLineupAccordion } from '@/components/products/ProductLineupAccordion'
import { ProductGrid } from '@/components/products/ProductGrid'

type Args = {
  params: Promise<{ locale: string; category: string; product: string }>
}

async function resolveProduct(locale: AppLocale, categorySlug: string, productSlug: string) {
  const [category, product] = await Promise.all([
    getCategoryBySlug(locale, categorySlug),
    getProductBySlug(locale, productSlug),
  ])
  // مسیر باید دقیقاً `/products/{دسته‌ی خودِ محصول}/{slug}` باشد (سند ۰۳)؛ اگر دسته‌ی داخل URL
  // با دسته‌ی واقعی محصول یکی نباشد (لینک قدیمی/دستکاری‌شده)، ۴۰۴ صحیح‌تر از نمایش محصول
  // زیر دسته‌ی اشتباه است.
  if (!category || !product || product.categoryId !== category.id) return null
  return { category, product }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, category: categorySlug, product: productSlug } = await params
  const appLocale = locale as AppLocale
  const resolved = await resolveProduct(appLocale, categorySlug, productSlug)
  if (!resolved) return {}

  const { product } = resolved
  const { canonical, languages } = buildAlternates(
    appLocale,
    `/products/${categorySlug}/${productSlug}`,
  )
  const title = product.seo.metaTitle[appLocale]
  const description = product.seo.metaDescription[appLocale]

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      images: product.images[0] ? [product.images[0].src] : undefined,
    },
  }
}

/**
 * `/{locale}/products/{category}/{product}` — جزئیات محصول (`05-pages-build-order.md` بسته‌ی ۲
 * #۷)، الگوی دقیق رفرنس Okamura Plimode: Hero تمام‌قد + متن معرفی وسط‌چین (سکشن ۹۰vh) → Overview (کاروسل
 * بزرگ اسلایدی + Accordion مشخصات/CTA) → سکشن مستقل Gallery (نوار افقی بزرگ) → سکشن Features (تصویر
 * تمام‌عرض/دوستونه + متن وسط‌چین) → سکشن Lineup (Accordion گزینه‌ها) → لینک بازگشت → Other
 * Products. کاملاً عمومی/داده‌محور است؛ فقط `ara-managerial-chair` فعلاً محتوای کامل
 * (گالری+Features) دارد تا الگو کامل دیده شود.
 */
export default async function ProductDetailPage({ params }: Args) {
  const { locale, category: categorySlug, product: productSlug } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const resolved = await resolveProduct(appLocale, categorySlug, productSlug)
  if (!resolved) notFound()
  const { category, product } = resolved

  const [t, tProducts, salesMode, tags, materials, relatedProducts, categories] = await Promise.all(
    [
      getTranslations({ locale, namespace: 'ProductDetail' }),
      getTranslations({ locale, namespace: 'Products' }),
      resolveProductSalesMode(product),
      getProductTagsByIds(product.tagIds),
      getProductMaterialsByIds(product.materialIds),
      getRelatedProducts(product),
      getCategories(),
    ],
  )

  const categorySlugById = Object.fromEntries(categories.map((c) => [c.id, c.slug[appLocale]]))

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: tProducts('breadcrumb.home'), href: '/' },
    { label: tProducts('breadcrumb.products'), href: '/products' },
    { label: category.title[appLocale], href: `/products/${categorySlug}` },
    { label: product.title[appLocale] },
  ]

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: crumb.href } : {}),
    })),
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title[appLocale],
    description: product.shortDescription[appLocale],
    sku: product.sku,
    image: product.images.map((image) => image.src),
    ...(salesMode === 'direct-purchase'
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: product.currency,
            price: product.basePrice,
            availability:
              product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }
      : {}),
  }

  const heroImage = product.images[1] ?? product.images[0]
  const overviewImages = product.images.slice(0, 4)
  const hasLineupContent = product.variants.length > 1 || materials.length > 0 || tags.length > 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Hero — تصویر به‌اندازه‌ی کل نمایشگر (۱۰۰svh) و از بالای صفحه شروع می‌شود (-mt-16 فاصله‌ی
          pt-16 پیش‌فرض main را لغو می‌کند)، ولی هدر با پس‌زمینه‌ی اصلی سایت (data-header-solid ←
          bg-background در HeaderNav) روی آن می‌نشیند؛ پس عملاً تصویر از زیر منو تا خط پایین
          اسکرین دیده می‌شود و بخش بعدی فقط با اسکرول. چون زیر هدر پس‌زمینه‌ی روشن است،
          data-header-tone="light" (لوگو/منوی تیره). عنوان (۳۰px) و یک خط توضیح کوتاه (۱۶px)
          وسط‌چین و بدون وزن Bold‌اند و مرکز بلوک‌شان روی ۷۵ درصد ارتفاع هیرو از بالا قرار می‌گیرد. */}
      {heroImage ? (
        <section
          data-section="hero"
          data-header-tone="light"
          data-header-solid
          className="bg-arvand-ink relative -mt-16 h-svh min-h-[520px] w-full overflow-hidden"
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt[appLocale]}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* لایه‌ی تیره‌ی ملایم برای خوانایی متن سفید روی هر عکس (روشن‌تر بالا، تیره‌تر پایین) */}
          <div
            data-section="hero-overlay"
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(20,20,20,.2), rgba(20,20,20,.55))',
            }}
          />
          <div
            data-section="hero-text"
            className="px-container-x absolute inset-x-0 top-[75%] flex -translate-y-1/2 flex-col items-center gap-3 text-center font-normal text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]"
          >
            <h1
              data-section="hero-title"
              className="text-[30px] leading-tight font-normal tracking-tight"
            >
              {product.title[appLocale]}
            </h1>
            <p data-section="hero-subtitle" className="max-w-2xl text-base text-white/90">
              {product.shortDescription[appLocale]}
            </p>
          </div>
        </section>
      ) : (
        <div
          data-section="hero-fallback"
          data-header-tone="light"
          data-header-solid
          className="px-container-x max-w-container pt-section-y-md mx-auto"
        >
          <h1 className="text-arvand-ink text-center text-3xl font-bold sm:text-5xl">
            {product.title[appLocale]}
          </h1>
        </div>
      )}

      {/* متن معرفی — پاراگراف کامل محصول (نه تگ‌لاین کوتاه) وسط‌چین و درشت، در سکشنی به‌ارتفاع
          ۹۰ درصد نمایشگر تا فضای خالیِ بالا/پایین متن زیاد باشد (الگوی رفرنس). */}
      <section
        data-section="intro"
        data-header-tone="light"
        className="px-container-x flex min-h-[90svh] items-center justify-center"
      >
        <p
          data-section="intro-text"
          className="text-arvand-ink mx-auto max-w-4xl text-center text-[19.2px] leading-relaxed font-light text-balance sm:text-2xl sm:leading-relaxed"
        >
          {product.description[appLocale]}
        </p>
      </section>

      {/* Overview — کاروسل بزرگ + Accordion مشخصات/CTA، هم‌ارتفاع یک صفحه‌ی نمایش */}
      <section
        data-section="overview"
        data-header-tone="light"
        className="px-container-x max-w-container mx-auto flex min-h-svh items-center py-24"
      >
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div data-section="overview-carousel">
            <ProductOverviewCarousel images={overviewImages} locale={appLocale} />
          </div>
          <ProductOverviewPanel
            product={product}
            locale={appLocale}
            salesMode={salesMode}
            materials={materials}
          />
        </div>
      </section>

      {product.images.length > 1 ? (
        <div data-section="gallery" className="bg-surface-mist py-section-y-md">
          <p
            data-section="gallery-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('gallery.title')}
          </p>
          <ProductGalleryFilmstrip images={product.images} locale={appLocale} />
        </div>
      ) : null}

      {product.features && product.features.length > 0 ? (
        <div data-section="features" className="py-section-y-lg">
          <p
            data-section="features-title"
            className="text-arvand-ink mb-14 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('features.title')}
          </p>
          <div className="flex flex-col gap-20">
            {product.features.map((feature, index) => (
              <div
                key={feature.title[appLocale]}
                data-section={`feature-${index + 1}`}
                className="flex flex-col gap-8"
              >
                <div
                  className={
                    feature.images.length > 1
                      ? 'px-container-x max-w-container mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2'
                      : 'px-container-x max-w-container mx-auto w-full'
                  }
                >
                  {feature.images.map((image) => (
                    <div
                      key={image.src}
                      className="bg-surface-mist relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt[appLocale]}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="px-container-x mx-auto max-w-xl text-center">
                  <h3 className="text-arvand-ink text-xl font-semibold sm:text-2xl">
                    {feature.title[appLocale]}
                  </h3>
                  <p className="text-arvand-ink mt-3 text-base leading-relaxed">
                    {feature.text[appLocale]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasLineupContent ? (
        <div data-section="lineup" className="bg-surface-mist py-section-y-lg">
          <p
            data-section="lineup-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('lineup.title')}
          </p>
          <div data-section="lineup-accordion" className="px-container-x max-w-container mx-auto">
            <ProductLineupAccordion
              product={product}
              locale={appLocale}
              tags={tags}
              materials={materials}
            />
          </div>
        </div>
      ) : null}

      <div data-section="back-link" className="py-section-y-sm flex justify-center">
        <Link
          href={`/products/${categorySlug}`}
          className="text-arvand-ink hover:text-arvand-ink/70 duration-base text-sm transition-colors"
        >
          {t('backToIndex')}
        </Link>
      </div>

      {relatedProducts.length > 0 ? (
        <div data-section="related-products" className="py-section-y-lg">
          <p
            data-section="related-products-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('related.title')}
          </p>
          <div
            data-section="related-products-grid"
            className="px-container-x max-w-container mx-auto"
          >
            <ProductGrid
              products={relatedProducts}
              locale={appLocale}
              categorySlugById={categorySlugById}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
