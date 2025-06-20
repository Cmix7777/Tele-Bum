<template>
  <div class="editor-page">
    <h1>Tele-Bum</h1>
    <input v-model="title" placeholder="Заголовок статьи" class="title-input">
    
    <!-- Обертка для редактора -->
    <div v-if="mounted">
      <div id="editorjs" ref="editorElement"></div>
    </div>
    
    <button @click="saveArticle" :disabled="isSaving">
      {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
    </button>
    
    <div v-if="articleUrl" class="article-link">
      Ссылка: <NuxtLink :to="`/article/${articleUrl}`">{{ articleUrl }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = ref('')
const articleUrl = ref('')
const isSaving = ref(false)
const mounted = ref(false)
const editorElement = ref(null)
let editor = null

// Импортируем Editor.js только на клиенте
onMounted(async () => {
  mounted.value = true
  
  const EditorJS = (await import('@editorjs/editorjs')).default
  const Header = (await import('@editorjs/header')).default
  const Paragraph = (await import('@editorjs/paragraph')).default
  
  editor = new EditorJS({
    holder: editorElement.value,
    tools: {
      header: Header,
      paragraph: Paragraph
    },
    placeholder: 'Начните писать здесь...'
  })
})

const saveArticle = async () => {
  if (!editor || !title.value.trim()) return
  
  isSaving.value = true
  try {
    const content = await editor.save()
    const { id } = await $fetch('/api/articles', {
      method: 'POST',
      body: { title: title.value, content }
    })
    articleUrl.value = id
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<style>
.title-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 18px;
}

#editorjs {
  border: 1px solid #ddd;
  padding: 20px;
  min-height: 300px;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.article-link {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
}
</style>