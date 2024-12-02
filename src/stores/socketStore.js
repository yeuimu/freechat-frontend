import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useChatStore } from './chatStore'
import { useUserStore } from './userStore'
import { useToast } from 'vue-toast-notification'
import { publickeyUser } from '@/api/userApi'
import {
  encryptWithPublicKey,
  decryptWithPrivateKey,
  hybridEncrypt,
  hybridDecrypt,
} from '@/utils/encryption'
import 'vue-toast-notification/dist/theme-sugar.css'
const $toast = useToast()

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const connected = ref(false)
  const whoSendNewMessage = ref('')

  const chatStore = useChatStore()
  const userStore = useUserStore()

  const initSocket = (username, signature) => {
    // 发起连接
    socket.value = io('wss://xymyfh.fun/', {
      query: {
        username,
        signature,
      },
    })

    // 连上时
    socket.value.on('connect', () => {
      connected.value = true
      console.log('Connected to server')
    })

    // 收到消息后
    socket.value.on('message', async ({ type, sender, id, create, content }) => {
      console.log({ type, sender, id, create, content })
      await receiveMessage(type, sender, id, create, content)
    })

    // 收到响应后
    socket.value.on('respond', ({ code, message, toMessage }) => {
      console.log(code, message, toMessage)
      const { create, id } = toMessage
    })

    // 收到错误后
    socket.value.on('error', (error) => {
      console.error('Socket error:', error)
    })

    // 断开连接后
    socket.value.on('disconnect', () => {
      connected.value = false
      console.log('Disconnected from server')
    })
  }

  /**
   * 发送消息
   * @param {string} type
   * @param {string} recipient
   * @param {string} content
   * @param {Date} create
   */
  const sendMessage = async (type, recipient, content, create) => {
    console.log(type, recipient, content, create)
    const publickey = chatStore.chatConversations.find((c) => c.name === recipient)?.publickey
    const { cipherText, encryptedKey, iv } = await hybridEncrypt(content, publickey)
    console.log(cipherText)
    socket.value.emit('message', {
      type,
      recipient,
      content: { cipherText, encryptedKey, iv },
      create,
    })
  }

  /**
   * 接收消息
   * @param {string} type - 消息类型
   * @param {string} sender - 发送者名
   * @param {string} id - 消息ID
   * @param {Date} create - 创建日期
   * @param {string} content - 消息内容
   */
  const receiveMessage = async (type, sender, id, create, content) => {
    const { cipherText, encryptedKey, iv } = content
    const decryptedContent = await hybridDecrypt(encryptedKey, cipherText, iv, userStore.privateKey)
    const newMessage = {
      sender,
      content: decryptedContent,
      id,
      create: new Date(create).toLocaleString('zh-cn'),
    }
    if (
      chatStore.currentConversation.name == sender &&
      chatStore.currentConversation.type == type
    ) {
      chatStore.currentConversation.messages.push(newMessage)
    } else {
      if (chatStore.chatConversations.some((c) => c.name == sender)) {
        const c = chatStore.chatConversations.find((c) => c.name == sender)
        c.messages.push(newMessage)
      } else {
        const res = await publickeyUser(userStore.nickname, await userStore.signature, sender)
        let index = 0
        if (res.publicKey) {
          index = chatStore.addConversation(sender, res.publicKey, type)
        } else {
          Error(`Not found public key of ${sender}`)
        }
        chatStore.chatConversations[index].messages.push(newMessage)
      }
      $toast.info(`${sender} 来了一条新消息`, { duration: 10000 })
    }
  }

  /**
   * 加入群聊
   * @param {string} groupId - 群ID
   */
  const joinGroup = (groupId) => {
    socket.value.emit('join', groupId)
  }

  return { initSocket, sendMessage, joinGroup, whoSendNewMessage, connected }
})
