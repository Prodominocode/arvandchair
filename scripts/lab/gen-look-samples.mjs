/**
 * مولد تصاویر PNG نمونه برای صفحه‌ی آزمایشی کاروسل (src/app/(frontend)/[locale]/lab/look-carousel).
 * فقط Placeholder است؛ بعد از نهایی‌شدن حرکت، فایل‌های public/images/lab/looks/look-N.png
 * با عکس‌های واقعی PNG (پس‌زمینه شفاف، نسبت ۵:۱۲) جایگزین می‌شوند.
 *
 * اجرا: node scripts/lab/gen-look-samples.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.resolve('public/images/lab/looks')
const W = 500
const H = 1200
const CX = 250

const LOOKS = [
  { skin: '#8d5a3c', hair: { type: 'short', color: '#1a1512' }, glasses: true, top: { kind: 'tee', color: '#161616', sw: 100, hem: 560, over: 1.0 }, pants: { color: '#aebfd6', hw: 82, fade: true }, shoes: '#f3f3ef', pose: 'pocket' },
  { skin: '#5b3a28', hair: { type: 'locs', color: '#14100d' }, top: { kind: 'tee', color: '#f1efe9', sw: 108, hem: 590, over: 1.25 }, pants: { color: '#b9c3ad', hw: 80, fade: true }, shoes: '#ece8de', pose: 'pocket' },
  { skin: '#d9a982', hair: { type: 'short', color: '#2b2118' }, top: { kind: 'sweater', color: '#8b8d90', sw: 100, hem: 575, over: 1.1 }, pants: { color: '#5f84b3', hw: 64 }, shoes: '#3a3a3a', pose: 'down' },
  { skin: '#e2b896', hair: { type: 'cap', color: '#222' , cap: '#c9c2b2' }, top: { kind: 'sweater', color: '#6f7a45', sw: 106, hem: 585, over: 1.2 }, pants: { color: '#7a5a42', hw: 70 }, shoes: '#2d2a27', pose: 'down' },
  { skin: '#6d4430', hair: { type: 'afro', color: '#120f0c' }, glasses: true, top: { kind: 'tee', color: '#1b1b1b', sw: 104, hem: 580, over: 1.2 }, pants: { color: '#d7dbe4', hw: 88, fade: true }, shoes: '#f0f0f0', pose: 'pocket' },
  { skin: '#c68d66', hair: { type: 'bun', color: '#201813' }, top: { kind: 'hoodie', color: '#e8dfce', sw: 112, hem: 600, over: 1.35 }, pants: { color: '#3e4043', hw: 76 }, shoes: '#d7d0c0', pose: 'down' },
  { skin: '#f0c9a6', hair: { type: 'short', color: '#8a5a2b' }, top: { kind: 'jacket', color: '#26324a', sw: 108, hem: 585, over: 1.2 }, pants: { color: '#cbb89a', hw: 66 }, shoes: '#f5f5f2', pose: 'pocket' },
  { skin: '#7a4a30', hair: { type: 'short', color: '#15110e' }, glasses: true, top: { kind: 'hoodie', color: '#c0563a', sw: 110, hem: 598, over: 1.3 }, pants: { color: '#2f3b52', hw: 72 }, shoes: '#f3f3ef', pose: 'down' },
  { skin: '#e9bf9a', hair: { type: 'bun', color: '#3a2a20' }, top: { kind: 'jacket', color: '#8a8f7a', sw: 108, hem: 588, over: 1.2 }, pants: { color: '#e9e3d4', hw: 78 }, shoes: '#2b2b2b', pose: 'pocket' },
  { skin: '#a56b46', hair: { type: 'cap', color: '#222', cap: '#1d2b4a' }, top: { kind: 'tee', color: '#d9a441', sw: 102, hem: 575, over: 1.15 }, pants: { color: '#41434a', hw: 84 }, shoes: '#ece8de', pose: 'down' },
]

const shade = (d, fill, extra = '') =>
  `<path d="${d}" fill="${fill}" ${extra}/><path d="${d}" fill="url(#shade)"/>`

/** اندام (دست/آستین) به‌صورت چهارضلعی مخروطی با انتهای گرد */
function limb(a, b, wa, wb) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  const nx = -dy / len
  const ny = dx / len
  const p = (pt, w, s) => `${(pt[0] + nx * w * s).toFixed(1)},${(pt[1] + ny * w * s).toFixed(1)}`
  return `M${p(a, wa, 1)} L${p(b, wb, 1)} L${p(b, wb, -1)} L${p(a, wa, -1)} Z`
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function hairBack(h) {
  if (h.type === 'afro') return `<ellipse cx="${CX}" cy="92" rx="88" ry="82" fill="${h.color}"/>`
  return ''
}

function hairFront(h, skin) {
  switch (h.type) {
    case 'short':
      return `<path d="M${CX - 58},100 C${CX - 62},40 ${CX + 62},40 ${CX + 58},100 C${CX + 40},78 ${CX - 40},78 ${CX - 58},100 Z" fill="${h.color}"/>`
    case 'afro':
      return `<path d="M${CX - 60},96 C${CX - 62},44 ${CX + 62},44 ${CX + 60},96 C${CX + 42},74 ${CX - 42},74 ${CX - 60},96 Z" fill="${h.color}"/>`
    case 'locs': {
      let s = `<path d="M${CX - 60},102 C${CX - 66},36 ${CX + 66},36 ${CX + 60},102 C${CX + 40},78 ${CX - 40},78 ${CX - 60},102 Z" fill="${h.color}"/>`
      for (let i = 0; i < 9; i++) {
        const x = CX - 62 + i * 15.5
        const len = 55 + ((i * 37) % 40)
        s += `<path d="M${x},84 q${i % 2 ? 6 : -6},${len / 2} ${i % 2 ? 2 : -2},${len}" stroke="${h.color}" stroke-width="9" stroke-linecap="round" fill="none"/>`
      }
      return s
    }
    case 'bun':
      return `<circle cx="${CX}" cy="30" r="26" fill="${h.color}"/><path d="M${CX - 58},100 C${CX - 62},44 ${CX + 62},44 ${CX + 58},100 C${CX + 40},80 ${CX - 40},80 ${CX - 58},100 Z" fill="${h.color}"/>`
    case 'cap':
      return `<path d="M${CX - 60},92 C${CX - 62},34 ${CX + 62},34 ${CX + 60},92 Z" fill="${h.cap}"/><path d="M${CX - 62},92 L${CX + 92},98 C${CX + 96},104 ${CX + 60},108 ${CX - 20},100 Z" fill="${h.cap}"/><path d="M${CX - 62},92 L${CX + 92},98 C${CX + 96},104 ${CX + 60},108 ${CX - 20},100 Z" fill="url(#shade)"/>`
    default:
      return ''
  }
}

function figure(look, i) {
  const { skin, top, pants, shoes } = look
  const parts = []

  // — پشت سر
  parts.push(hairBack(look.hair))

  // — شلوار
  const hw = pants.hw
  const hemY = 1128
  const legL = `M${CX - 82},540 L${CX - 2},540 Q${CX + 2},${(540 + hemY) / 2} ${CX - 62 + hw * 0.9},${hemY} L${CX - 62 - hw * 0.9 - 14},${hemY} Q${CX - 90},${(540 + hemY) / 2} ${CX - 82},540 Z`
  const legR = `M${CX + 82},540 L${CX + 2},540 Q${CX - 2},${(540 + hemY) / 2} ${CX + 62 - hw * 0.9},${hemY} L${CX + 62 + hw * 0.9 + 14},${hemY} Q${CX + 90},${(540 + hemY) / 2} ${CX + 82},540 Z`

  // — کفش
  const shoe = (cx, dir) =>
    `<path d="M${cx - 44 * dir},1118 L${cx + 44 * dir},1118 C${cx + 90 * dir},1126 ${cx + 100 * dir},1150 ${cx + 94 * dir},1166 L${cx - 40 * dir},1166 C${cx - 52 * dir},1150 ${cx - 52 * dir},1130 ${cx - 44 * dir},1118 Z" fill="${shoes}"/>` +
    `<path d="M${cx - 42 * dir},1156 L${cx + 94 * dir},1156 L${cx + 94 * dir},1170 L${cx - 40 * dir},1170 Z" fill="#e9e5da"/>` +
    `<path d="M${cx - 44 * dir},1118 L${cx + 44 * dir},1118 C${cx + 90 * dir},1126 ${cx + 100 * dir},1150 ${cx + 94 * dir},1166 L${cx - 40 * dir},1166 C${cx - 52 * dir},1150 ${cx - 52 * dir},1130 ${cx - 44 * dir},1118 Z" fill="url(#shade)"/>`
  parts.push(shoe(CX - 70, -1)) // چپ، نوک به بیرون
  parts.push(shoe(CX + 70, 1))
  parts.push(shade(legL, pants.color))
  parts.push(shade(legR, pants.color))
  // کمر + درز
  parts.push(`<rect x="${CX - 84}" y="528" width="168" height="26" rx="6" fill="${pants.color}"/><rect x="${CX - 84}" y="528" width="168" height="26" rx="6" fill="url(#shade)"/>`)
  parts.push(`<path d="M${CX},552 L${CX},700" stroke="rgba(0,0,0,.18)" stroke-width="2.5"/>`)
  // چین‌های پارچه
  const foldCol = pants.fade ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.16)'
  for (let k = 0; k < 4; k++) {
    const y = 820 + k * 62
    parts.push(`<path d="M${CX - 132 + k * 6},${y} q18,16 44,${6 + k * 2}" stroke="${foldCol}" stroke-width="5" stroke-linecap="round" fill="none"/>`)
    parts.push(`<path d="M${CX + 132 - k * 6},${y} q-18,16 -44,${6 + k * 2}" stroke="${foldCol}" stroke-width="5" stroke-linecap="round" fill="none"/>`)
  }
  // کاف‌های پایین شلوار
  parts.push(`<path d="M${CX - 62 - hw * 0.9 - 14},${hemY - 26} L${CX - 62 + hw * 0.9},${hemY - 26} L${CX - 62 + hw * 0.9},${hemY} L${CX - 62 - hw * 0.9 - 14},${hemY} Z" fill="rgba(0,0,0,.14)"/>`)
  parts.push(`<path d="M${CX + 62 + hw * 0.9 + 14},${hemY - 26} L${CX + 62 - hw * 0.9},${hemY - 26} L${CX + 62 - hw * 0.9},${hemY} L${CX + 62 + hw * 0.9 + 14},${hemY} Z" fill="rgba(0,0,0,.14)"/>`)

  // — گردن و سر
  parts.push(`<rect x="${CX - 20}" y="150" width="40" height="70" rx="14" fill="${skin}"/>`)
  parts.push(`<ellipse cx="${CX}" cy="104" rx="54" ry="66" fill="${skin}"/>`)
  parts.push(`<ellipse cx="${CX}" cy="104" rx="54" ry="66" fill="url(#shade)"/>`)
  parts.push(`<ellipse cx="${CX - 55}" cy="108" rx="9" ry="16" fill="${skin}"/><ellipse cx="${CX + 55}" cy="108" rx="9" ry="16" fill="${skin}"/>`)
  parts.push(hairFront(look.hair, skin))
  if (look.glasses) {
    parts.push(
      `<rect x="${CX - 50}" y="100" width="43" height="22" rx="8" fill="#0d0d0d"/><rect x="${CX + 7}" y="100" width="43" height="22" rx="8" fill="#0d0d0d"/><rect x="${CX - 8}" y="105" width="16" height="4" fill="#0d0d0d"/>`,
    )
  }

  // — دست‌ها (پوست) زیر آستین
  const sw = top.sw
  const sL = [CX - sw + 10, 238]
  const sR = [CX + sw - 10, 238]
  const long = top.kind !== 'tee'
  const sleeveFrac = long ? 0.98 : 0.42
  const armW = 13

  if (look.pose === 'pocket') {
    const eL = [CX - sw - 22, 400]
    const eR = [CX + sw + 22, 400]
    const wL = [CX - 80, 560]
    const wR = [CX + 80, 560]
    for (const [s, e, w] of [[sL, eL, wL], [sR, eR, wR]]) {
      parts.push(`<path d="${limb(s, e, armW, armW - 1)}" fill="${skin}" stroke="${skin}" stroke-width="4" stroke-linejoin="round"/>`)
      parts.push(`<path d="${limb(e, w, armW - 1, armW - 3)}" fill="${skin}" stroke="${skin}" stroke-width="4" stroke-linejoin="round"/>`)
    }
    // — بالاتنه
    parts.push(...torso(top, sw))
    // آستین‌ها
    const sleeveW = (long ? 25 : 27) * top.over ** 0.5
    for (const [s, e, w] of [[sL, eL, wL], [sR, eR, wR]]) {
      if (long) {
        parts.push(`<path d="${limb(s, e, sleeveW, sleeveW - 2)}" fill="${top.color}" stroke="${top.color}" stroke-width="4" stroke-linejoin="round"/><path d="${limb(s, e, sleeveW, sleeveW - 2)}" fill="url(#shade)"/>`)
        const t = lerp(e, w, 0.78)
        parts.push(`<path d="${limb(e, t, sleeveW - 2, sleeveW - 6)}" fill="${top.color}" stroke="${top.color}" stroke-width="4" stroke-linejoin="round"/><path d="${limb(e, t, sleeveW - 2, sleeveW - 6)}" fill="url(#shade)"/>`)
      } else {
        const t = lerp(s, e, 0.72)
        parts.push(`<path d="${limb(s, t, sleeveW, sleeveW + 2)}" fill="${top.color}" stroke="${top.color}" stroke-width="4" stroke-linejoin="round"/><path d="${limb(s, t, sleeveW, sleeveW + 2)}" fill="url(#shade)"/>`)
      }
    }
  } else {
    const wL = [CX - sw - 14, 590]
    const wR = [CX + sw + 14, 590]
    for (const [s, w] of [[sL, wL], [sR, wR]]) {
      parts.push(`<path d="${limb(s, w, armW, armW - 3)}" fill="${skin}" stroke="${skin}" stroke-width="4" stroke-linejoin="round"/>`)
      parts.push(`<ellipse cx="${w[0]}" cy="${w[1] + 22}" rx="15" ry="26" fill="${skin}"/>`)
    }
    parts.push(...torso(top, sw))
    const sleeveW = (long ? 26 : 28) * top.over ** 0.5
    for (const [s, w] of [[sL, wL], [sR, wR]]) {
      const e = lerp(s, w, sleeveFrac)
      parts.push(`<path d="${limb(s, e, sleeveW, long ? sleeveW - 4 : sleeveW + 2)}" fill="${top.color}" stroke="${top.color}" stroke-width="4" stroke-linejoin="round"/><path d="${limb(s, e, sleeveW, long ? sleeveW - 4 : sleeveW + 2)}" fill="url(#shade)"/>`)
      if (long) {
        const c = lerp(s, w, 0.9)
        parts.push(`<path d="${limb(c, e, sleeveW - 3, sleeveW - 3)}" fill="rgba(0,0,0,.18)"/>`)
      }
    }
  }

  const defs = `<defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".10"/>
      <stop offset=".55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </linearGradient></defs>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs}${parts.join('')}</svg>`
}

function torso(top, sw) {
  const hemHalf = 78 * top.over ** 0.7
  const y0 = 222
  const d = `M${CX - 28},${y0 - 4} C${CX - sw + 10},${y0 - 2} ${CX - sw},${y0 + 6} ${CX - sw},${y0 + 30} L${CX - hemHalf},${top.hem} Q${CX},${top.hem + 14} ${CX + hemHalf},${top.hem} L${CX + sw},${y0 + 30} C${CX + sw},${y0 + 6} ${CX + sw - 10},${y0 - 2} ${CX + 28},${y0 - 4} Q${CX},${y0 + 22} ${CX - 28},${y0 - 4} Z`
  const out = [shade(d, top.color)]
  // کش/لبه‌ی پایین
  out.push(`<path d="M${CX - hemHalf},${top.hem - 14} Q${CX},${top.hem} ${CX + hemHalf},${top.hem - 14} L${CX + hemHalf},${top.hem} Q${CX},${top.hem + 14} ${CX - hemHalf},${top.hem} Z" fill="rgba(0,0,0,.14)"/>`)
  // یقه
  if (top.kind === 'hoodie') {
    out.push(`<path d="M${CX - 46},${y0 - 6} Q${CX},${y0 + 44} ${CX + 46},${y0 - 6} Q${CX + 52},${y0 - 22} ${CX + 30},${y0 - 22} Q${CX},${y0 + 10} ${CX - 30},${y0 - 22} Q${CX - 52},${y0 - 22} ${CX - 46},${y0 - 6} Z" fill="rgba(0,0,0,.16)"/>`)
    out.push(`<rect x="${CX - 62}" y="${top.hem - 150}" width="124" height="70" rx="14" fill="rgba(0,0,0,.08)"/>`)
  } else if (top.kind === 'jacket') {
    out.push(`<path d="M${CX},${y0 + 10} L${CX},${top.hem}" stroke="rgba(0,0,0,.35)" stroke-width="3"/>`)
    out.push(`<path d="M${CX - 28},${y0 - 4} L${CX - 4},${y0 + 90} L${CX},${y0 + 14} Z" fill="rgba(255,255,255,.12)"/><path d="M${CX + 28},${y0 - 4} L${CX + 4},${y0 + 90} L${CX},${y0 + 14} Z" fill="rgba(0,0,0,.18)"/>`)
  } else {
    out.push(`<path d="M${CX - 30},${y0 - 4} Q${CX},${y0 + 30} ${CX + 30},${y0 - 4}" stroke="rgba(0,0,0,.28)" stroke-width="7" fill="none" stroke-linecap="round"/>`)
  }
  if (top.kind === 'tee') {
    // لوگوی کوچک روی سینه
    out.push(`<circle cx="${CX + 38}" cy="${y0 + 70}" r="9" fill="rgba(255,255,255,.55)"/>`)
  }
  // چین‌های شکم
  out.push(`<path d="M${CX - 60},${top.hem - 120} q40,20 120,0" stroke="rgba(0,0,0,.10)" stroke-width="6" fill="none" stroke-linecap="round"/>`)
  return out
}

await mkdir(OUT, { recursive: true })
for (const [i, look] of LOOKS.entries()) {
  const svg = figure(look, i)
  const png = await sharp(Buffer.from(svg), { density: 144 })
    .resize(750, 1800, { fit: 'fill' })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer()
  await writeFile(path.join(OUT, `look-${i + 1}.png`), png)
  console.log('look-' + (i + 1) + '.png', (png.length / 1024).toFixed(0) + ' KB')
}
