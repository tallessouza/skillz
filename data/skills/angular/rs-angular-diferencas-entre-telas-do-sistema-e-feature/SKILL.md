---
name: rs-angular-feature-vs-tela
description: "Enforces feature-based folder organization by business domain instead of by screen/page when structuring Angular projects. Use when user asks to 'organize project', 'create folder structure', 'add a new page', 'structure components', or 'setup Angular app'. Applies domain-driven grouping: features are business domains, not individual screens. Make sure to use this skill whenever creating or restructuring Angular project folders. Not for routing configuration, state management, or backend architecture."
---

# Feature vs Tela — Organização por Domínio

> Organize componentes por domínio de negócio (feature), não por tela individual.

## Rules

1. **Uma feature é um domínio de negócio, não uma tela** — "Produtos" é a feature, não "Tela de Listagem" ou "Tela de Edição", porque o negócio gerencia produtos, não telas
2. **Telas são sub-recursos dentro do domínio** — list, edit, create são sub-recursos de `products/`, porque pertencem ao mesmo contexto de negócio
3. **Services ficam dentro do domínio** — `products/data/products-api.service.ts` fica dentro da feature, porque serve apenas aquele domínio
4. **Shared fica separado de features** — componentes reutilizáveis entre domínios vão em `shared/`, porque não pertencem a um único domínio
5. **Core contém funcionalidades fundamentais** — guards, interceptors, layouts vão em `core/`, porque são infraestrutura da aplicação
6. **Pergunte "o que o negócio gerencia?"** — a resposta define suas features, porque o código deve refletir o domínio, não a interface

## How to write

### Estrutura de pastas por domínio

```
app/
├── feature/
│   └── products/              # Domínio = Feature
│       ├── list/              # Sub-recurso (tela)
│       │   ├── list.component.ts
│       │   ├── list.component.html
│       │   └── list.component.css
│       ├── edit/              # Sub-recurso (tela)
│       ├── create/            # Sub-recurso (tela)
│       ├── data/              # Lógica de dados do domínio
│       │   └── products-api.service.ts
│       └── products.component.ts  # Container opcional
├── shared/                    # Componentes reutilizáveis
│   └── button/
└── core/                      # Infraestrutura da app
```

### Identificando features

```
Pergunta: "O que a área de negócio gerencia neste sistema?"
Resposta: "Produtos" → feature/products/
Resposta: "Usuários" → feature/users/
Resposta: "Pedidos" → feature/orders/

NÃO: "Tela de login" → isso é sub-recurso de auth/
NÃO: "Tela de listagem" → isso é sub-recurso de um domínio
```

## Example

**Before (organização por tipo/tela):**
```
app/
├── components/
│   ├── product-list.component.ts
│   ├── product-edit.component.ts
│   ├── product-create.component.ts
│   └── login.component.ts
├── services/
│   ├── products.service.ts
│   └── auth.service.ts
└── pipes/
    └── currency.pipe.ts
```

**After (organização por domínio/feature):**
```
app/
├── feature/
│   ├── products/
│   │   ├── list/
│   │   ├── edit/
│   │   ├── create/
│   │   └── data/
│   │       └── products-api.service.ts
│   └── auth/
│       ├── login/
│       └── data/
│           └── auth-api.service.ts
├── shared/
│   └── currency.pipe.ts
└── core/
```

## Heuristics

| Situação | Faça |
|----------|------|
| Nova tela de CRUD | Crie sub-recurso dentro da feature existente |
| Novo domínio de negócio | Crie nova pasta em `feature/` |
| Service usado por 1 domínio | Coloque em `feature/{dominio}/data/` |
| Service usado por N domínios | Coloque em `shared/` ou `core/` |
| Componente visual reutilizável | Coloque em `shared/` |
| Dúvida se é feature ou tela | Pergunte: "o negócio gerencia isso?" |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `components/product-list.component.ts` | `feature/products/list/list.component.ts` |
| `services/products.service.ts` (pasta global) | `feature/products/data/products-api.service.ts` |
| Uma feature por tela (`feature/product-list/`) | Uma feature por domínio (`feature/products/list/`) |
| Misturar domínios numa mesma pasta | Cada domínio tem sua própria pasta em `feature/` |
| Organizar por tipo (components/, services/, pipes/) | Organizar por contexto e funcionalidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
