import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import {initDb} from './plugins/database'
import './assets/css/icon.css'
import './assets/css/base.css'
import './esmodules'

const app = createApp(App)
// 初始化插件
// Element-Plus
installElementPlus(app)
// 本地数据库
initDb()
// 默认登录
localStorage.setItem("ms_username", "admin");
app
    .use(store)
    .use(router)
    .mount('#app')
