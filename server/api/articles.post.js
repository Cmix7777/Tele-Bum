import fs from 'fs'
const DB_FILE = 'articles.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const articles = fs.existsSync(DB_FILE) 
    ? JSON.parse(fs.readFileSync(DB_FILE)) 
    : []

  const article = {
    id: Date.now().toString(),
    title: body.title,
    content: body.content,
    createdAt: new Date().toISOString()
  }

  articles.push(article)
  fs.writeFileSync(DB_FILE, JSON.stringify(articles))
  
  return { id: article.id }
})