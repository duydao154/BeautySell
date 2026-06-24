import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Use path.resolve (not import.meta.url): Wrangler's autoconfig parses this
// file with a limited JS parser that can fail on newer syntax.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
})