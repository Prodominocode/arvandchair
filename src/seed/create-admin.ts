/**
 * ساخت (یا بازنشانی رمز) کاربر سوپرادمین پنل — `pnpm create-admin <email> [password]`.
 * لازم است چون Seed کاربر نویسنده‌ی بلاگ را می‌سازد و از آن به بعد Payload دیگر صفحه‌ی «ساخت
 * اولین کاربر» را نشان نمی‌دهد. اگر رمز داده نشود، یک رمز تصادفی ساخته و یک بار چاپ می‌شود.
 */

import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'

import config from '../payload.config'

const [email, givenPassword] = process.argv.slice(2)

try {
  if (!email) throw new Error('Usage: pnpm create-admin <email> [password]')
  const password = givenPassword ?? randomBytes(12).toString('base64url')
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (docs[0]) {
    await payload.update({
      collection: 'users',
      id: docs[0].id,
      data: { password, role: 'superadmin' },
      overrideAccess: true,
    })
    payload.logger.info(`Updated existing user ${email} → superadmin, password reset.`)
  } else {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Admin', role: 'superadmin' },
      overrideAccess: true,
    })
    payload.logger.info(`Created superadmin ${email}.`)
  }
  if (!givenPassword) console.log(`\n  email:    ${email}\n  password: ${password}\n`)
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
