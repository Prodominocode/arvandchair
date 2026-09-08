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
    authorName: { fa: 'مهدی رستمی', en: 'Mehdi Rostami', ar: 'مهدي رستمي' },
    authorCompany: {
      fa: 'مدیر اداری، کارگزاری بورس نمونه',
      en: 'Admin Manager, Sample Exchange Brokerage',
      ar: 'مدير إداري، شركة وساطة بورصة نموذجية',
    },
    quote: {
      fa: 'تجهیز ۴ طبقه در ۳ هفته با کیفیت و زمان‌بندی که اروند تعهد داده بود انجام شد؛ حتی یک روز تأخیر هم نداشتیم.',
      en: 'Four floors, fitted out in three weeks, exactly at the quality and schedule Arvand committed to — not a single day of delay.',
      ar: 'تم تجهيز أربعة طوابق خلال ثلاثة أسابيع بالجودة والجدول الزمني الذي التزمت به أرواند، دون أي تأخير.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'مهدی رستمی', en: 'Mehdi Rostami', ar: 'مهدي رستمي' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-university',
    authorName: { fa: 'دکتر سارا کیانی', en: 'Dr. Sara Kiani', ar: 'د. سارة كياني' },
    authorCompany: {
      fa: 'معاون اداری، دانشگاه صنعتی نمونه',
      en: 'Deputy Admin, Sample University of Technology',
      ar: 'نائب الشؤون الإدارية، جامعة تكنولوجيا نموذجية',
    },
    quote: {
      fa: 'تیم اروند در طراحی چیدمان آمفی‌تئاتر به استانداردهای ایمنی و تخلیه‌ی اضطراری کاملاً مسلط بود.',
      en: 'Arvand’s team was fully fluent in safety and emergency-egress standards while designing the amphitheater layout.',
      ar: 'كان فريق أرواند متمكنًا تمامًا من معايير السلامة والإخلاء الطارئ أثناء تصميم تخطيط المدرج.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'سارا کیانی', en: 'Sara Kiani', ar: 'سارة كياني' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-convention',
    authorName: { fa: 'علی نجفی', en: 'Ali Najafi', ar: 'علي نجفي' },
    authorCompany: {
      fa: 'مدیر عملیات، مرکز همایش‌های نمونه',
      en: 'Operations Manager, Sample Convention Center',
      ar: 'مدير العمليات، مركز مؤتمرات نموذجي',
    },
    quote: {
      fa: 'مشاوره‌ی چیدمان برای بهبود دید از ردیف‌های عقب واقعاً روی رضایت مهمانان ما تأثیر گذاشت.',
      en: 'The layout consulting to improve back-row sightlines genuinely improved our guests’ experience.',
      ar: 'استشارة التخطيط لتحسين خطوط الرؤية من الصفوف الخلفية أثّرت فعلاً على رضا ضيوفنا.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'علی نجفی', en: 'Ali Najafi', ar: 'علي نجفي' },
    },
    rating: 4,
  },
  {
    id: 'testimonial-petrochemical',
    authorName: { fa: 'نگار احمدی', en: 'Negar Ahmadi', ar: 'نغار أحمدي' },
    authorCompany: {
      fa: 'مدیر تدارکات، هلدینگ پتروشیمی نمونه',
      en: 'Procurement Manager, Sample Petrochemical Holding',
      ar: 'مدير المشتريات، حيازة بتروكيماويات نموذجية',
    },
    quote: {
      fa: 'میز کنفرانس و ست مبل لابی دقیقاً هماهنگ با هویت بصری ساختمان جدید ما اجرا شد.',
      en: 'The conference table and lobby sofa set were delivered in exact harmony with our new building’s visual identity.',
      ar: 'طاولة الاجتماعات وطقم أثاث الردهة نُفذا بتناسق تام مع الهوية البصرية لمبنانا الجديد.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'نگار احمدی', en: 'Negar Ahmadi', ar: 'نغار أحمدي' },
    },
    rating: 5,
  },
  {
    id: 'testimonial-bank',
    authorName: { fa: 'حسین موسوی', en: 'Hossein Mousavi', ar: 'حسين موسوي' },
    authorCompany: {
      fa: 'سرپرست تدارکات، شعبه‌ی مرکزی بانک نمونه',
      en: 'Procurement Lead, Sample Bank Central Branch',
      ar: 'رئيس المشتريات، الفرع المركزي لبنك نموذجي',
    },
    quote: {
      fa: 'علاوه بر تحویل به‌موقع صندلی‌ها، آموزش نگهداری دوره‌ای برای تیم ما هم بسیار کاربردی بود.',
      en: 'Beyond on-time delivery of the seats, the periodic-maintenance training for our team was genuinely practical.',
      ar: 'إضافة إلى التسليم في الوقت المحدد، كان تدريب الصيانة الدورية لفريقنا عمليًا للغاية.',
    },
    avatar: {
      src: '/images/mock/icon-avatar.svg',
      alt: { fa: 'حسین موسوی', en: 'Hossein Mousavi', ar: 'حسين موسوي' },
    },
    rating: 5,
  },
]
