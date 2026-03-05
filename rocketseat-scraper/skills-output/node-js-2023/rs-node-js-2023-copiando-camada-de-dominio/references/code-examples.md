# Code Examples: Migracao de Camada de Dominio

## Comando tsc --noEmit

```bash
# Type checking sem emitir build (mais rapido)
pnpm tsc --noEmit

# NOTA: use pnpm (binario do node_modules), nao pnpm run
# porque tsc e um binario, nao um script do package.json
```

## Correcao de tipo de retorno vazio

### Antes (em todos os use cases com retorno vazio)
```typescript
// delete-question.ts
type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>
```

### Depois
```typescript
type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
```

Aplicar em todos os use cases que retornam `Either<Error, {}>`.

## Substituicao de any por unknown

### Domain Events
```typescript
// Antes
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}

export class AggregateRoot<Props = any> extends Entity<Props> {
  // ...
}

// Depois
export class AggregateRoot<Props = unknown> extends Entity<Props> {
  // ...
}
```

### Entidades base
```typescript
// Antes
export abstract class Entity<Props = any> {
  // ...
}

// Depois
export abstract class Entity<Props = unknown> {
  // ...
}
```

## Reorganizacao de getters/setters

### Answer entity
```typescript
export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  // ... outros getters sem setter ficam separados
}
```

### Question entity
```typescript
export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(value: QuestionAttachmentList) {
    this.props.attachments = value
    this.touch()
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(value: UniqueEntityID | undefined) {
    this.props.bestAnswerId = value
    this.touch()
  }
}
```

## Configuracao ESLint para no-new

```json
// .eslintrc.json
{
  "rules": {
    "no-new": "off"
  }
}
```

### Contexto: onde o new e usado para side effects
```typescript
// Em arquivos de teste ou setup de Domain Events
new OnAnswerCreated() // constructor chama setupSubscriptions()

// O constructor registra listeners:
class OnAnswerCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(this.execute.bind(this), AnswerCreatedEvent.name)
  }
}
```

## Instalacao de dependencias

```bash
# faker-js: usado em factories de teste
pnpm add -D @faker-js/faker

# dayjs: usado em producao (manipulacao de datas)
pnpm add dayjs
```

## Estrutura de arquivos copiados

```
src/
├── core/              # Copiado: entidades base, Either, errors
├── domain/            # Copiado: entities, use-cases, repositories
├── infra/             # Ja existia: NestJS controllers, modules
└── ...

test/
├── factories/         # Copiado: factory functions com faker
├── repositories/      # Copiado: in-memory repository implementations
└── utils/             # Copiado: utilitarios de teste
```

## Configuracao Vitest (referencia)

```typescript
// vitest.config.ts (unitarios — padrao)
export default defineConfig({
  test: {
    globals: true,
  },
})

// vitest.config.e2e.ts (end-to-end)
export default defineConfig({
  test: {
    globals: true,
    // configuracoes especificas de e2e
  },
})
```

```json
// package.json scripts
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "vitest run --config ./vitest.config.e2e.ts"
  }
}
```