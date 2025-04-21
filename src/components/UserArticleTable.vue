<template>
  <div>
    <el-table
      :data="currentPageUsers"
      style="width: 100%"
      v-loading="loading"
      @row-click="handleRowClick"
    >
      <el-table-column prop="username" label="Username" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="paperCount" label="Articles" width="100" sortable />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button
            size="small"
            type="primary"
            @click.stop="selectUser(row)"
          >
            View Articles
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="users.length"
      layout="prev, pager, next, sizes"
      :page-sizes="[5, 10, 20, 50]"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { users, loading } = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-user', 'page-change', 'update-visible-users']) // ✅ 多加了一个 'update-visible-users'

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

const currentPageUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return users.slice(start, end)
})

// ✅ 监听当前页用户变化，emit给外面
watch(currentPageUsers, (newVal) => {
  emit('update-visible-users', newVal)
}, { immediate: true })

const selectUser = (user) => {
  emit('select-user', user)
}

const handleRowClick = (row) => {
  selectUser(row)
}

const handlePageChange = (page) => {
  currentPage.value = page
  emit('page-change', { currentPage: page, pageSize: pageSize.value })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  emit('page-change', { currentPage: 1, pageSize: size })
}
</script>

<style scoped>
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>
