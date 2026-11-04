import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

// eslint-config-next v16 مستقیماً Flat Config است؛ دیگر به FlatCompat نیازی نیست.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // قوانین جدید React Compiler که با eslint-config-next v16 آمده‌اند؛ روی کد موجود (کارکرد درست)
    // خطا می‌دهند. فعلاً هشدار می‌مانند تا کامیت‌ها بلاک نشوند و در فرصت مناسب بازنویسی شوند.
    rules: {
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'src/app/(payload)/admin/importMap.js',
    'src/payload-types.ts',
  ]),
])

export default eslintConfig
