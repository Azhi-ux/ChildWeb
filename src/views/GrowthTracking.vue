<template>
  <div class="growth-tracking">
    <!-- 成长数据录入 -->
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>记录成长数据</span>
          <el-button type="primary" @click="handleSaveRecord">
            保存记录
          </el-button>
        </div>
      </template>
      <el-form :model="recordForm" :rules="rules" ref="recordFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="测量日期" prop="date">
              <el-date-picker
                v-model="recordForm.date"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身高(cm)" prop="height">
              <el-input-number
                v-model="recordForm.height"
                :precision="1"
                :step="0.1"
                :min="0"
                :max="200"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体重(kg)" prop="weight">
              <el-input-number
                v-model="recordForm.weight"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="recordForm.notes"
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 成长趋势图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>身高趋势</span>
              <el-radio-group v-model="heightChartType" size="small">
                <el-radio-button label="line">折线图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="heightChartRef" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>体重趋势</span>
              <el-radio-group v-model="weightChartType" size="small">
                <el-radio-button label="line">折线图</el-radio-button>
                <el-radio-button label="bar">柱状图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="weightChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 历史记录表格 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span>历史记录</span>
          <div class="header-actions">
            <el-button type="primary" size="small" @click="exportData">
              导出数据
            </el-button>
            <el-button type="success" size="small" @click="refreshData">
              刷新
            </el-button>
          </div>
        </div>
      </template>
      <el-table :data="historyRecords" style="width: 100%" border stripe>
        <el-table-column prop="date" label="日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.date) }}
          </template>
        </el-table-column>
        <el-table-column prop="height" label="身高(cm)" width="120" />
        <el-table-column prop="weight" label="体重(kg)" width="120" />
        <el-table-column prop="bmi" label="BMI" width="120">
          <template #default="{ row }">
            {{ calculateBMI(row.height, row.weight) }}
          </template>
        </el-table-column>
        <el-table-column prop="heightPercentile" label="身高百分位" width="120" />
        <el-table-column prop="weightPercentile" label="体重百分位" width="120" />
        <el-table-column prop="notes" label="备注" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editRecord(row)">
              编辑
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

    <!-- 成长评估 -->
    <el-card class="assessment-card">
      <template #header>
        <div class="card-header">
          <span>成长评估</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="metric in growthMetrics" :key="metric.name">
          <div class="metric-card">
            <div class="metric-icon" :class="metric.status">
              <el-icon>
                <component :is="metric.icon" />
              </el-icon>
            </div>
            <div class="metric-content">
              <h4>{{ metric.name }}</h4>
              <p>{{ metric.value }}</p>
              <div class="metric-status" :class="metric.status">
                {{ metric.description }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { FormInstance } from 'element-plus';
import {
  TrendCharts,
  Histogram,
  Scale
} from '@element-plus/icons-vue';

// 表单数据
const recordFormRef = ref<FormInstance>();
const recordForm = reactive({
  date: new Date(),
  height: 0,
  weight: 0,
  notes: ''
});

// 表单验证规则
const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }]
};

// 图表相关
const heightChartRef = ref<HTMLElement>();
const weightChartRef = ref<HTMLElement>();
const heightChartType = ref('line');
const weightChartType = ref('line');
let heightChart: echarts.ECharts | null = null;
let weightChart: echarts.ECharts | null = null;

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 历史记录数据
const historyRecords = ref([
  {
    date: '2024-02-01',
    height: 120,
    weight: 25,
    heightPercentile: '75th',
    weightPercentile: '60th',
    notes: '正常体检记录'
  },
  {
    date: '2024-01-01',
    height: 119,
    weight: 24.5,
    heightPercentile: '73th',
    weightPercentile: '58th',
    notes: '春季体检'
  }
]);

// 成长评估指标
const growthMetrics = ref([
  {
    name: '身高发育',
    value: '75th 百分位',
    description: '身高发育正常',
    status: 'normal',
    icon: 'TrendCharts'
  },
  {
    name: '体重发育',
    value: '60th 百分位',
    description: '体重适中',
    status: 'normal',
    icon: 'Scale'
  },
  {
    name: 'BMI指数',
    value: '18.5',
    description: '体重正常范围',
    status: 'good',
    icon: 'Histogram'
  }
]);

// 保存记录
const handleSaveRecord = async () => {
  if (!recordFormRef.value) return;
  
  await recordFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('记录保存成功');
      refreshData();
    }
  });
};

// 计算BMI
const calculateBMI = (height: number, weight: number) => {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

// 格式化日期
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出成功');
};

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已更新');
  initCharts();
};

// 编辑记录
const editRecord = (row: any) => {
  recordForm.date = new Date(row.date);
  recordForm.height = row.height;
  recordForm.weight = row.weight;
  recordForm.notes = row.notes;
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
    refreshData();
  });
};

// 初始化图表
const initCharts = () => {
  // 身高趋势图
  if (heightChartRef.value) {
    heightChart = echarts.init(heightChartRef.value);
    const heightOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        name: '身高(cm)'
      },
      series: [
        {
          name: '身高',
          type: heightChartType.value,
          data: [115, 116, 117, 118, 119, 120],
          itemStyle: {
            color: '#409EFF'
          }
        }
      ]
    };
    heightChart.setOption(heightOption);
  }

  // 体重趋势图
  if (weightChartRef.value) {
    weightChart = echarts.init(weightChartRef.value);
    const weightOption = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value',
        name: '体重(kg)'
      },
      series: [
        {
          name: '体重',
          type: weightChartType.value,
          data: [22, 22.5, 23, 23.5, 24, 24.5],
          itemStyle: {
            color: '#67C23A'
          }
        }
      ]
    };
    weightChart.setOption(weightOption);
  }
};

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  refreshData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  refreshData();
};

// 监听图表类型变化
watch([heightChartType, weightChartType], () => {
  initCharts();
});

// 监听窗口大小变化
const handleResize = () => {
  heightChart?.resize();
  weightChart?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  heightChart?.dispose();
  weightChart?.dispose();
});
</script>

<style scoped lang="scss">
.growth-tracking {
  padding: 20px;

  .input-card,
  .chart-card,
  .history-card,
  .assessment-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .chart-row {
    .chart {
      height: 300px;
    }
  }

  .history-card {
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .metric-card {
    background-color: #f5f7fa;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;

      &.normal {
        background-color: #e1f3ff;
        color: #409EFF;
      }

      &.good {
        background-color: #e1f3d8;
        color: #67C23A;
      }

      &.warning {
        background-color: #fdf6ec;
        color: #E6A23C;
      }
    }

    .metric-content {
      flex: 1;

      h4 {
        margin: 0 0 8px;
        font-size: 16px;
        color: #303133;
      }

      p {
        margin: 0 0 8px;
        font-size: 20px;
        font-weight: bold;
        color: #303133;
      }

      .metric-status {
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 4px;
        display: inline-block;

        &.normal {
          background-color: #e1f3ff;
          color: #409EFF;
        }

        &.good {
          background-color: #e1f3d8;
          color: #67C23A;
        }

        &.warning {
          background-color: #fdf6ec;
          color: #E6A23C;
        }
      }
    }
  }
}
</style>