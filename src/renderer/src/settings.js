// import './assets/main.css'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

import { createApp } from 'vue'
import Settings from './Settings.vue'
import naive from 'naive-ui'

createApp(Settings).use(naive).mount('#settings')
