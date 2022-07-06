<template>
  <section class="main">
    <div class="container">
      <div class="plugins-tips">
        Vue.Draggable：基于 Sortable.js 的 Vue 拖拽组件。
        访问地址：<a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a>
      </div>
      <div class="drag-box">
        <div class="drag-box-item">
          <div class="item-title">todo</div>
          <transition-group tag="div" id="todo" class="item-ul">
            <draggable v-model="todo" group="site" animation="300" @change="changeHandle" item-key="id" key="id">
              <template #item="{ element }">
                <div class="drag-list" :key="element.id">
                  {{ element.content }}
                </div>
              </template>
            </draggable>
          </transition-group>
        </div>
        <div class="drag-box-item">
          <div class="item-title">doing</div>
          <transition-group tag="div" id="doing" class="item-ul">
            <draggable v-model="doing" group="site" animation="300" @change="changeHandle" item-key="id" key="id">
              <template #item="{ element }">
                <div class="drag-list" :key="element.id">
                  {{ element.content }}
                </div>
              </template>
            </draggable>
          </transition-group>
        </div>
        <div class="drag-box-item">
          <div class="item-title">done</div>
          <transition-group tag="div" id="done" class="item-ul">
            <draggable v-model="done" group="site" animation="300" @change="changeHandle" item-key="id" key="id">
              <template #item="{ element }">
                <div class="drag-list" :key="element.id">
                  {{ element.content }}
                </div>
              </template>
            </draggable>
          </transition-group>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import draggable from 'vuedraggable'
import {ref} from "vue";

const todo = ref([{id: 1, content: '1. 吃苹果'}, {id: 2, content: '2. 吃西瓜'}, {id: 3, content: '3. 吃葡萄'}]);
const doing = ref([{id: 1, content: '1. 种土豆'}, {id: 2, content: '2. 种菠菜'}, {id: 3, content: '3. 种西红柿'}]);
const done = ref([{id: 1, content: '1. 爬山'}, {id: 2, content: '2. 吃饭'}]);
const changeHandle = event => {
  console.log(event)
};
</script>

<style scoped>
.drag-box {
  display: flex;
  user-select: none;
}

.drag-box-item {
  flex: 1;
  max-width: 330px;
  min-width: 300px;
  background-color: #eff1f5;
  margin-right: 16px;
  border-radius: 6px;
  border: 1px #e1e4e8 solid;
}

.item-title {
  padding: 8px 8px 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
  font-weight: 600;
}

.item-ul {
  padding: 0 8px 8px;
  height: 500px;
  overflow-y: scroll;
}

.item-ul::-webkit-scrollbar {
  width: 0;
}

.drag-list {
  border: 1px #e1e4e8 solid;
  padding: 10px;
  margin: 5px 0 10px;
  list-style: none;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  -webkit-transition: border .3s ease-in;
  transition: border .3s ease-in;
}

.drag-list:hover {
  border: 1px solid #20a0ff;
}

.drag-title {
  font-weight: 400;
  line-height: 25px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}

.ghost-style {
  display: block;
  color: transparent;
  border-style: dashed
}
</style>
