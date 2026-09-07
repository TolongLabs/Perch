import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app lives in v2/ so that v1/, the mockup it replaced, can sit beside it at the repo root and
// still be opened. Both ship in the same image; see the Dockerfile.
export default defineConfig({
  root: 'v2',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true, assetsDir: 'assets' }
})
