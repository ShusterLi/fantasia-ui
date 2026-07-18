import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  server: {
    host: 'localhost',
    port: 7000,
    open: true
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: false,
      },
    }),
  ],
  build: {
    lib: {
      entry: './packages/index.ts',
      name: 'FantasiaUI',
      fileName: (format) => `fantasia-ui.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@vicons/ionicons5',
        'vue-router',
        'pinia',
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
          '@vicons/ionicons5': 'IconsIonicons5',
          'vue-router': 'VueRouter',
          'pinia': 'Pinia',
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'fantasia-ui.css'
          }
          return assetInfo.name as string
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'CIRCULAR_DEPENDENCY') return
        warn(warning)
      },
    },
    minify: false,
    sourcemap: false,
    cssCodeSplit: false,
    target: 'es2015',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages', import.meta.url)),
    },
  },
})
