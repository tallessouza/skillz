# Code Examples: Organização de Features por Domínio

## Exemplo completo: Sistema de Gerenciamento de Projetos

### Passo 1: Levantamento de requisitos

```
Requisitos do sistema:
- Estruturar projetos
- Gerenciar tarefas (criação, movimentação, deleção)
- Quadros Kanban
- Gerenciar membros
- Gerenciar permissões
- Comentários
- Notificações
- Calcular métricas (burn down)
- Calcular tempo gasto em tarefas
- Gerar relatórios
```

### Passo 2: Agrupamento por responsabilidade

```
Domínio 1 — Projetos e Tarefas:
  Requisitos: estruturar projetos, gerenciar tarefas, quadros Kanban
  Entidades: Projeto, Tarefa, Quadro, Lista, Status

Domínio 2 — Colaboração e Usuários:
  Requisitos: gerenciar membros, permissões, comentários, notificações
  Entidades: Usuário, Equipe, Permissão, Comentário

Domínio 3 — Relatórios e Análises:
  Requisitos: calcular métricas, burn down, tempo gasto, relatórios
  Entidades: Métrica de Tempo, Log de Atividades, Relatório
```

### Passo 3: Mapeamento para Angular

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'projects',
    loadChildren: () => import('./tasks/tasks.routes')
  },
  {
    path: 'collaboration',
    loadChildren: () => import('./collaboration/collaboration.routes')
  },
  {
    path: 'reporting',
    loadChildren: () => import('./reporting/reporting.routes')
  }
];
```

### Estrutura de pastas final

```
src/app/
├── tasks/
│   ├── models/
│   │   ├── project.model.ts      # { id, name, description, boards }
│   │   ├── task.model.ts         # { id, title, status, assignee }
│   │   ├── board.model.ts        # { id, name, lists }
│   │   ├── list.model.ts         # { id, name, tasks }
│   │   └── status.model.ts       # enum: TODO, IN_PROGRESS, DONE
│   ├── services/
│   │   ├── project.service.ts
│   │   └── task.service.ts
│   ├── components/
│   │   ├── board-view/
│   │   ├── task-card/
│   │   └── task-detail/
│   └── tasks.routes.ts
│
├── collaboration/
│   ├── models/
│   │   ├── user.model.ts         # { id, name, email, role }
│   │   ├── team.model.ts         # { id, name, members }
│   │   ├── permission.model.ts   # { resource, action, allowed }
│   │   └── comment.model.ts      # { id, author, content, taskId }
│   ├── services/
│   │   ├── member.service.ts
│   │   ├── permission.service.ts
│   │   └── notification.service.ts
│   ├── components/
│   │   ├── member-list/
│   │   ├── comment-thread/
│   │   └── notification-panel/
│   └── collaboration.routes.ts
│
├── reporting/
│   ├── models/
│   │   ├── time-metric.model.ts  # { taskId, timeSpent, date }
│   │   ├── activity-log.model.ts # { action, user, timestamp }
│   │   └── report.model.ts       # { type, dateRange, data }
│   ├── services/
│   │   ├── metrics.service.ts
│   │   └── report.service.ts
│   ├── components/
│   │   ├── burndown-chart/
│   │   └── report-viewer/
│   └── reporting.routes.ts
│
├── core/                          # Transversal (auth, interceptors)
├── shared/                        # Componentes reutilizáveis entre features
└── app.routes.ts
```

### Variação: Nomeando a feature como /tasks em vez de /projects

O instrutor menciona que o domínio "Projetos e Tarefas" poderia ser `/tasks` ou `/projects`. A escolha depende do foco principal:

```typescript
// Se o foco é gerenciar tarefas (Kanban, movimentação):
path: 'tasks'

// Se o foco é gerenciar projetos (criação, configuração):
path: 'projects'

// Se ambos são igualmente importantes, use o mais abrangente:
path: 'projects'  // projetos contêm tarefas
```