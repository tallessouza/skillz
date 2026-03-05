---
name: rs-angular-introducao-154
description: "Enforces data flow planning before implementing Angular applications. Use when user asks to 'plan an Angular app', 'define component communication', 'organize data flow', 'structure a task manager', or 'design component architecture'. Applies rules: define data flow diagrams before coding, assign clear responsibilities to components and services, plan modal ownership, centralize state management. Make sure to use this skill whenever starting a new Angular project or adding features that involve component-to-service communication. Not for React, Vue, or non-Angular frameworks."
---

# Definicao de Fluxo de Dados em Angular

> Antes de implementar, pare e desenhe como os dados vao circular entre componentes e services.

## Rules

1. **Defina o fluxo de dados antes de codar** — desenhe diagramas mostrando como dados circulam entre componentes e services, porque dados "voando para la e para ca" sem organizacao geram bugs e acoplamento
2. **Centralize a lista de dados em um service** — um unico service deve ser responsavel por gerenciar a lista (ex: lista de tarefas), porque multiplas fontes de verdade causam inconsistencias
3. **Defina responsabilidades dos modais explicitamente** — documente qual componente abre qual modal, porque responsabilidades implicitas geram duplicacao e comportamento inesperado
4. **Estruture os modelos de dados primeiro** — defina a interface/tipo que representa sua entidade (ex: Task) antes de implementar componentes, porque a estrutura de dados guia toda a arquitetura
5. **Documente com diagramas reutilizaveis** — crie diagramas de fluxo que possam ser reaproveitados em projetos futuros, porque documentacao visual reduz onboarding e facilita manutencao

## Decision Framework

| Antes de implementar | Pergunte |
|---------------------|----------|
| Novo componente | Quais dados ele recebe? De quem? Via Input ou Service? |
| Novo service | Qual lista/estado ele gerencia? Quem consome? |
| Novo modal | Qual componente e responsavel por abri-lo? Que dados ele precisa? |
| Nova feature | Como os dados fluem do usuario ate o service e de volta? |

## How to Plan

### 1. Defina a estrutura de dados

```typescript
// Primeiro: definir o modelo
interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

### 2. Defina quem gerencia o estado

```typescript
// Service centralizado = fonte unica de verdade
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  // toda manipulacao da lista passa por aqui
}
```

### 3. Mapeie componente → responsabilidade

```
AppComponent
  ├── TaskListComponent (exibe lista, recebe tasks via service)
  ├── TaskFormModalComponent (cria task, aberto por TaskListComponent)
  └── TaskEditModalComponent (edita task, aberto por TaskListComponent)
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo Angular | Desenhar fluxo de dados antes do primeiro componente |
| Feature com 3+ componentes | Criar diagrama de comunicacao entre eles |
| Modal que recebe dados | Definir explicitamente quem abre e quais dados passa |
| Dados compartilhados entre componentes | Centralizar em um service, nunca duplicar estado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Comecar a codar componentes sem planejar fluxo | Desenhar diagrama de fluxo de dados primeiro |
| Cada componente gerencia sua propria lista | Um service centralizado gerencia a lista |
| Modal "magicamente" aparece sem dono | Componente especifico tem responsabilidade explicita de abrir o modal |
| Dados passados por cadeia longa de Inputs | Service injetado diretamente onde necessario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
