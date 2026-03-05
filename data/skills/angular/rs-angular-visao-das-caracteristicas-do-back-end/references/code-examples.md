# Code Examples: Visao das Caracteristicas do Back-end

## Estrutura de pastas do backend

```
server/
├── src/                    # Codigo-fonte
│   ├── users/              # Feature: usuarios
│   │   ├── routes.ts
│   │   └── controller.ts
│   ├── movies/             # Feature: filmes
│   │   ├── routes.ts
│   │   └── controller.ts
│   ├── favorites/          # Feature: favoritos
│   │   ├── routes.ts
│   │   └── controller.ts
│   └── middlewares/
│       ├── auth.ts         # JWT validation middleware
│       └── upload.ts       # Multer upload middleware
├── data/                   # "Banco de dados" JSON
│   ├── users.json
│   ├── movies.json
│   └── favorites.json
└── public/                 # Storage de imagens
    └── uploads/
        └── *.jpg|png
```

## Endpoints completos

### Users

```typescript
// POST /users — Criar usuario
// Valida duplicidade de email, salva no JSON, retorna sem senha
app.post('/users', (req, res) => {
  const { name, email, password } = req.body
  // Verifica se email ja existe em users.json
  // Hash da senha
  // Salva no JSON
  // Retorna usuario sanitizado (sem campo password)
})

// POST /users/login — Autenticar
// Valida credenciais, gera JWT com validade 1h
app.post('/users/login', (req, res) => {
  const { email, password } = req.body
  // Busca usuario por email
  // Compara senha
  // Gera JWT com validade de 1 hora
  // Retorna { token, user } (user sem senha)
})
```

### Movies (todos requerem token)

```typescript
// GET /movies — Listar todos
// Header: Authorization: Bearer <token>
app.get('/movies', authMiddleware, (req, res) => {
  // Le movies.json e retorna array completo
})

// GET /movies/:id — Detalhe por ID
app.get('/movies/:id', authMiddleware, (req, res) => {
  // Busca filme por ID numerico em movies.json
})

// POST /movies — Cadastrar com imagem
// Content-Type: multipart/form-data
app.post('/movies', authMiddleware, uploadMiddleware, (req, res) => {
  // Multer ja processou a imagem e salvou no disco
  // Salva dados do filme + caminho relativo da imagem no JSON
})

// POST /movies/:id/rate — Avaliar (1-5)
app.post('/movies/:id/rate', authMiddleware, (req, res) => {
  const { rating } = req.body // 1-5
  // Media ponderada incremental
  // Atualiza nota media e total de votos
  // Retorna filme com valores atualizados
})
```

### Favorites (todos requerem token)

```typescript
// GET /favorites — Listar favoritos do usuario logado
app.get('/favorites', authMiddleware, (req, res) => {
  // Pega userId do token (injetado pelo middleware)
  // Busca IDs em favorites.json para este usuario
  // Join logico: cruza IDs com movies.json
  // Retorna filmes completos
})

// POST /favorites/:movieId — Adicionar
app.post('/favorites/:movieId', authMiddleware, (req, res) => {
  // Adiciona movieId ao array de favoritos do usuario
})

// DELETE /favorites/:movieId — Remover
app.delete('/favorites/:movieId', authMiddleware, (req, res) => {
  // Remove movieId do array de favoritos do usuario
})
```

## Auth Middleware pattern

```typescript
// middlewares/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: { id: number; name: string; email: string }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = decoded as AuthRequest['user'] // Injeta tipado na request
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

## Upload Middleware pattern

```typescript
// middlewares/upload.ts
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../public/uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${uuid()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images allowed.'))
  }
}

export const uploadMiddleware = multer({ storage, fileFilter }).single('image')
```

## Media ponderada incremental

```typescript
// Ao receber um novo rating para um filme
function updateRating(movie: Movie, newRating: number): Movie {
  const totalVotes = movie.totalVotes + 1
  const averageRating =
    (movie.averageRating * movie.totalVotes + newRating) / totalVotes

  return {
    ...movie,
    averageRating: Math.round(averageRating * 10) / 10,
    totalVotes
  }
}
```

## Servindo arquivos estaticos

```typescript
import express from 'express'
import path from 'path'

const app = express()

// Serve a pasta public como estatica
// Imagens acessiveis via: http://localhost:3000/uploads/nome-unico.jpg
app.use(express.static(path.resolve(__dirname, '../public')))
```

## CORS configuracao

```typescript
import cors from 'cors'

app.use(cors({
  origin: 'http://localhost:4200', // Angular dev server
  credentials: true
}))
```