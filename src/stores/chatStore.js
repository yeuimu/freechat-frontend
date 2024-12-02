import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    const chatConversations = ref([])
    const currentConversationIndex = ref(null)

    const currentConversation = computed(() =>
      currentConversationIndex.value == null
        ? ''
        : chatConversations.value[currentConversationIndex.value],
    )
    const currentMessages = computed(() =>
      currentConversationIndex.value == null ? '' : currentConversation.value.messages,
    )

    const setCurrentConversation = (i) => (currentConversationIndex.value = i)
    const addConversation = (name, publickey, type) => {
      const index = chatConversations.value?.findIndex((c) => c.name === name)
      if (index && index !== -1) return index

      const len = chatConversations.value.push({
        name: name,
        type,
        messages: [],
        publickey,
      })
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
