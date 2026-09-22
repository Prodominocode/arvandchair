'use client'

import * as React from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils/cn'

/**
 * Accordion مخصوص صفحه‌ی جزئیات محصول — الگوی رفرنس Okamura: یک خط بالای فهرست و یک خط
 * `border-bottom` (#d9d9d9) زیر هر آیتم، ردیف‌های بلند (۸۲px) با متن ۱۶px، آیکن «+» نازک که با
 * باز شدن به «−» تبدیل می‌شود، و Hover فقط با تغییر پس‌زمینه‌ی ردیف به #e7e7e7 (بدون Underline).
 * جدا از `components/ui/accordion` است چون آن یکی الگوی عمومی shadcn (Chevron + Underline) را
 * برای بقیه‌ی صفحات نگه می‌دارد.
 */
function ProductAccordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="product-accordion"
      className={cn('border-accordion-border border-t', className)}
      {...props}
    />
  )
}

function ProductAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="product-accordion-item"
      className={cn('border-accordion-border border-b', className)}
      {...props}
    />
  )
}

function ProductAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="product-accordion-trigger"
        className={cn(
          'group text-arvand-ink hover:bg-accordion-hover focus-visible:bg-accordion-hover duration-base flex h-[82px] flex-1 items-center justify-between gap-4 px-1.5 text-start text-base transition-colors outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <svg
          viewBox="0 0 18 18"
          className="text-arvand-ink/70 group-hover:text-arvand-ink pointer-events-none size-[18px] shrink-0 transition-colors"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
        >
          <line x1="1" y1="9" x2="17" y2="9" />
          <line
            x1="9"
            y1="1"
            x2="9"
            y2="17"
            className="duration-base origin-center transition-transform [transform-box:fill-box] group-data-[state=open]:scale-y-0"
          />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function ProductAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="product-accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn('text-arvand-ink px-1.5 pt-1 pb-8', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { ProductAccordion, ProductAccordionItem, ProductAccordionTrigger, ProductAccordionContent }
