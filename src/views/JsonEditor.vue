<template>
  <div>
    <div class="container">
      <el-button type="primary" @click="format" style="margin-bottom: 20px">格式化</el-button>
      <MonacoEditor @change-content="receive" default='{}' ref="monacoRef"/>
      <el-divider/>
      <div>{{ result }}</div>
    </div>

  </div>
</template>

<script setup>
import MonacoEditor from '@/components/editors/MonacoEditor.vue';
import {ref} from "vue";

const monacoRef = ref(null)
const result = ref('')

const receive = (value) => {
  result.value = value
}

const format = () => {
  monacoRef.value.formatJson();
}

</script>

<style scoped>

</style>
