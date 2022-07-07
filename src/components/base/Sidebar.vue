<template>
  <div class='sidebar'>
    <el-menu class='sidebar-el-menu'
             :default-active='onRoutes'
             :collapse='collapse'
             active-text-color='#20a0ff'
             unique-opened router
    >
      <template v-for='item in menuList'>
        <template v-if='item.subs'>
          <el-sub-menu :index='item.index' :key='item.index'>
            <template #title>
              <i :class='item.icon'></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for='subItem in item.subs'>
              <el-sub-menu v-if='subItem.subs' :index='subItem.index' :key='subItem.index'>
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for='(threeItem, i) in subItem.subs' :key='i' :index='threeItem.index'>
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index='subItem.index' :key='subItem.index'>{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index='item.index' :key='item.index'>
            <i :class='item.icon'></i>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'
import {useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()
const menuList = ref([])
const store = useStore()
const collapse = computed(() => store.state.collapse)
const onRoutes = computed(() => {
  return route.path
})

router.getRoutes().filter(r => r.path !== '/').forEach(i => {
  menuList.value.push({
    title: String(i.meta.title),
    index: i.path,
    icon: String(i.meta.icon)
  })
})

</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
  border-top: 1px solid #e4e7ed;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}

.sidebar > ul {
  height: 100%;
}
</style>
