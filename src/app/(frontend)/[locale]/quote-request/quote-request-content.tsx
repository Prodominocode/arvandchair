'use client'

import { type FormEvent, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

import type { AppLocale } from '@/i18n/routing'
import type { Product } from '@/lib/mock-data/products'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type QuoteRequestContentProps = {
  products: Product[]
  locale: AppLocale
  initialProductId: string | null
}

type QuoteItemRow = {
  key: string
  productId: string
  qty: number
  notes: string
}

function createRow(productId: string): QuoteItemRow {
  return { key: crypto.randomUUID(), productId, qty: 1, notes: '' }
}

/**
 * فرم چندآیتمی استعلام قیمت — طبق فاز ۳ («فقط UI و State»، دقیقاً هم‌الگوی
 * `contact/contact-content.tsx`)، بدون اتصال واقعی به CRM/ایمیل (فاز ۶). ردیف اول از
 * `initialProductId` پر می‌شود (ورودی از دکمه‌ی «درخواست استعلام» صفحه‌ی جزئیات محصول).
 */
export function QuoteRequestContent({
  products,
  locale,
  initialProductId,
}: QuoteRequestContentProps) {
  const t = useTranslations('QuoteRequest')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<QuoteItemRow[]>([
    createRow(initialProductId ?? products[0]?.id ?? ''),
  ])

  function updateItem(key: string, patch: Partial<Omit<QuoteItemRow, 'key'>>) {
    setItems((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  function addItem() {
    setItems((current) => [...current, createRow(products[0]?.id ?? '')])
  }

  function removeItem(key: string) {
    setItems((current) => (current.length > 1 ? current.filter((row) => row.key !== key) : current))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    window.setTimeout(() => {
      toast.success(t('form.submitSuccess'))
      event.currentTarget.reset()
      setItems([createRow(products[0]?.id ?? '')])
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="px-container-x py-section-y-lg max-w-container mx-auto">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-arvand-ink text-4xl font-bold text-balance">{t('title')}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{t('subtitle')}</p>
      </header>

      <Card className="mx-auto mt-12 max-w-3xl">
        <CardContent className="p-6">
          <h2 className="text-foreground mb-5 text-xl font-semibold">{t('formTitle')}</h2>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="qr-company">{t('form.companyLabel')}</Label>
                <Input
                  id="qr-company"
                  name="company"
                  required
                  placeholder={t('form.companyPlaceholder')}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="qr-contact-name">{t('form.contactNameLabel')}</Label>
                <Input
                  id="qr-contact-name"
                  name="contactName"
                  required
                  placeholder={t('form.contactNamePlaceholder')}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="qr-email">{t('form.emailLabel')}</Label>
                <Input
                  id="qr-email"
                  name="email"
                  type="email"
                  dir="ltr"
                  required
                  placeholder={t('form.emailPlaceholder')}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="qr-phone">{t('form.phoneLabel')}</Label>
                <Input
                  id="qr-phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  required
                  placeholder={t('form.phonePlaceholder')}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label>{t('form.itemsTitle')}</Label>
              <div className="grid gap-4">
                {items.map((row) => (
                  <div key={row.key} className="border-border grid gap-3 rounded-lg border p-4">
                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="grid gap-1.5">
                        <Label htmlFor={`qr-item-product-${row.key}`}>
                          {t('form.itemProductLabel')}
                        </Label>
                        <Select
                          value={row.productId}
                          onValueChange={(value) => updateItem(row.key, { productId: value })}
                        >
                          <SelectTrigger id={`qr-item-product-${row.key}`} className="w-full">
                            <SelectValue placeholder={t('form.itemProductPlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.title[locale]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor={`qr-item-qty-${row.key}`}>{t('form.itemQtyLabel')}</Label>
                        <Input
                          id={`qr-item-qty-${row.key}`}
                          type="number"
                          min={1}
                          required
                          dir="ltr"
                          className="w-24"
                          value={row.qty}
                          onChange={(event) =>
                            updateItem(row.key, { qty: Number(event.target.value) || 1 })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor={`qr-item-notes-${row.key}`}>{t('form.itemNotesLabel')}</Label>
                      <Input
                        id={`qr-item-notes-${row.key}`}
                        placeholder={t('form.itemNotesPlaceholder')}
                        value={row.notes}
                        onChange={(event) => updateItem(row.key, { notes: event.target.value })}
                      />
                    </div>
                    {items.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive w-fit gap-1.5"
                        onClick={() => removeItem(row.key)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {t('form.removeItem')}
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit gap-1.5"
                onClick={addItem}
              >
                <Plus className="size-4" aria-hidden="true" />
                {t('form.addItem')}
              </Button>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="qr-message">{t('form.messageLabel')}</Label>
              <Textarea
                id="qr-message"
                name="message"
                rows={4}
                placeholder={t('form.messagePlaceholder')}
              />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
              {t('form.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
