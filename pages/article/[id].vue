<template>
  <div>
    <h1>{{ article?.title }}</h1>
    <div v-for="block in article?.content?.blocks" :key="block.id">
      <h2 v-if="block.type === 'header'">{{ block.data.text }}</h2>
      <p v-if="block.type === 'paragraph'">{{ block.data.text }}</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const article = ref(null)

onMounted(async () => {
  article.value = await $fetch(`/api/articles/${route.params.id}`)
})
</script>