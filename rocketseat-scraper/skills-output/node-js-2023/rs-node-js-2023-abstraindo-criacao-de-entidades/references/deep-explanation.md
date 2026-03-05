# Deep Explanation: Abstraindo Criacao de Entidades

## O problema que motivou o pattern

Quando entidades DDD herdam de uma classe base `Entity`, o construtor fica na classe pai. Campos como `createdAt` sao obrigatorios na entidade (sempre existem depois de criada), mas nao deveriam ser passados manualmente na criacao — deveriam ser preenchidos automaticamente.

O instrutor (Diego) explica que a solucao ingenua seria sobrescrever o construtor na classe filha com `super()`, mas isso quebra o reaproveitamento do construtor da classe pai e adiciona complexidade desnecessaria.

## A solucao: metodo estatico `create()`

Um metodo estatico nao precisa de instancia para ser chamado — `Question.create()` ao inves de `new Question()`. Isso funciona como um "construtor alternativo" que:

1. Recebe props com alguns campos opcionais (via `Optional<T, K>`)
2. Preenche os defaults (`createdAt: new Date()`)
3. Chama `new` internamente (possivel porque esta dentro da classe, e o construtor e `protected`)
4. Retorna a instancia pronta

## Por que `protected` e nao `private`?

O construtor precisa ser `protected` (nao `private`) porque as classes filhas precisam chama-lo via `new` dentro do seu proprio `create()`. Se fosse `private`, nem as subclasses teriam acesso.

O efeito colateral desejado: ninguem fora da hierarquia de classes pode dar `new Answer()` — e forcado a usar `Answer.create()`.

## A distincao crucial: opcional na criacao vs opcional na entidade

Diego enfatiza um ponto sutil:

- `createdAt` **nao e opcional** na entidade — toda entidade criada SEMPRE tera essa data
- `createdAt` **e opcional na criacao** — porque sera preenchido automaticamente

Colocar `createdAt?: Date` na interface Props seria errado, porque depois de criada, a entidade sempre tem esse campo. A solucao e o utility type `Optional<T, K>` que torna campos opcionais APENAS no parametro do `create()`.

## O utility type Optional

```typescript
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
```

Decompondo:
- `Pick<Partial<T>, K>` — pega apenas as chaves K e torna opcionais
- `Omit<T, K>` — pega todo o resto sem modificar
- `&` — combina os dois, resultando no tipo original mas com K opcional

Diego menciona que usa `Pick`, `Partial` e `Omit` do TypeScript, e que nao e dificil de entender depois que voce conhece esses utility types.

## Pattern de ID: criar ou reaproveitar

No `create()`, o segundo parametro `id?: UniqueEntityId` permite dois cenarios:

- **Criando entidade nova:** nao passa id → `new UniqueEntityId()` gera um novo
- **Reconstruindo do banco:** passa id existente → reutiliza o valor

Isso e fundamental em DDD porque entidades precisam manter identidade quando carregadas de persistencia.

## Conversao de tipos no use case

Diego mostra que strings vindas de fora do dominio (como `instructorId` e `questionId`) devem ser convertidas em `UniqueEntityId` na camada de use case:

```typescript
authorId: new UniqueEntityId(instructorId)
```

Isso garante que o dominio trabalha com tipos fortes. O `UniqueEntityId` nao cria um novo ID — ele encapsula o valor string existente como Value Object.