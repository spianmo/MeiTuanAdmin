<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          mode="default"
          style="border-bottom: 1px solid #ccc"
      />
      <Editor
          :defaultConfig="editorConfig"
          mode="default"
          v-model="valueHtml"
          style="height: 400px; overflow-y: hidden"
          @onCreated="handleCreated"
          @onChange="handleChange"
          @onDestroyed="handleDestroyed"
          @onFocus="handleFocus"
          @onBlur="handleBlur"
          @customAlert="customAlert"
          @customPaste="customPaste"
      />
    </div>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, ref, shallowRef, onMounted} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

const props = defineProps({
  default: String
});

let emit = defineEmits(['change-content']);

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = `<p>ABC</p>`;
  // }, 1500);
});

const toolbarConfig = {};
const editorConfig = {placeholder: '请输入内容...'};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
  valueHtml.value = `<p>${props.default}</p>`;
};
const handleChange = (editor) => {
  console.log('change:', editor.getHtml());
  emit('change-content', editor.getHtml())
};
const handleDestroyed = (editor) => {
  console.log('destroyed', editor);
};
const handleFocus = (editor) => {
  console.log('focus', editor);
};
const handleBlur = (editor) => {
  console.log('blur', editor);
};
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event);
  // 自定义插入内容
  // editor.insertText('xxx');
  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false); // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
};

const insertText = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.clear()
  editor.insertText('hello world');
};

const printHtml = () => {
  const editor = editorRef.value;
  if (editor == null) return;
  console.log(editor.getHtml());
};

</script>
