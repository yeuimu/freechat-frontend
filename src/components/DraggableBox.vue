<template>
  <div class="w-11/12 flex flex-col items-center">
    <!-- 拖拽条 -->
    <div class="drag-bar cursor-move flex items-center justify-center" @mousedown="startDragging">
      <div class="h-1 w-12 bg-gray-400 rounded"></div>
    </div>
    <!-- 消息框 -->
    <div class="w-full rounded-box bg-white flex justify-center items-center" :style="{ height: `${height}px` }">
      <!-- 插槽 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

// 设置初始高度、最小高度和最大高度
const height = ref(100); // 当前高度
const minHeight = 60; // 最小高度
const maxHeight = 200; // 最大高度

let isDragging = false; // 是否正在拖拽
let startY = 0; // 鼠标初始位置
let initialHeight = 0; // 拖拽开始时的高度

const startDragging = (event) => {
  isDragging = true;
  startY = event.clientY;
  initialHeight = height.value;

  // 添加全局鼠标移动和释放事件
  document.addEventListener("mousemove", handleDragging);
  document.addEventListener("mouseup", stopDragging);
};

const handleDragging = (event) => {
  if (!isDragging) return;

  const deltaY = startY - event.clientY; // 鼠标移动的距离
  const newHeight = initialHeight + deltaY;

  // 限制高度在最小值和最大值之间
  height.value = Math.min(Math.max(newHeight, minHeight), maxHeight);
};

const stopDragging = () => {
  isDragging = false;
  // 移除全局事件
  document.removeEventListener("mousemove", handleDragging);
  document.removeEventListener("mouseup", stopDragging);
};

// 确保组件销毁时清理事件
onUnmounted(() => {
  stopDragging();
});
</script>

<style scoped>
.drag-bar {
  user-select: none;
  /* 禁止选中文本 */
}
</style>
