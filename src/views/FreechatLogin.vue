<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content flex-col lg:flex-row lg:justify-center lg:gap-10">
      <div class="text-center md:w-4/5 lg:text-left lg:w-2/5">
        <h1 class="text-5xl font-bold">常聊!</h1>
        <p class="py-6 text-slate-400">
          欢迎来！输入匿名开启端对端加密畅聊！
        </p>
      </div>
      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div class="card-body">
          <div class="form-control">
            <input type="input" v-model="nickname" placeholder="输入匿名" class="input input-bordered" required />
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary" @click="register">开始聊天</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { registerUser } from '@/api/userApi';
import { ref } from 'vue';
import { deleteUser } from '@/api/userApi';
import { useRouter } from 'vue-router'

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();

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
    $toast.success(`注册成功: ${response.message}`);

    router.push('/chat');
  } catch (error) {
    console.error('注册失败:', error?.data.message || error);
    $toast.error(`注册失败: ${error?.data.message || error}`, { duration: 30000 });
    userStore.clearUserData();
  }
};
</script>
