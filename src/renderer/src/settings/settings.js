// import '@styles/index.scss'

import { createApp } from 'vue'
import Settings from './Settings.vue'

// 状态管理
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(Settings)
app.use(pinia)

app.mount('#app')
