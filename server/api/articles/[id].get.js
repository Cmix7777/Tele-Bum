import fs from 'fs'
const DB_FILE = 'articles.json'

export default defineEventHandler((event) => {
  const articles = JSON.parse(fs.readFileSync(DB_FILE))
  return articles.find(a => a.id === event.context.params.id)
})