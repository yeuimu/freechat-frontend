import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useChatStore } from './chatStore'
import { useUserStore } from './userStore'
import { useToast } from 'vue-toast-notification';
import { publickeyUser } from '@/api/userApi';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const whoSendNewMessage = ref('');

  const chatStore = useChatStore()
  const userStore = useUserStore();

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

    socket.value.on('message', async ({ type, sender, id, create, content }) => {
      console.log({ type, sender, id, create, content });
      const newMessage = {
        sender,
        content,
        id,
        create,
      };
      if (
        chatStore.currentConversation.name == sender &&
        chatStore.currentConversation.type == type
      ) {
        chatStore.currentConversation.messages.push(newMessage);
      } else {
        if (chatStore.chatConversations.some((c) => c.name == sender)) {
          const c = chatStore.chatConversations.find((c) => c.name == sender);
          c.messages.push(newMessage);
        }
        else {
          const res = await publickeyUser(userStore.nickname, userStore.signature, sender);
          let index = 0;
          if (res.publicKey) {
            index = chatStore.addConversation(sender, res.publicKey, type);
          } else {
            Error(`Not found public key of ${sender}`);
          }
          chatStore.chatConversations[index].messages.push(newMessage);
        }
        $toast.info(`${sender} 来了一条新消息`, {duration: 10000});
      }
    })

    socket.value.on('respond', ({ code, message, toMessage }) => {
      console.log(code)
      console.log(message)
      console.log(new Date(toMessage.create).toLocaleString('zh-cn'))
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
    if (!socket.value) return;
    console.log(type);

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
