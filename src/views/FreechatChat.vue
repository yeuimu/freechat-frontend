<template>
  <div class="h-full w-screen flex justify-between">
    <!-- 左侧聊天列表 -->
    <div class="w-1/5 bg-gray-100 border-r">
      <div class="p-4 flex flex-col justify-center items-center border-b">
        <div class="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center overflow-hidden">
          <p class="text-white text-sm whitespace-nowrap text-ellipsis">{{ userStore.nickname }}</p>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center gap-6" v-for="(c, i) in chatStore.chatConversations"
        :key="c.conversationName">
        <div @click="chatStore.setCurrentConversation(i)">
          {{ c.conversationName }}
        </div>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="flex-1 flex flex-col">

      <!-- 消息列表 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
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

      <!-- 输入区域 -->
      <div class="p-4 border-t">
        <div class="flex space-x-2">
          <input v-model="messageInput" type="text"
            class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入消息..." @keyup.enter="sendMessage" />
          <button @click="sendMessage"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            发送
          </button>
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
