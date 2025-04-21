<template>
  <div class="contact-management">
    <!-- 查询栏 -->
    <el-card class="search-bar">
      <el-input
        v-model="searchName"
        placeholder="Search by name"
        clearable
        @input="handleSearchInput"
        style="width: 300px; margin-right: 20px"
      />
      <el-button type="primary" @click="addContact">Add Contact</el-button>
    </el-card>

    <!-- 联系人列表 -->
    <el-card class="contact-list">
      <el-table :data="pagedContacts" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="phone" label="Phone" width="180" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="relationship" label="Relationship" />
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button size="small" @click="editContact(scope.row)">Edit</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteContact(scope.row.id)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="totalContacts"
      :page-sizes="[5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      style="margin-top: 20px; text-align: center;"
    />

    <!-- 弹出窗口 - 编辑/添加联系人 -->
    <el-dialog
      v-model="isModalOpen"
      :title="isEditing ? 'Edit Contact' : 'Add Contact'"
      width="500px"
    >
      <el-form 
        :model="currentContact" 
        label-width="100px"
        ref="contactForm"
        :rules="formRules"
      >
        <el-form-item label="Name" prop="name" required>
          <el-input v-model="currentContact.name" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="currentContact.phone" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="currentContact.email" type="email" />
        </el-form-item>
        <el-form-item label="Relationship" prop="relationship">
          <el-input v-model="currentContact.relationship" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeModal">Cancel</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEditing ? 'Update' : 'Add' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api/index.js'

// 状态管理
const searchName = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const isModalOpen = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const contacts = ref([])
const totalContacts = ref(0)
const contactForm = ref(null)

const currentContact = ref({
  id: '',
  userId: '',
  name: '',
  phone: '',
  email: '',
  relationship: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: 'Please input name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^[0-9+\- ]+$/, message: 'Please input valid phone number', trigger: 'blur' }
  ]
}

const userId = localStorage.getItem('id')

// 计算属性：分页数据
const pagedContacts = computed(() => {
  return contacts.value
})

// 获取联系人列表
const getContacts = async () => {
  isLoading.value = true
  try {
    const response = await api.getContactsByUserId(
      userId,
      currentPage.value,
      pageSize.value
    )
    contacts.value = response.records || []
    totalContacts.value = response.total || 0
  } catch (error) {
    ElMessage.error('Error fetching contacts')
    console.error('Error fetching contacts:', error)
  } finally {
    isLoading.value = false
  }
}

// 搜索联系人
const searchContact = async () => {
  isLoading.value = true
  try {
    const response = await api.searchContactsByName(
      userId,
      searchName.value,
      currentPage.value,
      pageSize.value
    )
    contacts.value = response.records || []
    totalContacts.value = response.total || 0
  } catch (error) {
    ElMessage.error('Search failed')
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

// 搜索输入处理（防抖）
let searchTimer = null
const handleSearchInput = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    if (searchName.value.trim()) {
      searchContact()
    } else {
      getContacts()
    }
  }, 500)
}

// 删除联系人
const deleteContact = async (id) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure to delete this contact?',
      'Warning',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    await api.deleteContact(id)
    ElMessage.success('Contact deleted')
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
      console.error('Error deleting contact:', error)
    }
  }
}

// 分页处理
const handlePageChange = (val) => {
  currentPage.value = val
  loadData()
}

// 每页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadData()
}

// 打开编辑/添加窗口
const editContact = (contact) => {
  currentContact.value = { ...contact }
  isEditing.value = true
  isModalOpen.value = true
}

const addContact = () => {
  currentContact.value = {
    id: '',
    userId: userId,
    name: '',
    phone: '',
    email: '',
    relationship: ''
  }
  isEditing.value = false
  isModalOpen.value = true
}

// 关闭弹出窗口
const closeModal = () => {
  contactForm.value?.resetFields()
  isModalOpen.value = false
}

// 提交表单验证
const submitForm = async () => {
  try {
    await contactForm.value.validate()
    await handleSubmit()
  } catch (error) {
    console.log('Form validation failed', error)
  }
}

// 提交表单数据
const handleSubmit = async () => {
  try {
    const contactData = { ...currentContact.value }
    
    if (isEditing.value) {
      await api.updateContact(contactData)
      ElMessage.success('Contact updated')
    } else {
      delete contactData.id
      await api.addContact(contactData)
      ElMessage.success('Contact added')
    }
    
    closeModal()
    await loadData()
  } catch (error) {
    ElMessage.error('Operation failed')
    console.error('Error submitting contact:', error)
  }
}

// 统一数据加载方法
const loadData = async () => {
  if (searchName.value.trim()) {
    await searchContact()
  } else {
    await getContacts()
  }
}

// 初始化数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.contact-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.contact-list {
  margin-bottom: 20px;
}

.el-pagination {
  justify-content: center;
  margin-top: 20px;
}


</style>