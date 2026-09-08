'use client'

import { type FormEvent, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Mail, Phone } from 'lucide-react'

import type { AppLocale } from '@/i18n/routing'
import type { Office } from '@/lib/mock-data/site-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ContactContentProps = {
  offices: Office[]
  contactEmail: string
}

/**
 * فرم تماس فقط UI و State است — طبق فاز ۳ (docs/01-workflow-roadmap.md)، بدون اتصال واقعی به
 * بک‌اند/ایمیل تراکنشی (آن فاز ۶ است، روی Mailhog). Submit فعلاً فقط یک Toast موفقیت نمایش
 * می‌دهد و فرم را ریست می‌کند.
 */
export function ContactContent({ offices, contactEmail }: ContactContentProps) {
  const t = useTranslations('Contact')
  const locale = useLocale() as AppLocale
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    window.setTimeout(() => {
      toast.success(t('form.submitSuccess'))
      event.currentTarget.reset()
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="px-container-x py-section-y-lg mx-auto max-w-6xl">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-arvand-ink text-4xl font-bold text-balance">{t('title')}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{t('subtitle')}</p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-foreground mb-5 text-xl font-semibold">{t('formTitle')}</h2>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-1.5">
                <Label htmlFor="contact-name">{t('form.nameLabel')}</Label>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  placeholder={t('form.namePlaceholder')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-email">{t('form.emailLabel')}</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    required
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="contact-phone">{t('form.phoneLabel')}</Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    dir="ltr"
                    required
                    placeholder={t('form.phonePlaceholder')}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="contact-company">{t('form.companyLabel')}</Label>
                <Input
                  id="contact-company"
                  name="company"
                  placeholder={t('form.companyPlaceholder')}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="contact-message">{t('form.messageLabel')}</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>
              <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
                {t('form.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-foreground mb-5 text-xl font-semibold">{t('officesTitle')}</h2>
          <ul className="space-y-4">
            {offices.map((office) => (
              <li key={office.id}>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-foreground font-semibold">{office.title[locale]}</p>
                    <p className="text-arvand-gold text-xs font-medium">
                      {t(`officeType.${office.type}`)}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">{office.address.street}</p>
                    <p className="text-muted-foreground text-sm">
                      {office.address.city}، {office.address.province}
                    </p>
                    <a
                      href={`tel:${office.phone}`}
                      dir="ltr"
                      className="text-foreground mt-2 inline-flex items-center gap-2 text-sm hover:underline"
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {office.phone}
                    </a>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${contactEmail}`}
            className="text-foreground mt-4 inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Mail className="size-4" aria-hidden="true" />
            <span dir="ltr">{contactEmail}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
