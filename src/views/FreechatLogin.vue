<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center">
    <div class="w-60 flex flex-col justify-between items-center gap-4">
      <input class="input" v-model="nickname" placeholder="输入昵称" />
      <button class="btn w-full" @click="register">注册</button>
      <button class="btn w-full" @click="handleDelete">注销</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { registerUser } from '@/api/userApi';
import { ref } from 'vue';
import { deleteUser } from '@/api/userApi';
import { useRouter } from 'vue-router'

const userStore = useUserStore();
const nickname = ref('');
const router = useRouter();

// 注销方法
const handleDelete = async () => {
  try {
    // console.log(`private key: ${userStore.privateKey}`);
    // 生成签名
    const signature = await userStore.generateSignature;

    // 调用注销 API
    const response = await deleteUser(nickname.value, signature);
    userStore.clearUserData();

    console.log('注销成功:', response.message);
  } catch (error) {
    console.error('注销失败:', error.response?.data || error.message);
  }
};

// 注册方法
const register = async () => {
  try {
    // 设置昵称
    userStore.setNickname(nickname.value);

    // 生成密钥对
    await userStore.generateKeys();

    // 调用注册 API
    const response = await registerUser(userStore.nickname, userStore.publicKey);
    console.log('注册成功:', response.message);

    router.push('/chat');
  } catch (error) {
    console.error('注册失败:', error.response?.data || error.message);
    userStore.clearUserData();
  }
};
</script>
