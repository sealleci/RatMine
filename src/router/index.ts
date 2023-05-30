import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/configs/routes'

const router = createRouter({
    history: createWebHistory('/RatMine/dist'),
    routes
})

export default router
