---
name: rs-angular-definindo-estrutura-de-pastas
description: "Enforces Angular folder structure using Feature, Core, Shared, and Domain layers when organizing or scaffolding Angular projects. Use when user asks to 'create angular project structure', 'organize angular folders', 'refactor angular app', 'setup feature based components', or 'separate concerns in angular'. Applies rules: features hold domain components, core holds singletons and layout, shared holds reusable UI, domain holds interfaces to prevent circular deps. Make sure to use this skill whenever creating or reorganizing Angular project structure. Not for React, Vue, or non-Angular frameworks."
---

# Estrutura de Pastas Angular — Feature Based Components

> Organize o projeto Angular em 4 camadas: Feature, Core, Shared e Domain, onde cada camada tem regras claras de dependencia.

## Rules

1. **Features contem componentes de dominio** — cada feature agrupa os sub-recursos do dominio (create, edit, list, comments), porque isso isola funcionalidades e facilita lazy loading
2. **Core contem singletons e layout** — services com instancia unica (providedIn: root) e componentes de layout nao-reutilizaveis (header, sidebar) ficam no core, porque sao inicializados uma vez com a aplicacao
3. **Shared contem apenas reutilizaveis** — somente componentes, pipes e directives usados em multiplos lugares, porque colocar componentes nao-reutilizaveis viola o principio do shared
4. **Domain contem interfaces e models** — interfaces, enums e types ficam em domain/ separados por feature, porque evita dependencias circulares entre core e features
5. **Regra de dependencia unidirecional** — Feature depende de Core e Domain. Core depende apenas de Domain. Shared depende apenas de Domain. Domain nao depende de ninguem, porque dependencias circulares quebram a arquitetura
6. **Services singleton vao no Core, nao na Feature** — se o service gerencia estado global (fonte unica de verdade), ele pertence ao core, porque precisa existir como instancia unica independente do ciclo de vida da feature

## How to write

### Estrutura de pastas

```
src/app/
├── core/
│   ├── services/
│   │   ├── task.service.ts        # Singleton, estado global
│   │   └── modal.service.ts       # Singleton, gerencia modais
│   └── components/
│       └── layout/
│           ├── header/
│           └── welcome-section/
├── shared/
│   ├── components/
│   │   └── button/                # Reutilizavel em multiplos lugares
│   ├── pipes/
│   └── directives/
├── domain/
│   ├── task/
│   │   ├── task.model.ts          # interface ITask
│   │   └── task-form.model.ts     # interface ITaskFormControls
│   └── user/                      # Outro dominio se existir
│       └── user.model.ts
└── features/
    └── task/
        ├── task-board/
        ├── task-card/
        ├── task-create/
        ├── task-edit/
        └── task-comments/
```

### Decidindo onde colocar um service

```typescript
// CORE — Service singleton com estado global
// core/services/task.service.ts
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks$ = new BehaviorSubject<ITask[]>([]);
  // Fonte unica de verdade para toda a aplicacao
}

// FEATURE — Service com ciclo de vida da feature
// features/task/services/task-filter.service.ts
@Injectable()
export class TaskFilterService {
  // Criado quando a feature inicializa, destruido quando sai
}
```

## Example

**Before (tudo na raiz, dependencia circular):**
```
src/app/
├── header/
├── welcome-section/
├── task-board/
├── task-card/
├── task.service.ts      # Importa ITask de task-card/
├── task-card/
│   └── task.model.ts    # ITask mora aqui
└── modal.service.ts
```

**After (separado por camadas):**
```
src/app/
├── core/
│   ├── services/
│   │   ├── task.service.ts       # Importa ITask de domain/
│   │   └── modal.service.ts
│   └── components/layout/
│       ├── header/
│       └── welcome-section/
├── domain/
│   └── task/
│       └── task.model.ts         # ITask mora aqui, sem deps
├── shared/
│   └── components/button/
└── features/
    └── task/
        ├── task-board/
        ├── task-card/
        ├── task-create/
        └── task-edit/
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Service com providedIn: root e estado global | Coloque no core/services/ |
| Service especifico de uma feature | Coloque em features/{feature}/services/ |
| Componente usado apenas no layout principal | Coloque em core/components/layout/ |
| Componente usado em 2+ features | Coloque em shared/components/ |
| Interface usada por core E feature | Coloque em domain/{feature}/ |
| Aplicacao com muitas interfaces | Separe domain/ por sub-pastas de feature |
| Componente usado apenas dentro de uma feature | Mantenha dentro de features/{feature}/ |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Interface dentro da feature usada pelo core | Mova para domain/{feature}/ |
| Componente nao-reutilizavel no shared | Mova para core/components/layout/ |
| Service singleton dentro de features/ | Mova para core/services/ |
| Core importando de features/ | Extraia o tipo para domain/ |
| Tudo flat na raiz do app/ | Separe em core/, shared/, domain/, features/ |
| Shared com logica de negocio | Shared so tem UI generica, mova logica para core ou feature |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
