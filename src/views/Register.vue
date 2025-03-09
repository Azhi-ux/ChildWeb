<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2>注册</h2>
      </template>
      
      <el-form
        ref="registerForm"
        :model="registerData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerData.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerData.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="register-button"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <router-link to="/login">已有账号？立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';

const router = useRouter();
const registerForm = ref<FormInstance>();
const loading = ref(false);

const registerData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerData.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ]
};

const handleRegister = async () => {
  if (!registerForm.value) return;
  
  await registerForm.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 这里模拟注册，实际项目中需要调用后端API
      setTimeout(() => {
        ElMessage.success('注册成功！');
        router.push('/login');
        loading.value = false;
      }, 1000);
    }
  });
};
</script>

<style scoped lang="scss">
.register-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  
  .register-card {
    width: 400px;
    
    :deep(.el-card__header) {
      text-align: center;
      
      h2 {
        margin: 0;
        font-size: 24px;
        color: #303133;
      }
    }
    
    .register-button {
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