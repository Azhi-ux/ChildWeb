import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: 'nutrition-analysis',
        name: 'NutritionAnalysis',
        component: () => import('../views/NutritionAnalysis.vue'),
      },
      {
        path: 'diet-recommendations',
        name: 'DietRecommendations',
        component: () => import('../views/DietRecommendations.vue'),
      },
      {
        path: 'growth-tracking',
        name: 'GrowthTracking',
        component: () => import('../views/GrowthTracking.vue'),
      },
      {
        path: 'health-assessment',
        name: 'HealthAssessment',
        component: () => import('../views/HealthAssessment.vue'),
      },
      {
        path: 'reading-recommendations',
        name: 'ReadingRecommendations',
        component: () => import('../views/ReadingRecommendations.vue'),
      }
    ],
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;