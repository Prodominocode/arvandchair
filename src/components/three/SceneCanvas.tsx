'use client'

import { Canvas } from '@react-three/fiber'

type SceneCanvasProps = {
  className?: string
}

/**
 * Canvas واقعی R3F — فقط نور و دوربین (بدون هیچ مدل/محتوای محصول)، طبق تصمیم فاز ۲: کتابخانه
 * الان نصب می‌شود ولی محتوای سه‌بعدی واقعی کار فاز ۳ است. همیشه از طریق `next/dynamic` با
 * `ssr:false` در Scene.tsx بارگذاری شود، هرگز مستقیم import نشود.
 */
export default function SceneCanvas({ className }: SceneCanvasProps) {
  return (
    <Canvas className={className} camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
    </Canvas>
  )
}
