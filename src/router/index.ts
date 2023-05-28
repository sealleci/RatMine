import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/config/routes.ts'

const router = createRouter({
    history: createWebHistory('/RatMine/dist'),
    routes
})

export default router
