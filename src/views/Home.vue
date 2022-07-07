<template>
  <div class="about">
    <v-header/>
    <v-sidebar/>
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <!--            <v-tags></v-tags>-->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
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
import vHeader from "../components/base/Header.vue";
import vSidebar from "../components/base/Sidebar.vue";
import vTags from "../components/base/Tags.vue";

const store = useStore();
const tagsList = computed(() =>
    store.state.tagsList.map((item) => item.name)
);
const collapse = computed(() => store.state.collapse);
</script>
