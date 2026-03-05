# Deep Explanation: Caso de Uso de Check-in

## Por que UncheckedCreateInput vs CreateInput?

O Prisma gera dois tipos de input para cada model:

- **`CheckIn.CreateInput`**: Usado quando voce quer criar a entidade E seus relacionamentos ao mesmo tempo. Exemplo: criar um check-in e simultaneamente criar uma academia. Usa a sintaxe `{ user: { connect: { id } } }` ou `{ user: { create: { ... } } }`.

- **`CheckIn.UncheckedCreateInput`**: Usado quando os relacionamentos (user, gym) ja existem no banco. Aceita os IDs diretamente: `{ user_id: '...', gym_id: '...' }`. E o caso do check-in, porque o usuario e a academia precisam existir antes.

O instrutor destaca que o nome "unchecked" e confuso, mas a logica e simples: se os registros relacionados ja existem, use Unchecked. Se precisa criar junto, use o padrao.

## Por que randomUUID ao inves de IDs fixos?

O instrutor percebeu durante o desenvolvimento que IDs fixos como `'user-1'` causam problemas quando multiplos testes criam entidades no mesmo repositorio in-memory. Com `randomUUID()` de `node:crypto`:

- Cada entidade tem ID unico garantido
- Testes podem rodar em paralelo sem colisao
- O prefixo `node:` indica explicitamente que e uma biblioteca interna do Node, melhorando a resolucao de modulos

## O problema do await com expect.rejects

O instrutor destaca que descobriu esse problema depois de gravar aulas anteriores e precisou voltar para corrigir. Sem `await`:

```typescript
// PERIGO: teste pode passar sem validar
expect(asyncFunction()).rejects.toBeInstanceOf(Error)
// O Vitest/Jest nao espera a promise resolver
// O teste termina antes da assertion ser avaliada
```

Com `await`:

```typescript
// CORRETO: teste espera a promise antes de validar
await expect(asyncFunction()).rejects.toBeInstanceOf(Error)
```

Isso afeta tanto `.rejects` quanto `.resolves`. Sem await, o teste pode:
1. Gerar falsos positivos (passa quando deveria falhar)
2. Nao cobrir linhas no coverage report
3. Mascarar bugs reais

## Desenvolvimento incremental de use cases

O instrutor enfatiza: "a gente sempre comeca da maneira mais simples". O use case de check-in no primeiro momento apenas cria o registro, sem validar:
- Se o usuario existe
- Se a academia existe
- Se ja fez check-in no dia
- Se esta proximo da academia

Essas regras de negocio sao adicionadas uma a uma em aulas subsequentes, cada uma com seu proprio teste. Esse padrao incremental permite que cada regra seja testavel isoladamente.

## Padrao de copia e adaptacao

O instrutor usa uma tecnica pratica: copiar um use case existente e adaptar. Seleciona o nome do use case com multi-cursor (Ctrl+D) e substitui de uma vez. Isso garante que a estrutura base (constructor injection, interface de request/response, metodo execute) se mantem consistente entre todos os use cases.