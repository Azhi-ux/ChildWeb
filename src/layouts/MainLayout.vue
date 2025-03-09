<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><Monitor /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/nutrition-analysis">
          <el-icon><DataLine /></el-icon>
          <span>营养需求分析</span>
        </el-menu-item>
        <el-menu-item index="/diet-recommendations">
          <el-icon><Food /></el-icon>
          <span>饮食推荐</span>
        </el-menu-item>
        <el-menu-item index="/growth-tracking">
          <el-icon><TrendCharts /></el-icon>
          <span>成长记录</span>
        </el-menu-item>
        <el-menu-item index="/health-assessment">
          <el-icon><FirstAidKit /></el-icon>
          <span>健康评估</span>
        </el-menu-item>
        <el-menu-item index="/reading-recommendations">
          <el-icon><Reading /></el-icon>
          <span>读物推荐</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>儿童营养与健康成长跟踪系统</h2>
          <el-dropdown @command="handleCommand">
            <span class="user-profile">
              {{ userStore.userInfo.username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import {
  Monitor,
  DataLine,
  Food,
  TrendCharts,
  FirstAidKit,
  Reading,
  ArrowDown
} from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout();
    router.push('/login');
  }
};
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  
  .el-aside {
    background-color: #304156;
    
    .el-menu {
      border-right: none;
      background-color: transparent;
      
      .el-menu-item {
        color: #bfcbd9;
        
        &:hover, &.is-active {
          color: #409EFF;
          background-color: #263445;
        }
      }
    }
  }
  
  .el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 20px;
    
    .header-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      h2 {
        margin: 0;
        font-size: 18px;
        color: #303133;
      }
      
      .user-profile {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
  
  .el-main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}
</style>