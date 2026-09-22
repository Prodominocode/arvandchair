/**
 * Mock data برای Collection `Testimonials` (docs/02-data-model.md بخش ۳).
 * برای بخش «اعتماد» صفحه‌ی اصلی (بسته‌ی ۱) استفاده می‌شود.
 */

import type { LocalizedText, MockImage } from './types'

export type Testimonial = {
  id: string
  authorName: LocalizedText
  authorCompany: LocalizedText
  quote: LocalizedText
  avatar: MockImage
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-exchange',
    authorName: { fa: 'مهدی رستمی', en: 'Mehdi Rostami' },
    authorCompany: {
      fa: 'مدیر اداری، کارگزاری بورس نمونه',
      en: 'Admin Manager, Sample Exchange Brokerage',
    },
    quote: {
      fa: 'تجهیز ۴ طبقه در ۳ هفته با کیفیت و زمان‌بندی که اروند تعهد داده بود انجام شد؛ حتی یک روز تأخیر هم نداشتیم.',
      en: 'Four floors, fitted out in three weeks, exactly at the quality and schedule Arvand committed to — not a single day of delay.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'مهدی رستمی', en: 'Mehdi Rostami' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-university',
    authorName: { fa: 'دکتر سارا کیانی', en: 'Dr. Sara Kiani' },
    authorCompany: {
      fa: 'معاون اداری، دانشگاه صنعتی نمونه',
      en: 'Deputy Admin, Sample University of Technology',
    },
    quote: {
      fa: 'تیم اروند در طراحی چیدمان آمفی‌تئاتر به استانداردهای ایمنی و تخلیه‌ی اضطراری کاملاً مسلط بود.',
      en: 'Arvand’s team was fully fluent in safety and emergency-egress standards while designing the amphitheater layout.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'سارا کیانی', en: 'Sara Kiani' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-convention',
    authorName: { fa: 'علی نجفی', en: 'Ali Najafi' },
    authorCompany: {
      fa: 'مدیر عملیات، مرکز همایش‌های نمونه',
      en: 'Operations Manager, Sample Convention Center',
    },
    quote: {
      fa: 'مشاوره‌ی چیدمان برای بهبود دید از ردیف‌های عقب واقعاً روی رضایت مهمانان ما تأثیر گذاشت.',
      en: 'The layout consulting to improve back-row sightlines genuinely improved our guests’ experience.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'علی نجفی', en: 'Ali Najafi' },
    },
    rating: 4,
  },
  {
    id: 'testimonial-petrochemical',
    authorName: { fa: 'نگار احمدی', en: 'Negar Ahmadi' },
    authorCompany: {
      fa: 'مدیر تدارکات، هلدینگ پتروشیمی نمونه',
      en: 'Procurement Manager, Sample Petrochemical Holding',
    },
    quote: {
      fa: 'میز کنفرانس و ست مبل لابی دقیقاً هماهنگ با هویت بصری ساختمان جدید ما اجرا شد.',
      en: 'The conference table and lobby sofa set were delivered in exact harmony with our new building’s visual identity.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'نگار احمدی', en: 'Negar Ahmadi' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-bank',
    authorName: { fa: 'حسین موسوی', en: 'Hossein Mousavi' },
    authorCompany: {
      fa: 'سرپرست تدارکات، شعبه‌ی مرکزی بانک نمونه',
      en: 'Procurement Lead, Sample Bank Central Branch',
    },
    quote: {
      fa: 'علاوه بر تحویل به‌موقع صندلی‌ها، آموزش نگهداری دوره‌ای برای تیم ما هم بسیار کاربردی بود.',
      en: 'Beyond on-time delivery of the seats, the periodic-maintenance training for our team was genuinely practical.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'حسین موسوی', en: 'Hossein Mousavi' },
    },
    rating: 5,
  },
]
