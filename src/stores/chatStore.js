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
            id: null,
            data: null,
            status: ''
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
          },
          {
            sender: 'me',
            content: '你好',
            id: null,
            data: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
          },
          {
            sender: 'me',
            content: '你好',
            id: null,
            data: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
          },
          {
            sender: 'me',
            content: '你好',
            id: null,
            data: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
          },
          {
            sender: 'me',
            content: '你好',
            id: null,
            data: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
          },
          {
            sender: 'me',
            content: '你好',
            id: null,
            data: null,
          },
          {
            sender: 'nm',
            content: '很高兴认识你',
            id: null,
            data: null,
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
            create: null,
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
    // const chatConversations = ref(null)
    // const userList = ref(null)
    // const currentConversationIndex = ref(null)
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
      const index = chatConversations.value.findIndex((c) => c.conversationName === name);
      if (index !== -1) return index;

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
    }
  },
  {
    persist: true,
  },
)
