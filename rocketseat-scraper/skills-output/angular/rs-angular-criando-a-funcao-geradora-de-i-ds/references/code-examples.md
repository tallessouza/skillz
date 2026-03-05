# Code Examples: Geracao de IDs Unicos com Timestamp

## Exemplo 1: A funcao completa

Arquivo: `app/utils/generate-unique-id-with-timestamp.ts`

```typescript
export const generateUniqueIdWithTimestamp = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
};
```

### Passo a passo:

1. `new Date().getTime()` → numero como `1709136000000`
2. `.toString(36)` → string compacta como `"lk2f8x3"`
3. `Math.random()` → float como `0.723489156`
4. `.toString(36)` → `"0.q1w2e3r4t5"`
5. `.substring(2, 9)` → `"q1w2e3r"` (7 chars, sem o "0.")
6. Template literal junta: `"lk2f8x3-q1w2e3r"`

## Exemplo 2: Teste no constructor do componente

```typescript
import { Component } from '@angular/core';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

@Component({
  selector: 'app-welcome-section',
  templateUrl: './welcome-section.component.html',
})
export class WelcomeSectionComponent {
  constructor() {
    console.log(generateUniqueIdWithTimestamp());
    // Output no console: "lk2f8x3-a4b7c2d" (muda a cada reload)
  }
}
```

> **Nota:** Este teste e temporario. O instrutor remove o constructor e o import apos confirmar que funciona. O uso real sera no `TaskService`.

## Exemplo 3: Uso futuro no TaskService (inferido)

```typescript
import { Injectable } from '@angular/core';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';

@Injectable({ providedIn: 'root' })
export class TaskService {
  createTask(title: string, column: string) {
    return {
      id: generateUniqueIdWithTimestamp(),
      title,
      column,
      comments: [],
    };
  }
}
```

## Exemplo 4: Estrutura de pastas resultante

```
app/
├── utils/
│   └── generate-unique-id-with-timestamp.ts
├── components/
│   └── welcome-section/
│       └── welcome-section.component.ts
└── services/
    └── task.service.ts  (uso futuro)
```

## Variacao: Se precisasse de IDs mais robustos

```typescript
// Alternativa com crypto (browsers modernos)
export const generateCryptoId = (): string => {
  return crypto.randomUUID(); // "550e8400-e29b-41d4-a716-446655440000"
};

// Alternativa com prefixo de dominio
export const generateTaskId = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `task-${timestamp}-${randomPart}`;
};
```