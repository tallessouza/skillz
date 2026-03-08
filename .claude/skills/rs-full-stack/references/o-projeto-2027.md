---
name: rs-full-stack-o-projeto-2027
description: "Applies Q&A API project structure conventions when scaffolding Node.js/Express APIs with ORM integration. Use when user asks to 'create an API', 'scaffold a project', 'setup express routes', 'organize controllers', or 'start a CRUD project'. Enforces separation of routes, controllers, and centralized route index. Make sure to use this skill whenever generating a new REST API project structure with CRUD operations. Not for frontend, database schema design, or ORM configuration itself."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-structure
  tags: [express, api, routes, controllers, CRUD, project-structure]
---

# Estrutura de Projeto API REST com CRUD

> Organize projetos API separando rotas por dominio, controllers por recurso, e centralize rotas em um index.

## Rules

1. **Separe rotas por dominio** — um arquivo de rotas por recurso (`user-routes.ts`, `question-routes.ts`), porque facilita localizar e manter cada grupo de endpoints
2. **Separe controllers por recurso** — um arquivo de controller por entidade com funcoes nomeadas por operacao (`list`, `create`, `show`, `update`, `remove`), porque isola a logica de cada recurso
3. **Centralize rotas em um index** — crie `routes/index.ts` que importa e registra todas as rotas de dominio, porque o `server.ts` fica limpo e desacoplado
4. **Server minimo** — `server.ts` apenas inicializa o servidor e registra o router central, porque responsabilidade unica evita acoplamento
5. **Sempre rode `npm install` ao clonar** — a pasta `node_modules` nunca vai para o repositorio (esta no `.gitignore`), porque dependencias sao resolvidas localmente

## How to write

### Estrutura de pastas

```
src/
├── server.ts              # Inicializacao do servidor
├── routes/
│   ├── index.ts           # Centraliza todas as rotas
│   ├── user-routes.ts     # Rotas de usuario
│   └── question-routes.ts # Rotas de perguntas
└── controllers/
    ├── user-controller.ts     # list, create, show
    └── question-controller.ts # list, create, update, remove
```

### Controller padrao

```typescript
// question-controller.ts
export function list(req: Request, res: Response) {
  return res.json([])
}

export function create(req: Request, res: Response) {
  return res.json({})
}

export function update(req: Request, res: Response) {
  return res.json({})
}

export function remove(req: Request, res: Response) {
  return res.json({})
}
```

### Rotas por dominio

```typescript
// routes/question-routes.ts
import { Router } from "express"
import * as controller from "../controllers/question-controller"

const router = Router()

router.get("/questions", controller.list)
router.post("/questions", controller.create)
router.put("/questions/:id", controller.update)
router.delete("/questions/:id", controller.remove)

export { router as questionRoutes }
```

### Index centralizador

```typescript
// routes/index.ts
import { Router } from "express"
import { userRoutes } from "./user-routes"
import { questionRoutes } from "./question-routes"

const router = Router()

router.use(userRoutes)
router.use(questionRoutes)

export { router }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo recurso CRUD | Crie um controller + um arquivo de rotas + registre no index |
| Recurso so com leitura | Crie controller apenas com `list` e `show` |
| Projeto clonado do GitHub | Rode `npm install` antes de qualquer coisa |
| Controllers vazios (scaffold) | Retorne `res.json({})` como placeholder ate implementar a logica |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Todas as rotas em `server.ts` | Separe em arquivos por dominio em `routes/` |
| Logica de negocio dentro do arquivo de rotas | Mova para o controller correspondente |
| Commitar `node_modules` | Adicione ao `.gitignore` e rode `npm install` |
| Um unico controller gigante para todos os recursos | Um controller por recurso/entidade |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `Cannot find module '../controllers/...'` | Caminho de importacao incorreto | Verifique o caminho relativo entre routes/ e controllers/ |
| `npm install` falha ao clonar | `node_modules` nao existe no repo | Rode `npm install` — `node_modules` esta no `.gitignore` |
| Rotas nao respondem | Router nao registrado no index | Importe e use o router no `routes/index.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a separacao de responsabilidades e o uso de templates
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes