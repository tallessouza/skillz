# Code Examples: Gemini API Key

## Configuracao basica no projeto Node.js

### Variavel de ambiente

```bash
# .env
GEMINI_API_KEY=AIzaSy...sua_chave_aqui
```

### Carregando a chave no codigo

```typescript
import 'dotenv/config'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is required. Get one at https://aistudio.google.com/apikey')
}
```

### Teste rapido da chave via curl

```bash
# Listar modelos disponiveis (valida a chave)
curl "https://generativelanguage.googleapis.com/v1beta/models?key=SUA_CHAVE"

# Resposta esperada: JSON com lista de modelos
# Se retornar erro 401/403: chave invalida ou projeto sem permissao
```

### Uso com o SDK do Google Generative AI

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

const result = await model.generateContent('Hello, Gemini!')
console.log(result.response.text())
```

### Seguranca: garantir que .env nao vai para o repositorio

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### Exemplo de .env.example para documentar variaveis necessarias

```bash
# .env.example (este arquivo PODE ir para o repositorio)
GEMINI_API_KEY=your_gemini_api_key_here
```