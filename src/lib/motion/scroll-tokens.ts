/**
 * قرارداد موشن برای GSAP/ScrollTrigger — فقط تعریف Token (فاز ۲)، بدون هیچ کد GSAP واقعی
 * (docs/00-tech-stack.md بخش ۲.۱؛ gsap هنوز در package.json نصب نیست، فاز ۳ نصب می‌کند).
 *
 * واحد زمان اینجا ثانیه است (ورودی مستقیم gsap.to/timeline)، نه میلی‌ثانیه مثل توکن‌های
 * --duration-* در globals.css — روایت اسکرول‌بیس معمولاً به تایمینگ کندتر و سینمایی‌تری از
 * میکرو-اینترکشن UI نیاز دارد، پس عمداً همان اعداد نیستند.
 */

export const GSAP_DURATION = {
  fast: 0.15,
  base: 0.4,
  slow: 0.8,
  slower: 1.2,
} as const

/** نام Easeهای GSAP — مستقیماً به‌عنوان مقدار `ease` در gsap.to/timeline پاس داده می‌شوند. */
export const GSAP_EASE = {
  enter: 'power2.out',
  exit: 'power2.in',
  emphasis: 'expo.out',
  linearScrub: 'none',
} as const

/**
 * دو الگوی ScrollTrigger که کل سایت را پوشش می‌دهند (docs/00-tech-stack.md بخش ۲.۱):
 * - `reveal`: بیشتر سکشن‌ها — یک فید/اسلاید ساده وقتی وارد Viewport می‌شود، بدون Pin.
 * - `pin`: تعداد محدودی روایت اسکرول‌بیس شاخص (Home Hero، About) که سکشن Pin می‌شود و
 *   انیمیشن مستقیماً به اسکرول Scrub می‌شود.
 */
export const SCROLL_TRIGGER = {
  reveal: { start: 'top 80%', end: 'bottom 20%', once: true },
  pin: { start: 'top top', end: '+=100%', scrub: true },
} as const

/** قرارداد نام‌گذاری data-attribute برای تگ‌کردن سکشن‌های اسکرول‌محور در Markup (فاز ۳). */
export const SCROLL_DATA_ATTR = 'data-scroll-section'
