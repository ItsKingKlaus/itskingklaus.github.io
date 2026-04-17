import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, './index.html'),
        InkShader: resolve(import.meta.dirname, './InkShader/index.html'),
		POC: resolve(import.meta.dirname, './POC/index.html'),
      },
    },
  },
})