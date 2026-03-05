# Code Examples: Criando API com JSON Server

## Exemplo completo do server.json da aula

O instrutor usou dados de um player de cursos com modulos e aulas:

```json
{
  "courses": [
    {
      "id": 1,
      "title": "Fundamentos do Redux",
      "modules": [
        {
          "id": 1,
          "title": "Iniciando com Redux",
          "lessons": [
            {
              "id": "1",
              "title": "Criando o projeto",
              "duration": "09:45"
            },
            {
              "id": "2",
              "title": "Configurando o store",
              "duration": "12:30"
            }
          ]
        },
        {
          "id": 2,
          "title": "Usando Redux Toolkit",
          "lessons": [
            {
              "id": "3",
              "title": "Criando slices",
              "duration": "08:15"
            }
          ]
        }
      ]
    }
  ]
}
```

## Script no package.json

```json
{
  "scripts": {
    "dev": "vite",
    "server": "json-server -w server.json -d 500"
  }
}
```

### Flags explicadas

- `-w` (watch): reinicia o servidor quando `server.json` e modificado
- `-d 500` (delay): adiciona 500ms de latencia em todas as respostas

## Cliente Axios centralizado

```typescript
// src/lib/axios.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000',
})
```

### Uso em componentes ou stores

```typescript
import { api } from '../lib/axios'

// Buscar todos os cursos
const response = await api.get('/courses')
const courses = response.data

// Buscar curso especifico
const response = await api.get('/courses/1')
const course = response.data
```

## Verificacao da API no navegador

Apos rodar `npm run server`, acesse no navegador:

```
http://localhost:3000/courses
```

O json-server retorna automaticamente os dados do array `courses` do `server.json` como uma API REST completa com suporte a:

- `GET /courses` — listar todos
- `GET /courses/1` — buscar por id
- `POST /courses` — criar
- `PUT /courses/1` — atualizar
- `DELETE /courses/1` — deletar

## Estrutura de pastas resultante

```
projeto/
├── src/
│   └── lib/
│       └── axios.ts        # Cliente HTTP centralizado
├── server.json              # Dados da API fake
├── package.json             # Script "server" adicionado
└── ...
```