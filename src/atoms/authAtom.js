import { atom } from 'jotai';
import api from '@/api';

// Lấy accessToken
export const accessTokenAtom = atom(localStorage.getItem('accessToken') || null);

export const userAtom = atom(null);

export const loadingAtom = atom(true);


export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return null;
  }
};

export const loginAtom = atom(
  null,
  async (get, set, token) => {
    localStorage.setItem('accessToken', token);
    set(accessTokenAtom, token);
    set(userAtom, { token }); // Cập nhật user với token
    set(loadingAtom, false); // Set loading về false khi đăng nhập thành công
  }
);  

export const logoutAtom = atom(
  null,
  async (get, set) => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
    localStorage.removeItem('accessToken');
    set(accessTokenAtom, null);
    set(userAtom, null); // Xóa user
    set(loadingAtom, false); // Set loading về false khi đăng xuất
  }
);