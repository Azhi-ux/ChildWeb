<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 统计卡片 -->
      <el-col :span="6" v-for="card in statisticsCards" :key="card.title">
        <el-card class="statistics-card" :body-style="{ padding: '20px' }">
          <div class="card-content">
            <el-icon class="card-icon" :class="card.color">
              <component :is="card.icon" />
            </el-icon>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <!-- 成长趋势图 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>儿童成长趋势</span>
              <el-radio-group v-model="growthMetric" size="small">
                <el-radio-button label="height">身高</el-radio-button>
                <el-radio-button label="weight">体重</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="growthChartRef" class="chart"></div>
        </el-card>
      </el-col>

      <!-- 营养摄入分析 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>营养摄入分析</span>
              <el-select v-model="selectedPeriod" size="small" style="width: 120px">
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
                <el-option label="本年" value="year" />
              </el-select>
            </div>
          </template>
          <div ref="nutritionChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="table-row">
      <!-- 最近活动 -->
      <el-col :span="24">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">
              <span>最近活动记录</span>
              <el-button type="primary" size="small" @click="refreshActivities">
                刷新
              </el-button>
            </div>
          </template>
          <el-table :data="recentActivities" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getActivityTypeTag(row.type)">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="row.status === '完成' ? 'success' : 'warning'">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import {
  User,
  DataLine,
  Food,
  Reading
} from '@element-plus/icons-vue';

// 统计卡片数据
const statisticsCards = [
  {
    title: '注册儿童',
    value: '125',
    icon: 'User',
    color: 'blue'
  },
  {
    title: '营养评估',
    value: '89',
    icon: 'DataLine',
    color: 'green'
  },
  {
    title: '饮食建议',
    value: '234',
    icon: 'Food',
    color: 'orange'
  },
  {
    title: '阅读推荐',
    value: '56',
    icon: 'Reading',
    color: 'purple'
  }
];

// 成长趋势图
const growthChartRef = ref<HTMLElement>();
const growthMetric = ref('height');
let growthChart: echarts.ECharts | null = null;

// 营养摄入图
const nutritionChartRef = ref<HTMLElement>();
const selectedPeriod = ref('week');
let nutritionChart: echarts.ECharts | null = null;

// 最近活动数据
const recentActivities = ref([
  {
    date: '2024-02-20',
    type: '身高测量',
    description: '完成每月身高测量记录',
    status: '完成'
  },
  {
    date: '2024-02-19',
    type: '营养评估',
    description: '进行营养状况评估分析',
    status: '完成'
  },
  {
    date: '2024-02-18',
    type: '饮食建议',
    description: '生成个性化饮食推荐方案',
    status: '进行中'
  },
  {
    date: '2024-02-17',
    type: '阅读推荐',
    description: '更新适龄读物推荐列表',
    status: '完成'
  }
]);

// 初始化成长趋势图
const initGrowthChart = () => {
  if (!growthChartRef.value) return;
  
  growthChart = echarts.init(growthChartRef.value);
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value',
      name: growthMetric.value === 'height' ? '身高 (cm)' : '体重 (kg)'
    },
    series: [
      {
        name: growthMetric.value === 'height' ? '身高' : '体重',
        type: 'line',
        smooth: true,
        data: growthMetric.value === 'height' 
          ? [110, 111, 112, 113, 114, 115]
          : [20, 20.5, 21, 21.3, 21.7, 22],
        itemStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(64,158,255,0.2)'
            }, {
              offset: 1,
              color: 'rgba(64,158,255,0)'
            }]
          }
        }
      }
    ]
  };
  
  growthChart.setOption(option);
};

// 初始化营养摄入图
const initNutritionChart = () => {
  if (!nutritionChartRef.value) return;
  
  nutritionChart = echarts.init(nutritionChartRef.value);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: '营养摄入',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 30, name: '蛋白质' },
          { value: 25, name: '碳水化合物' },
          { value: 20, name: '脂肪' },
          { value: 15, name: '维生素' },
          { value: 10, name: '矿物质' }
        ]
      }
    ]
  };
  
  nutritionChart.setOption(option);
};

// 获取活动类型对应的标签类型
const getActivityTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '身高测量': '',
    '营养评估': 'success',
    '饮食建议': 'warning',
    '阅读推荐': 'info'
  };
  return typeMap[type] || '';
};

// 刷新活动列表
const refreshActivities = () => {
  // 模拟刷新数据
  ElMessage.success('活动列表已更新');
};

// 监听窗口大小变化，重绘图表
const handleResize = () => {
  growthChart?.resize();
  nutritionChart?.resize();
};

// 监听成长指标变化
watch(growthMetric, () => {
  initGrowthChart();
});

// 监听时间周期变化
watch(selectedPeriod, () => {
  initNutritionChart();
});

onMounted(() => {
  initGrowthChart();
  initNutritionChart();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  growthChart?.dispose();
  nutritionChart?.dispose();
});
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
  
  .statistics-card {
    margin-bottom: 20px;
    
    .card-content {
      display: flex;
      align-items: center;
      
      .card-icon {
        font-size: 48px;
        margin-right: 16px;
        
        &.blue { color: #409EFF; }
        &.green { color: #67C23A; }
        &.orange { color: #E6A23C; }
        &.purple { color: #909399; }
      }
      
      .card-info {
        .card-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }
        
        .card-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }
  
  .chart-row {
    margin-bottom: 20px;
    
    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .chart {
        height: 300px;
      }
    }
  }
  
  .table-row {
    .table-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>