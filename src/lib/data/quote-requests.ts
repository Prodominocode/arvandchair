/**
 * لایه‌ی Data Access برای Collection `QuoteRequests` — فاز ۵ به Payload وصل شد؛ خروجی به شکل Mock
 * (`QuoteRequest`) Adapt می‌شود. نگاشت فیلدها: `items[].product` → `items[].productId` (id واقعی
 * محصول، هم‌راستا با `lib/data/products.ts`)، `createdAt` → `YYYY-MM-DD` تقویم تهران.
 *
 * ⚠️ داده‌ی حساس (اطلاعات تماس مشتری) — در Payload فقط نقش فروش اجازه‌ی خواندن دارد (`isSales`)،
 * ولی Local API به‌صورت پیش‌فرض Access Control را دور می‌زند. این تابع را هرگز از صفحه‌ی عمومی
 * صدا نزنید؛ فعلاً هیچ مصرف‌کننده‌ای ندارد (پنل فروش همان پنل ادمین Payload است).
 *
 * ثبت فرم استعلام سایت (Create) هنوز وصل نیست — فرم فعلاً فقط Toast موفقیت نشان می‌دهد؛ این کار
 * طبق roadmap فاز ۶ است («منطق ثبت و پیگیری درخواست استعلام قیمت»).
 */

import type { QuoteRequest } from '@/lib/mock-data/quote-requests'
import type { QuoteRequest as PayloadQuoteRequest } from '@/payload-types'
import { getPayloadClient, relationId, toTehranDate } from './payload'

function toQuoteRequest(doc: PayloadQuoteRequest): QuoteRequest {
  return {
    id: String(doc.id),
    company: doc.company,
    contactName: doc.contactName,
    email: doc.email,
    phone: doc.phone,
    items: (doc.items ?? []).map((item) => ({
      productId: relationId(item.product) ?? '',
      qty: item.qty,
      notes: item.notes ?? '',
    })),
    message: doc.message ?? '',
    status: doc.status ?? 'new',
    createdAt: toTehranDate(doc.createdAt),
  }
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'quote-requests',
    depth: 0,
    pagination: false,
    sort: 'id',
  })
  return docs.map(toQuoteRequest)
}
