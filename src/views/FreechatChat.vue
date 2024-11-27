<template>
  <div class="drawer lg:drawer-open h-full">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col h-full">
      <!-- 顶层工具栏 -->
      <div class="flex h-20 w-full justify-between sticky top-0 border-b border-base-200 drop-shadow-md">
        <label for="my-drawer" class="lg:hidden ml-4 h-full text-2xl flex justify-center items-center">
          =
        </label>
        <div class="lg: ml-4 h-full text-3xl flex justify-center items-center">{{
          chatStore.chatConversations[chatStore.currentConversation].conversationName }}</div>
        <button class="lg:ml-4 mr-4 h-full text-xl flex justify-center items-center">+</button>
      </div>
      <!-- 聊天区域 -->
      <div class="flex flex-1 flex-col w-full">
        <!-- 消息列表 -->
        <div class="flex-1 p-4">
          <div v-for="m in chatStore.currentMessages" :key="m">
            <div v-if="m.sender != 'me'" class="chat chat-start">
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  {{ m.sender }}
                </div>
              </div>
              <div class="chat-bubble">{{ m.content }}</div>
            </div>
            <div v-else class="chat chat-end">
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  {{ m.sender }}
                </div>
              </div>
              <div class="chat-bubble">{{ m.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="w-full flex justify-center items-center sticky bottom-10">
        <DraggableBox>
          <textarea class="textarea-lg bg-base-300 w-3/4 h-3/4 focus:outline-none resize-none"
            placeholder="输入消息"></textarea>
        </DraggableBox>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="w-2/3 lg:min-w-40 bg-base-100 h-full flex flex-col gap-2">
        <!-- 头像 -->
        <div class="self-center avatar placeholder mt-6">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="text-2xl">{{ userStore.nickname }}</span>
          </div>
        </div>
        <!-- 聊天列表 -->
        <div class="overflow-y-auto h-4/6">
          <ul class="menu rounded-box">
            <li v-if="chatStore.chatConversations.length > 0" class="menu-title">会话列表</li>
            <li v-for="(c, i) in chatStore.chatConversations" :key="c.conversationName" class="text-xl cursor-pointer"
              @click="chatStore.setCurrentConversation(i)">
              <a :class="{ 'focus': chatStore.currentConversation === i }">{{ c.conversationName }}</a>
            </li>
          </ul>
        </div>
        <!-- 注销 -->
        <div class="flex flex-0 lg:flex-col justify-around">
          <button class="self-center btn btn-ghost btn-square">退出</button>
          <button class="self-center btn btn-ghost btn-square">注销</button>
          <!-- 主题切换 -->
          <label class="swap swap-rotate mt-1">
            <!-- this hidden checkbox controls the state -->
            <input type="checkbox" class="theme-controller" @click="toggleTheme" />
            <!-- sun icon -->
            <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
            <!-- moon icon -->
            <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSocketStore } from '@/stores/socketStore'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'
import DraggableBox from '@/components/DraggableBox.vue'

const socketStore = useSocketStore()
const userStore = useUserStore()
const chatStore = useChatStore()

const messageInput = ref('')
const currentChat = ref(null)
const chatList = ref([])
const messages = ref([])

// onMounted(() => {
//   // 初始化 socket 连接
//   socketStore.initSocket(
//     userStore.username,
//     userStore.signature
//   )
// })

const isDark = ref(false);
const toggleTheme = () => {
  const htmlElement = document.documentElement;
  isDark.value = !isDark.value;
  htmlElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light');
};

// const sendMessage = () => {
//   if (!messageInput.value.trim()) return

//   socketStore.sendMessage(
//     currentChat.value.type, // 'private' 或 'group'
//     currentChat.value.recipient,
//     messageInput.value
//   )

//   messageInput.value = ''
// }
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
