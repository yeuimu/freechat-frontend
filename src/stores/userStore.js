import { defineStore } from 'pinia'
import { generatePemKeyPair } from '@/utils/encryption'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const nickname = ref(null)
    const publicKey = ref(null)
    const privateKey = ref(null)

    const generateKeys = async () => {
      const { pub, pri } = await generatePemKeyPair()
      // console.log(`public key: ${pub}\nprivate key: ${pri}`)
      publicKey.value = pub
      privateKey.value = pri
    }

    const generateSignature = computed(async () => {
      if (privateKey.value == null) return ''

      // 提取 PEM 格式中的密钥
      const keyData = privateKey.value.replace(
        /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g,
        '',
      )
      const privateKeyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0)).buffer

      // 导入私钥
      const importedPrivateKey = await crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        {
          name: 'RSA-PSS',
          hash: { name: 'SHA-256' },
        },
        false,
        ['sign'],
      )

      // 使用私钥签名消息
      const encoder = new TextEncoder()
      const data = encoder.encode(nickname.value)
      const signature = await crypto.subtle.sign(
        {
          name: 'RSA-PSS',
          saltLength: 32,
        },
        importedPrivateKey,
        data,
      )

      // 返回 Base64 编码的签名
      return btoa(String.fromCharCode(...new Uint8Array(signature)))
    })

    const setNickname = (nname) => (nickname.value = nname)

    const clearUserData = () => {
      nickname.value = null
      publicKey.value = null
      privateKey.value = null
    }

    return {
      nickname,
      publicKey,
      privateKey,
      setNickname,
      clearUserData,
      generateKeys,
      generateSignature,
    }
  },
  {
    persist: true,
  },
)
