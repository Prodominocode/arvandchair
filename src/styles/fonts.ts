import localFont from 'next/font/local'

export const manrope = localFont({
  variable: '--font-manrope',
  display: 'swap',
  src: [
    { path: '../../public/fonts/Manrope-Thin.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/Manrope-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Manrope-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Manrope-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Manrope-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Manrope-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Manrope-ExtraBold.woff2', weight: '800', style: 'normal' },
  ],
})

// فونت فارسی/عربی: Peyda (PeydaWeb) — تصمیم برند تأییدشده.
export const persianFont = localFont({
  variable: '--font-persian',
  display: 'swap',
  src: [
    { path: '../../public/fonts/PeydaWeb-Thin.woff2', weight: '100', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-ExtraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-ExtraBold.woff2', weight: '800', style: 'normal' },
    { path: '../../public/fonts/PeydaWeb-Black.woff2', weight: '900', style: 'normal' },
  ],
})
