<template>
  <div class="drawer lg:drawer-open h-screen w-screen">
    <input id="my-drawer" type="checkbox" v-model="drawer" class="drawer-toggle" />
    <!-- 主栏 -->
    <div class="drawer-content flex flex-col h-screen">
      <!-- 顶栏 -->
      <div class="navbar bg-base-100">
        <!-- 打开侧边栏 -->
        <div class="flex-none">
          <label for="my-drawer" class="lg:hidden btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <!-- 对话名 -->
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">{{ chatStore.currentConversation.conversationName }}</a>
        </div>
        <div class="flex-none">
          <button class="lg:ml-4 text-xl btn btn-square btn-ghost" @click="openModal">+</button>
        </div>
      </div>
      <!-- 聊天区域 -->
      <div class="flex-grow overflow-y-auto flex-col">
        <!-- 消息列表 -->
        <div class="my-2 mx-2" v-for="m in chatStore.currentMessages" :key="m">
          <div v-if="m.sender != userStore.nickname" class="chat chat-start">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                {{ m.sender }}
              </div>
            </div>
            <div class="chat-header">
              <time v-if="m.create" class="text-xs opacity-50">{{ m.create }}</time>
            </div>
            <div class="chat-bubble">{{ m.content }}</div>
          </div>
          <div v-else class="chat chat-end">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                {{ m.sender }}
              </div>
            </div>
            <div class="chat-header">
              <time class="text-xs opacity-50">{{ m.create.toLocaleString() }}</time>
            </div>
            <div class="chat-bubble">{{ m.content }}</div>
          </div>
        </div>
      </div>
      <!-- 输入区域 -->
      <div class="flex items-center">
        <div class="flex-1">
          <textarea class="w-full h-32 textarea-lg bg-base-100 rounded-xl focus:outline-none resize-none"
            placeholder="输入消息" v-model="messageInput"></textarea>
        </div>
        <!-- 发送按钮 -->
        <div class="flex-none">
          <button class="btn btn-ghost" @click="send">Send</button>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="w-2/3 lg:min-w-40 bg-base-100 h-screen flex flex-col">
        <!-- 头像 -->
        <div class="flex-0 self-center avatar mt-4">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="text-2xl">{{ userStore.nickname }}</span>
          </div>
        </div>
        <!-- 聊天列表 -->
        <div class="overflow-y-auto flex-grow">
          <ul class="menu rounded-box">
            <li class="menu-title">会话列表</li>
            <li v-for="(c, i) in chatStore.chatConversations" :key="c.conversationName" class="text-xl cursor-pointer"
              @click="switchConversation(i)">
              <a :class="{ 'focus': chatStore.currentConversationIndex === i }">{{ c.conversationName }}</a>
            </li>
          </ul>
        </div>
        <!-- 注销 -->
        <div class="flex flex-none lg:flex-col justify-around mb-2">
          <button class="self-center btn btn-ghost btn-square">退出</button>
          <button class="self-center btn btn-ghost btn-square">注销</button>
          <!-- 主题切换 -->
          <label class="swap mt-2">
            <!-- this hidden checkbox controls the state -->
            <input type="checkbox" class="theme-controller" v-model="isDark" @click="toggleTheme" />
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
  <!-- 用户搜索框 -->
  <dialog class="modal" ref="modal">
    <div class="modal-box w-5/6 flex flex-col items-center justify-center gap-6">
      <div class="text-2xl">发起聊天</div>
      <!-- 输入框 -->
      <div class="flex justify-center items-center gap-4">
        <input type="text" v-model="searchNickname" placeholder="输入昵称"
          class="input w-full max-w-xs focus:border-none focus:ring-0" />
        <!-- 搜索按钮 -->
        <button class="btn btn-ghost" @click="searchUserByName">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <!-- 结果 -->
      <div class="flex-1 overflow-y-auto w-4/6 rounded-md">
        <span class="loading-spinner loading-xs" :class="{ loading: isSearching }"></span>
        <ul class="menu bg-base-100 p-0 [&_li>*]:rounded-md" v-for="r in searchResults" :key="r">
          <li><a @click="newConversation(r.nickname, r.publicKey, 'private')">{{ r.nickname }}</a></li>
        </ul>
      </div>
      <!-- 关闭按钮 -->
      <div class="self-center">
        <form method="dialog">
          <!-- if there is a button, it will close the modal -->
          <button class="btn btn-ghost" @click="searchResults.length = 0">Close</button>
        </form>
      </div>
    </div>
    <!-- 屏罩 -->
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { searchUser } from '@/api/userApi';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

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

onMounted(async () => {
  // 初始化 socket 连接
  const sign = await userStore.signature;
  socketStore.initSocket(
    userStore.nickname,
    sign
  )
  // 检测系统是否切换是黑暗模式
  isSystemDark()
})

// 主题切换
const isDark = ref(null);
const isSystemDark = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark')
    isDark.value = true
  }
}
const toggleTheme = () => {
  const htmlElement = document.documentElement;
  console.log(htmlElement.dataset.theme)
  htmlElement.setAttribute('data-theme', isDark.value ? 'light' : 'dark');
};

// 搜索用户
const modal = ref(null);
const openModal = () => {
  if (modal.value) modal.value.showModal();
};
const closeModal = () => {
  if (modal.value) modal.value.close();
};

const isSearching = ref(false);
const searchNickname = ref('');
const searchResults = ref([]);
const searchUserByName = async () => {
  isSearching.value = true;
  searchResults.value = [];
  try {
    const res = await searchUser(searchNickname.value);
    $toast.success(`用户存在：${res.results[0].nickname}`);
    console.log(res.results[0].nickname);
    searchResults.value = res.results;
  } catch (error) {
    $toast.error(`用户不存在`);
    console.log(error)
  }
  isSearching.value = false;
}
const newConversation = (nickname, publicKey, type) => {
  const index = chatStore.addConversation(nickname, publicKey, type);
  closeModal();
  switchConversation(index);
  console.log('add: ', index)
}

// 发送消息
const send = () => {
  if (!messageInput.value.trim()) return;
  const create = new Date();
  socketStore.sendMessage(
    chatStore.currentConversation.type, // 'private' 或 'group'
    chatStore.currentConversation.conversationName,
    messageInput.value,
    create,
  )
  chatStore.addMessage(userStore.nickname, messageInput.value, create.toLocaleString('zh-cn'));
  messageInput.value = ''
}

// 会话列表
const drawer = ref(null)
const closeDrawer = () => {
  if (drawer.value == true) drawer.value = false;
}
const switchConversation = (index) => {
  chatStore.setCurrentConversation(index)
  closeDrawer()
}
</script>
