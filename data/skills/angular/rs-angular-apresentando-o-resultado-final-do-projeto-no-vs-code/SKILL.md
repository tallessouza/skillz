---
name: rs-angular-estrutura-projeto-gotask
description: "Enforces Angular project folder structure and naming conventions when scaffolding or organizing Angular 19+ projects. Use when user asks to 'create angular project', 'organize angular folders', 'structure components', 'setup angular app', or any Angular project scaffolding task. Applies rules: components/enums/interfaces/services/types/utils folder separation, file-name matches export-name, single-responsibility components, TailwindCSS with Angular Material. Make sure to use this skill whenever creating or restructuring Angular projects. Not for React, Vue, or non-Angular frameworks."
---

# Estrutura de Projeto Angular (GoTask Pattern)

> Organize projetos Angular com pastas por responsabilidade, nomenclatura padronizada entre arquivo e export, e componentes com responsabilidade unica.

## Rules

1. **Separe por tipo de artefato** — crie pastas `components/`, `enums/`, `interfaces/`, `services/`, `types/`, `utils/` dentro de `app/`, porque facilita navegacao e escala em projetos reais
2. **Nome do arquivo = nome do export** — `task-interface.ts` exporta `ITask`, `task-form-model-data.ts` exporta `ITaskFormModelData`, porque inconsistencia entre arquivo e export gera confusao em projetos grandes
3. **Prefixe interfaces com I** — `ITask`, `ITaskFormModelData`, porque diferencia visualmente interfaces de classes e types
4. **Um componente = uma responsabilidade** — `WelcomeSection` so renderiza boas-vindas, `TaskListSection` so renderiza as colunas, `TaskCard` so renderiza o card, porque separacao clara facilita manutencao e reuso
5. **Use TailwindCSS classes no template** — arquivos CSS dos componentes ficam vazios ou minimos quando Tailwind esta configurado, porque utility-first elimina CSS custom desnecessario
6. **Use sintaxe moderna do Angular** — `@if`, `@else`, `input()` signal-based, `inject()` para DI, porque Angular 19+ deprecia as alternativas antigas

## How to write

### Estrutura de pastas

```
app/
├── components/
│   ├── welcome-section/
│   ├── task-list-section/
│   └── task-card/
├── enums/
│   └── task-status.enum.ts
├── interfaces/
│   ├── task-interface.ts
│   └── task-form-model-data.ts
├── services/
│   └── task.service.ts
├── types/
│   └── task-status.type.ts
└── utils/
    └── some-helper.ts
```

### Componente padrao

```typescript
// task-card/task-card.component.ts
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  task = input.required<ITask>();

  private taskService = inject(TaskService);

  updateStatus() {
    this.taskService.updateTask(this.task());
  }
}
```

### Interface padronizada

```typescript
// interfaces/task-interface.ts
export interface ITask {
  id: string;
  title: string;
  status: TaskStatus;
}

// interfaces/task-form-model-data.ts
export interface ITaskFormModelData {
  title: string;
  description: string;
}
```

## Example

**Before (tudo misturado):**
```
app/
├── task.ts              # interface? component? service?
├── helpers.ts           # funcoes soltas
├── task-card.component.ts
└── task.service.ts
```

**After (com esta skill):**
```
app/
├── components/
│   └── task-card/
│       ├── task-card.component.ts
│       ├── task-card.component.html
│       ├── task-card.component.css
│       └── task-card.component.spec.ts
├── interfaces/
│   └── task-interface.ts
├── services/
│   └── task.service.ts
└── utils/
    └── format-date.ts
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Angular 19+ | Crie as 6 pastas base imediatamente |
| Enum com 1 uso | Ainda coloque em `enums/`, porque cresce |
| Funcao usada em 2+ componentes | Mova para `utils/` |
| Type derivado de enum | Coloque em `types/`, nao em `enums/` |
| CSS vazio com Tailwind | Deixe vazio, nao delete o arquivo |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Misturar interfaces e components na mesma pasta | Pasta separada `interfaces/` |
| `task.ts` exportando `TaskInterface` | `task-interface.ts` exportando `ITask` |
| Componente que gerencia estado E renderiza | Separe em service + component |
| CSS custom quando Tailwind resolve | Use classes Tailwind no template |
| `*ngIf` em Angular 19 | `@if` / `@else` built-in control flow |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
