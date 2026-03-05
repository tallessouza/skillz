# Code Examples: Feature-Based Components no Angular

## Estrutura completa do Go Task refatorado

O instrutor mostra a seguinte estrutura apos refatorar o Go Task:

```
src/app/
├── core/
│   ├── interfaces/          # Interfaces base da aplicacao
│   ├── layout/              # Componentes de layout (header, etc)
│   └── services/            # Services globais
│
├── domain/
│   └── tasks/
│       ├── enums/           # Enums relacionados a tasks
│       ├── interfaces/      # Interface Task, CreateTask, etc
│       └── types/           # Type aliases do dominio
│
├── features/
│   └── tasks/
│       └── components/      # Componentes da feature tasks
│
└── shared/                  # Componentes/pipes compartilhados
```

## Comparacao: antes vs depois

### Antes (por tipo)

```
src/app/
├── components/
│   ├── task-list.component.ts
│   ├── task-form.component.ts
│   ├── task-item.component.ts
│   ├── header.component.ts
│   └── sidebar.component.ts
├── services/
│   ├── task.service.ts
│   └── auth.service.ts
├── interfaces/
│   └── task.interface.ts
└── pipes/
    └── status.pipe.ts
```

### Depois (feature-based, Angular 20 sem sufixos)

```
src/app/
├── core/
│   ├── layout/
│   │   ├── header.ts
│   │   └── sidebar.ts
│   └── services/
│       └── auth.ts
├── domain/
│   └── tasks/
│       ├── task.interface.ts
│       └── task-status.enum.ts
├── features/
│   └── tasks/
│       ├── components/
│       │   ├── task-list.ts
│       │   ├── task-form.ts
│       │   └── task-item.ts
│       └── services/
│           └── task.ts
└── shared/
    └── pipes/
        └── status.ts
```

## Exemplo de como decidir onde colocar cada arquivo

```
Novo arquivo: UserAvatarComponent
Pergunta: E usado em mais de uma feature?
  - SIM → shared/components/user-avatar.ts
  - NAO, so na feature "profile" → features/profile/components/user-avatar.ts

Novo arquivo: AuthService
Pergunta: E um singleton global?
  - SIM → core/services/auth.ts

Novo arquivo: TaskService
Pergunta: E especifico de uma feature?
  - SIM, so tasks usa → features/tasks/services/task.ts

Novo arquivo: Task interface
Pergunta: E um modelo de dominio?
  - SIM → domain/tasks/task.interface.ts
```

## Tres exemplos de estrutura mencionados pelo instrutor

O instrutor menciona que mostrara tres exemplos praticos de estruturacao de projetos ao longo do modulo, alem da refatoracao do Go Task. Esses exemplos servem para o aluno ir se acostumando com o padrao e desenvolver o "feeling" de como organizar.