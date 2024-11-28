import { defineStore } from 'pinia'
import { generatePemKeyPair, generateSignature } from '@/utils/encryption'
import { computed, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const nickname = ref(null)
    const publicKey = ref(null)
    const privateKey = ref(null)
    const id = ref(null)

    const generateKeys = async () => {
      const { pub, pri } = await generatePemKeyPair()
      // console.log(`public key: ${pub}\nprivate key: ${pri}`)
      publicKey.value = pub
      privateKey.value = pri
    }

    const signature = computed(async () => {
      if (privateKey.value == null) return ''

      return generateSignature(nickname.value, privateKey.value)
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
      signature,
    }
  },
  {
    persist: true,
  },
)
