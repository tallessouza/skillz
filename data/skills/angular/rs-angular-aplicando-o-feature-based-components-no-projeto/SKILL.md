---
name: rs-angular-feature-based-components
description: "Enforces Feature Based Components folder structure when organizing Angular projects. Use when user asks to 'organize project', 'create folder structure', 'restructure Angular app', 'setup project architecture', or 'move components'. Applies rules: features group by domain not type, Core holds singletons and layout, Domain holds shared typings, Shared holds reusable utilities, no cross-layer circular dependencies. Make sure to use this skill whenever scaffolding or reorganizing an Angular project. Not for React, Vue, or non-Angular frameworks."
---

# Feature Based Components — Estrutura de Pastas Angular

> Organize por dominio e funcionalidade, nunca por tipo de arquivo.

## Rules

1. **Agrupe por feature, nao por tipo** — `app/tasks/components/` nao `app/components/task-*`, porque features encapsulam contexto e facilitam navegacao
2. **Core so contem singletons e layout** — header, services globais, interfaces internas da core, porque core e instanciada uma unica vez no app
3. **Domain agrupa apenas tipagens compartilhadas** — interfaces, enums, types que sao usados por core E features, porque evita acoplamento direto entre camadas
4. **Shared contem apenas utilitarios reutilizaveis** — funcoes puras, pipes, helpers que qualquer feature pode usar, porque nao tem dependencia de dominio
5. **Core nunca depende de Feature** — se um componente da core importa algo de uma feature, mova o componente para a feature, porque dependencia circular quebra escalabilidade
6. **Services globais ficam na Core** — mesmo que gerenciem uma unica feature, se sao singleton e coração da app, ficam na core, porque podem ser consumidos por futuras features

## Estrutura

```
app/
├── core/
│   ├── layout/           # Header, WelcomeSection (nao reutilizaveis)
│   ├── services/         # TaskService, ModalControllerService (singletons)
│   └── interfaces/       # Tipagens usadas APENAS dentro da core
├── domain/
│   └── tasks/
│       ├── interfaces/   # ITask, IComment (usadas em core + features)
│       ├── enums/        # TaskCategory, etc
│       └── types/        # TaskStatus, etc
├── shared/
│   └── utils/            # generateId(), pipes genericos
└── tasks/                # FEATURE
    └── components/       # TaskCard, TaskListSection, TaskFormModal, etc
```

## Decisao: onde colocar cada arquivo

| Arquivo | Criterio | Destino |
|---------|----------|---------|
| Componente usado 1x, sem dependencia de feature | Layout da app | `core/layout/` |
| Componente usado 1x, importa coisas de feature | Pertence a feature | `tasks/components/` |
| Service singleton, coração da app | Global | `core/services/` |
| Interface usada em core E feature | Tipagem compartilhada | `domain/tasks/interfaces/` |
| Interface usada APENAS na core | Interna | `core/interfaces/` |
| Enum/type usado em multiplas camadas | Tipagem compartilhada | `domain/tasks/enums/` |
| Funcao utilitaria generica | Reutilizavel | `shared/utils/` |

## Example

**Before (tudo solto em app/):**
```
app/
├── components/
│   ├── header/
│   ├── task-card/
│   ├── task-list-section/
│   ├── task-form-modal/
│   └── main-content/
├── services/
│   ├── task.service.ts
│   └── modal-controller.service.ts
├── interfaces/
│   ├── task.interface.ts
│   └── comment.interface.ts
└── utils/
```

**After (Feature Based Components):**
```
app/
├── core/
│   ├── layout/
│   │   ├── header/
│   │   └── welcome-section/
│   ├── services/
│   │   ├── task.service.ts
│   │   └── modal-controller.service.ts
│   └── interfaces/
│       ├── task-form-controls.interface.ts
│       └── task-form-modal-data.interface.ts
├── domain/
│   └── tasks/
│       ├── interfaces/
│       │   ├── task.interface.ts
│       │   └── comment.interface.ts
│       ├── enums/
│       └── types/
├── shared/
│   └── utils/
│       └── generate-id.ts
└── tasks/
    └── components/
        ├── task-card/
        ├── task-list-section/
        ├── task-form-modal/
        ├── task-comments-modal/
        └── main-content/
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Componente importa coisas de feature E de core | Mova para a feature, nao para core |
| Service usado em toda app, mesmo gerenciando 1 feature | Core (e singleton, pode crescer) |
| Tipagem usada em 2+ camadas | Domain, segregada por feature |
| Tipagem usada em 1 camada apenas | Dentro da propria camada |
| Duvida entre shared e core | Se e singleton ou layout → core. Se e funcao pura generica → shared |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `app/components/` agrupando tudo por tipo | `app/{feature}/components/` agrupando por dominio |
| Core importando de uma feature | Mova o arquivo para a feature ou para domain |
| Jogar service, componente e interface tudo em domain | Domain contem APENAS tipagens (interfaces, enums, types) |
| Shared com componentes especificos de feature | Shared so contem utilitarios genericos sem dependencia de dominio |
| Mover arquivos sem corrigir imports | Apos cada movimentacao, corrija todos os imports antes de continuar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
