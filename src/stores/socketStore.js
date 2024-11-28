import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useChatStore } from './chatStore'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const messages = ref([])

  const chatStore = useChatStore()

  const initSocket = (username, signature) => {
    socket.value = io('wss://xymyfh.fun/', {
      query: {
        username,
        signature,
      },
    })

    socket.value.on('connect', () => {
      connected.value = true
      console.log('Connected to server')
    })

    socket.value.on('message', (data) => {
      messages.value.push(data)
      console.log(data)
      chatStore.currentConversation.messages.push({
        sender: data.sender,
        content: data.content,
        id: data.id,
      })
    })

    socket.value.on('error', (error) => {
      console.error('Socket error:', error)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Disconnected from server')
    })
  }

  const sendMessage = (chatType, recipient, content) => {
    if (!socket.value) return

    socket.value.emit('message', {
      chatType,
      recipient,
      content,
    })
  }

  const joinGroup = (groupId) => {
    if (!socket.value) return
    socket.value.emit('join', groupId)
  }

  return {initSocket, sendMessage, joinGroup}
})
