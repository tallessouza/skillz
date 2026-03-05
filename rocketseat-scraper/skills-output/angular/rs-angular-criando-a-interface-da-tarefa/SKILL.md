---
name: rs-angular-criando-interface-tarefa
description: "Enforces Angular TypeScript interface and enum organization patterns when user asks to 'create an interface', 'define types', 'type a model', 'organize interfaces', or 'create enums'. Applies rules: singular interface names, enum+type pattern for status fields, separate files per concern (interfaces/, enums/, types/). Make sure to use this skill whenever generating Angular model types or organizing TypeScript type files. Not for component creation, service logic, or API integration."
---

# Criando Interfaces e Tipagens em Angular

> Interfaces representam um unico objeto, nunca uma colecao — nomeie no singular e organize em arquivos separados por tipo.

## Rules

1. **Nomeie interfaces no singular** — `ITask` nao `ITasks`, `IComment` nao `IComments`, porque a interface representa um unico objeto, nao a colecao
2. **Prefixe com I** — `ITask`, `IComment`, porque indica visualmente que e uma interface TypeScript
3. **Use enum + type para status** — crie o enum com os valores e um type union baseado nele, porque facilita reutilizacao sem fricao ao passar valores como parametro
4. **Separe por tipo de artefato** — interfaces em `interfaces/`, enums em `enums/`, types em `types/`, porque mantém o codigo organizado e facil de localizar
5. **Nao duplique strings de status** — centralize em enum para evitar refatoracao dolorosa quando um valor mudar
6. **Enum values em MAIUSCULO, strings em minusculo** — `TODO = 'to-do'`, porque segue convencao TypeScript padrao

## How to write

### Interface com prefixo I (singular)

```typescript
// interfaces/comment.interface.ts
export interface IComment {
  id: string;
  description: string;
}

// interfaces/task.interface.ts
import { IComment } from './comment.interface';
import { TaskStatus } from '../types/task-status';

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: IComment[];
  status: TaskStatus;
}
```

### Enum + Type pattern para status

```typescript
// enums/task-status.enum.ts
export enum TaskStatusEnum {
  TODO = 'to-do',
  DOING = 'doing',
  DONE = 'done',
}

// types/task-status.ts
import { TaskStatusEnum } from '../enums/task-status.enum';

export type TaskStatus =
  | TaskStatusEnum.TODO
  | TaskStatusEnum.DOING
  | TaskStatusEnum.DONE;
```

## Example

**Before (tudo no service, plural, sem enum):**

```typescript
// task.service.ts
interface ITasks {
  id: string;
  name: string;
  status: 'to-do' | 'doing' | 'done';
  comments: { id: string; description: string }[];
}
```

**After (com esta skill aplicada):**

```
app/
├── interfaces/
│   ├── task.interface.ts      // ITask
│   └── comment.interface.ts   // IComment
├── enums/
│   └── task-status.enum.ts    // TaskStatusEnum
├── types/
│   └── task-status.ts         // TaskStatus type
└── services/
    └── task.service.ts        // importa ITask
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Objeto dentro de lista em outra interface | Extraia para interface separada |
| Campo com valores fixos (status, role) | Crie enum + type |
| Type usado em 1 lugar apenas | Pode ficar inline, mas extraia se crescer |
| Nomenclatura de arquivo de interface | `{nome}.interface.ts` |
| Nomenclatura de arquivo de enum | `{nome}.enum.ts` |
| Nomenclatura de arquivo de type | `{nome}.ts` (sem sufixo .type) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `interface ITasks` (plural) | `interface ITask` (singular) |
| `status: 'to-do' \| 'doing' \| 'done'` inline | `status: TaskStatus` com enum+type |
| `comments: { id: string; desc: string }[]` | `comments: IComment[]` com interface separada |
| `status: TaskStatusEnum` (enum direto como tipo) | `status: TaskStatus` (type baseado no enum) |
| Tudo no service file | Arquivos separados em pastas por tipo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
