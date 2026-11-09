/**
 * Seed کاروسل صفحه‌ی اصلی — مقادیر پیش‌فرض کامل (`DEFAULT_CHAIRS`) را با آپلود تصاویرشان در Global
 * «کاروسل صفحه‌ی اصلی» پنل می‌ریزد. اجرا: `npm run seed:carousel`.
 *
 * برخلاف `npm run seed` هیچ چیز دیگری را پاک نمی‌کند؛ فقط همین Global را بازنویسی می‌کند (هر
 * ویرایشی که قبلاً در پنل روی کاروسل شده از بین می‌رود). تصویرهایی که قبلاً با همین نام فایل
 * در Media هستند دوباره آپلود نمی‌شوند.
 */

import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload, type Payload } from 'payload'

import config from '../payload.config'
import { DEFAULT_CHAIRS } from '../components/look-carousel/chairs'

type Id = number | string
type Locale = 'fa' | 'en'

const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public')

function createMediaRegistry(payload: Payload) {
  const bySrc = new Map<string, Id>()
  return async function media(src: string, alt: string): Promise<Id> {
    const cached = bySrc.get(src)
    if (cached !== undefined) return cached

    const filename = `carousel-${path.basename(src)}`
    const { docs } = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const filePath = path.join(publicDir, src)
    let id = docs[0]?.id
    if (id === undefined) {
      const created = await payload.create({
        collection: 'media',
        locale: 'fa',
        data: { alt },
        file: {
          data: await readFile(filePath),
          mimetype: 'image/png',
          name: filename,
          size: (await stat(filePath)).size,
        },
        overrideAccess: true,
      })
      id = created.id
    }
    bySrc.set(src, id)
    return id
  }
}

/** id ردیف‌های آرایه‌ی سند fa را روی داده‌ی en می‌نشاند (وگرنه Payload ردیف‌ها را از نو می‌سازد). */
type Row = { id?: string | null; specs?: Array<{ id?: string | null }> | null }

async function main() {
  const payload = await getPayload({ config })
  const media = createMediaRegistry(payload)

  payload.logger.info('Seed: home carousel…')
  const mediaIds = new Map<string, { image: Id; gallery: Id[] }>()
  for (const [i, chair] of DEFAULT_CHAIRS.entries()) {
    mediaIds.set(String(i), {
      image: await media(chair.image, `${chair.name.fa} — ${chair.caption.fa}`),
      gallery: await Promise.all(
        chair.gallery.map((src, g) => media(src, `${chair.name.fa} — عکس جزئی ${g + 1}`)),
      ),
    })
  }

  const build = (locale: Locale) =>
    DEFAULT_CHAIRS.map((chair, i) => ({
      name: chair.name[locale],
      caption: chair.caption[locale],
      image: mediaIds.get(String(i))!.image,
      gallery: mediaIds.get(String(i))!.gallery,
      specs: chair.specs.map((spec) => ({
        kind: spec.kind[locale],
        value: spec.value[locale],
        swatch: spec.swatch,
      })),
    }))

  const fa = (await payload.updateGlobal({
    slug: 'home-carousel',
    locale: 'fa',
    data: { chairs: build('fa') } as never,
    overrideAccess: true,
  })) as unknown as { chairs?: Row[] | null }

  const faRows = fa.chairs ?? []
  await payload.updateGlobal({
    slug: 'home-carousel',
    locale: 'en',
    data: {
      chairs: build('en').map((row, i) => ({
        ...row,
        id: faRows[i]?.id,
        specs: row.specs.map((spec, s) => ({ ...spec, id: faRows[i]?.specs?.[s]?.id })),
      })),
    } as never,
    overrideAccess: true,
  })

  payload.logger.info(`Seed: home carousel done — ${DEFAULT_CHAIRS.length} chairs.`)
  process.exit(0)
}

// Top-level await: `payload run` بلافاصله بعد از import ماژول process را می‌بندد.
try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
