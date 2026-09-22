import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Building2, Factory, Layers, Clock, CalendarCheck, Target, Lightbulb } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { buildAlternates } from '@/lib/seo/metadata'
import {
  getPortfolioProjectBySlug,
  getRelatedPortfolioProjects,
} from '@/lib/data/portfolio-projects'
import { getPortfolioIndustries } from '@/lib/data/portfolio-industries'
import { getCategories } from '@/lib/data/categories'
import { getProductById } from '@/lib/data/products'
import type { Product } from '@/lib/mock-data/products'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductGalleryFilmstrip } from '@/components/products/ProductGalleryFilmstrip'
import { ProductGrid } from '@/components/products/ProductGrid'
import { PortfolioGrid } from '@/components/portfolio/PortfolioGrid'

type Args = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, slug } = await params
  const appLocale = locale as AppLocale
  const project = await getPortfolioProjectBySlug(appLocale, slug)
  if (!project) return {}

  const { canonical, languages } = buildAlternates(appLocale, `/portfolio/${slug}`)
  const title = project.seo.metaTitle[appLocale]
  const description = project.seo.metaDescription[appLocale]

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [project.coverImage.src],
    },
  }
}

/**
 * `/{locale}/portfolio/{slug}` — جزئیات پروژه‌ی نمونه‌کار (`05-pages-build-order.md` بسته‌ی ۳
 * #۱۰)، هم‌الگوی بصری جزئیات محصول/پست وبلاگ (Hero تمام‌قد data-header-solid → متن معرفی
 * وسط‌چین → محتوا → بازگشت → مرتبط) با سه بخش اختصاصی این نوع محتوا: نوار «مشخصات فنی پروژه»
 * (لیست آیکنی صنعت/کارفرما/محل/دامنه‌ی کار/مدت/سال تحویل) زیر هیرو، سکشن دوستونه‌ی
 * چالش/راه‌حل (Case Study)، و گرید محصولات استفاده‌شده که به صفحه‌ی هر محصول لینک می‌دهد.
 */
export default async function PortfolioProjectPage({ params }: Args) {
  const { locale, slug } = await params
  const appLocale = locale as AppLocale
  setRequestLocale(locale)

  const project = await getPortfolioProjectBySlug(appLocale, slug)
  if (!project) notFound()

  const [t, tPortfolio, industries, categories, relatedProjects, resolvedProducts] =
    await Promise.all([
      getTranslations({ locale, namespace: 'PortfolioDetail' }),
      getTranslations({ locale, namespace: 'Portfolio' }),
      getPortfolioIndustries(),
      getCategories(),
      getRelatedPortfolioProjects(project),
      Promise.all(project.productIds.map((id) => getProductById(id))),
    ])

  const usedProducts = resolvedProducts.filter((product): product is Product => product !== null)
  const categorySlugById = Object.fromEntries(categories.map((c) => [c.id, c.slug[appLocale]]))
  const industryLabelById = Object.fromEntries(
    industries.map((industry) => [industry.id, industry.label[appLocale]]),
  )
  const industryLabel = industryLabelById[project.industryId] ?? project.industry[appLocale]

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: tPortfolio('breadcrumb.home'), href: '/' },
    { label: tPortfolio('breadcrumb.portfolio'), href: '/portfolio' },
    { label: project.title[appLocale] },
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

  const caseStudyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title[appLocale],
    description: project.summary[appLocale],
    image: [project.coverImage.src, ...project.gallery.map((image) => image.src)],
    about: project.industry[appLocale],
  }

  const facts: Array<{ icon: typeof Building2; label: string; value: string }> = [
    { icon: Factory, label: t('meta.industry'), value: industryLabel },
    { icon: Building2, label: t('meta.client'), value: project.clientName[appLocale] },
    { icon: Layers, label: t('meta.scope'), value: project.scope[appLocale] },
    { icon: Clock, label: t('meta.duration'), value: project.duration[appLocale] },
    {
      icon: CalendarCheck,
      label: t('meta.completed'),
      value: String(project.completionYear),
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd) }}
      />

      {/* Hero — هم‌الگوی هیروی جزئیات محصول/پست (تصویر تمام‌قد + گرادیان + عنوان وسط‌چین روی
          ۷۵٪ ارتفاع)؛ بج صنعت بالای عنوان (هم‌شکل بج جزئیات پست) و کارفرما به‌جای زیرنویس. */}
      <section
        data-section="hero"
        data-header-tone="light"
        data-header-solid
        className="bg-arvand-ink relative -mt-16 h-svh min-h-[520px] w-full overflow-hidden"
      >
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt[appLocale]}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          data-section="hero-overlay"
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(20,20,20,.2), rgba(20,20,20,.55))',
          }}
        />
        <div
          data-section="hero-text"
          className="px-container-x absolute inset-x-0 top-[75%] flex -translate-y-1/2 flex-col items-center gap-4 text-center font-normal text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]"
        >
          <Badge variant="secondary" className="bg-surface-white/90 backdrop-blur-sm">
            {industryLabel}
          </Badge>
          <h1
            data-section="hero-title"
            className="max-w-3xl text-[28px] leading-tight font-normal tracking-tight sm:text-[36px]"
          >
            {project.title[appLocale]}
          </h1>
          <p data-section="hero-subtitle" className="max-w-2xl text-base text-white/90">
            {project.clientName[appLocale]} · {project.location[appLocale]}
          </p>
        </div>
      </section>

      {/* مشخصات فنی پروژه — لیست آیکنی صنعت/کارفرما/دامنه‌ی کار/مدت/سال تحویل، هم‌الگوی گرید
          خط‌دار ProductGrid/BlogGrid (والد فقط ضلع بالا/شروع، هر سلول ضلع پایان/پایین خودش). */}
      <div
        data-section="facts"
        className="border-border px-container-x max-w-container mx-auto border-b"
      >
        <div className="border-border grid grid-cols-2 border-s border-t sm:grid-cols-3 lg:grid-cols-5">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-border flex flex-col items-center gap-2 border-e border-b px-3 py-6 text-center"
            >
              <fact.icon className="text-muted-foreground size-5" aria-hidden="true" />
              <div>
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  {fact.label}
                </p>
                <p className="text-arvand-ink mt-0.5 text-sm font-medium sm:text-base">
                  {fact.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* متن معرفی — خلاصه‌ی پروژه، وسط‌چین (هم‌الگوی سکشن intro جزئیات محصول/پست) */}
      <section
        data-section="intro"
        className="px-container-x flex items-center justify-center py-16 sm:py-20"
      >
        <p
          data-section="intro-text"
          className="text-arvand-ink mx-auto max-w-3xl text-center text-[19.2px] leading-relaxed font-light text-balance sm:text-2xl sm:leading-relaxed"
        >
          {project.summary[appLocale]}
        </p>
      </section>

      {/* چالش/راه‌حل — دوستونه روی زمینه‌ی خاکستری برای جدا شدن بصری از سکشن‌های سفید اطراف؛
          دقیقاً همان خلاصه‌ی Case Study که سند ۰۵ برای جزئیات پروژه خواسته. */}
      <div data-section="challenge-solution" className="bg-surface-mist py-section-y-lg">
        <div className="px-container-x max-w-container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-section="challenge">
            <div className="text-arvand-ink mb-3 flex items-center gap-2">
              <Target className="size-5 shrink-0" aria-hidden="true" />
              <h2 className="text-xl font-semibold sm:text-2xl">{t('challenge.title')}</h2>
            </div>
            <p className="text-arvand-slate text-base leading-relaxed">
              {project.challenge[appLocale]}
            </p>
          </div>
          <div data-section="solution">
            <div className="text-arvand-ink mb-3 flex items-center gap-2">
              <Lightbulb className="size-5 shrink-0" aria-hidden="true" />
              <h2 className="text-xl font-semibold sm:text-2xl">{t('solution.title')}</h2>
            </div>
            <p className="text-arvand-slate text-base leading-relaxed">
              {project.solution[appLocale]}
            </p>
          </div>
        </div>
      </div>

      {/* گالری پروژه — همان کاروسل بزرگ Filmstrip جزئیات محصول، عیناً reuse شده چون کاملاً
          داده‌محور است (فقط MockImage[] + locale می‌گیرد). */}
      {project.gallery.length > 0 ? (
        <div data-section="gallery" className="py-section-y-md">
          <p
            data-section="gallery-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('gallery.title')}
          </p>
          <ProductGalleryFilmstrip images={project.gallery} locale={appLocale} />
        </div>
      ) : null}

      {/* محصولات استفاده‌شده — همان ProductGrid کاتالوگ، لینک هر کارت به صفحه‌ی محصول
          می‌رود؛ دقیقاً همان چیزی که سند ۰۵ برای جزئیات پروژه خواسته. */}
      {usedProducts.length > 0 ? (
        <div data-section="products-used" className="bg-surface-mist py-section-y-lg">
          <p
            data-section="products-used-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('productsUsed.title')}
          </p>
          <div data-section="products-used-grid" className="px-container-x max-w-container mx-auto">
            <ProductGrid
              products={usedProducts}
              locale={appLocale}
              categorySlugById={categorySlugById}
            />
          </div>
        </div>
      ) : null}

      {/* CTA — تنها لهجه‌ی طلایی صفحه (سند ۰۶ بخش ۲: فقط یک لهجه‌ی طلایی در هر صفحه)، لینک به
          صفحه‌ی تماس که از قبل ساخته شده (بسته‌ی ۱ #۴). */}
      <div
        data-section="cta"
        className="px-container-x py-section-y-lg flex flex-col items-center gap-4 text-center"
      >
        <h2 className="text-arvand-ink text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('cta.title')}
        </h2>
        <p className="text-muted-foreground max-w-xl text-base leading-relaxed">{t('cta.text')}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/contact">{t('cta.button')}</Link>
        </Button>
      </div>

      <div data-section="back-link" className="py-section-y-sm flex justify-center">
        <Link
          href="/portfolio"
          className="text-arvand-ink hover:text-arvand-ink/70 duration-base text-sm transition-colors"
        >
          {t('backToIndex')}
        </Link>
      </div>

      {relatedProjects.length > 0 ? (
        <div data-section="related-projects" className="bg-surface-mist py-section-y-lg">
          <p
            data-section="related-projects-title"
            className="text-arvand-ink mb-8 text-center text-2xl font-semibold tracking-tight uppercase"
          >
            {t('related.title')}
          </p>
          <div
            data-section="related-projects-grid"
            className="px-container-x max-w-container mx-auto"
          >
            <PortfolioGrid
              projects={relatedProjects}
              locale={appLocale}
              industryLabelById={industryLabelById}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
