<template>
  <div class="nutrition-analysis">
    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button type="primary" size="small" @click="handleSaveInfo">
            保存信息
          </el-button>
        </div>
      </template>
      <el-form :model="basicInfo" label-width="100px" :rules="rules" ref="infoForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="basicInfo.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="basicInfo.age" :min="0" :max="18" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="basicInfo.gender" style="width: 100%">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身高(cm)" prop="height">
              <el-input-number v-model="basicInfo.height" :min="0" :max="200" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重(kg)" prop="weight">
              <el-input-number v-model="basicInfo.weight" :min="0" :max="100" :precision="1" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动水平" prop="activityLevel">
              <el-select v-model="basicInfo.activityLevel" style="width: 100%">
                <el-option label="久坐" value="sedentary" />
                <el-option label="轻度活动" value="light" />
                <el-option label="中度活动" value="moderate" />
                <el-option label="重度活动" value="heavy" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 营养需求分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>每日营养需求</span>
              <el-button type="primary" size="small" @click="calculateNutrition">
                计算
              </el-button>
            </div>
          </template>
          <div class="nutrition-results">
            <div class="result-item" v-for="item in nutritionNeeds" :key="item.name">
              <span class="label">{{ item.name }}:</span>
              <span class="value">{{ item.value }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>营养状况评估</span>
            </div>
          </template>
          <div ref="nutritionChartRef" class="nutrition-chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 营养建议 -->
    <el-card class="suggestions-card">
      <template #header>
        <div class="card-header">
          <span>营养建议</span>
        </div>
      </template>
      <div class="suggestions-content">
        <el-timeline>
          <el-timeline-item
            v-for="(suggestion, index) in nutritionSuggestions"
            :key="index"
            :type="suggestion.type"
            :color="suggestion.color"
          >
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.content }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { FormInstance } from 'element-plus';

const infoForm = ref<FormInstance>();
const nutritionChartRef = ref<HTMLElement>();
let nutritionChart: echarts.ECharts | null = null;

// 基本信息表单数据
const basicInfo = reactive({
  name: '',
  age: 6,
  gender: 'male',
  height: 120,
  weight: 25,
  activityLevel: 'moderate'
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  activityLevel: [{ required: true, message: '请选择活动水平', trigger: 'change' }]
};

// 营养需求数据
const nutritionNeeds = ref([
  { name: '热量', value: '1600', unit: 'kcal/天' },
  { name: '蛋白质', value: '40-60', unit: 'g/天' },
  { name: '碳水化合物', value: '200-250', unit: 'g/天' },
  { name: '脂肪', value: '45-60', unit: 'g/天' },
  { name: '膳食纤维', value: '20', unit: 'g/天' },
  { name: '钙', value: '800', unit: 'mg/天' },
  { name: '铁', value: '12', unit: 'mg/天' },
  { name: '维生素A', value: '600', unit: 'μg/天' },
  { name: '维生素D', value: '10', unit: 'μg/天' },
  { name: '维生素C', value: '60', unit: 'mg/天' }
]);

// 营养建议数据
const nutritionSuggestions = ref([
  {
    title: '均衡饮食',
    content: '建议每天食用多样化的食物，包括谷物、蔬菜、水果、肉类、蛋奶等，保证营养均衡。',
    type: 'primary',
    color: '#409EFF'
  },
  {
    title: '补充蛋白质',
    content: '多食用瘦肉、鱼、蛋、奶等优质蛋白质食物，有助于身高发育。',
    type: 'success',
    color: '#67C23A'
  },
  {
    title: '补充钙质',
    content: '每天喝足量牛奶，适量食用虾皮、小鱼干等钙含量丰富的食物。',
    type: 'warning',
    color: '#E6A23C'
  },
  {
    title: '注意事项',
    content: '避免偏食挑食，少吃高糖、高盐、高脂食品，保持规律饮食习惯。',
    type: 'danger',
    color: '#F56C6C'
  }
]);

// 保存基本信息
const handleSaveInfo = async () => {
  if (!infoForm.value) return;
  
  await infoForm.value.validate((valid) => {
    if (valid) {
      ElMessage.success('信息保存成功');
      calculateNutrition();
    }
  });
};

// 计算营养需求
const calculateNutrition = () => {
  // 这里应该根据年龄、性别、身高、体重等计算营养需求
  // 目前使用模拟数据
  ElMessage.success('营养需求计算完成');
  initNutritionChart();
};

// 初始化营养状况评估图表
const initNutritionChart = () => {
  if (!nutritionChartRef.value) return;
  
  nutritionChart = echarts.init(nutritionChartRef.value);
  const option = {
    radar: {
      indicator: [
        { name: '热量', max: 100 },
        { name: '蛋白质', max: 100 },
        { name: '碳水化合物', max: 100 },
        { name: '脂肪', max: 100 },
        { name: '维生素', max: 100 },
        { name: '矿物质', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [80, 85, 90, 75, 70, 80],
          name: '当前营养状况',
          areaStyle: {
            color: 'rgba(64,158,255,0.2)'
          },
          lineStyle: {
            color: '#409EFF'
          },
          itemStyle: {
            color: '#409EFF'
          }
        },
        {
          value: [90, 90, 90, 90, 90, 90],
          name: '推荐值',
          lineStyle: {
            type: 'dashed',
            color: '#67C23A'
          },
          itemStyle: {
            color: '#67C23A'
          }
        }
      ]
    }]
  };
  
  nutritionChart.setOption(option);
};

// 监听窗口大小变化
const handleResize = () => {
  nutritionChart?.resize();
};

onMounted(() => {
  initNutritionChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  nutritionChart?.dispose();
});
</script>

<style scoped lang="scss">
.nutrition-analysis {
  padding: 20px;
  
  .info-card {
    margin-bottom: 20px;
  }
  
  .analysis-row {
    margin-bottom: 20px;
    
    .analysis-card {
      height: 100%;
      
      .nutrition-results {
        .result-item {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          
          .label {
            width: 120px;
            color: #606266;
          }
          
          .value {
            font-weight: bold;
            color: #303133;
            margin: 0 8px;
          }
          
          .unit {
            color: #909399;
          }
        }
      }
      
      .nutrition-chart {
        height: 300px;
      }
    }
  }
  
  .suggestions-card {
    .suggestions-content {
      padding: 20px;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>