# Deep Explanation: Delete com Knex Query Builder

## Por que o id vem dos parametros da rota

No padrao REST, a operacao DELETE usa a URL para identificar o recurso: `DELETE /courses/2` remove o curso com id 2. O id faz parte da URL (path parameter), nao do body da requisicao. Isso porque:

- DELETE semanticamente nao deveria ter body (algumas implementacoes ignoram o body)
- A URL identifica unicamente o recurso sendo manipulado
- Facilita cache invalidation e logging

## A cadeia Knex para delete

O Knex constroi queries SQL de forma encadeada. Para delete:

```typescript
await knex('courses').where({ id }).delete()
```

Gera o SQL:
```sql
DELETE FROM courses WHERE id = ?
```

A ordem importa:
1. `knex('courses')` — seleciona a tabela
2. `.where({ id })` — aplica o filtro
3. `.delete()` — executa a remocao

## Perigo do delete sem where

Se voce esquecer o `.where()`:

```typescript
await knex('courses').delete()
// Gera: DELETE FROM courses
// APAGA TODOS OS REGISTROS!
```

Isso e equivalente a `TRUNCATE` na pratica. O instrutor enfatiza que o where com id e essencial para garantir que apenas o registro correto seja removido.

## Fluxo completo demonstrado na aula

1. Cria rota `app.delete('/curse/:id', async (request, response) => {...})`
2. Extrai id: `const { id } = request.params`
3. Executa: `await knex('curse').where({ id }).delete()`
4. Retorna: `response.json()`
5. Testa no Insomnia: DELETE `localhost:3303/curse/2`
6. Verifica na listagem e diretamente no banco que o registro foi removido

## Contexto CRUD completo

Esta aula completa o CRUD basico com Knex:
- **Create** — `knex('table').insert(data)`
- **Read** — `knex('table').select()` ou `.where({ id }).first()`
- **Update** — `knex('table').where({ id }).update(data)`
- **Delete** — `knex('table').where({ id }).delete()`

Todos seguem o mesmo padrao: selecionar tabela, aplicar filtro quando necessario, executar operacao.