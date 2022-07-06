<template>
  <div class='header'>
    <!-- 折叠按钮 -->
    <div class='collapse-btn' @click='collapseChange'>
      <i v-if='!collapse' class='el-icon-s-fold'></i>
      <i v-else class='el-icon-s-unfold'></i>
    </div>
    <div class='logo'>{{ currentLabel }}</div>

    <div class='header-right'>
      <div class='header-user-con'>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {onBeforeRouteUpdate} from "vue-router";

const store = useStore()
const currentLabel = ref('首页')
// const username = localStorage.getItem('ms_username')
const collapse = computed(() => store.state.collapse)
// 侧边栏折叠
const collapseChange = () => {
  store.commit('handleCollapse', !collapse.value)
}

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChange()
  }
})

onBeforeRouteUpdate((to) => {
  currentLabel.value = to.meta.title;
});

</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 50px;
  color: #000;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 50px;
  color: #000000;
  font-size: 16px;
  font-weight: bold;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 50px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #000000;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
