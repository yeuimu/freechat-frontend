import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const messages = ref([])

  const initSocket = (username, signature) => {
    socket.value = io('ws://43.153.155.176/ws', {
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
})
