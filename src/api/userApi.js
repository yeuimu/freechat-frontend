import apiClient from '../utils/api'

/**
 * 用户注册
 * @param {string} nickname - 用户昵称
 * @param {string} publicKey - 用户公钥
 * @returns {Promise} Axios 请求 Promise
 */
export const registerUser = (nickname, publicKey) => {
  return apiClient.post('/user/register', { nickname, publicKey })
}

/**
 * 检测用户名合法性
 * @param {string} nickname - 用户昵称
 * @returns {Promise} Axios 请求 Promise
 */
export const checkUsername = (nickname) => {
  return apiClient.get('/user/validate', { params: { nickname } })
}

/**
 * 更新用户活跃时间
 * @param {string} nickname - 用户昵称
 * @returns {Promise} Axios 请求 Promise
 */
export const updateUserActivity = (nickname) => {
  return apiClient.post('/user/refresh', { nickname })
}

/**
 * 用户搜索
 * @param {string} query - 搜索关键字
 * @returns {Promise} Axios 请求 Promise
 */
export const searchUser = (query) => {
  return apiClient.get('/user/search', { params: { query } })
}

/**
 * 用户注销
 * @param {string} nickname - 用户昵称
 * @param {string} signature - 用户签名
 * @returns {Promise} Axios 请求 Promise
 */
export const deleteUser = (nickname, signature) => {
  return apiClient.delete(`/user/delete/${nickname}`, { data: { signature } })
}

/**
 * 验证用户是否存在
 * @param {string} nickname - 用户昵称
 * @param {string} signature - 用户签名
 * @returns {Promise} Axios 请求 Promise
 */
export const verifyUser = (nickname, signature) => {
  console.log(`signature: ${signature}`)
  return apiClient.post(`/user/verify`, { nickname, signature })
}
