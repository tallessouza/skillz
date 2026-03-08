---
name: rs-full-stack-0417-atualizando-ticket
description: "Applies the update record pattern in Node.js file-based databases when user asks to 'update a record', 'edit entry', 'implement PUT endpoint', 'modify database row', or 'create update method'. Enforces findIndex lookup, spread-merge for partial updates, persist after mutation, and updated_at timestamp. Make sure to use this skill whenever implementing update/PUT operations on in-memory or file-based databases. Not for SQL databases, ORMs, or frontend state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, database, update, spread-operator, findIndex]
---

# Atualizando Registros em Banco de Dados (File-based)

> Ao atualizar um registro, localize pelo indice, mescle com spread operator preservando dados existentes, e persista no arquivo.

## Rules

1. **Use `findIndex` para localizar o registro** — `find` retorna o objeto, mas voce precisa do indice para sobrescrever no array, porque a posicao exata e necessaria para mutacao in-place
2. **Valide se o registro existe antes de atualizar** — `findIndex` retorna `-1` quando nao encontra, sempre verifique `rowIndex > -1` antes de modificar
3. **Use spread operator para merge parcial** — `{ ...dadosAtuais, ...novosDados }` preserva campos nao enviados e sobrescreve apenas os enviados, porque isso permite atualizacao parcial sem perder dados
4. **Sempre adicione `updated_at` na atualizacao** — `new Date()` no momento do update, separado do `created_at` que nunca muda, porque rastrear quando o registro foi modificado pela ultima vez e padrao em qualquer banco de dados
5. **Persista apos a mutacao** — chame o metodo de persistencia (`persist()`) depois de modificar o array em memoria, porque sem isso a alteracao se perde ao reiniciar o servidor

## How to write

### Metodo update no banco

```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex],
      ...data,
    }

    this.#persist()
  }
}
```

### Controller chamando o update

```javascript
// No handler da rota PUT
const { equipamento, descricao } = req.body

database.update('tickets', id, {
  equipamento,
  descricao,
  updated_at: new Date(),
})
```

## Example

**Before (update ingenuo que perde dados):**
```javascript
update(table, id, data) {
  const item = this.#database[table].find(row => row.id === id)
  // Sobrescreve o objeto inteiro — perde created_at, status, etc.
  item = data
  this.#persist()
}
```

**After (com merge parcial e validacao):**
```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = {
      ...this.#database[table][rowIndex], // preserva todos os campos existentes
      ...data, // sobrescreve apenas os campos enviados
    }

    this.#persist()
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa do objeto inteiro | Use `find` |
| Precisa da posicao para sobrescrever | Use `findIndex` |
| Update parcial (só alguns campos) | Spread merge: `{ ...atual, ...novo }` |
| Registro nao encontrado | `findIndex` retorna `-1`, trate antes de modificar |
| Campo que nunca muda (created_at) | Nao inclua no objeto `data` do update |
| Campo que sempre atualiza (updated_at) | Passe `new Date()` no controller |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `find()` quando precisa do indice | `findIndex()` para obter a posicao |
| `table[i] = data` (sobrescreve tudo) | `table[i] = { ...table[i], ...data }` |
| Update sem verificar se existe | `if (rowIndex > -1)` antes de modificar |
| Mutacao sem persistir | Sempre chame `persist()` apos alterar |
| `updated_at` no metodo do banco | `updated_at` no controller (responsabilidade de quem chama) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre findIndex vs find, spread merge e persistencia
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Update nao persiste apos reiniciar servidor | `persist()` nao foi chamado apos mutacao | Adicione `this.#persist()` apos modificar o array |
| Campos existentes desaparecem apos update | Sobrescrevendo objeto inteiro sem spread | Use `{ ...dadosAtuais, ...novosDados }` para merge parcial |
| `findIndex` retorna `-1` mas update executa | Nao ha guard clause antes da mutacao | Adicione `if (rowIndex > -1)` antes de modificar |
| `updated_at` nao atualiza | Campo nao esta sendo passado no controller | Passe `updated_at: new Date()` no objeto de dados do update |