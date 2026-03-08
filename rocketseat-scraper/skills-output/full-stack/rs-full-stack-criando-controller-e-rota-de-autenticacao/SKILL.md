---
name: rs-full-stack-criando-controller-e-rota-de-autenticacao
description: "Enforces Express controller and route creation patterns when building authentication endpoints, session management, or adding new API resources. Use when user asks to 'create a controller', 'add a route', 'build login endpoint', 'implement authentication', or 'add a new API resource'. Applies patterns: class-based controllers, dedicated route files, route index aggregation, proper status codes. Make sure to use this skill whenever scaffolding new Express endpoints or organizing route/controller pairs. Not for database queries, JWT token logic, or frontend authentication flows."
---

# Criando Controller e Rota de Autenticação

> Cada recurso da API segue o padrão controller + route file + registro no index, mantendo separação clara de responsabilidades.

## Rules

1. **Retorne status codes semânticos** — use `res.status(201)` para criação bem-sucedida, porque o cliente precisa distinguir criação de leitura
2. **Um controller por recurso** — `users-controller.ts`, `sessions-controller.ts`, porque misturar recursos num controller quebra single responsibility
3. **Um arquivo de rotas por recurso** — `users-routes.ts`, `sessions-routes.ts`, porque facilita localizar e manter rotas relacionadas
4. **Agregue rotas no index** — `routes.use('/sessions', sessionsRoutes)`, porque centraliza o mapeamento de prefixos num único lugar
5. **Tipage request e response explicitamente** — `request: Request, response: Response`, porque auto-import pode puxar tipos errados de outros pacotes
6. **Cuidado com espaços em URLs** — um espaço invisível no path ou variável de ambiente quebra a rota silenciosamente, porque o Express faz match literal

## Steps

### Step 1: Criar o Controller

Crie um arquivo na pasta `controllers/` com uma classe que expõe métodos para cada ação HTTP.

```typescript
// src/controllers/sessions-controller.ts
import { Request, Response } from 'express'

class SessionsController {
  create(request: Request, response: Response) {
    return response.json({ message: 'ok' })
  }
}

export { SessionsController }
```

### Step 2: Criar o arquivo de rotas

Crie um arquivo dedicado na pasta `routes/` que instancia o controller e mapeia os métodos HTTP.

```typescript
// src/routes/sessions-routes.ts
import { Router } from 'express'
import { SessionsController } from '../controllers/sessions-controller'

const sessionsRoutes = Router()
const sessionsController = new SessionsController()

sessionsRoutes.post('/', sessionsController.create)

export { sessionsRoutes }
```

### Step 3: Registrar no index de rotas

Importe e monte as rotas no arquivo central com o prefixo do recurso.

```typescript
// src/routes/index.ts
import { sessionsRoutes } from './sessions-routes'

routes.use('/sessions', sessionsRoutes)
```

### Step 4: Testar o endpoint

Envie uma requisição POST para `{baseURL}/sessions` e verifique a resposta JSON.

## Output format

```
controllers/
  sessions-controller.ts    ← classe com método create
routes/
  sessions-routes.ts        ← Router + POST /
  index.ts                  ← routes.use('/sessions', ...)
```

## Error handling

- Se a rota retorna 404: verifique espaços invisíveis no path ou variáveis de ambiente — um espaço extra é suficiente para quebrar o roteamento
- Se o TypeScript importa tipos errados: explicite `Request, Response` do `express`, não aceite auto-import de outros pacotes

## Heuristics

| Situação | Faça |
|----------|------|
| Novo recurso na API | Crie controller + route file + registre no index |
| Endpoint retorna dados criados | Use `res.status(201).json(...)` |
| Rota não funciona sem erro | Verifique espaços invisíveis no path |
| Controller crescendo demais | Separe em controllers por recurso |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Colocar rotas de sessão no users-controller | Criar sessions-controller dedicado |
| `response.json()` sem status em criação | `response.status(201).json()` |
| Digitar paths manualmente com risco de espaço | Usar variáveis e verificar whitespace |
| Importar Request/Response sem especificar origem | `import { Request, Response } from 'express'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação controller/rota e debugging de URLs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações