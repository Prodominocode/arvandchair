import { Mail, Phone } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import type { AppLocale } from '@/i18n/routing'
import { formatBlogDate } from '@/lib/utils/date'

type ContentBlock = { type: 'p'; text: string } | { type: 'list'; items: string[] }
type LegalSection = { id: string; title: string; body: ContentBlock[] }

type LegalPageContentProps = {
  namespace: 'PrivacyPolicy' | 'TermsOfService'
  locale: AppLocale
  lastUpdatedIso: string
  contactEmail: string
  contactPhone: string
}

/**
 * قالب مشترک صفحات حقوقی (حریم خصوصی/شرایط استفاده، بسته‌ی ۶ #۲۴ در
 * docs/05-pages-build-order.md) — هیروی وسط‌چین هم‌الگوی about-content.tsx، به‌همراه فهرست
 * مطالب چسبان (فقط دسکتاپ) و ستون محتوای خوانا (max-w-3xl). بدون تعامل کاربر، پس Server
 * Component ساده (بدون 'use client')، هم‌الگوی Footer.tsx.
 */
export async function LegalPageContent({
  namespace,
  locale,
  lastUpdatedIso,
  contactEmail,
  contactPhone,
}: LegalPageContentProps) {
  const t = await getTranslations(namespace)
  const sections = t.raw('sections') as LegalSection[]
  const lastUpdated = formatBlogDate(lastUpdatedIso, locale)

  return (
    <div>
      {/* Hero — هم‌الگوی about-content.tsx */}
      <section className="px-container-x py-section-y-lg mx-auto max-w-3xl text-center">
        <p className="text-arvand-gold text-sm font-semibold tracking-wide uppercase">
          {t('hero.eyebrow')}
        </p>
        <h1 className="text-arvand-ink mt-3 text-4xl font-bold text-balance lg:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="text-muted-foreground mt-5 text-lg">{t('hero.intro')}</p>
        <p className="text-muted-foreground mt-4 text-sm">
          {t('lastUpdatedLabel', { date: lastUpdated })}
        </p>
      </section>

      <section className="px-container-x pb-section-y-lg max-w-container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* فهرست مطالب چسبان — فقط دسکتاپ؛ ارتفاع هدر (h-16) با top-24 جبران می‌شود */}
          <nav aria-label={t('tocTitle')} className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-foreground text-sm font-semibold">{t('tocTitle')}</p>
              <ul className="border-border mt-4 space-y-1 border-s ps-4 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-muted-foreground hover:text-arvand-ink block py-1 transition-colors"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="flex max-w-3xl flex-col gap-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-arvand-ink text-2xl font-semibold">{section.title}</h2>
                <div className="text-foreground mt-4 flex flex-col gap-4 text-base leading-relaxed">
                  {section.body.map((block, index) =>
                    block.type === 'list' ? (
                      <ul key={index} className="marker:text-arvand-gold list-disc space-y-2 ps-5">
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={index}>{block.text}</p>
                    ),
                  )}
                </div>

                {section.id === 'contact' ? (
                  <ul className="mt-4 space-y-2 text-sm">
                    <li>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-arvand-ink inline-flex items-center gap-2 hover:underline"
                      >
                        <Mail className="size-4 shrink-0" aria-hidden="true" />
                        <span dir="ltr" className="break-all">
                          {contactEmail}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${contactPhone}`}
                        className="text-arvand-ink inline-flex items-center gap-2 hover:underline"
                      >
                        <Phone className="size-4 shrink-0" aria-hidden="true" />
                        <span dir="ltr">{contactPhone}</span>
                      </a>
                    </li>
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
