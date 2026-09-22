'use client'

import { type FormEvent, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ProductQuoteInquiryProps = {
  productTitle: string
}

/**
 * CTA سکشن استعلام قیمت B2B — بعد از Lineup. کاملاً نمایشی است (Submit فقط Toast می‌زند و فرم را
 * می‌بندد)؛ طبق قانون «فقط یک لهجه‌ی طلایی در هر صفحه» (docs/06-design-tokens.md بخش ۲) دکمه‌ی
 * این سکشن Outline است، نه Primary — چون دکمه‌ی طلایی «درخواست استعلام» در Overview از قبل
 * ممکن است روی صفحه باشد.
 */
export function ProductQuoteInquiry({ productTitle }: ProductQuoteInquiryProps) {
  const t = useTranslations('ProductDetail.quoteInquiry')
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)

    window.setTimeout(() => {
      toast.success(t('toastSuccess'))
      form.reset()
      setIsSubmitting(false)
      setOpen(false)
    }, 400)
  }

  return (
    <div
      data-section="quote-inquiry"
      className="px-container-x max-w-container mx-auto flex flex-col items-center gap-4 text-center"
    >
      <h2 className="text-arvand-ink text-2xl font-semibold tracking-tight uppercase">
        {t('title')}
      </h2>
      <p className="text-arvand-ink max-w-lg text-base leading-relaxed">{t('text')}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" variant="outline" className="mt-2">
            {t('cta')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('dialog.description', { product: productTitle })}
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-1.5">
              <Label htmlFor="quote-inquiry-company">{t('form.companyLabel')}</Label>
              <Input
                id="quote-inquiry-company"
                name="company"
                required
                placeholder={t('form.companyPlaceholder')}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="quote-inquiry-contact-name">{t('form.contactNameLabel')}</Label>
              <Input
                id="quote-inquiry-contact-name"
                name="contactName"
                required
                placeholder={t('form.contactNamePlaceholder')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="quote-inquiry-phone">{t('form.phoneLabel')}</Label>
                <Input
                  id="quote-inquiry-phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  required
                  placeholder={t('form.phonePlaceholder')}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="quote-inquiry-email">{t('form.emailLabel')}</Label>
                <Input
                  id="quote-inquiry-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  required
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="quote-inquiry-quantity">{t('form.quantityLabel')}</Label>
              <Input
                id="quote-inquiry-quantity"
                name="quantity"
                type="number"
                dir="ltr"
                min={1}
                placeholder={t('form.quantityPlaceholder')}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="quote-inquiry-message">{t('form.messageLabel')}</Label>
              <Textarea
                id="quote-inquiry-message"
                name="message"
                rows={4}
                placeholder={t('form.messagePlaceholder')}
              />
            </div>

            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t('form.cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {t('form.submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
