import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './index.css' // TailwindCSS 样式
const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.mount('#app')
