import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    const chatConversations = ref(null)
    const userList = ref(null)
    const currentConversationIndex = ref(null)
    const addUser = (nickname, publickey) => {
      userList.value.push({
        userName: nickname,
        publicKey: publickey,
      })
    }
    const currentConversation = computed(() =>
      currentConversationIndex.value == null
        ? ''
        : chatConversations.value[currentConversationIndex.value],
    )
    const currentMessages = computed(() =>
      currentConversationIndex.value == null ? '' : currentConversation.value.messages,
    )
    const setCurrentConversation = (i) => (currentConversationIndex.value = i)
    const addConversation = (name, key, type) => {
      const index = chatConversations.value.findIndex((c) => c.conversationName === name)
      if (index !== -1) return index

      const len = chatConversations.value.push({
        conversationName: name,
        type: type,
        messages: [],
      })
      userList.value.push({ userName: name, publicKey: key }) - 1
      return len - 1
    }
    const addMessage = (sender, content, create) => {
      currentConversation.value.messages.push({
        sender,
        content,
        create,
        id: '',
        status: 'Delivering',
      })
    }

    return {
      chatConversations,
      userList,
      currentConversationIndex,
      currentConversation,
      currentMessages,
      setCurrentConversation,
      addConversation,
      addMessage,
      addUser,
    }
  },
  {
    persist: true,
  },
)
