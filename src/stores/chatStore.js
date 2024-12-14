import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useChatStore = defineStore(
  'chat',
  () => {
    // { [ { name: string, type: string, messages: [[{ sender: string, content: string, create: Date, id: string, status: string }]], publickey: string } ] }
    const chatConversations = ref([])
    // number
    const currentConversationIndex = ref(null)
    // { name: string, type: string, messages: [[{ sender: string, content: string, create: Date, id: string, status: string }]], publickey: string }
    const currentConversation = computed(() =>
      currentConversationIndex.value == null
        ? ''
        : chatConversations.value[currentConversationIndex.value],
    )
    // [{ sender: string, content: string, create: Date, id: string, status: string }]
    const currentMessages = computed(() =>
      currentConversationIndex.value == null ? '' : currentConversation.value.messages,
    )

    const setCurrentConversation = (i) => (currentConversationIndex.value = i)
    const addConversation = (name, publickey, type) => {
      const index = chatConversations.value?.findIndex((c) => c.name === name)
      if (index !== undefined  && index !== -1) return index

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
    const deleteCurrentConversation = () => {
      chatConversations.value.splice(currentConversationIndex, 1);
      if (chatConversations.value.length !== 0) currentConversationIndex.value = 0;
      else currentConversationIndex.value = null;
    }

    return {
      chatConversations,
      currentConversationIndex,
      currentConversation,
      currentMessages,
      setCurrentConversation,
      addConversation,
      addMessage,
      deleteCurrentConversation,
    }
  },
  {
    persist: true,
  },
)
