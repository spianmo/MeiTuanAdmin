<template>
  <div>
    <mavonEditor
        v-model="content"
        :toolbars="toolbars"
        :subfield="subfield"
        :defaultOpen="defaultOpen"
        :toolbarsFlag="true"
        :editable="true"
        :navigation="false"
        placeholder="请输入内容"
        fontSize="14"
        value="初始值"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, watch} from "vue";
import Mavon from "mavon-editor";
import 'mavon-editor/dist/css/index.css'

const mavonEditor = Mavon.mavonEditor;

// 模式配置 subfield :true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)
// 模式配置 defaultOpen 在单栏（subfield=false）时默认展示区域. edit： 默认展示编辑区域，preview： 默认展示预览区域
const subfield = ref(true);
const defaultOpen = ref('preview');

const toolbars = reactive({
  bold: true, // 粗体
  // italic: true, // 斜体
  header: true, // 标题
  // underline: true, // 下划线
  // strikethrough: true, // 中划线
  // mark: true, // 标记
  // superscript: true, // 上角标
  // subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  // link: true, // 链接
  // imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  // fullscreen: true, // 全屏编辑
  // readmodel: true, // 沉浸式阅读
  // htmlcode: true, // 展示html源码
  // help: true, // 帮助
  /* 1.3.5 */
  undo: true, // 上一步
  redo: true, // 下一步
  trash: true, // 清空
  // save: true, // 保存（触发events中的save事件）
  /* 1.4.2 */
  navigation: true, // 导航目录
  /* 2.1.8 */
  // alignleft: true, // 左对齐
  // aligncenter: true, // 居中
  // alignright: true, // 右对齐
  /* 2.2.1 */
  subfield: true, // 单双栏模式
  preview: true, // 预览
})

const props = defineProps({
  default: String
});

const content = ref("");
let emit = defineEmits(["change-content"]);

onMounted(() => {
  content.value = props.default;
});

watch(content, (value) => {
  emit("change-content", value);
});

</script>

<style scoped>
.v-note-wrapper {
  position: relative;
  min-width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 1500;
  text-align: left;
  border: 1px solid #f2f6fc;
  border-radius: 4px;
}
</style>
