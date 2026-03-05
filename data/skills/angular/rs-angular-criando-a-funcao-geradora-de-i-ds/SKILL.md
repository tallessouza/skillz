---
name: rs-angular-geradora-de-ids
description: "Applies timestamp-based unique ID generation pattern when writing Angular/TypeScript code. Use when user asks to 'generate ID', 'create unique identifier', 'add ID to model', or 'identify items in a list'. Implements pattern: timestamp base-36 + random part for client-side ID generation without external libraries. Make sure to use this skill whenever creating IDs for local state management, task lists, or kanban-style apps. Not for database UUIDs, server-side ID generation, or cryptographic identifiers."
---

# Geracao de IDs Unicos com Timestamp

> Gere IDs unicos no cliente combinando timestamp em base 36 com parte aleatoria, sem dependencias externas.

## Rules

1. **Crie uma pasta `utils/` dentro de `app/`** — funcoes utilitarias isoladas vivem separadas dos componentes, porque facilita reutilizacao em toda a aplicacao
2. **Nomeie o arquivo igual a funcao** — `generate-unique-id-with-timestamp.ts` exporta `generateUniqueIdWithTimestamp`, porque consistencia entre arquivo e export evita confusao
3. **Use base 36 no toString** — converte numeros para string alfanumerica compacta (0-9 + a-z), porque reduz o tamanho do ID mantendo unicidade
4. **Combine timestamp + random** — timestamp garante ordenacao temporal, random evita colisao em chamadas no mesmo milissegundo
5. **Sempre type o retorno explicitamente** — `: string` no retorno da funcao, porque Angular/TypeScript exige clareza de tipos
6. **Faca double-check nos nomes** — verifique nomes de funcoes e propriedades antes de seguir, porque renomear depois exige refatoracao em todos os consumidores

## How to write

### Funcao geradora de ID

```typescript
// utils/generate-unique-id-with-timestamp.ts
export const generateUniqueIdWithTimestamp = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
};
```

### Uso em um Service

```typescript
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

// Dentro do TaskService, ao criar uma nova tarefa:
const newTask = {
  id: generateUniqueIdWithTimestamp(),
  title: 'Minha tarefa',
  // ...
};
```

## Example

**Before (sem ID, impossivel identificar tarefas):**
```typescript
const task = {
  title: 'Fazer deploy',
  status: 'todo',
};
// Como excluir essa tarefa especifica de uma lista?
```

**After (com ID unico):**
```typescript
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

const task = {
  id: generateUniqueIdWithTimestamp(), // "lk2f8x3-a4b7c2d"
  title: 'Fazer deploy',
  status: 'todo',
};
// Agora posso filtrar, excluir, editar por ID
```

## Heuristics

| Situacao | Faca |
|----------|------|
| App local sem backend | Use esta funcao de ID com timestamp |
| Backend gera UUID | Use o ID do backend, nao gere no cliente |
| Precisa de ordenacao por criacao | Timestamp no ID ja garante isso |
| Multiplas tarefas criadas no mesmo clique | O randomPart evita colisao |
| Precisa de ID criptograficamente seguro | Use `crypto.randomUUID()` em vez desta funcao |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `id: Math.random()` (numero, colide) | `id: generateUniqueIdWithTimestamp()` |
| `id: Date.now()` (colide em batch) | Combine timestamp + random |
| `id: tasks.length + 1` (quebra ao excluir) | ID independente do indice |
| Funcao utilitaria dentro do componente | Pasta `utils/` separada |
| Exportar sem tipar retorno | `(): string =>` explicito |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
