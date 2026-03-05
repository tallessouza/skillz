---
name: rs-angular-feature-based-domain-grouping
description: "Enforces domain-driven feature organization when structuring Angular applications. Use when user asks to 'create a feature', 'organize modules', 'structure an Angular app', 'plan project architecture', or 'group components by domain'. Applies rules: group requirements by responsibility into domains, each domain becomes a feature folder with its own route, entities belong to their domain. Make sure to use this skill whenever scaffolding or restructuring an Angular project. Not for individual component creation, styling, or state management implementation."
---

# Organização de Features por Domínio no Angular

> Agrupe requisitos por responsabilidade em domínios, e cada domínio vira uma feature com rota própria na aplicação Angular.

## Rules

1. **Levante todos os requisitos antes de criar pastas** — liste tudo que o sistema precisa fazer antes de decidir a estrutura, porque estrutura prematura gera refatoração
2. **Agrupe requisitos por responsabilidade** — requisitos que compartilham entidades e operações pertencem ao mesmo domínio, porque coesão reduz acoplamento entre features
3. **Cada domínio vira uma feature com rota própria** — `projects/`, `collaboration/`, `reporting/`, porque isso mapeia diretamente para lazy-loaded routes no Angular
4. **Identifique as entidades de cada domínio** — liste explicitamente as entidades (projeto, tarefa, usuario, metrica) antes de implementar, porque entidades guiam a criação de models, services e components
5. **Nomeie features pelo domínio, não pela tela** — `tasks` não `kanban-page`, `reporting` não `charts-view`, porque domínios são estáveis, telas mudam

## How to write

### Mapeamento de requisitos para domínios

```typescript
// Passo 1: Liste requisitos
// - Estruturar projetos, gerenciar tarefas, quadros Kanban
// - Gerenciar membros, permissões, comentários, notificações
// - Calcular métricas, burn down, relatórios

// Passo 2: Agrupe por responsabilidade → nomeie o domínio
// Domínio 1: Projetos e Tarefas → /tasks ou /projects
// Domínio 2: Colaboração e Usuários → /collaboration
// Domínio 3: Relatórios e Análises → /reporting
```

### Estrutura de pastas resultante

```
src/app/
├── tasks/                    # Domínio: Projetos e Tarefas
│   ├── models/
│   │   ├── project.model.ts
│   │   ├── task.model.ts
│   │   ├── board.model.ts
│   │   └── status.model.ts
│   ├── services/
│   ├── components/
│   └── tasks.routes.ts
├── collaboration/            # Domínio: Colaboração e Usuários
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── team.model.ts
│   │   ├── permission.model.ts
│   │   └── comment.model.ts
│   ├── services/
│   ├── components/
│   └── collaboration.routes.ts
├── reporting/                # Domínio: Relatórios e Análises
│   ├── models/
│   │   ├── time-metric.model.ts
│   │   ├── activity-log.model.ts
│   │   └── report.model.ts
│   ├── services/
│   ├── components/
│   └── reporting.routes.ts
└── app.routes.ts
```

## Example

**Before (organização por tipo de arquivo):**
```
src/app/
├── components/
│   ├── kanban-board.component.ts
│   ├── user-list.component.ts
│   └── chart.component.ts
├── services/
│   ├── project.service.ts
│   ├── user.service.ts
│   └── report.service.ts
└── models/
    ├── project.model.ts
    ├── user.model.ts
    └── report.model.ts
```

**After (organização por domínio):**
```
src/app/
├── tasks/
│   ├── components/kanban-board.component.ts
│   ├── services/project.service.ts
│   └── models/project.model.ts
├── collaboration/
│   ├── components/user-list.component.ts
│   ├── services/user.service.ts
│   └── models/user.model.ts
└── reporting/
    ├── components/chart.component.ts
    ├── services/report.service.ts
    └── models/report.model.ts
```

## Heuristics

| Situação | Faça |
|----------|------|
| Requisito usa entidades de dois domínios | Coloque no domínio que é o dono principal da operação |
| Entidade compartilhada (ex: User) | Crie um `shared/` apenas se 3+ features dependem dela |
| Dúvida se é 1 ou 2 domínios | Se as entidades são diferentes, são domínios diferentes |
| Sistema pequeno (< 5 entidades) | Um único domínio pode ser suficiente |
| Requisito transversal (auth, logging) | Vai para `core/`, não para uma feature |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Pasta `components/` global com tudo junto | Uma pasta `components/` dentro de cada feature |
| Feature nomeada pela tela: `dashboard-page/` | Feature nomeada pelo domínio: `reporting/` |
| Criar estrutura antes de listar requisitos | Listar requisitos → agrupar → nomear domínios → criar pastas |
| Um `models/` global na raiz | `models/` dentro de cada feature |
| Feature com 1 componente e 0 entidades próprias | Provavelmente pertence a outra feature |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
