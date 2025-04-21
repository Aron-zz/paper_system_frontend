<template>
  <div class="article-chart" v-if="shouldRender">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import ChartJS from 'chart.js/auto';  // 确保正确引入 Chart.js

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const canvasRef = ref(null);
let chartInstance = null;

// 新增计算属性控制渲染条件
const shouldRender = computed(() => props.data.length > 0);

// 渲染图表
const renderChart = () => {
  if (!canvasRef.value?.getContext) {
    console.error('Canvas 不可用', {
      element: canvasRef.value,
      isConnected: canvasRef.value?.isConnected
    });
    return;
  }

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  // 如果已有实例，先销毁再重建
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new ChartJS(ctx, {
  type: 'bar',
  data: {
    labels: props.data.map(item => item.label),
    datasets: [{
      label: 'Articles',
      data: props.data.map(item => item.value),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        ticks: {
          align: 'center'
        },
        grid: {
          offset: true
        }
      },
      y: {
        beginAtZero: true
      }
    }
  }
});

};

// 优化渲染触发逻辑
watch(() => props.data, (newVal) => {
  if (newVal.length) {
    nextTick(() => {
      if (canvasRef.value) renderChart(); // 只有在 canvas 元素存在时才渲染
    });
  }
}, { immediate: true });

// 初始化加载图表
onMounted(() => {
  if (props.data.length) {
    nextTick(renderChart);
  }
});
</script>

<style scoped>
.article-chart {
  width: 100%;
  height: 400px;
}


</style>
