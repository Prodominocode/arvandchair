'use client'

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

import { mod, type Engine } from './engine'
import { normalizeTexture } from './normalize-texture'

/** چرخش لبه‌ها به سمت بیرون دایره (۰ = کاملاً تخت) */
const EDGE_TURN = 0.25
/** عمق دایره نسبت به شعاع افقی (بیضی) — کمتر = کوچک‌شدن کمتر اسلایدهای کناری */
const DEPTH_RATIO = 0.55
/**
 * منحنی شفافیت بر حسب فاصله از مرکز (واحد اسلاید): ۵ اسلاید واضح (|o|≤۲)، بعد ۴ اسلاید
 * محو و دور که پشت دایره می‌چرخند و آخری (پشت مرکز) با درصد خیلی کم دیده می‌شود.
 */
const OPACITY_CURVE: Array<[number, number]> = [
  [0, 1],
  [1, 1],
  [2, 0.8],
  [3, 0.28],
  [4, 0.06],
  [4.7, 0],
  [5, 0],
]
/** هل‌دادن اسلایدهای پشت دایره به بیرون (نسبت به عرض اسلاید، با کف ۰٫۷ فاصله‌ی گام) تا به ±۱ و ±۲ نچسبند */
const BACK_PUSH = 0.5
/** سایه‌ی بیضی زیر هر اسلاید — موقتاً غیرفعال؛ برای برگرداندن `true` کنید */
const SHOW_SHADOW = false
const curve = (a: number) => {
  for (let i = 1; i < OPACITY_CURVE.length; i++) {
    const [a1, v1] = OPACITY_CURVE[i]!
    if (a <= a1) {
      const [a0, v0] = OPACITY_CURVE[i - 1]!
      const t = (a - a0) / (a1 - a0)
      return v0 + (v1 - v0) * (t * t * (3 - 2 * t))
    }
  }
  return OPACITY_CURVE[OPACITY_CURVE.length - 1]![1]
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Blur دور با bias روی Mip (ارزان‌تر از پاس Blur جدا) و محو‌شدن به رنگ پس‌زمینه.
 * تکسچر premultiplied آپلود می‌شود تا لبه‌های شفاف در Mipهای پایین هاله‌ی تیره نسازند.
 */
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uBlur;
  uniform vec3 uTint;
  uniform float uTintAmt;
  varying vec2 vUv;
  uniform float uAspect;
  void main() {
    // Blur دیسکی ۱۳‌نقطه‌ای (بدون پاس جدا) + کمی bias روی Mip برای نرمی بیشتر
    float r = uBlur * 0.0042;
    vec2 rad = vec2(r, r * uAspect);
    float bias = uBlur * 0.45;
    vec4 c = texture2D(map, vUv, bias);
    float wsum = 1.0;
    if (uBlur > 0.01) {
      for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5235988 + (i % 2 == 0 ? 0.0 : 0.26);
        float ring = i % 2 == 0 ? 1.0 : 0.55;
        c += texture2D(map, vUv + vec2(cos(a), sin(a)) * rad * ring, bias);
        wsum += 1.0;
      }
      c /= wsum;
    }
    // رنگ‌ها خام sRGB و premultiplied‌اند؛ Tint هم خام → بدون تبدیل فضای رنگی و بدون هاله‌ی سفید
    vec3 rgb = mix(c.rgb, uTint * c.a, uTintAmt);
    gl_FragColor = vec4(rgb, c.a) * uOpacity;
  }
`

const hexToVec3 = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** ماسک آلفای کم‌رزولوشن برای کلیک روی «خود فرد» و نه کادر شفاف اطراف */
function buildMask(
  img: CanvasImageSource,
  aspect: number,
): { data: Uint8ClampedArray; w: number; h: number } {
  const w = 72
  const h = Math.round(w / aspect)
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const rgba = ctx.getImageData(0, 0, w, h).data
  const raw = new Uint8ClampedArray(w * h)
  for (let i = 0; i < w * h; i++) raw[i] = rgba[i * 4 + 3] ?? 0
  // اتساع ۲ سلولی: شکاف‌های باریک داخل صندلی (درز، لبه‌ی روشن، فاصله‌ی پره‌ها) «خالی» حساب نشوند
  const data = new Uint8ClampedArray(w * h)
  const R = 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0
      for (let dy = -R; dy <= R && m < 255; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= h) continue
        for (let dx = -R; dx <= R; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= w) continue
          const v = raw[yy * w + xx]!
          if (v > m) m = v
        }
      }
      data[y * w + x] = m
    }
  }
  return { data, w, h }
}

function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 32
  const ctx = c.getContext('2d')!
  ctx.translate(64, 16)
  ctx.scale(1, 0.25)
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 64)
  g.addColorStop(0, 'rgba(40,32,24,0.55)')
  g.addColorStop(0.55, 'rgba(40,32,24,0.18)')
  g.addColorStop(1, 'rgba(40,32,24,0)')
  ctx.fillStyle = g
  ctx.fillRect(-64, -64, 128, 128)
  return new THREE.CanvasTexture(c)
}

type SlidesProps = {
  engine: Engine
  srcs: string[]
  bg: string
  /** نسبت عرض/ارتفاع تصاویر */
  aspect: number
  /** ارتفاع اسلاید مرکزی نسبت به ارتفاع Viewport */
  heightFrac: number
  /** فاصله‌ی اسلایدهای مجاور بر حسب عرض اسلاید */
  gap: number
  /** جابه‌جایی عمودی کل صحنه (کسری از ارتفاع)؛ پیش‌فرض برای جا دادن کنترل‌های پایین */
  yOffset?: number
  onSlideClick: (index: number, solid: boolean) => void
  onReady: () => void
}

function Slides({
  engine,
  srcs,
  bg,
  aspect,
  heightFrac,
  gap,
  yOffset,
  onSlideClick,
  onReady,
}: SlidesProps) {
  const count = srcs.length
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const rawTextures = useTexture(srcs) as THREE.Texture[]

  // یکسان‌سازی نسبت: هر تصویری با نسبت متفاوت (آپلود پنل) با کراپ به `aspect` می‌رسد، نه با کشیدن
  const normalized = useMemo(
    () => rawTextures.map((t) => normalizeTexture(t, aspect)),
    [rawTextures, aspect],
  )
  const textures = useMemo(() => normalized.map((n) => n.texture), [normalized])
  useEffect(
    () => () => {
      for (const n of normalized) if (n.created) n.texture.dispose()
    },
    [normalized],
  )

  // تنظیمات تکسچر قبل از اولین رندر (Layout Effect) — فیلتر Mip، آنیزوتروپی، Premultiplied
  useLayoutEffect(() => {
    for (const t of textures) {
      t.colorSpace = THREE.NoColorSpace // خام sRGB؛ ترکیب در همان فضا مثل CSS
      t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      t.premultiplyAlpha = true
      t.generateMipmaps = true
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.needsUpdate = true
    }
    invalidate()
  }, [textures, gl, invalidate])

  const masks = useMemo(
    () => textures.map((t) => buildMask(t.image as CanvasImageSource, aspect)),
    [textures, aspect],
  )

  const materials = useMemo(
    () =>
      textures.map(
        (map) =>
          new THREE.ShaderMaterial({
            uniforms: {
              map: { value: map },
              uOpacity: { value: 1 },
              uBlur: { value: 0 },
              uTint: { value: hexToVec3(bg) },
              uTintAmt: { value: 0 },
              uAspect: { value: aspect },
            },
            vertexShader: VERT,
            fragmentShader: FRAG,
            transparent: true,
            premultipliedAlpha: true,
            depthWrite: false,
          }),
      ),
    [textures, bg, aspect],
  )
  const shadowTex = useMemo(() => makeShadowTexture(), [])
  const shadowMats = useMemo(
    () =>
      srcs.map(
        () =>
          new THREE.MeshBasicMaterial({
            map: shadowTex,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
          }),
      ),
    [srcs, shadowTex],
  )

  useEffect(
    () => () => {
      materials.forEach((m) => m.dispose())
      shadowMats.forEach((m) => m.dispose())
      shadowTex.dispose()
    },
    [materials, shadowMats, shadowTex],
  )

  const meshes = useRef<Array<THREE.Mesh | null>>([])
  const shadows = useRef<Array<THREE.Mesh | null>>([])
  const opacities = useRef<number[]>(new Array(count).fill(1))

  // هر تغییر pos/focus در GSAP → یک فریم رندر (frameloop="demand")
  useEffect(() => engine.subscribe(invalidate), [engine, invalidate])
  useEffect(() => {
    onReady()
    invalidate()
  }, [onReady, invalidate])

  useFrame((state) => {
    const { viewport, size } = state
    const vw = viewport.width
    const vh = viewport.height
    const sheet = size.width < 768 // هم‌مرز md: پنل به Bottom-sheet تبدیل می‌شود

    const H = sheet
      ? Math.min(vh * heightFrac * 0.85, (vw * 0.6) / aspect)
      : Math.min(vh * heightFrac, (vw * 0.7) / aspect)
    const W = H * aspect
    const y0 = vh * (yOffset ?? (sheet ? 0.03 : 0.1))
    // دایره‌ی کامل: هر گام 2π/count. شعاع افقی از عرض صفحه می‌آید (استفاده‌ی بیشتر از عرض)،
    // با حداقل فاصله‌ای که اسلایدهای مجاور روی هم نیفتند.
    // با کمتر از ۱۰ اسلاید، گام زاویه همان ۱۰ اسلاید می‌ماند (فاصله‌ی ±۱/±۲ ثابت)؛ نیم‌دایره‌ی پشتی که
    // ناقص می‌ماند همین‌طور هم کاملاً محو است.
    const THETA = (Math.PI * 2) / Math.max(count, 10)
    const Rx = sheet
      ? (gap * W) / THETA
      : Math.min(Math.max(vw * 0.4, (gap * W) / THETA), (1.9 * gap * W) / THETA)
    const panelPx = sheet ? 0 : 228
    const usableW = vw - (panelPx / size.width) * vw
    const neighborDx = usableW * (sheet ? 0.36 : 0.32)
    const Rz = Rx * DEPTH_RATIO
    // در حالت فوکوس فاصله‌ی دیده‌شده‌ی اسلایدها neighborDx است، نه گام دایره (برای درگ در فوکوس)
    engine.state.unitPx = (engine.state.focused ? neighborDx : Rx * THETA) * (size.width / vw)

    const { pos, focus } = engine.state
    // حالت فوکوس: اسلاید مرکزی بزرگ‌تر و به سمت خالی پنل می‌رود؛ دو نمای مجاور (±۱) کمی دورتر،
    // کوچک‌تر و کم‌رنگ‌تر دو طرفش می‌مانند و با کلیک/اسکرول جابه‌جا می‌شوند.
    const focusScale = sheet ? 0.8 : 1.15
    const neighborScale = focusScale * (sheet ? 0.66 : 0.64)
    const focusX = sheet ? 0 : -(panelPx / 2 / size.width) * vw
    const focusY = sheet ? vh * 0.15 : -y0 * 0.7

    for (let i = 0; i < count; i++) {
      const mesh = meshes.current[i]
      const shadow = shadows.current[i]
      const mat = materials[i]
      const shadowMat = shadowMats[i]
      if (!mesh || !shadow || !mat || !shadowMat) continue

      const o = mod(i - pos + count / 2, count) - count / 2
      const a = Math.abs(o)
      const ang = o * THETA
      let rotY = Math.sin(ang) * EDGE_TURN

      const back = (1 - Math.cos(ang)) / 2 // ۰ جلو … ۱ پشت دایره
      const push = Math.max(W * BACK_PUSH, Rx * THETA * 0.7) // هم‌ارز برای تصویر باریک و پهن
      let x = Rx * Math.sin(ang) + Math.sign(o) * push * smooth(1.6, 3.3, a)
      const z = -Rz * (1 - Math.cos(ang))
      let zz = z
      let y = y0 + H * 0.06 * back // دورتر = کمی بالاتر روی «کف»
      let s = 1 / (1 + 0.04 * a)
      // پشتِ دایره (نیم‌دایره‌ی مقابل مرکز) هرگز دیده نشود، هر تعداد اسلایدی که باشد
      const half = count / 2
      let op = curve(a) * (1 - smooth(half - 1, half - 0.2, a))
      let blur = smooth(0.3, 2.6, a) * 1.8 + smooth(2, 5, a) * 1.4
      let tint = smooth(1, 5, a) * 0.5

      if (focus > 0) {
        // چیدمان فوکوس به‌صورت تابعی پیوسته از o (نه شاخص)، تا با جابه‌جایی pos نرم بچرخد
        const sg = Math.sign(o)
        const near = Math.min(a, 1)
        const fx = focusX + sg * (near * neighborDx + Math.max(a - 1, 0) * neighborDx * 0.6)
        const fs = focusScale + (neighborScale - focusScale) * near - Math.max(a - 1, 0) * 0.08
        const fop = a <= 1 ? 1 - 0.12 * a : 0.88 * (1 - smooth(1, 1.7, a))
        const fz = -Math.min(a, 1.5) * 0.4
        const fy = y0 + focusY + H * 0.012 * near
        x += (fx - x) * focus
        y += (fy - y) * focus
        zz += (fz - zz) * focus
        s += (fs - s) * focus
        op += (fop - op) * focus
        blur += (near * 0.55 - blur) * focus
        tint += (near * 0.08 - tint) * focus
        rotY *= 1 - focus
      }

      opacities.current[i] = op
      const visible = op > 0.003
      mesh.visible = visible
      shadow.visible = visible && SHOW_SHADOW
      if (!visible) continue

      mesh.position.set(x, y, zz)
      mesh.scale.set(W * s, H * s, 1)
      mesh.rotation.y = rotY

      const u = mat.uniforms as Record<string, THREE.IUniform<number>>
      u.uOpacity!.value = op
      u.uBlur!.value = blur
      u.uTintAmt!.value = tint

      shadow.position.set(x, y - (H * s) / 2 + H * s * 0.01, zz - 0.01)
      const shadowW = Math.min(W, H * 0.55) * s
      shadow.scale.set(shadowW * 1.3, shadowW * 0.22, 1)
      shadowMat.opacity = op * 0.9
    }
  })

  const handleClick = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return // درگ بوده، نه کلیک
    if ((opacities.current[i] ?? 0) < 0.3) return
    const m = masks[i]
    let solid = false
    if (e.uv && m) {
      const px = Math.min(m.w - 1, Math.floor(e.uv.x * m.w))
      const py = Math.min(m.h - 1, Math.floor((1 - e.uv.y) * m.h))
      solid = (m.data[py * m.w + px] ?? 0) > 24
    }
    if (solid) e.stopPropagation()
    onSlideClick(i, solid)
  }

  return (
    <>
      {srcs.map((src, i) => (
        <group key={src}>
          <mesh
            ref={(m) => {
              shadows.current[i] = m
            }}
            material={shadowMats[i]}
            renderOrder={-1}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
          <mesh
            ref={(m) => {
              meshes.current[i] = m
            }}
            material={materials[i]}
            onClick={handleClick(i)}
          >
            <planeGeometry args={[1, 1]} />
          </mesh>
        </group>
      ))}
    </>
  )
}

type LookSceneProps = SlidesProps & { onMiss: () => void }

export default function LookScene({ onMiss, ...rest }: LookSceneProps) {
  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={onMiss}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Slides {...rest} />
      </Suspense>
    </Canvas>
  )
}
