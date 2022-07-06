<template>
  <div>
    <div class="container">
      <MavonEditor @change-content="receive" default='## Hello'/>
      <el-divider/>
      <div class="preview" v-html="mdHtml" />
    </div>
  </div>
</template>

<script setup>
import MavonEditor from '@/components/editors/MavonEditor.vue'
import { mavonEditor } from 'mavon-editor'
import {computed, ref} from "vue";

const markdownIt = mavonEditor.getMarkdownIt()
const md = ref('');
const receive = (content) => {
  md.value = content;
}

const mdHtml = computed(() => {
  return markdownIt.render(md.value)
})


</script>

<style scoped>

</style>
