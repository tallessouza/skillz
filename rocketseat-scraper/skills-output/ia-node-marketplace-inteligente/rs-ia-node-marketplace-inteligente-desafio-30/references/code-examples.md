# Code Examples: Enriquecimento de Base de Conhecimento para Chat AI

## Exemplo 1: Extracao de Texto de PDF

```typescript
import pdfParse from 'pdf-parse'

async function extractTextFromPDF(file: Buffer): Promise<string> {
  const result = await pdfParse(file)
  return result.text
}
```

## Exemplo 2: Rota de Upload de Receita (Node.js + Fastify)

```typescript
app.post('/recipes', async (request, reply) => {
  const { text, pdf } = request.body

  let recipeText: string

  if (pdf) {
    const buffer = Buffer.from(pdf, 'base64')
    recipeText = await extractTextFromPDF(buffer)
  } else if (text) {
    recipeText = text
  } else {
    return reply.status(400).send({ error: 'Provide text or PDF' })
  }

  await saveRecipe(recipeText)
  return reply.status(201).send({ message: 'Recipe added' })
})
```

## Exemplo 3: Abordagem Inline (Prompt Concatenado)

```typescript
import { openai } from './lib/openai'

async function chatWithRecipes(userMessage: string, userId: string) {
  const recipes = await getRecipesByUser(userId)
  const recipesContext = recipes.map(r => r.text).join('\n---\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `Voce é um assistente de marketplace inteligente.
O usuario tem as seguintes receitas salvas:

${recipesContext}

Use essas receitas para enriquecer suas respostas.`
      },
      { role: 'user', content: userMessage }
    ]
  })

  return response.choices[0].message.content
}
```

## Exemplo 4: Abordagem com Vector Store (OpenAI)

```typescript
import { openai } from './lib/openai'

// Ingestao: criar embedding e salvar
async function addRecipeToVectorStore(text: string, vectorStoreId: string) {
  // OpenAI Vector Store: upload como file
  const file = await openai.files.create({
    file: new Blob([text], { type: 'text/plain' }),
    purpose: 'assistants'
  })

  await openai.vectorStores.files.create(vectorStoreId, {
    file_id: file.id
  })
}

// Chat: usar assistant com vector store
async function chatWithVectorStore(userMessage: string, assistantId: string, threadId: string) {
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: userMessage
  })

  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId
  })

  const messages = await openai.beta.threads.messages.list(threadId)
  return messages.data[0].content[0].text.value
}
```

## Exemplo 5: Abordagem Hibrida (Decide Rota por Volume)

```typescript
const INLINE_TOKEN_THRESHOLD = 4000

async function getRecipeContext(userId: string, query: string): Promise<string> {
  const recipes = await getRecipesByUser(userId)
  const totalTokens = recipes.reduce((sum, r) => sum + estimateTokens(r.text), 0)

  if (totalTokens < INLINE_TOKEN_THRESHOLD) {
    // Inline: manda tudo junto
    return recipes.map(r => r.text).join('\n---\n')
  }

  // Vector search: busca apenas relevantes
  const relevant = await vectorSearch(query, userId, { topK: 3 })
  return relevant.map(r => r.text).join('\n---\n')
}
```

## Exemplo 6: Frontend - Formulario de Upload

```typescript
// Componente que aceita PDF ou texto
function RecipeUpload() {
  const [text, setText] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await api.post('/recipes', { text })
    setText('')
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('pdf', file)
    await api.post('/recipes/upload', formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Digite sua receita..." />
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      <button type="submit">Adicionar Receita</button>
    </form>
  )
}
```