<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      
      <el-form
        ref="loginForm"
        :model="loginData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginData.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import type { FormInstance } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const loginForm = ref<FormInstance>();
const loading = ref(false);

const loginData = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ]
};

const handleLogin = async () => {
  if (!loginForm.value) return;
  
  await loginForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 这里模拟登录，实际项目中需要调用后端API
      setTimeout(() => {
        userStore.setToken('mock-token');
        userStore.setUserInfo({
          username: loginData.username,
          avatar: '',
          role: 'admin'
        });
        router.push('/');
        loading.value = false;
      }, 1000);
    }
  });
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  
  .login-card {
    width: 400px;
    
    :deep(.el-card__header) {
      text-align: center;
      
      h2 {
        margin: 0;
        font-size: 24px;
        color: #303133;
      }
    }
    
    .login-button {
      width: 100%;
    }
    
    .form-footer {
      text-align: center;
      margin-top: 16px;
      
      a {
        color: #409EFF;
        text-decoration: none;
        
        &:hover {
          color: #66b1ff;
        }
      }
    }
  }
}
</style>