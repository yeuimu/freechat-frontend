import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/FreechatHome.vue';
import Login from '../views/FreechatLogin.vue';
import Chat from '../views/FreechatChat.vue';
import { useUserStore } from '@/stores/userStore';
import { verifyUser } from '@/api/userApi';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/chat', name: 'Chat', component: Chat },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const signature = await userStore.generateSignature;
  const { nickname, privateKey, publicKey } = userStore;

  if (!nickname || !privateKey || !publicKey) {
    if (to.path !== '/login') {
      return next('/login');
    }
    return next();
  }

  try {
    await verifyUser(nickname, signature);
    if (to.path !== '/chat') {
      return next('/chat');
    }
  } catch (error) {
    console.error('验证失败:', error);
    if (to.path !== '/login') {
      return next('/login');
    }
  }

  next();
});

export default router;
