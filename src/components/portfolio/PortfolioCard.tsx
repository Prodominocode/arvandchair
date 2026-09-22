import Image from 'next/image'
import { Package } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { PortfolioProject } from '@/lib/mock-data/portfolio-projects'
import { Badge } from '@/components/ui/badge'

type PortfolioCardProps = {
  project: PortfolioProject
  locale: AppLocale
  industryLabel: string
}

/**
 * کارت آرشیو نمونه‌کار — هم‌الگوی خطی `ProductCard`/`BlogCard` (بج روی تصویر، عنوان زیر آن)
 * با دو تفاوت عمدی چون این کارت یک محصول تک‌قیمتی نیست، خلاصه‌ی یک پروژه‌ی اجراشده است:
 *  ۱) نسبت تصویر ۱۶:۱۰ به‌جای مربع/۴:۳ — عکس فضای واقعی پروژه (نه شات استودیویی محصول)
 *     در قاب عریض‌تر بهتر خوانده می‌شود و حس «پروژه‌ی معماری/دکوراسیون» را منتقل می‌کند.
 *  ۲) خط دوم متادیتا به‌جای تاریخ/بدون‌چیزی: نام کارفرما + تعداد محصولات استفاده‌شده. تعداد
 *     محصول از این جهت اضافه شد که (الف) اعتبار/مقیاس پروژه را در همان کارت نشان می‌دهد بدون
 *     باز کردن جزئیات، (ب) به‌صورت ضمنی به کاتالوگ محصول پیوند می‌زند — دقیقاً همان هدفی که
 *     `05-pages-build-order.md` بسته‌ی ۳ #۱۰ برای صفحه‌ی جزئیات پروژه در نظر گرفته («لیست
 *     محصولات استفاده‌شده، لینک به صفحه‌ی محصول»)، این کارت فقط پیش‌نمایش همان ایده است.
 */
export function PortfolioCard({ project, locale, industryLabel }: PortfolioCardProps) {
  const t = useTranslations('Portfolio')

  return (
    <Link
      href={`/portfolio/${project.slug[locale]}`}
      className="focus-visible:ring-ring block outline-none focus-visible:ring-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Badge
          variant="secondary"
          className="bg-surface-white/90 absolute start-0 top-0 z-10 backdrop-blur-sm"
        >
          {industryLabel}
        </Badge>
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt[locale]}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="object-contain"
        />
      </div>
      <p className="text-arvand-ink mt-6 text-sm font-medium sm:mt-7 sm:text-base">
        {project.title[locale]}
      </p>
      <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
        <span>{project.clientName[locale]}</span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Package className="size-3.5 shrink-0" aria-hidden="true" />
          {t('productsUsedCount', { count: project.productIds.length })}
        </span>
      </div>
    </Link>
  )
}
