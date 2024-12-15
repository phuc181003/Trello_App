import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_ROOT, // URL của server
  timeout: 3000 // Thời gian chờ của request
})

// Cấu hình Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào headers nếu có
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Cấu hình Interceptor cho response để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    return response
  },
  (error) => {
    // Lấy thông tin lỗi từ response
    if (error.response) {
      // const status = error.response.status // Lấy mã trạng thái (status code)
      const errorMessage = error.response.data.message || 'Lỗi không xác định từ server' // Lấy thông báo lỗi từ server
      // Hiển thị thông báo lỗi chính xác từ server
      toast.error(`${errorMessage}`)
      // Trả về lỗi chi tiết cho phần xử lý khác (nếu cần)
      return Promise.reject(error.response.data)
    } else {
      // Xử lý lỗi không có response (ví dụ: mất kết nối mạng)
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
      return Promise.reject(error)
    }
  }
)

export default axiosInstance