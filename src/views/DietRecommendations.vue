<template>
  <div class="diet-recommendations">
    <!-- 食谱推荐卡片 -->
    <el-row :gutter="20">
      <el-col :span="8" v-for="recipe in recommendedRecipes" :key="recipe.id">
        <el-card class="recipe-card" :body-style="{ padding: '0px' }">
          <img :src="recipe.image" class="recipe-image" />
          <div class="recipe-content">
            <h3>{{ recipe.name }}</h3>
            <div class="recipe-tags">
              <el-tag 
                v-for="tag in recipe.tags" 
                :key="tag"
                size="small"
                :type="getTagType(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="recipe-description">{{ recipe.description }}</p>
            <div class="recipe-nutrition">
              <div class="nutrition-item">
                <span class="label">热量</span>
                <span class="value">{{ recipe.nutrition.calories }}kcal</span>
              </div>
              <div class="nutrition-item">
                <span class="label">蛋白质</span>
                <span class="value">{{ recipe.nutrition.protein }}g</span>
              </div>
              <div class="nutrition-item">
                <span class="label">碳水</span>
                <span class="value">{{ recipe.nutrition.carbs }}g</span>
              </div>
            </div>
            <el-button type="primary" text @click="showRecipeDetail(recipe)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 每周饮食计划 -->
    <el-card class="meal-plan-card">
      <template #header>
        <div class="card-header">
          <span>每周饮食计划</span>
          <el-button type="primary" size="small" @click="generateMealPlan">
            生成计划
          </el-button>
        </div>
      </template>
      <el-table :data="weeklyMealPlan" style="width: 100%">
        <el-table-column prop="day" label="星期" width="100" />
        <el-table-column prop="breakfast" label="早餐">
          <template #default="{ row }">
            <div class="meal-cell">
              <img :src="row.breakfast.image" class="meal-image" />
              <span>{{ row.breakfast.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lunch" label="午餐">
          <template #default="{ row }">
            <div class="meal-cell">
              <img :src="row.lunch.image" class="meal-image" />
              <span>{{ row.lunch.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dinner" label="晚餐">
          <template #default="{ row }">
            <div class="meal-cell">
              <img :src="row.dinner.image" class="meal-image" />
              <span>{{ row.dinner.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="snack" label="加餐">
          <template #default="{ row }">
            <div class="meal-cell">
              <img :src="row.snack.image" class="meal-image" />
              <span>{{ row.snack.name }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 营养建议 -->
    <el-card class="nutrition-tips-card">
      <template #header>
        <div class="card-header">
          <span>营养建议</span>
        </div>
      </template>
      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="tip in nutritionTips" 
          :key="tip.id" 
          :title="tip.title"
          :name="tip.id"
        >
          <div class="tip-content">
            <el-icon :class="tip.iconClass">
              <component :is="tip.icon" />
            </el-icon>
            <p>{{ tip.content }}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 食谱详情对话框 -->
    <el-dialog
      v-model="recipeDialogVisible"
      :title="selectedRecipe?.name"
      width="60%"
    >
      <div v-if="selectedRecipe" class="recipe-detail">
        <img :src="selectedRecipe.image" class="detail-image" />
        <div class="detail-content">
          <h4>营养成分</h4>
          <div class="nutrition-grid">
            <div class="nutrition-item" v-for="(value, key) in selectedRecipe.nutrition" :key="key">
              <span class="label">{{ getNutritionLabel(key) }}</span>
              <span class="value">{{ value }}{{ getNutritionUnit(key) }}</span>
            </div>
          </div>
          <h4>食材</h4>
          <el-tag
            v-for="ingredient in selectedRecipe.ingredients"
            :key="ingredient"
            class="ingredient-tag"
          >
            {{ ingredient }}
          </el-tag>
          <h4>烹饪步骤</h4>
          <ol class="cooking-steps">
            <li v-for="(step, index) in selectedRecipe.steps" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Apple,
  Milk,
  Food,
  Timer,
  Chicken,
  Sugar
} from '@element-plus/icons-vue';

// 推荐食谱数据
const recommendedRecipes = ref([
  {
    id: 1,
    name: '彩虹水果燕麦碗',
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    tags: ['早餐', '健康', '高纤维'],
    description: '营养丰富的燕麦碗，搭配新鲜水果和坚果，为一天提供充足能量。',
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 55,
      fat: 8,
      fiber: 8,
      vitamins: ['维生素C', '维生素B']
    },
    ingredients: [
      '燕麦片 50g',
      '香蕉 1个',
      '蓝莓 50g',
      '草莓 50g',
      '奇异果 1个',
      '杏仁片 10g',
      '蜂蜜 1勺'
    ],
    steps: [
      '将燕麦片用牛奶浸泡15分钟',
      '将水果切片',
      '将浸泡好的燕麦装碗',
      '在燕麦上摆放水果片',
      '撒上杏仁片',
      '淋上蜂蜜即可食用'
    ]
  },
  {
    id: 2,
    name: '五彩蔬菜鸡肉饭',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    tags: ['午餐', '高蛋白', '均衡'],
    description: '营养均衡的午餐选择，搭配多种蔬菜和优质蛋白。',
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 60,
      fat: 12,
      fiber: 6,
      vitamins: ['维生素A', '维生素B6']
    },
    ingredients: [
      '鸡胸肉 150g',
      '糙米 100g',
      '西兰花 100g',
      '胡萝卜 50g',
      '玉米粒 50g',
      '豌豆 50g'
    ],
    steps: [
      '将鸡胸肉切块并腌制',
      '煮糙米',
      '将蔬菜切块',
      '炒制鸡肉',
      '蒸煮蔬菜',
      '将米饭、鸡肉和蔬菜拌匀'
    ]
  },
  {
    id: 3,
    name: '三文鱼牛油果沙拉',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    tags: ['晚餐', '低碳水', 'Omega-3'],
    description: '清爽可口的沙拉，富含健康脂肪和优质蛋白。',
    nutrition: {
      calories: 380,
      protein: 22,
      carbs: 15,
      fat: 28,
      fiber: 7,
      vitamins: ['维生素D', '维生素E']
    },
    ingredients: [
      '三文鱼片 120g',
      '牛油果 1个',
      '生菜 100g',
      '小番茄 50g',
      '黄瓜 50g',
      '橄榄油 15ml'
    ],
    steps: [
      '将三文鱼煎至七分熟',
      '将牛油果切片',
      '将生菜撕成小块',
      '将小番茄对半切',
      '将黄瓜切片',
      '将所有食材混合，淋上橄榄油'
    ]
  }
]);

// 每周饮食计划数据
const weeklyMealPlan = ref([
  {
    day: '星期一',
    breakfast: {
      name: '全麦面包配牛奶',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    lunch: {
      name: '糙米饭配清炒时蔬',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    dinner: {
      name: '蒸鱼配西兰花',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    snack: {
      name: '水果拼盘',
      image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    }
  },
  {
    day: '星期二',
    breakfast: {
      name: '燕麦粥配坚果',
      image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    lunch: {
      name: '鸡肉沙拉',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    dinner: {
      name: '豆腐汤配杂粮饭',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    snack: {
      name: '酸奶配蓝莓',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    }
  }
]);

// 营养建议数据
const nutritionTips = ref([
  {
    id: 1,
    title: '均衡饮食的重要性',
    content: '保持均衡的饮食结构，确保每天摄入充足的蛋白质、碳水化合物、健康脂肪、维生素和矿物质。',
    icon: 'Food',
    iconClass: 'tip-icon-food'
  },
  {
    id: 2,
    title: '补充优质蛋白',
    content: '选择瘦肉、鱼、蛋、奶等优质蛋白质食物，有助于儿童生长发育。',
    icon: 'Chicken',
    iconClass: 'tip-icon-protein'
  },
  {
    id: 3,
    title: '多吃新鲜水果',
    content: '每天食用2-3份新鲜水果，补充维生素和膳食纤维。',
    icon: 'Apple',
    iconClass: 'tip-icon-fruit'
  },
  {
    id: 4,
    title: '注意饮食规律',
    content: '保持规律的饮食时间，不要跳过早餐，避免零食过量。',
    icon: 'Timer',
    iconClass: 'tip-icon-time'
  }
]);

const activeNames = ref(['1']);
const recipeDialogVisible = ref(false);
const selectedRecipe = ref(null);

// 获取标签类型
const getTagType = (tag: string) => {
  const tagTypes: Record<string, string> = {
    '早餐': '',
    '午餐': 'success',
    '晚餐': 'warning',
    '健康': 'info',
    '高蛋白': 'danger',
    '低碳水': 'warning',
    'Omega-3': 'info'
  };
  return tagTypes[tag] || '';
};

// 显示食谱详情
const showRecipeDetail = (recipe: any) => {
  selectedRecipe.value = recipe;
  recipeDialogVisible.value = true;
};

// 生成饮食计划
const generateMealPlan = () => {
  ElMessage.success('新的饮食计划已生成');
};

// 获取营养标签
const getNutritionLabel = (key: string) => {
  const labels: Record<string, string> = {
    calories: '热量',
    protein: '蛋白质',
    carbs: '碳水化合物',
    fat: '脂肪',
    fiber: '膳食纤维',
    vitamins: '维生素'
  };
  return labels[key] || key;
};

// 获取营养单位
const getNutritionUnit = (key: string) => {
  const units: Record<string, string> = {
    calories: 'kcal',
    protein: 'g',
    carbs: 'g',
    fat: 'g',
    fiber: 'g'
  };
  return units[key] || '';
};
</script>

<style scoped lang="scss">
.diet-recommendations {
  padding: 20px;
  
  .recipe-card {
    margin-bottom: 20px;
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .recipe-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .recipe-content {
      padding: 16px;
      
      h3 {
        margin: 0 0 12px;
        font-size: 18px;
        color: #303133;
      }
      
      .recipe-tags {
        margin-bottom: 12px;
        
        .el-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
      
      .recipe-description {
        color: #606266;
        margin-bottom: 16px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .recipe-nutrition {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        
        .nutrition-item {
          text-align: center;
          
          .label {
            display: block;
            font-size: 12px;
            color: #909399;
          }
          
          .value {
            display: block;
            font-size: 14px;
            color: #303133;
            font-weight: bold;
          }
        }
      }
    }
  }
  
  .meal-plan-card {
    margin-bottom: 20px;
    
    .meal-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .meal-image {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
  
  .nutrition-tips-card {
    .tip-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 8px 0;
      
      .el-icon {
        font-size: 24px;
        
        &.tip-icon-food { color: #409EFF; }
        &.tip-icon-protein { color: #67C23A; }
        &.tip-icon-fruit { color: #E6A23C; }
        &.tip-icon-time { color: #F56C6C; }
      }
      
      p {
        margin: 0;
        color: #606266;
      }
    }
  }
  
  .recipe-detail {
    .detail-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .detail-content {
      h4 {
        margin: 20px 0 12px;
        color: #303133;
      }
      
      .nutrition-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-bottom: 20px;
        
        .nutrition-item {
          text-align: center;
          padding: 12px;
          background-color: #f5f7fa;
          border-radius: 4px;
          
          .label {
            display: block;
            font-size: 12px;
            color: #909399;
          }
          
          .value {
            display: block;
            font-size: 16px;
            color: #303133;
            font-weight: bold;
            margin-top: 4px;
          }
        }
      }
      
      .ingredient-tag {
        margin-right: 8px;
        margin-bottom: 8px;
      }
      
      .cooking-steps {
        padding-left: 20px;
        color: #606266;
        
        li {
          margin-bottom: 8px;
        }
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>