/**
 * تبدیل بین متن ساده‌ی Mock (پاراگراف‌ها با `\n\n` جدا شده‌اند) و فرمت Lexical فیلدهای `richText`
 * Payload — تصمیم فاز ۵: UI فاز ۳ دست نمی‌خورد و همچنان متن ساده می‌گیرد (مثلاً جزئیات بلاگ
 * `split('\n\n')` می‌کند). هزینه‌ی آگاهانه: قالب‌بندی (bold/لیست/لینک) که ویرایشگر در پنل بدهد
 * فعلاً در سایت دیده نمی‌شود — رندر واقعی Lexical کار بعدی است (docs/progress/phase-05).
 */

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

export function plainTextToLexical(text: string, direction: 'rtl' | 'ltr'): SerializedEditorState {
  const paragraphs = text
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: paragraphs.map((paragraph) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text: paragraph,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      })),
    },
  } as SerializedEditorState
}

function nodeText(node: LexicalNode): string {
  if (node.type === 'linebreak') return '\n'
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

/** هر بلوک سطح‌بالای Lexical (پاراگراف/تیتر/لیست/...) یک پاراگراف متن ساده می‌شود. */
export function lexicalToPlainText(state: SerializedEditorState | null | undefined): string {
  const blocks = (state?.root?.children ?? []) as LexicalNode[]
  return blocks
    .map(nodeText)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join('\n\n')
}
