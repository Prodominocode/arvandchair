import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

import { isContentEditor } from '@/access/roles'

/**
 * نسخه‌ی موقت و سریع مدیریت کاروسل سه‌بعدی صفحه‌ی اصلی. هر ردیف `chairs` یک اسلاید کاروسل است:
 * تصویر اصلی (روی صحنه‌ی سه‌بعدی)، عکس‌های جزئی (داخل سایدبار) و مشخصات (ردیف‌های سایدبار).
 * اگر این لیست خالی باشد، سایت از مقادیر پیش‌فرض کد (`components/look-carousel/chairs.ts`) استفاده می‌کند.
 * مقادیر پیش‌فرض کامل با `npm run seed:carousel` در پنل ساخته می‌شوند.
 */
export const HomeCarousel: GlobalConfig = {
  slug: 'home-carousel',
  label: 'کاروسل صفحه‌ی اصلی',
  access: {
    read: () => true,
    update: isContentEditor,
  },
  hooks: {
    afterChange: [
      () => {
        // در اسکریپت‌های CLI (seed) محیط Next وجود ندارد؛ آنجا خطا بی‌اهمیت است.
        try {
          revalidatePath('/', 'layout')
        } catch {
          /* no-op */
        }
      },
    ],
  },
  fields: [
    {
      name: 'chairs',
      label: 'صندلی‌ها (اسلایدهای کاروسل)',
      type: 'array',
      labels: { singular: 'صندلی', plural: 'صندلی‌ها' },
      admin: {
        description:
          'ترتیب ردیف‌ها همان ترتیب اسلایدهاست. تصویر اصلی بهتر است PNG با پس‌زمینه‌ی شفاف و نسبت ۶۰۰×۸۵۳ باشد؛ ' +
          'تصویری با نسبت دیگر هم پذیرفته می‌شود و خودکار (فقط با کراپ دور خودِ صندلی، بدون کشیدن) به همان نسبت می‌رسد. ' +
          'اگر هیچ صندلی‌ای ثبت نشود، مقادیر پیش‌فرض سایت نمایش داده می‌شود.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              label: 'نام صندلی',
              type: 'text',
              localized: true,
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'caption',
              label: 'توضیح کوتاه (زیر نام)',
              type: 'text',
              localized: true,
              admin: { width: '50%', description: 'مثلاً «نمای روبه‌رو».' },
            },
          ],
        },
        {
          name: 'image',
          label: 'تصویر اصلی',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description:
              'PNG شفاف با نسبت ایده‌آل ۶۰۰×۸۵۳. نسبت دیگر خودکار به همین نسبت کراپ می‌شود (صندلی وسط می‌ماند).',
          },
        },
        {
          name: 'gallery',
          label: 'عکس‌های جزئی',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description:
              'تصاویر ریزتر (دسته‌بندی، پارچه، پایه، …) که در سایدبار جزئیات زیر مشخصات نمایش داده می‌شوند.',
          },
        },
        {
          name: 'specs',
          label: 'مشخصات',
          type: 'array',
          labels: { singular: 'مشخصه', plural: 'مشخصات' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'kind',
                  label: 'عنوان (مثلاً رنگ)',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: { width: '33%' },
                },
                {
                  name: 'value',
                  label: 'مقدار (مثلاً قرمز)',
                  type: 'text',
                  localized: true,
                  required: true,
                  admin: { width: '40%' },
                },
                {
                  name: 'swatch',
                  label: 'رنگ نمونه (اختیاری)',
                  type: 'text',
                  admin: { width: '27%', description: 'کد هگز، مثل #b23a3f' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
