<template>
  <div class="article-list">
    <div class="list-header">
      <el-button type="primary" @click="$emit('add')" :loading="loading">
        Add Article
      </el-button>
    </div>
    
    <el-table :data="articles" v-loading="loading" style="width: 100%"  scrollbar-always-on="true" :fit="true">
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="status" label="Status" >
        <template #default="{row}">
          <el-tag :type="statusTagType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Created"  />
      <el-table-column prop="updatedAt" label="Updated"  />
      <el-table-column label="Actions"  align="center">
        <template #default="{row}">
          <el-button size="small" @click="$emit('edit', row)">Edit</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="$emit('delete', row.id)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  articles: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'edit', 'delete'])

const statusTagType = (status) => {
  switch (status) {
    case 'published': return 'success'
    case 'draft': return 'warning'
    case 'archived': return 'info'
    default: return ''
  }
}
</script>

<style scoped>
.list-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;

}
</style>