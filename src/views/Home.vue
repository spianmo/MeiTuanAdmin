<template>
  <div class="about">
    <v-header/>
    <v-sidebar/>
    <div :class="{ 'content-collapse': collapse }" class="content-box">
<!--      <v-tags/>-->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="move">
            <keep-alive :include="tagsList">
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed} from "vue";
import {useStore} from "vuex";
import VTags from "../components/base/vTags.vue";
import VHeader from "../components/base/vHeader.vue";
import VSidebar from "../components/base/vSidebar.vue";

const store = useStore();
const tagsList = computed(() =>
    store.state.tagsList.map((item) => item.name)
);
const collapse = computed(() => store.state.collapse);
</script>
