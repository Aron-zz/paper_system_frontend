<template>
    <el-form 
      :model="form" 
      label-width="120px" 
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      
      <el-form-item label="Content" prop="content">
        <el-input 
          v-model="form.content" 
          type="textarea" 
          :rows="5" 
        />
      </el-form-item>
      
      <el-form-item label="Status" prop="status">
        <el-select v-model="form.status" placeholder="Select status">
          <el-option label="Draft" value="draft" />
          <el-option label="Published" value="published" />
          <el-option label="Archived" value="archived" />
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="$emit('cancel')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { ref, reactive, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps({
    article: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['submit', 'cancel'])
  
  const formRef = ref(null)
  const form = reactive({
    id: props.article.id || null,
    title: props.article.title || '',
    content: props.article.content || '',
    status: props.article.status || 'draft'
  })
  
  const rules = reactive({
    title: [
      { required: true, message: 'Please input title', trigger: 'blur' },
      { min: 3, message: 'Title must be at least 3 characters', trigger: 'blur' }
    ],
    content: [
      { required: true, message: 'Please input content', trigger: 'blur' }
    ],
    status: [
      { required: true, message: 'Please select status', trigger: 'change' }
    ]
  })
  
  watch(() => props.article, (newVal) => {
    Object.assign(form, {
      id: newVal.id || null,
      title: newVal.title || '',
      content: newVal.content || '',
      status: newVal.status || 'draft'
    })
  }, { immediate: true })
  
  const submitForm = async () => {
    try {
      await formRef.value.validate()
      emit('submit', form)
    } catch (err) {
      ElMessage.error('Please fill in all required fields correctly')
    }
  }
  </script>