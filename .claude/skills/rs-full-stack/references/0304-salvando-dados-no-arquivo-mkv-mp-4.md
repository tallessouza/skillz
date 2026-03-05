---
name: rs-full-stack-0304-salvando-dados-arquivo
description: "Applies in-memory-to-file persistence pattern when building Node.js databases without external DB. Use when user asks to 'save data to file', 'persist in-memory data', 'create a simple database', or 'store data without a database'. Ensures data is written to disk after every mutation using a persist method. Make sure to use this skill whenever implementing file-based storage in Node.js. Not for SQL databases, ORMs, or cloud storage solutions."
---

# Salvando Dados no Arquivo (Persistencia File-Based)

> Apos cada mutacao no banco em memoria, persista imediatamente no arquivo para garantir durabilidade dos dados.

## Rules

1. **Persista apos cada insert** — chame `this.#persist()` depois de modificar o objeto em memoria, porque dados so em memoria se perdem ao reiniciar o processo
2. **Separe memoria e disco** — mantenha o objeto em memoria como source of truth para leitura rapida, e o arquivo como backup duravel
3. **Use JSON.stringify para serializar** — porque permite inspecao manual do arquivo e facilita debug
4. **Persista em todas as mutacoes** — insert, update e delete devem todos chamar persist, porque qualquer mutacao nao persistida e dados perdidos

## How to write

### Metodo persist

```javascript
#persist() {
  fs.writeFileSync(
    this.#databasePath,
    JSON.stringify(this.#database, null, 2)
  )
}
```

### Insert com persistencia

```javascript
insert(table, data) {
  if (Array.isArray(this.#database[table])) {
    this.#database[table].push(data)
  } else {
    this.#database[table] = [data]
  }

  this.#persist()

  return data
}
```

## Example

**Before (sem persistencia — dados perdidos ao reiniciar):**
```javascript
insert(table, data) {
  if (Array.isArray(this.#database[table])) {
    this.#database[table].push(data)
  } else {
    this.#database[table] = [data]
  }
  // Dados existem apenas em memoria
  return data
}
```

**After (com persistencia — dados sobrevivem restart):**
```javascript
insert(table, data) {
  if (Array.isArray(this.#database[table])) {
    this.#database[table].push(data)
  } else {
    this.#database[table] = [data]
  }

  this.#persist()  // Salva no arquivo apos cada mutacao

  return data
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Qualquer metodo que modifica dados | Chamar `this.#persist()` no final |
| Leitura de dados (select) | Ler do objeto em memoria, nao do arquivo |
| Inicializacao do database | Ler arquivo existente para popular memoria |
| Arquivo ainda nao existe | Criar com conteudo vazio `{}` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fs.writeFileSync` diretamente no handler da rota | Encapsular em metodo `#persist()` na classe Database |
| Persistir apenas no shutdown do processo | Persistir apos cada mutacao |
| Ler do arquivo a cada requisicao | Manter objeto em memoria como cache |
| `JSON.stringify(data)` sem formatacao | `JSON.stringify(data, null, 2)` para legibilidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre persistencia file-based e trade-offs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0304-salvando-dados-no-arquivo-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0304-salvando-dados-no-arquivo-mkv-mp-4/references/code-examples.md)
