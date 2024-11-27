<template>
  <div class="drawer lg:drawer-open h-full">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col h-full">
      <!-- 顶层工具栏 -->
      <div class="flex h-14 w-full justify-between sticky top-0">
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
          <textarea class="textarea-lg bg-white w-3/4 h-3/4 focus:outline-none resize-none"
            placeholder="输入消息"></textarea>
        </DraggableBox>

      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="w-2/3 lg:min-w-40 bg-gray-100 h-full border-r flex flex-col gap-4 pt-4">
        <!-- 头像 -->
          <div class="self-center w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center overflow-hidden">
            <p class="text-white text-sm whitespace-nowrap text-ellipsis">{{ userStore.nickname }}</p>
          </div>
        <!-- 聊天列表 -->
        <div class="overflow-y-auto h-4/5">
          <ul class="menu rounded-box" v-for="(c, i) in chatStore.chatConversations" :key="c.conversationName">
            <li v-if="i == 0" class="menu-title">会话列表</li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
            <li class="text-xl" @click="chatStore.setCurrentConversation(i)">
              <a>{{ c.conversationName }}</a>
            </li>
          </ul>
        </div>
        <!-- 注销 -->
         <button class="self-center btn btn-circle">注销</button>
         <button class="self-center btn btn-circle">退出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
