<template>
  <div class="health-assessment">
    <!-- 健康状况概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6" v-for="stat in healthStats" :key="stat.title">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-content">
            <el-icon class="stat-icon" :class="stat.status">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <h3>{{ stat.title }}</h3>
              <p class="stat-value">{{ stat.value }}</p>
              <div class="stat-status" :class="stat.status">
                {{ stat.description }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 体检记录表单 -->
    <el-card class="examination-card">
      <template #header>
        <div class="card-header">
          <span>体检记录</span>
          <el-button type="primary" @click="handleSaveExamination">
            保存记录
          </el-button>
        </div>
      </template>
      <el-form :model="examinationForm" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="体检日期" prop="date">
              <el-date-picker
                v-model="examinationForm.date"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体温(℃)" prop="temperature">
              <el-input-number
                v-model="examinationForm.temperature"
                :precision="1"
                :step="0.1"
                :min="35"
                :max="42"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="血压(mmHg)" prop="bloodPressure">
              <el-input v-model="examinationForm.bloodPressure" placeholder="如：120/80" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="心率(次/分)" prop="heartRate">
              <el-input-number
                v-model="examinationForm.heartRate"
                :min="0"
                :max="200"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="血氧饱和度(%)" prop="bloodOxygen">
              <el-input-number
                v-model="examinationForm.bloodOxygen"
                :min="0"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="视力" prop="vision">
              <el-input v-model="examinationForm.vision" placeholder="如：5.0/5.0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="体检结果" prop="result">
          <el-input
            type="textarea"
            v-model="examinationForm.result"
            :rows="3"
            placeholder="请输入体检结果描述"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 健康指标分析 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>体温变化趋势</span>
              <el-select v-model="timeRange" size="small" style="width: 120px">
                <el-option label="最近一周" value="week" />
                <el-option label="最近一月" value="month" />
                <el-option label="最近三月" value="quarter" />
              </el-select>
            </div>
          </template>
          <div ref="temperatureChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>心率变化趋势</span>
              <el-select v-model="timeRange" size="small" style="width: 120px">
                <el-option label="最近一周" value="week" />
                <el-option label="最近一月" value="month" />
                <el-option label="最近三月" value="quarter" />
              </el-select>
            </div>
          </template>
          <div ref="heartRateChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 健康建议 -->
    <el-card class="suggestions-card">
      <template #header>
        <div class="card-header">
          <span>健康建议</span>
          <el-button type="primary" size="small" @click="refreshSuggestions">
            刷新建议
          </el-button>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="suggestion in healthSuggestions" :key="suggestion.id">
          <div class="suggestion-card">
            <div class="suggestion-icon">
              <el-icon>
                <component :is="suggestion.icon" />
              </el-icon>
            </div>
            <h4>{{ suggestion.title }}</h4>
            <p>{{ suggestion.content }}</p>
            <el-tag :type="suggestion.type" effect="light">{{ suggestion.tag }}</el-tag>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 历史记录表格 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>历史体检记录</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="exportHistory">
              导出记录
            </el-button>
            <el-button type="success" size="small" @click="refreshHistory">
              刷新
            </el-button>
          </div>
        </div>
      </template>
      <el-table :data="examHistory" style="width: 100%" border stripe>
        <el-table-column prop="date" label="日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.date) }}
          </template>
        </el-table-column>
        <el-table-column prop="temperature" label="体温(℃)" width="100" />
        <el-table-column prop="bloodPressure" label="血压(mmHg)" width="120" />
        <el-table-column prop="heartRate" label="心率(次/分)" width="120" />
        <el-table-column prop="bloodOxygen" label="血氧(%)" width="100" />
        <el-table-column prop="vision" label="视力" width="100" />
        <el-table-column prop="result" label="体检结果" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row)">
              详情
            </el-button>
            <el-button type="danger" link @click="deleteRecord(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { FormInstance } from 'element-plus';
import {
  User,
  Thermometer,
  FirstAidKit,
  View,
  Timer,
  Location,
  Bell,
  Calendar
} from '@element-plus/icons-vue';

// 健康状况统计
const healthStats = ref([
  {
    title: '总体健康状况',
    value: '良好',
    description: '各项指标正常',
    icon: 'FirstAidKit',
    status: 'good'
  },
  {
    title: '最近体检',
    value: '7天前',
    description: '需要复查',
    icon: 'Calendar',
    status: 'warning'
  },
  {
    title: '免疫接种',
    value: '已完成',
    description: '按计划进行',
    icon: 'Timer',
    status: 'normal'
  },
  {
    title: '生长发育',
    value: '正常',
    description: '符合年龄特征',
    icon: 'Location',
    status: 'good'
  }
]);

// 表单数据
const formRef = ref<FormInstance>();
const examinationForm = reactive({
  date: new Date(),
  temperature: 36.5,
  bloodPressure: '',
  heartRate: 80,
  bloodOxygen: 98,
  vision: '',
  result: ''
});

// 表单验证规则
const rules = {
  date: [{ required: true, message: '请选择体检日期', trigger: 'change' }],
  temperature: [{ required: true, message: '请输入体温', trigger: 'blur' }],
  bloodPressure: [{ required: true, message: '请输入血压', trigger: 'blur' }],
  heartRate: [{ required: true, message: '请输入心率', trigger: 'blur' }],
  bloodOxygen: [{ required: true, message: '请输入血氧饱和度', trigger: 'blur' }],
  vision: [{ required: true, message: '请输入视力', trigger: 'blur' }]
};

// 图表相关
const temperatureChartRef = ref<HTMLElement>();
const heartRateChartRef = ref<HTMLElement>();
const timeRange = ref('week');
let temperatureChart: echarts.ECharts | null = null;
let heartRateChart: echarts.ECharts | null = null;

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 历史记录数据
const examHistory = ref([
  {
    date: '2024-02-20',
    temperature: 36.5,
    bloodPressure: '120/80',
    heartRate: 78,
    bloodOxygen: 98,
    vision: '5.0/5.0',
    result: '体检各项指标正常，继续保持良好的生活习惯。'
  },
  {
    date: '2024-01-20',
    temperature: 36.7,
    bloodPressure: '118/78',
    heartRate: 82,
    bloodOxygen: 99,
    vision: '5.0/5.0',
    result: '体检结果正常，建议加强运动。'
  }
]);

// 健康建议
const healthSuggestions = ref([
  {
    id: 1,
    title: '规律作息',
    content: '保持规律的作息时间，每天保证充足的睡眠时间。',
    icon: 'Bell',
    type: 'primary',
    tag: '生活习惯'
  },
  {
    id: 2,
    title: '均衡饮食',
    content: '注意营养均衡，多吃蔬菜水果，适量补充蛋白质。',
    icon: 'FirstAidKit',
    type: 'success',
    tag: '饮食建议'
  },
  {
    id: 3,
    title: '适量运动',
    content: '每天进行适度运动，增强体质，提高免疫力。',
    icon: 'Timer',
    type: 'warning',
    tag: '运动建议'
  }
]);

// 保存体检记录
const handleSaveExamination = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('体检记录保存成功');
      refreshHistory();
    }
  });
};

// 格式化日期
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

// 查看详情
const viewDetail = (row: any) => {
  ElMessage.info('查看详情：' + row.date);
};

// 删除记录
const deleteRecord = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除这条记录吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('记录删除成功');
    refreshHistory();
  });
};

// 导出历史记录
const exportHistory = () => {
  ElMessage.success('历史记录导出成功');
};

// 刷新历史记录
const refreshHistory = () => {
  ElMessage.success('历史记录已更新');
  initCharts();
};

// 刷新健康建议
const refreshSuggestions = () => {
  ElMessage.success('健康建议已更新');
};

// 初始化图表
const initCharts = () => {
  // 体温趋势图
  if (temperatureChartRef.value) {
    temperatureChart = echarts.init(temperatureChartRef.value);
    const temperatureOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value',
        name: '体温(℃)',
        min: 35,
        max: 40
      },
      series: [
        {
          name: '体温',
          type: 'line',
          data: [36.5, 36.7, 36.6, 36.8, 36.5, 36.6, 36.7],
          smooth: true,
          itemStyle: {
            color: '#F56C6C'
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
                color: 'rgba(245,108,108,0.2)'
              }, {
                offset: 1,
                color: 'rgba(245,108,108,0)'
              }]
            }
          }
        }
      ]
    };
    temperatureChart.setOption(temperatureOption);
  }

  // 心率趋势图
  if (heartRateChartRef.value) {
    heartRateChart = echarts.init(heartRateChartRef.value);
    const heartRateOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value',
        name: '心率(次/分)'
      },
      series: [
        {
          name: '心率',
          type: 'line',
          data: [75, 78, 82, 80, 77, 79, 81],
          smooth: true,
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
    heartRateChart.setOption(heartRateOption);
  }
};

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshHistory();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshHistory();
};

// 监听时间范围变化
watch(timeRange, () => {
  initCharts();
});

// 监听窗口大小变化
const handleResize = () => {
  temperatureChart?.resize();
  heartRateChart?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  temperatureChart?.dispose();
  heartRateChart?.dispose();
});
</script>

<style scoped lang="scss">
.health-assessment {
  padding: 20px;

  .overview-row {
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          font-size: 48px;
          padding: 12px;
          border-radius: 8px;

          &.normal {
            color: #409EFF;
            background-color: #ecf5ff;
          }

          &.good {
            color: #67C23A;
            background-color: #f0f9eb;
          }

          &.warning {
            color: #E6A23C;
            background-color: #fdf6ec;
          }
        }

        .stat-info {
          flex: 1;

          h3 {
            margin: 0 0 8px;
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
}