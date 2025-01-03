import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {  // build 应该是顶级配置，不是在 resolve 里面
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/main/index.mjs')  // 使用 resolve 来确保路径正确
                },
                external: ['electron'],
                output: {
                    format: 'es',
                    entryFileNames: '[name].mjs'
                }
            }
        },
        resolve: {
            alias: {
                '@main': resolve('src/main/'),
                '@mainPreload': resolve('src/preload/main'),
                '@settingsPreload': resolve('src/preload/settings'),
                '@mainRenderer': resolve('src/renderer/src/main/'),
                '@settingsRenderer': resolve('src/renderer/src/settings/')
            }
        }
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            rollupOptions: {
                input: {
                    'main/index': resolve(__dirname, 'src/preload/main/index.js'),
                    'settings/index': resolve(__dirname, 'src/preload/settings/index.js')
                },
                external: ['electron'],
                output: {
                    format: 'cjs',
                    entryFileNames: '[name].js'
                }
            }
        },
        resolve: {
            alias: {
                '@preload': resolve('src/preload'),
                '@main': resolve('src/preload/main'),
                '@settings': resolve('src/preload/settings')
            }
        }
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src'),
                '@image': resolve('src/renderer/src/assets/image'),
                '@mainLayout': resolve('src/renderer/src/components/main/layout'),
                '@setLayout': resolve('src/renderer/src/components/settings/layout'),
                '@styles': resolve('src/renderer/src/assets/styles'),
                '@components': resolve('src/renderer/src/components/'),
                '@stores': resolve('src/renderer/src/stores')
            }
        },
        plugins: [
            vue(),
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ],
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'src/renderer/src/main/main.html'),
                    settings: resolve(__dirname, 'src/renderer/src/settings/settings.html')
                }
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // 使用 @use 替代 @import
                    additionalData: `@use "@styles/index.scss" as *;`,
                    api: 'modern-compiler'
                    // 临时禁用警告
                    // sassOptions: {
                    //     silenceDeprecations: ['legacy-js-api', 'import']
                    // }
                }
            }
        }
    }
})
