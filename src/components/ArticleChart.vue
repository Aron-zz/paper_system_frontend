<template>
  <div class="article-chart">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// 注册所有必要的模块
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const canvasRef = ref(null);

onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      const ctx = canvasRef.value.getContext('2d');
      if (ctx) {
        new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: props.data.map(item => item.label),
            datasets: [{
              label: 'Articles',
              data: props.data.map(item => item.value),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } else {
        console.error('Canvas context not available.');
      }
    } else {
      console.error('Canvas element not found.');
    }
  });
});
</script>

<style scoped>
.article-chart {
  width: 100%;
  height: 400px;
}
</style>
