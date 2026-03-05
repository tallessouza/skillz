---
name: rs-node-js-2023-refatorando-pastas
description: "Enforces Clean Architecture folder structure with DDD subdomains in Node.js/TypeScript projects. Use when user asks to 'organize folders', 'refactor project structure', 'apply clean architecture', 'setup DDD structure', or 'create domain layers'. Applies domain/subdomain separation with application and enterprise layers. Make sure to use this skill whenever structuring a new Node.js project or reorganizing existing folder hierarchy. Not for file naming conventions, variable naming, or code-level patterns."
---

# Estrutura de Pastas: Clean Architecture + DDD

> Organize o projeto em dominios e subdomínios, separando camadas de application (casos de uso) e enterprise (entidades) dentro de cada subdominio.

## Rules

1. **Crie uma pasta `domain/` na raiz do src** — todo codigo de negocio vive dentro de domain, porque domain representa a area de expertise do problema sendo resolvido (conceito DDD)
2. **Divida domain em subdominios** — cada subdomain e uma pasta nomeada pelo contexto de negocio (`forum`, `notification`, `billing`), porque subdominios definem fronteiras claras que facilitam futura separacao em microservicos
3. **Dentro de cada subdomain, crie `application/` e `enterprise/`** — application contem use-cases e repositories (contratos), enterprise contem entities, porque isso mapeia diretamente para as camadas do diagrama Clean Architecture (vermelha = Application Business Rules, amarela = Enterprise Business Rules)
4. **Repositories na camada application sao apenas contratos (interfaces)** — implementacoes concretas ficam na camada de infraestrutura (fora do domain), porque o dominio nao conhece detalhes de persistencia
5. **Apos mover pastas, valide todas as importacoes** — rode os testes para garantir que nada quebrou, porque IDEs corrigem a maioria mas nao todas as importacoes automaticamente
6. **Use path aliases (`@core`, `@domain`) para importacoes longas** — porque importacoes relativas profundas (`../../../`) sao frageis e ilegíveis

## How to write

### Estrutura padrao de um subdomain

```
src/
└── domain/
    └── forum/                    # Subdomain
        ├── application/          # Application Business Rules (camada vermelha)
        │   ├── repositories/     # Contratos (interfaces)
        │   └── use-cases/        # Casos de uso
        └── enterprise/           # Enterprise Business Rules (camada amarela)
            └── entities/         # Entidades de dominio
```

### Projeto com multiplos subdominios

```
src/
└── domain/
    ├── forum/
    │   ├── application/
    │   │   ├── repositories/
    │   │   └── use-cases/
    │   └── enterprise/
    │       └── entities/
    ├── notification/
    │   ├── application/
    │   │   ├── repositories/
    │   │   └── use-cases/
    │   └── enterprise/
    │       └── entities/
    └── billing/
        ├── application/
        └── enterprise/
```

## Example

**Before (estrutura plana sem separacao de camadas):**

```
src/
├── entities/
│   ├── question.ts
│   └── answer.ts
├── use-cases/
│   ├── create-question.ts
│   └── get-question-by-slug.ts
└── repositories/
    └── questions-repository.ts
```

**After (com Clean Architecture + DDD):**

```
src/
└── domain/
    └── forum/
        ├── application/
        │   ├── repositories/
        │   │   └── questions-repository.ts
        │   └── use-cases/
        │       ├── create-question.ts
        │       └── get-question-by-slug.ts
        └── enterprise/
            └── entities/
                ├── question.ts
                └── answer.ts
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto pequeno, um unico contexto | Um subdomain e suficiente, nao force multiplos |
| Dois contextos compartilham entidade | Duplique a entidade em cada subdomain — subdominios sao fronteiras |
| Repositorio precisa de implementacao concreta | Coloque fora de domain/ (ex: `src/infra/database/`) |
| Nao sabe se algo e application ou enterprise | Se depende de caso de uso → application. Se e regra independente de caso de uso → enterprise |
| Projeto vai virar microservicos | Cada subdomain mapeia para um servico potencial |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `src/entities/` na raiz (sem domain) | `src/domain/{subdomain}/enterprise/entities/` |
| `src/use-cases/` na raiz | `src/domain/{subdomain}/application/use-cases/` |
| Implementacao concreta de repo dentro de domain | Apenas interface em domain, implementacao em `src/infra/` |
| Um unico subdomain chamado `core` ou `main` | Nomeie pelo contexto de negocio: `forum`, `billing`, `notification` |
| Misturar entidades e use-cases na mesma pasta | Separe em `enterprise/` e `application/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
