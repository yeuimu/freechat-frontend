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
          <a class="btn btn-ghost text-xl">{{ chatStore.currentConversation.name }}</a>
        </div>
        <div class="flex-none">
          <button class="lg:ml-4 text-xl btn btn-square btn-ghost" @click="openModalSearch">+</button>
        </div>
      </div>
      <!-- 聊天区域 -->
      <div class="flex-grow overflow-y-auto flex-col" ref="messageArea">
        <!-- 消息列表 -->
        <div class="my-2 mx-2" v-for="m in chatStore.currentMessages" :key="m">
          <div v-if="m.sender != userStore.nickname" class="chat chat-start">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full bg-base-300">
                <div class="h-10 text-center flex items-center justify-center">{{ m.sender }}</div>
              </div>
            </div>
            <div class="chat-header">
              <time v-if="m.create" class="text-xs opacity-50">{{ m.create }}</time>
            </div>
            <div data-tip="复制" class="tooltip tooltip-accent">
              <button @click="copyToClipboard($event, m.content)"
                class="btn h-max cursor-copy font-mono font-light max-w-64 lg:max-w-2xl break-words chat-bubble">
                {{ m.content }}
              </button>
            </div>
          </div>
          <div v-else class="chat chat-end">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full bg-base-300">
                <div class="h-10 text-center flex items-center justify-center">{{ m.sender }}</div>
              </div>
            </div>
            <div class="chat-header">
              <time class="text-xs opacity-50">{{ m.create }}</time>
            </div>
            <div data-tip="复制" class="tooltip tooltip-accent">
              <button @click="copyToClipboard($event, m.content)"
                class="btn h-max cursor-copy font-mono font-light max-w-64 lg:max-w-2xl break-words chat-bubble">
                {{ m.content }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="isNewMessage" @click="toTopMessageArea" class="sticky bottom-0 flex justify-center"><button class="btn btn-xs btn-info">新消息</button></div>
      </div>
      <!-- 输入区域 -->
      <div class="flex items-center">
        <div class="flex-1">
          <textarea class="w-full h-32 textarea-lg bg-base-100 rounded-xl focus:outline-none resize-none"
            placeholder="输入消息" v-model="messageInput"></textarea>
        </div>
        <!-- 发送按钮 -->
        <div class="flex-none">
          <button class="btn btn-ghost" @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="w-2/3 lg:min-w-56 bg-base-100 h-screen flex flex-col">
        <!-- 头像 -->
        <div class="flex-0 self-center avatar mt-4">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <div class="text-2xl h-10 text-center flex items-center justify-center">{{ userStore.nickname }}</div>
          </div>
        </div>
        <!-- 聊天列表 -->
        <div class="mx-4 my-2 text-neutral-400 flex justify-between">
          <span>会话列表</span>
          <!-- <a>新建</a> -->
        </div>
        <div class="overflow-y-auto flex-grow">
          <ul class="menu rounded-box">
            <li class="text-xl lg:cursor-pointer flex" v-for="(c, i) in chatStore.chatConversations" :key="c.name">
              <a class="flex flex-1" :class="{ 'focus': chatStore.currentConversationIndex === i }">
                <div class="flex-1" @click="switchConversation(i)">
                  <span>{{ c.name }}</span>
                  <span v-if="c.type == 'private'" class="badge badge-xs">用户</span>
                  <span v-if="c.type == 'group'" class="badge badge-xs">群聊</span>
                </div>
                <div>
                  <details v-if="chatStore.currentConversationIndex === i"
                    class="dropdown dropdown-bottom dropdown-end">
                    <summary class="btn btn-xs btn-ghost btn-square flex justify-center">
                      <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="icon-md">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
                          fill="currentColor"></path>
                      </svg>
                    </summary>
                    <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow">
                      <li><a @click="openModalDeleteConversation($event)">删除</a></li>
                    </ul>
                  </details>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <!-- 注销 -->
        <div class="flex flex-none justify-around my-2">
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
  <!-- 用户搜索弹窗 -->
  <input type="checkbox" id="modal_search" ref="modalSearch" class="modal-toggle" />
  <div class="modal" role="dialog" ref="modal">
    <div class="modal-box -z-1 w-5/6 flex flex-col items-center justify-center gap-6">
      <div class="text-2xl">发起新聊天</div>
      <div class="flex flex-col gap-2">
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
        <div class="flex-1 overflow-y-auto rounded-md">
          <div class="flex justify-center">
            <span class="loading-spinner loading-xs" :class="{ loading: isSearching }"></span>
          </div>
          <ul class="menu bg-base-100 p-0 [&_li>*]:rounded-md" v-for="r in searchResults" :key="r">
            <li><a @click="newConversation(r.nickname, r.publicKey, r.type)">
                <span>{{ r.nickname }}</span>
                <span v-if="r.type == 'private'" class="badge badge-lg">用户</span>
                <span v-if="r.type == 'group'" class="badge badge-lg">群聊</span>
              </a></li>
          </ul>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <div class="modal-action">
        <label for="modal_search" class="btn btn-ghost" @click="searchResults.length = 0">关闭</label>
      </div>
    </div>
    <!-- 屏罩 -->
    <label class="modal-backdrop" for="modal_search" @click="searchResults.length = 0">Close</label>
  </div>
  <!-- 会话删除确认弹窗 -->
  <input type="checkbox" id="modal_delete_conversation" ref="modalDeleteConversation" class="modal-toggle" />
  <div class="modal" role="dialog" ref="modal">
    <div class="modal-box -z-1 w-5/6 flex flex-col items-center justify-center gap-6">
      <div class="text-2xl">是否删除会话？</div>
      <div class="text-gray-400">此操作会清空本地聊天记录</div>
      <div class="flex justify-between w-full">
        <!-- 关闭 -->
        <div class="btn btn-ghost" @click="closeModalDeleteConversation">关闭</div>
        <!-- 确认 -->
        <div class="btn btn-neutral" @click="deleteCurrentConversation">确认</div>
      </div>
    </div>
    <!-- 屏罩 -->
    <label class="modal-backdrop" for="modal_delete_conversation"></label>
  </div>
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

// 用户搜索框
const modalSearch = ref();
const openModalSearch = () => {
  modalSearch.value.checked = true;
};
const closeModalSearch = () => {
  modalSearch.value.checked = false;
};

const isSearching = ref(false);
const searchNickname = ref('');
const searchResults = ref([]);
const searchUserByName = async () => {
  isSearching.value = true;
  searchResults.value = [];
  try {
    const res = await searchUser(userStore.nickname, await userStore.signature, searchNickname.value);
    $toast.success(`用户存在：${res.results[0].nickname}`);
    console.log(res.results[0]);
    searchResults.value = res.results;
  } catch (error) {
    $toast.error(`用户不存在`);
    console.log(error)
  }
  isSearching.value = false;
}
const newConversation = (nickname, publickey, type) => {
  const index = chatStore.addConversation(nickname, publickey, type);
  closeModalSearch();
  switchConversation(index);
  console.log('add: ', index)
}

// 发送消息
const messageInput = ref('');
const sendMessage = async () => {
  // if (!messageInput.value.trim()) return;
  console.log(messageInput.value);
  const create = new Date();
  await socketStore.sendMessage(
    chatStore.currentConversation.type, // 'private' 或 'group'
    chatStore.currentConversation.name,
    messageInput.value,
    create,
  )
  chatStore.addMessage(userStore.nickname, messageInput.value, create.toLocaleString('zh-cn'));
  messageInput.value = ''
  toTopMessageArea();
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

// 复制消息
const copyToClipboard = async (event, text) => {
  await navigator.clipboard.writeText(text);
}

// 会话删除框
const modalDeleteConversation = ref();
const openModalDeleteConversation = (event) => {
  event.target.parentElement.parentElement.parentElement.open = false;
  modalDeleteConversation.value.checked = true;
}
const closeModalDeleteConversation = () => {
  modalDeleteConversation.value.checked = false;
}
const deleteCurrentConversation = () => {
  chatStore.deleteCurrentConversation();
  closeModalDeleteConversation();
}

// 新消息提醒
const isNewMessage = ref();
watch(chatStore.currentMessages, (n, o) => {
  console.log("有新消息来了！");
  const clientHeight = messageArea.value.clientHeight;
  const scrollTop = messageArea.value.scrollTop;
  const scrollHeight = messageArea.value.scrollHeight;
  // console.log(clientHeight);
  // console.log(scrollTop);
  // console.log(clientHeight + scrollTop);
  // console.log(`总高度：${scrollHeight}`);
  // console.log(scrollHeight - clientHeight - scrollTop);
  if (scrollHeight - clientHeight - scrollTop > 72 && n[n.length - 1].sender !== userStore.nickname) {
    isNewMessage.value = true;
    setTimeout(() => isNewMessage.value = false, 5000);
  }
})

// 将消息框内的滚动条滚到最底下
const messageArea = ref();
const toTopMessageArea = () => {
  setTimeout(() => messageArea.value.scrollTop = messageArea.value.scrollHeight, 100);
  isNewMessage.value = false;
}
</script>
