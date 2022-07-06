<template>
  <div>
    <div className="border" id="editor" ref="editor"></div>
  </div>
</template>

<script setup>
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {onMounted, ref} from "vue";

const props = defineProps({
  default: {
    type: String,
  },
});

let editor = ref(null);

let emit = defineEmits(["change-content"]);

onMounted(() => {
  window.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === "json") {
        return new JsonWorker();
      }
      if (label === "css" || label === "scss" || label === "less") {
        return new CssWorker();
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return new HtmlWorker();
      }
      if (label === "typescript" || label === "javascript") {
        return new TsWorker();
      }
      return new EditorWorker();
    },
  };

  editor = monaco.editor.create(document.getElementById('editor'), {
    language: "json",
    lineNumbers: "on",
    minimap: {
      enabled: false
    },
    overviewRulerBorder: false,
    renderLineHighlight: 'none',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    fontSize: "14px",
    lineNumbersMinChars: 3,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    find: {
      addExtraSpaceOnTop: false,
    },
    formatOnType: true,
    formatOnPaste: true,
    scrollbar: {
      horizontal: "hidden",
      vertical: "hidden",
    }
  });
  editor.setValue(props.default);
  editor.onDidChangeModelContent(() => {
    //编辑器内容change事件
    emit("change-content", editor.getValue());
  });
})

const formatJson = () =>{
  editor.getAction('editor.action.formatDocument').run();
}

defineExpose({
  formatJson,
});

</script>

<style scoped>

.border {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
}

#editor {
  min-height: 300px;
}
</style>
