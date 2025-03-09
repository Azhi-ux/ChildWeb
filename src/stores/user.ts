import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref({
    username: '',
    avatar: '',
    role: ''
  });

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function setUserInfo(info: typeof userInfo.value) {
    userInfo.value = info;
  }

  function logout() {
    token.value = '';
    userInfo.value = {
      username: '',
      avatar: '',
      role: ''
    };
    localStorage.removeItem('token');
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  };
});