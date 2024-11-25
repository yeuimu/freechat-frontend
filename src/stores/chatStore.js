import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    const chatConversations = ref([
      {
        conversationName: 'nm',
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
        messages: [
          {
            sender: 'fdsafds',
            content: '你好',
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
    const currentConversation = ref(1)
    const currentMessages = computed(() => {
      return currentConversation.value !== null
        ? chatConversations.value[currentConversation.value].messages
        : []
    })
    const setCurrentConversation = (i) => (currentConversation.value = i)

    return {
      chatConversations,
      userList,
      currentConversation,
      currentMessages,
      setCurrentConversation,
    }
  },
  {
    persist: true,
  },
)
