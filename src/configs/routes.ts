import Guidebook from '@/views/Guidebook.vue'
import ModeSelection from '@/views/ModeSelection.vue'
import RatMine from '@/views/RatMine.vue'
import RatMinePresetting from '@/views/RatMinePresetting.vue'
import Setting from '@/views/Setting.vue'
import Staff from '@/views/Staff.vue'
import Start from '@/views/Start.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/',
        redirect: { name: 'Start' }
    }, {
        path: '/start',
        name: 'Start',
        component: Start
    }, {
        path: '/staff',
        name: 'Staff',
        component: Staff
    }, {
        path: '/guidebook',
        name: 'Guidebook',
        component: Guidebook
    },
    {
        path: '/setting',
        name: 'Setting',
        component: Setting
    }, {
        path: '/mode',
        name: 'ModeSelection',
        component: ModeSelection
    }, {
        path: '/presetting',
        name: 'RatMinePresetting',
        component: RatMinePresetting
    }, {
        path: '/ratmine',
        name: 'RatMine',
        component: RatMine
    }, {
        path: '/:catchAll(.*)',
        redirect: { name: 'Start' }
    }
]

export default routes
