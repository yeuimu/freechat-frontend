import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useChatStore } from './chatStore'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const whoSendNewMessage = ref('');

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

    socket.value.on('message', ({ type, sender, id, create, content }) => {
      console.log({ type, sender, id, create, content });
      const newMessage = {
        sender,
        content,
        id,
        create,
      };
      if (
        chatStore.currentConversation.conversationName == sender &&
        chatStore.currentConversation.type == type
      ) {
        chatStore.currentConversation.messages.push(newMessage);
      }
      else if (chatStore.chatConversations.some((c) => c.conversationName == sender)) {
        const c = chatStore.chatConversations.find((c) => c.conversationName == sender);
        c.messages.push(newMessage);
      }
      else {
        const index = chatStore.addConversation(sender, type);
        chatStore.chatConversations[index].messages.push(newMessage);
      }
      whoSendNewMessage.value = sender;
    })

    socket.value.on('respond', ({ code, message, toMessage }) => {
      console.log(code)
      console.log(message)
      console.log(new Date(toMessage.create).toLocaleString())
    })

    socket.value.on('error', (error) => {
      console.error('Socket error:', error)
    })

    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Disconnected from server')
    })
  }

  const sendMessage = (type, recipient, content, create) => {
    if (!socket.value) return

    socket.value.emit('message', {
      type,
      recipient,
      content,
      create,
    })
  }

  const joinGroup = (groupId) => {
    if (!socket.value) return
    socket.value.emit('join', groupId)
  }

  return { initSocket, sendMessage, joinGroup, whoSendNewMessage, connected }
})
