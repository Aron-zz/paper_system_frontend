<template>
  <div class="article-list">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.title">
          <td>{{ article.title }}</td>
          <td>{{ article.content }}</td>
          <td>
            <button @click="editArticle(article)">Edit</button>
            <button @click="deleteArticle(article)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  articles: Array
});

const editArticle = (article) => {
  console.log('Edit article', article);
};

const deleteArticle = (article) => {
  console.log('Delete article', article);
};
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
</style>
