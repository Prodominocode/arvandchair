import Link from 'next/link'
import type { ServerProps } from 'payload'

/**
 * بنر یادآور بالای داشبورد ادمین: تا وقتی «noindex» فعال است، یادآوری می‌کند که قبل از
 * انتشار نهایی روی دامنه‌ی اصلی باید برداشته شود.
 */
export default async function NoindexBanner({ payload }: ServerProps) {
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    select: { noindex: true },
  })
  if (!settings.noindex) return null

  return (
    <div
      dir="rtl"
      style={{
        marginBottom: 24,
        padding: '14px 18px',
        borderRadius: 6,
        border: '1px solid #d97706',
        background: '#fffbeb',
        color: '#78350f',
        lineHeight: 1.9,
      }}
    >
      <strong>⚠️ سایت فعلاً برای موتورهای جستجو noindex است.</strong>
      <div>
        قبل از انتشار نهایی روی دامنه‌ی اصلی، این گزینه را غیرفعال کنید:{' '}
        <Link href="/admin/globals/site-settings" style={{ color: '#b45309', fontWeight: 600 }}>
          تنظیمات سایت ← «مخفی‌کردن کل سایت از موتورهای جستجو»
        </Link>
      </div>
    </div>
  )
}
