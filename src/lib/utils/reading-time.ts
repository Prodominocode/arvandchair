/** برآورد زمان مطالعه از روی تعداد کلمات محتوا (۲۰۰ کلمه در دقیقه)، برای متای پست وبلاگ. */
export function getReadingTimeMinutes(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
}
