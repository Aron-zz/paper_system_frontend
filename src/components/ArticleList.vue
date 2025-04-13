<template>
  <div class="article-list">
    <!-- 新增论文按钮 -->
    <button @click="openAddArticleModal">Add Paper</button>

    <!-- 搜索框 -->
    <div>
      <input v-model="searchQuery" @input="searchArticles" placeholder="Search by title" />
    </div>

    <!-- 论文列表 -->
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in filteredArticles" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.paperAbstract }}</td>
          <td>
            <button @click="editArticle(article)">Edit</button>
            <button @click="deleteArticle(article.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 编辑弹窗 -->
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <h3>Edit Article</h3>
        <label for="title">Title:</label>
        <input type="text" v-model="currentArticle.title" id="title" />

        <label for="paperAbstract">Content:</label>
        <textarea v-model="currentArticle.paperAbstract" id="paperAbstract"></textarea>

        <button @click="saveArticle">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
    </div>

    <!-- 新增论文弹窗 -->
    <div v-if="isAdding" class="modal">
      <div class="modal-content">
        <h3>Add New Paper</h3>
        <label for="newTitle">Title:</label>
        <input type="text" v-model="newArticle.title" id="newTitle" />

        <label for="newAbstract">Content:</label>
        <textarea v-model="newArticle.paperAbstract" id="newAbstract"></textarea>

        <button @click="addArticle">Add Paper</button>
        <button @click="cancelAdd">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  articles: Array,
});

const emit = defineEmits(['edit', 'delete', 'add']);  // 使用 emit 注册事件

const isEditing = ref(false);
const isAdding = ref(false); // 控制新增论文弹窗
const currentArticle = ref({});
const newArticle = ref({
  title: '',
  paperAbstract: '',
}); // 新增论文的初始数据

const searchQuery = ref('');
const filteredArticles = ref(props.articles);

// 打开新增论文弹窗
const openAddArticleModal = () => {
  isAdding.value = true;
};

// 关闭新增论文弹窗
const cancelAdd = () => {
  isAdding.value = false;
  newArticle.value = { title: '', paperAbstract: '' };
};

// 提交新增论文
const addArticle = () => {
  emit('add', newArticle.value);  // 通知父组件
  isAdding.value = false;
  newArticle.value = { title: '', paperAbstract: '' };
};

// 编辑论文
const editArticle = (article) => {
  currentArticle.value = { ...article };
  isEditing.value = true;
};

// 保存编辑的论文
const saveArticle = () => {
  emit('edit', currentArticle.value);  // 通知父组件
  isEditing.value = false;
};

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false;
};

// 删除论文
const deleteArticle = (articleId) => {
  emit('delete', articleId);  // 通知父组件
};

// 模糊搜索论文
const searchArticles = () => {
  filteredArticles.value = props.articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

// 监听 articles 变化，确保 search 不会丢失
watch(() => props.articles, () => {
  searchArticles();
}, { immediate: true });
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button.cancel {
  background-color: #f44336;
  margin-left: 10px;
}

button.cancel:hover {
  background-color: #e53935;
}
</style>
