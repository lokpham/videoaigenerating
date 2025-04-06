import { atom } from 'jotai';
import api from '@/api';

export const accessTokenAtom = atom(localStorage.getItem('accessToken') || null);

export const userAtom = atom(null);

export const loadingAtom = atom(true);

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