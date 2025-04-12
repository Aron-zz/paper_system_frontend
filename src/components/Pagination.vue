<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)">
      Previous
    </button>

    <span>Page {{ currentPage }} of {{ totalPages }}</span>

    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)">
      Next
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

// 接收父组件传递的分页数据
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

// 定义 emit 事件
const emit = defineEmits();

// 触发父组件的方法来更新当前页码
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('update:currentPage', newPage);  // 更新当前页码
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

button:disabled {
  opacity: 0.5;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

span {
  font-weight: bold;
}
</style>
