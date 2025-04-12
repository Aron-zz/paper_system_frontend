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
import { defineEmits, defineProps } from 'vue';

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

const emit = defineEmits(['change-page']);

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('change-page', newPage); // ✅ 只发这个事件
  }
};
</script>
