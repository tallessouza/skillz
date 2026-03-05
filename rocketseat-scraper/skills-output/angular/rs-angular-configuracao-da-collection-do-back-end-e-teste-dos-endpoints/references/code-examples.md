# Code Examples: Configuracao de Collection e Teste de Endpoints

## Exemplo completo de cada endpoint

### Health Check
```
GET http://localhost:3000/
Response: 200 OK
Body: (confirmacao que servidor esta rodando)
```

### Criar Usuario
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Felipe",
  "email": "felipe@teste.com",
  "password": "12345678"
}

Response: 201 Created
```

### Login
```
POST http://localhost:3000/users/login
Content-Type: application/json

{
  "email": "felipe@teste.com",
  "password": "12345678"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validar Token
```
GET http://localhost:3000/users/validate-token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response: 200 OK
```

### Listar Filmes
```
GET http://localhost:3000/movies
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "1",
    "title": "Nome do Filme",
    "description": "Descricao do filme",
    "imagePath": "nome-imagem.jpg",
    "voteAverage": 7.5,
    "voteCount": 106
  },
  ...
]
```

### Filme por ID
```
GET http://localhost:3000/movies/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "1",
  "title": "Nome do Filme",
  "description": "...",
  "imagePath": "...",
  "voteAverage": 7.5,
  "voteCount": 106
}
```

### Avaliar Filme
```
POST http://localhost:3000/movies/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}

Response: 200 OK
(retorna filme atualizado com voteCount incrementado e voteAverage recalculado)
```

### Criar Filme (Multipart)
```
POST http://localhost:3000/movies
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields:
  title: "Teste"
  description: "Descricao do filme"
  year: "2024"
  genre: "Acao"
  image: [arquivo.jpg]

Response: 201 Created
{
  "id": "novo-id",
  "title": "Teste",
  ...
}
```

### Listar Favoritos
```
GET http://localhost:3000/favorites
Authorization: Bearer <token>

Response: 200 OK
[] (vazio se nenhum favorito)
ou
[{ "id": "1", "title": "...", ... }]
```

### Adicionar Favorito
```
POST http://localhost:3000/favorites/:movieId
Authorization: Bearer <token>

Response: 200 OK
"Filme adicionado aos favoritos"
```

### Remover Favorito
```
DELETE http://localhost:3000/favorites/:movieId
Authorization: Bearer <token>

Response: 204 No Content
(sem body no response)
```

## Acessar imagem do filme via URL
```
GET http://localhost:3000/uploads/nome-da-imagem.jpg

Response: 200 OK (binario da imagem)
```

## Estrutura de arquivos do back-end

```typescript
// users/user.routes.ts
// Define os endpoints de usuarios
router.post('/', userController.create)
router.post('/login', userController.login)
router.get('/validate-token', userController.validateToken)

// users/user.controller.ts
// Recebe request HTTP, orquestra JWT, envia response
// Responsabilidade: HTTP + JWT

// users/user.service.ts
// Logica de negocios: buscar usuario, criar usuario
// Acessa users.json para leitura/escrita
```

## Estrutura dos dados JSON

```json
// data/users.json
[
  {
    "id": "uuid",
    "name": "Felipe",
    "email": "felipe@teste.com",
    "password": "hash..."
  }
]

// data/movies.json
[
  {
    "id": "uuid",
    "title": "Filme X",
    "description": "...",
    "imagePath": "imagem.jpg",
    "voteAverage": 7.5,
    "voteCount": 106,
    "year": "2024",
    "genre": "Acao"
  }
]

// data/favorites.json
[
  {
    "userId": "uuid-do-usuario",
    "movieIds": ["movie-id-1", "movie-id-2"]
  }
]
```