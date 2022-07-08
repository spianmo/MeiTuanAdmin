<template>
  <div class='sidebar'>
    <el-menu :collapse='collapse'
             :default-active='onRoutes'
             active-text-color='#20a0ff'
             class='sidebar-el-menu'
             router unique-opened
    >
      <template v-for='item in menuList'>
        <template v-if='item.subs'>
          <el-sub-menu :key='item.index' :index='item.index'>
            <template #title>
              <i :class='item.icon'></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-for='subItem in item.subs'>
              <el-sub-menu v-if='subItem.subs' :key='subItem.index' :index='subItem.index'>
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for='(threeItem, i) in subItem.subs' :key='i' :index='threeItem.index'>
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :key='subItem.index' :index='subItem.index'>{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :key='item.index' :index='item.index'>
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
import {useRoute, useRouter} from 'vue-router'

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
