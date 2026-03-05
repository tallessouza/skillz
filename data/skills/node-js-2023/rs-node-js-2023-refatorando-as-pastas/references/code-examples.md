# Code Examples: Refatorando Pastas

## Estrutura antes da refatoracao

```
src/
├── entities/
│   ├── question.ts
│   ├── answer.ts
│   └── instructor.ts
├── use-cases/
│   ├── create-question.ts
│   ├── get-question-by-slug.ts
│   └── create-question.spec.ts
└── repositories/
    └── questions-repository.ts
```

Nesta estrutura plana, nao ha separacao entre camadas do Clean Architecture nem conceito de dominio/subdomain do DDD.

## Estrutura apos refatoracao

```
src/
└── domain/
    └── forum/
        ├── application/
        │   ├── repositories/
        │   │   └── questions-repository.ts    # Interface/contrato apenas
        │   └── use-cases/
        │       ├── create-question.ts
        │       ├── create-question.spec.ts
        │       └── get-question-by-slug.ts
        └── enterprise/
            └── entities/
                ├── question.ts
                ├── answer.ts
                └── instructor.ts
```

## Passo a passo da movimentacao

### 1. Criar a hierarquia de pastas

```bash
mkdir -p src/domain/forum/application/repositories
mkdir -p src/domain/forum/application/use-cases
mkdir -p src/domain/forum/enterprise/entities
```

### 2. Mover entidades para enterprise

```bash
mv src/entities/* src/domain/forum/enterprise/entities/
```

### 3. Mover use-cases para application

```bash
mv src/use-cases/* src/domain/forum/application/use-cases/
```

### 4. Mover repositorios (contratos) para application

```bash
mv src/repositories/* src/domain/forum/application/repositories/
```

### 5. Corrigir importacoes

**Antes:**
```typescript
import { Question } from '../entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
```

**Depois (relativo):**
```typescript
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
```

**Depois (com path alias — recomendado):**
```typescript
import { Question } from '@domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@domain/forum/application/repositories/questions-repository'
```

### 6. Configurar path alias no tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@domain/*": ["./src/domain/*"],
      "@core/*": ["./src/core/*"]
    }
  }
}
```

### 7. Validar com testes

```bash
npm test
```

Todos os testes devem passar sem modificacao de logica — apenas importacoes mudaram.

## Exemplo com multiplos subdominios

```
src/
└── domain/
    ├── forum/
    │   ├── application/
    │   │   ├── repositories/
    │   │   │   ├── questions-repository.ts
    │   │   │   └── answers-repository.ts
    │   │   └── use-cases/
    │   │       ├── create-question.ts
    │   │       ├── answer-question.ts
    │   │       └── choose-question-best-answer.ts
    │   └── enterprise/
    │       └── entities/
    │           ├── question.ts
    │           ├── answer.ts
    │           └── instructor.ts
    ├── notification/
    │   ├── application/
    │   │   ├── repositories/
    │   │   │   └── notifications-repository.ts
    │   │   └── use-cases/
    │   │       └── send-notification.ts
    │   └── enterprise/
    │       └── entities/
    │           └── notification.ts
    └── _shared/
        └── enterprise/
            └── entities/
                └── value-objects/
                    └── unique-entity-id.ts
```

Nota: a pasta `_shared/` (ou `core/`) pode existir para value objects e entidades base compartilhadas entre subdominios, mas deve ser usada com parcimonia — subdominios devem ser o mais independentes possivel.