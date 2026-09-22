'use client'

import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'

import { usePathname, useRouter } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import type { ProductTag } from '@/lib/mock-data/tags'
import type { ProductMaterial } from '@/lib/mock-data/materials'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'

type ProductFilterBarProps = {
  tags: ProductTag[]
  materials: ProductMaterial[]
  locale: AppLocale
}

const MATERIAL_ALL = 'all'
const SORT_DEFAULT = 'featured'

/**
 * ردیف فیلتر Facet آرشیو محصول — تگ (چندانتخابی، OR) + متریال (تک‌انتخابی) + مرتب‌سازی.
 * طبق `03-url-structure-seo.md` بخش ۳، فیلترها همیشه Query Param‌اند («فقط دسته‌بندی اصلی در
 * Path می‌آید») — همین‌جا با `URLSearchParams` روی همان مسیر جاری (بدون تغییر دسته) اعمال می‌شود.
 */
export function ProductFilterBar({ tags, materials, locale }: ProductFilterBarProps) {
  const t = useTranslations('Products')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTagIds = searchParams.get('tag')?.split(',').filter(Boolean) ?? []
  const activeMaterial = searchParams.get('material') ?? MATERIAL_ALL
  const activeSort = searchParams.get('sort') ?? SORT_DEFAULT
  const hasActiveFilters = activeTagIds.length > 0 || activeMaterial !== MATERIAL_ALL

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function toggleTag(tagId: string) {
    const next = activeTagIds.includes(tagId)
      ? activeTagIds.filter((id) => id !== tagId)
      : [...activeTagIds, tagId]
    setParam('tag', next.length ? next.join(',') : null)
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    params.delete('material')
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeTagIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              aria-pressed={isActive}
              className={cn(
                'duration-fast rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-arvand-ink bg-arvand-ink text-surface-white'
                  : 'border-border text-foreground hover:border-arvand-ink',
              )}
            >
              {tag.label[locale]}
            </button>
          )
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="size-3.5" />
            {t('filters.clear')}
          </Button>
        ) : null}

        <Select
          value={activeMaterial}
          onValueChange={(value) => setParam('material', value === MATERIAL_ALL ? null : value)}
        >
          <SelectTrigger size="sm" aria-label={t('filters.material')} className="min-w-36">
            <SelectValue placeholder={t('filters.material')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MATERIAL_ALL}>{t('filters.materialAll')}</SelectItem>
            {materials.map((material) => (
              <SelectItem key={material.id} value={material.id}>
                {material.label[locale]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeSort}
          onValueChange={(value) => setParam('sort', value === SORT_DEFAULT ? null : value)}
        >
          <SelectTrigger size="sm" aria-label={t('filters.sort')} className="min-w-36">
            <SelectValue placeholder={t('filters.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{t('filters.sortOptions.featured')}</SelectItem>
            <SelectItem value="newest">{t('filters.sortOptions.newest')}</SelectItem>
            <SelectItem value="name-asc">{t('filters.sortOptions.nameAsc')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
