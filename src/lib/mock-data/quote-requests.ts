/**
 * Mock data برای Collection `QuoteRequests` (docs/02-data-model.md بخش ۴).
 * در بسته‌ی ۱ مصرف نمی‌شود؛ برای بسته‌ی ۴ (فرم درخواست استعلام) آماده شده.
 */

export type QuoteRequestItem = { productId: string; qty: number; notes: string }
export type QuoteRequestStatus = 'new' | 'in-review' | 'quoted' | 'won' | 'lost'

export type QuoteRequest = {
  id: string
  company: string
  contactName: string
  email: string
  phone: string
  items: QuoteRequestItem[]
  message: string
  status: QuoteRequestStatus
  createdAt: string
}

export const quoteRequests: QuoteRequest[] = [
  {
    id: 'qr-1',
    company: 'دانشگاه صنعتی نمونه',
    contactName: 'دکتر سارا کیانی',
    email: 'kiani@sample-university.example',
    phone: '02166123456',
    items: [
      { productId: 'salen-amphitheater-seating', qty: 320, notes: 'آمفی‌تئاتر دانشکده‌ی مهندسی' },
    ],
    message: 'نیاز به مشاوره‌ی چیدمان بر اساس نقشه‌ی سالن موجود داریم.',
    status: 'won',
    createdAt: '2026-01-20',
  },
  {
    id: 'qr-2',
    company: 'مرکز همایش‌های نمونه',
    contactName: 'علی نجفی',
    email: 'najafi@sample-convention.example',
    phone: '02177889900',
    items: [{ productId: 'royal-cinema-hall-seating', qty: 180, notes: 'سالن چندمنظوره' }],
    message: 'زمان‌بندی نصب باید هماهنگ با تقویم رویدادهای سالن باشد.',
    status: 'quoted',
    createdAt: '2026-04-08',
  },
  {
    id: 'qr-3',
    company: 'هلدینگ پتروشیمی نمونه',
    contactName: 'نگار احمدی',
    email: 'ahmadi@sample-petrochem.example',
    phone: '02188990011',
    items: [
      { productId: 'resta-conference-desk', qty: 1, notes: 'اتاق هیئت‌مدیره' },
      { productId: 'vesta-conference-chair', qty: 12, notes: 'همراه میز کنفرانس' },
    ],
    message: '',
    status: 'in-review',
    createdAt: '2026-05-11',
  },
  {
    id: 'qr-4',
    company: 'استارتاپ فناوری نمونه',
    contactName: 'حامد طاهری',
    email: 'hamed@sample-startup.example',
    phone: '09121112233',
    items: [{ productId: 'dorsa-reception-sofa-set', qty: 1, notes: 'لابی ورودی دفتر جدید' }],
    message: 'رنگ سفارشی هماهنگ با هویت بصری برند مدنظر است.',
    status: 'new',
    createdAt: '2026-06-01',
  },
]
