import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '首页',
                    icon: 'el-icon-house'
                },
                component: () => import ('../views/Dashboard.vue')
            },
            {
                path: '/database',
                name: 'database',
                meta: {
                    title: '数据库',
                    icon: 'el-icon-coin'
                },
                component: () => import ('../views/DataBase.vue')
            },
            {
                path: '/baseForm',
                name: 'baseForm',
                meta: {
                    title: '表单',
                    icon: 'el-icon-document'
                },
                component: () => import ('../views/BaseForm.vue')
            },
            {
                path: '/baseTable',
                name: 'baseTable',
                meta: {
                    title: '表格',
                    icon: 'el-icon-document-copy'
                },
                component: () => import ('../views/BaseTable.vue')
            },
            {
                path: '/textEditor',
                name: 'textEditor',
                meta: {
                    title: '富文本编辑器',
                    icon: 'el-icon-edit'
                },
                component: () => import ('../views/TextEditor.vue')
            },
            {
                path: '/jsonEditor',
                name: 'jsonEditor',
                meta: {
                    title: 'Json编辑器',
                    icon: 'el-icon-edit'
                },
                component: () => import ('../views/JsonEditor.vue')
            },
            {
                path: '/markdownEditor',
                name: 'markdownEditor',
                meta: {
                    title: 'Markdown',
                    icon: 'el-icon-edit'
                },
                component: () => import ('../views/MarkdownEditor.vue')
            },
            {
                path: '/drag',
                name: 'drag',
                meta: {
                    title: '拖拽列表',
                    icon: 'el-icon-thumb'
                },
                component: () => import ('../views/DragList.vue')
            },
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
