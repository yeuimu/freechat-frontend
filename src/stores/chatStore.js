import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    const chatConversations = ref([
      {
        conversationName: 'nm',
        type: 'private',
        messages: [
          {
            sender: 'me',
            content: '你好',
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
          },
        ],
      },
      {
        conversationName: 'group1',
        type: 'group',
        messages: [
          {
            sender: 'fdsafds',
            content: '你好',
            id: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
          },
          {
            sender: 'me',
            content: '欢迎新成员',
          },
          {
            sender: 'fdsa',
            content: '欢迎新成员',
          },
        ],
      },
    ])
    const userList = ref([
      {
        userName: 'nm',
        publicKey: 'fjdlafjlksd',
      },
    ])
    const currentConversationIndex = ref(1)
    const currentConversation = computed(() => chatConversations.value[currentConversationIndex.value])
    const currentMessages = computed(() => currentConversation.value.messages);
    const setCurrentConversation = (i) => (currentConversationIndex.value = i);
    const addConversation = (name, key, type) => {
      let index = chatConversations.value.findIndex((c) => c.conversationName === name)
      if (index !== -1) return index - 1

      index = chatConversations.value.push({
        conversationName: name,
        type,
        messages: [],
      })
      userList.value.push({ userName: name, publicKey: key }) - 1
      return index
    }
    const addMessage = (sender, content) => {
      currentConversation.value.messages.push({
        sender,
        content,
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
    }
  },
  {
    persist: true,
  },
)
