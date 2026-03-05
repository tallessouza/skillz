---
name: rs-angular-feature-based-components
description: "Enforces feature-based component architecture when structuring Angular projects. Use when user asks to 'organize Angular project', 'create folder structure', 'refactor project structure', 'scaffold Angular app', or 'structure components'. Applies Core/Shared/Features folder pattern instead of type-based grouping. Make sure to use this skill whenever creating or reorganizing Angular project folders. Not for individual component creation, styling, or Angular API usage."
---

# Feature-Based Components no Angular

> Organize projetos Angular por funcionalidade (feature), nunca por tipo (components/, services/, pipes/).

## Rules

1. **Nunca agrupe por tipo** — nao crie pastas `components/`, `services/`, `pipes/` na raiz, porque em projetos grandes voce tera 50 componentes numa unica pasta sem contexto de dominio
2. **Agrupe por feature** — cada funcionalidade do sistema tem sua propria pasta com tudo que precisa dentro, porque isso isola responsabilidades e facilita manutencao
3. **Use tres pastas raiz: Core, Shared, Features** — `core/` para singletons e layout, `shared/` para reutilizaveis, `features/` para funcionalidades de dominio
4. **Core nao depende de Features** — core contem services globais, layout, interfaces base. Features dependem de Core, nunca o contrario
5. **Shared nao depende de Features** — shared contem componentes/pipes/directives reutilizaveis. Features podem importar de Shared, nunca o contrario
6. **Feature != Tela** — uma feature e uma funcionalidade de dominio (ex: tasks), nao uma pagina. Uma feature pode ter multiplas telas

## Estrutura padrao

```
src/app/
├── core/                    # Singletons, layout, services globais
│   ├── layout/              # Header, sidebar, footer
│   ├── services/            # Services que existem uma vez na app
│   └── interfaces/          # Interfaces/types base
│
├── domain/                  # Modelos de dominio
│   └── tasks/
│       ├── enums/
│       ├── interfaces/
│       └── types/
│
├── features/                # Funcionalidades do sistema
│   └── tasks/
│       ├── components/      # Componentes especificos de tasks
│       ├── services/        # Services especificos de tasks
│       └── pages/           # Telas da feature
│
└── shared/                  # Reutilizaveis entre features
    ├── components/          # Componentes genericos (button, modal)
    ├── pipes/
    └── directives/
```

## Regras de dependencia

| Pasta | Pode importar de | Nunca importa de |
|-------|-------------------|------------------|
| `core/` | — (independente) | `features/`, `shared/` |
| `shared/` | `core/` | `features/` |
| `features/` | `core/`, `shared/`, `domain/` | outras features (idealmente) |
| `domain/` | — (independente) | `features/`, `shared/`, `core/` |

## Example

**Before (organizado por tipo — problematico em projetos grandes):**
```
src/app/
├── components/
│   ├── task-list.ts
│   ├── task-form.ts
│   ├── header.ts
│   ├── sidebar.ts
│   └── ... (50+ arquivos misturados)
├── services/
│   ├── task.service.ts
│   ├── auth.service.ts
│   └── ... (20+ services sem contexto)
└── pipes/
    └── date-format.pipe.ts
```

**After (feature-based — escalavel):**
```
src/app/
├── core/
│   ├── layout/
│   │   ├── header.ts
│   │   └── sidebar.ts
│   └── services/
│       └── auth.service.ts
├── domain/
│   └── tasks/
│       └── task.interface.ts
├── features/
│   └── tasks/
│       ├── components/
│       │   ├── task-list.ts
│       │   └── task-form.ts
│       └── services/
│           └── task.service.ts
└── shared/
    └── pipes/
        └── date-format.pipe.ts
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Componente usado em 1 feature | Vai dentro da pasta da feature |
| Componente usado em 2+ features | Move para `shared/` |
| Service com uma unica instancia global | Vai em `core/services/` |
| Service especifico de uma feature | Vai dentro da pasta da feature |
| Interface de dominio (model) | Vai em `domain/{entidade}/` |
| Layout da aplicacao (header, sidebar) | Vai em `core/layout/` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `components/task-list.ts` na raiz | `features/tasks/components/task-list.ts` |
| `services/` com 20+ services misturados | Separe entre `core/services/` e `features/*/services/` |
| Feature importando de outra feature | Extraia o compartilhado para `shared/` |
| Tudo em `shared/` "por precaucao" | So mova para shared quando reutilizado de fato |

## Angular 20+

Na versao 20, os sufixos `.component`, `.service`, `.pipe` nos nomes de arquivo foram removidos. O padrao feature-based se torna ainda mais importante porque sem sufixos, a organizacao por pasta e o unico indicador claro do tipo e contexto de cada arquivo.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
