---
name: rs-angular-config-collection-backend-teste
description: "Applies REST API testing patterns with Insomnia when user asks to 'test endpoints', 'configure Insomnia', 'test backend', 'setup API collection', or 'check API routes'. Guides JWT auth flow, multipart uploads, and endpoint verification for CRUD backends. Make sure to use this skill whenever setting up or testing a Node.js backend with JWT authentication. Not for frontend implementation, Angular components, or database design."
---

# Configuracao de Collection e Teste de Endpoints

> Antes de implementar o front-end, valide todos os endpoints do back-end usando uma collection configurada no Insomnia.

## Prerequisites

- Insomnia (ou similar) instalado
- Back-end rodando em `localhost:3000`
- Collection JSON do projeto importada no Insomnia

## Endpoints e Fluxo de Autenticacao

### 1. Health Check
```
GET /
Response: 200 OK
```

### 2. Criar Usuario
```
POST /users
Body (JSON):
{
  "name": "Felipe",
  "email": "felipe@teste.com",
  "password": "12345678"
}
Response: 201 Created
```

### 3. Login (gera token JWT)
```
POST /users/login
Body (JSON):
{
  "email": "felipe@teste.com",
  "password": "12345678"
}
Response: 200 OK → { "token": "eyJhbG..." }
```

### 4. Validar Token
```
GET /users/validate-token
Header: Authorization: Bearer <token>
Response: 200 OK
```

### 5. Listar Filmes (requer token)
```
GET /movies
Header: Authorization: Bearer <token>
Response: 200 OK → lista de filmes
```

### 6. Filme por ID
```
GET /movies/:id
Header: Authorization: Bearer <token>
```

### 7. Avaliar Filme
```
POST /movies/:id/rate
Header: Authorization: Bearer <token>
Body (JSON): { "rating": 5 }
```

### 8. Criar Filme (Multipart Form)
```
POST /movies
Header: Authorization: Bearer <token>
Body (Multipart): title, description, year, genre, image (binario)
Response: 201 Created
```

### 9. Favoritos
```
GET    /favorites              → lista favoritos do usuario (via token)
POST   /favorites/:movieId     → adiciona aos favoritos
DELETE /favorites/:movieId     → remove dos favoritos (204 No Content)
```

## Regras

1. **Todo endpoint apos login exige token JWT no header** — `Authorization: Bearer <token>`, porque sem ele o back-end retorna "token nao fornecido"
2. **Use Multipart Form para upload de imagens** — nao Base64 no JSON, porque o navegador consegue fazer cache de imagens servidas como binario via URL
3. **Imagens sao servidas como arquivos estaticos** — `localhost:3000/uploads/nome-imagem.jpg`, porque facilita cache no navegador
4. **O token JWT contem informacoes do usuario** — o back-end desmembra o token para identificar qual usuario esta fazendo a requisicao (ex: listar favoritos)
5. **No front-end, use um interceptor para enviar o token automaticamente** — assim como o Insomnia faz via Auth config, o Angular fara via HTTP interceptor

## Estrutura do Back-end

```
server/
├── src/
│   ├── favorites/    # controller, service, routes
│   ├── movies/       # controller, service, routes
│   └── users/        # controller, service, routes
├── data/
│   ├── users.json
│   ├── movies.json
│   └── favorites.json    # { userId, movieIds[] }
└── public/
    └── uploads/          # imagens dos filmes (binario)
```

| Arquivo | Responsabilidade |
|---------|-----------------|
| `controller` | Requisicoes HTTP, response, orquestracao JWT |
| `service` | Logica de negocios, leitura/escrita nos JSON |
| `routes` | Definicao dos endpoints da feature |

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint retorna "token nao fornecido" | Verifique se o header Authorization esta sendo enviado |
| Login retorna "email ou senha invalidos" | Verifique credenciais no body da requisicao |
| Precisa enviar imagem | Use Multipart Form, nao JSON com Base64 |
| Precisa identificar usuario | Extraia do token JWT, nao passe userId no body |
| Quer exibir imagem no front | Use URL direta: `/uploads/nome.jpg` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Enviar imagem como Base64 no JSON | Usar Multipart Form com binario |
| Passar userId no body para favoritos | Extrair userId do token JWT no back-end |
| Hardcodar token em cada requisicao | Usar interceptor (front) ou Auth config (Insomnia) |
| Criar pasta public do server dentro do Angular | Manter separada: `server/public/` vs `angular/public/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
