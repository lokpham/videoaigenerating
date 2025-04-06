import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization']= `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Nếu token hết hạn, gọi refresh token
      return refreshTokenAndRetry(error.config);
    }
    return Promise.reject(error);
  }
);

// Hàm để refresh token và thử lại yêu cầu
const refreshTokenAndRetry = async (originalConfig) => {
  try {
    const response = await api.post('/auth/refresh');
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    originalConfig.headers.Authorization = `Bearer ${accessToken}`;
    return api(originalConfig);
  } catch (err) {
    localStorage.removeItem('accessToken');
    window.location.href = '/login'; // Chuyển hướng về login nếu refresh token thất bại
    return Promise.reject(err);
  }
};

export default api;