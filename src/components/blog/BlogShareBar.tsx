'use client'

import type { ComponentProps } from 'react'
import { Link2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type BlogShareBarProps = {
  title: string
}

// lucide-react آیکن برند لینکدین ندارد (هم‌الگوی `Footer.tsx`)، پس یک SVG ساده‌ی خطی.
function LinkedinIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M6.5 9.5v8.5M6.5 6v.01M11 18v-8.5M11 13c0-2 1.5-3.5 3.5-3.5S18 11 18 13v5" />
    </svg>
  )
}

const ICON_BUTTON_CLASS =
  'border-border text-muted-foreground hover:border-foreground hover:bg-foreground hover:text-background focus-visible:ring-ring flex size-9 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:outline-none'

/** نوار اشتراک‌گذاری زیر هیرو — تلگرام/لینکدین (لینک مستقیم Share) + کپی لینک (Clipboard + Toast،
 * هم‌الگوی Submit در `ProductQuoteInquiry`). چون به `window.location` نیاز دارد، Client است. */
export function BlogShareBar({ title }: BlogShareBarProps) {
  const t = useTranslations('BlogDetail.share')

  function getCurrentUrl() {
    return typeof window === 'undefined' ? '' : window.location.href
  }

  function handleTelegramShare() {
    const url = getCurrentUrl()
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function handleLinkedinShare() {
    const url = getCurrentUrl()
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getCurrentUrl())
      toast.success(t('copied'))
    } catch {
      toast.error(t('copied'))
    }
  }

  return (
    <div role="group" aria-label={t('label')} className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleTelegramShare}
        aria-label={t('telegram')}
        className={ICON_BUTTON_CLASS}
      >
        <Send className="size-[16px]" strokeWidth={1.75} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={handleLinkedinShare}
        aria-label={t('linkedin')}
        className={ICON_BUTTON_CLASS}
      >
        <LinkedinIcon className="size-[16px]" />
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={t('copyLink')}
        className={ICON_BUTTON_CLASS}
      >
        <Link2 className="size-[16px]" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  )
}
