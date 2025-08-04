import { createVuestic } from 'vuestic-ui' // ✅ full Vuestic UI, includes toast
import 'vuestic-ui/styles/essential.css'
import 'vuestic-ui/styles/reset.css'
import 'vuestic-ui/styles/typography.css'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// ✅ Use full Vuestic UI plugin
app.use(createVuestic())

app.mount('#app')
