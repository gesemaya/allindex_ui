import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import { wrapperEnv } from './build/utils'
// need install plugin @types/node
import { resolve } from 'path'

import react from "@vitejs/plugin-react-swc";
import { lingui } from "@lingui/vite-plugin";
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  // this function can be converted to different types
  const viteEnv = wrapperEnv(env)
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv

  return {
    base: './',
    server: {
      // Listening on all local ips
      host: true,
      port: VITE_PORT,
    },
    plugins: [
      react({
        plugins: [["@lingui/swc-plugin", {}]],
      }),
      lingui(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        mockPath: 'mock',
        ignore: /^\_/
      })
    ],

    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // used to delete console and debugger in production environment
          drop_console: VITE_DROP_CONSOLE
        }
      },
      chunkSizeWarningLimit: 2000
    },

    resolve: {
      alias: {
				'@': resolve(__dirname, './src')
			}
    }
  }
}
