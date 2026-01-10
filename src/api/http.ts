import axios, { type AxiosResponse } from 'axios'

// 定义后端返回数据的统一格式
export interface ApiResponse<T> {
  data: T
  code: number
  message: string
  timestamp: number
}

// 创建axios实例
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理错误和返回数据
http.interceptors.response.use(
  async (
    response: AxiosResponse<ApiResponse<unknown>>,
  ): Promise<AxiosResponse<ApiResponse<unknown>>> => {
    const businessData = response.data ?? { code: -1, message: '未知响应数据', data: null, timestamp: 0};

    if (businessData.code === 200) {
      return response
    } else {
      const error = new Error(businessData.message || 'Business Error')
      throw error
    }
  },
  // 失败回调：处理网络错误/HTTP 错误（如 404/500）
  (error): Promise<never> => {
    const errorMsg = error.response?.data?.message || error.message || 'Network/HTTP Error'
    const wrappedError = new Error(errorMsg)
    throw wrappedError
  },
)
