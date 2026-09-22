import type { Access, FieldAccess } from 'payload'

/**
 * نقش‌های داخلی طبق docs/02-data-model.md بخش ۱ (`Users.role`). فاز ۴ فقط نقش‌ها را تعریف
 * می‌کند؛ صفحات مدیریتی خودِ Payload (نه فرانت) این‌ها را مصرف می‌کنند.
 *
 * هر نقش دو نسخه دارد (Collection-level و Field-level) چون Payload این دو را با امضای تایپ
 * جدا (`Access` در برابر `FieldAccess`) تعریف کرده — منطق هر جفت کاملاً یکسان است.
 */
export const publicRead: Access = () => true

export const isSuperAdmin: Access = ({ req }) => req.user?.role === 'superadmin'

export const isContentEditor: Access = ({ req }) =>
  req.user?.role === 'superadmin' || req.user?.role === 'content-editor'

export const isSales: Access = ({ req }) =>
  req.user?.role === 'superadmin' || req.user?.role === 'sales'

export const isSalesField: FieldAccess = ({ req }) =>
  req.user?.role === 'superadmin' || req.user?.role === 'sales'
