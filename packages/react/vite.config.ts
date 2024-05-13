import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { getBuildOptions } from '../../config'

const __dirname = dirname(fileURLToPath(new URL(import.meta.url)))
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    dts({
      entryRoot: __dirname,
      tsconfigPath: './tsconfig.lib.json',
    }),
  ],
  build: getBuildOptions(resolve(__dirname, './index.tsx')),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
