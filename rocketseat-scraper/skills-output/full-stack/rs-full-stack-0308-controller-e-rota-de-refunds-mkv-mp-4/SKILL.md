---
name: rs-full-stack-0308-controller-e-rota-de-refunds
description: "Enforces Express controller and route creation patterns when building new API resources. Use when user asks to 'create a controller', 'add a route', 'create an endpoint', 'add a new resource to the API', or 'scaffold a CRUD route'. Applies patterns: class-based controllers with typed Request/Response, separate route files with Router, route composition in index with app.use, and Insomnia environment setup. Make sure to use this skill whenever adding new Express API endpoints or resources. Not for frontend routes, Next.js API routes, or Fastify handlers."
---

# Controller e Rota de Refunds

> Cada recurso da API segue a mesma estrutura: controller (classe com metodos tipados) + arquivo de rotas (Router isolado) + registro no index com prefixo.

## Rules

1. **Um controller por recurso** — crie `{recurso}-controller.ts` na pasta `controllers/`, porque isola a logica de cada dominio
2. **Controller como classe** — exporte uma classe com metodos async que recebem `(request: Request, response: Response)` tipados do Express, porque permite instanciacao e futura injecao de dependencias
3. **Um arquivo de rotas por recurso** — crie `{recurso}-routes.ts` na pasta `routes/`, porque mantem cada grupo de endpoints isolado e navegavel
4. **Use Router do Express** — instancie `Router()` no arquivo de rotas, registre os endpoints, e exporte o router, porque permite composicao no index
5. **Registre rotas no index com prefixo** — use `routes.use("/{recurso}", recursoRoutes)` no arquivo index de rotas, porque centraliza o mapeamento de prefixos
6. **Prepare para rotas privadas** — ao registrar rotas que exigem autenticacao, use `routes.use()` com middleware de auth antes do router do recurso, porque garante que apenas usuarios autenticados acessem

## Steps

### Step 1: Criar o Controller

```typescript
// src/controllers/refunds-controller.ts
import { Request, Response } from "express"

class RefundsController {
  async create(request: Request, response: Response) {
    return response.json({ message: "ok" })
  }
}

export { RefundsController }
```

### Step 2: Criar o arquivo de rotas

```typescript
// src/routes/refunds-routes.ts
import { Router } from "express"
import { RefundsController } from "../controllers/refunds-controller"

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.post("/", refundsController.create)

export { refundsRoutes }
```

### Step 3: Registrar no index de rotas

```typescript
// src/routes/index.ts
import { refundsRoutes } from "./refunds-routes"

// Rotas privadas (futuro middleware de auth aqui)
routes.use("/refunds", refundsRoutes)
```

### Step 4: Configurar Insomnia para testar

1. Criar pasta `Refunds` no Insomnia
2. Em Environment da pasta, adicionar variavel JSON: `{ "resource": "refunds" }`
3. Criar requisicao POST com URL: `{{ base_url }}/{{ resource }}`
4. Enviar e verificar resposta `{ "message": "ok" }`

## Output format

Apos aplicar este skill, o recurso tera:
```
src/
├── controllers/
│   └── refunds-controller.ts   # Classe com metodo create
├── routes/
│   ├── refunds-routes.ts       # Router com POST /
│   └── index.ts                # routes.use("/refunds", refundsRoutes)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo recurso na API | Crie controller + routes + registre no index |
| Rota precisa de autenticacao | Registre com `routes.use()` apos middleware de auth |
| Testar endpoint novo | Configure pasta + environment no Insomnia primeiro |
| Controller so tem um metodo por enquanto | Retorne `{ message: "ok" }` como placeholder |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Colocar logica de rota dentro do index | Crie arquivo separado `{recurso}-routes.ts` |
| Exportar funcoes soltas como controller | Use classe com metodos tipados |
| Registrar rotas sem prefixo de recurso | Use `routes.use("/refunds", refundsRoutes)` |
| Hardcodar URL completa no Insomnia | Use variaveis de environment `base_url` + `resource` |
| Misturar rotas publicas e privadas no mesmo bloco | Separe com comentarios e middlewares |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrutura de controllers e rotas privadas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes