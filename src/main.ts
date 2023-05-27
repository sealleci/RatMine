import App from '@/App.vue'
import '@/css/style.css'
import router from '@/router/index.js'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
