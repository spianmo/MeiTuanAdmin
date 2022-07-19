import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        redirect: '/baseTable'
    }, {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/baseTable',
                name: 'baseTable',
                meta: {
                    title: '美团外卖订单',
                    icon: 'el-icon-document-copy'
                },
                component: () => import ('../views/BaseTable.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | Electron-Init`
//   next()
// })

export default router
