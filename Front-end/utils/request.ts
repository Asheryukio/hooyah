import axios from 'axios';
// import { ElMessage, ElMessageBox } from 'element-plus';
import store from '@/store';
import { localStorage } from '@/utils/storage';

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000, // 
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

service.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`,
      );
    }

    const { isLogin, tokenObj } = toRefs(store.user.useUserStore());

    if (isLogin.value) {
      config.headers[tokenObj.value.tokenName] = tokenObj.value.tokenValue;
      config.headers['TENANT_ID'] = '1';
      config.headers['appId'] = localStorage.get('appId');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    const { code, msg } = res;
    if (code === 200) {
      return res;
    } else {
      if (code === -1) {
        handleError();
      } else {
        // ElMessage({
        //   message: msg || 'error',
        //   type: 'error',
        //   duration: 5 * 1000,
        // });
      }
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  (error) => {
    console.log('error：', error);
    const { msg } = error.response.data;
    if (error.response.status === 401) {
      handleError();
    } else {
      //   ElMessage({
      //     message: 'network error',
      //     type: 'error',
      //     duration: 5 * 1000,
      //   });
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
);

function handleError() {
  const { isLogin, logout } = store.user.useUserStore();
  if (isLogin) {
    // ElMessageBox.confirm('error', {
    //   confirmButtonText: 'try again',
    //   cancelButtonText: 'cancel',
    //   type: 'warning',
    // }).then(() => {
    //   logout();
    // });
  }
}

export default service;
