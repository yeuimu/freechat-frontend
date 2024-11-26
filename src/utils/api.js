import axios from 'axios';

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: 'https://xymyfh.fun/api', // 替换为您的后端 API 根地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error.response || error.message);
  }
);

export default apiClient;
