---
name: rs-full-stack-propriedade-metodo-privado
description: "Enforces private properties and methods in JavaScript/TypeScript classes using # prefix. Use when user asks to 'create a class', 'encapsulate data', 'hide implementation details', 'make properties private', or 'protect internal state'. Applies rules: use # for internal state, expose only public API methods, never leak storage/persistence internals. Make sure to use this skill whenever generating classes with internal state or data storage. Not for module-level privacy, closures, or TypeScript access modifiers (private keyword)."
---

# Propriedade e Método Privado

> Propriedades e métodos internos de uma classe devem ser privados com `#`, expondo apenas a API pública que consumidores externos precisam.

## Rules

1. **Use `#` para estado interno** — `#database` não `database`, porque estado interno exposto permite sobrescrita acidental por código externo
2. **Exponha apenas métodos de manipulação** — `insert()` e `select()` são públicos, `#persist()` é privado, porque consumidores devem usar a API, não os mecanismos internos
3. **Métodos auxiliares são privados** — se um método existe apenas para suportar outros métodos da classe (como persistir dados), ele recebe `#`, porque não faz parte do contrato público
4. **Renomeie todas as referências ao tornar privado** — ao adicionar `#`, atualize TODOS os locais dentro da classe que referenciam a propriedade, porque `#name` e `name` são identificadores diferentes
5. **Retorne valores seguros para estado vazio** — `return this.#database[table] ?? []`, porque consumidores não devem receber `undefined` ao consultar dados inexistentes

## How to write

### Classe com encapsulamento correto

```javascript
class Database {
  #database = {}
  
  #persist() {
    fs.writeFileSync(this.#databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    const list = this.#database[table] ?? []
    list.push(data)
    this.#database[table] = list
    this.#persist()
  }

  select(table) {
    return this.#database[table] ?? []
  }
}
```

## Example

**Before (tudo público, estado exposto):**
```javascript
class Database {
  database = {}

  persist() {
    fs.writeFileSync(this.databasePath, JSON.stringify(this.database))
  }

  insert(table, data) {
    const list = this.database[table] ?? []
    list.push(data)
    this.database[table] = list
    this.persist()
  }

  select(table) {
    return this.database[table] ?? []
  }
}

// Problema: consumidor pode fazer isso
database.database = "qualquer coisa" // sobrescreveu o estado interno
database.persist() // chamou método interno diretamente
```

**After (encapsulado com #):**
```javascript
class Database {
  #database = {}

  #persist() {
    fs.writeFileSync(this.#databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    const list = this.#database[table] ?? []
    list.push(data)
    this.#database[table] = list
    this.#persist()
  }

  select(table) {
    return this.#database[table] ?? []
  }
}

// Agora o consumidor só vê: insert() e select()
// database.#database → SyntaxError
// database.#persist() → SyntaxError
```

## Heuristics

| Situação | Ação |
|----------|------|
| Propriedade armazena estado interno (cache, dados, config mutável) | Tornar privada com `#` |
| Método existe para suportar outros métodos (salvar, validar, transformar internamente) | Tornar privado com `#` |
| Método é chamado por código externo à classe | Manter público |
| Propriedade é read-only para externos | Usar `#` + getter público |
| Migrando código existente para privado | Selecionar a palavra no editor e verificar TODAS as ocorrências |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `this.database = {}` (estado público) | `this.#database = {}` |
| `persist()` público | `#persist()` privado |
| `return this.database[table]` (pode ser undefined) | `return this.#database[table] ?? []` |
| Renomear só a declaração e esquecer referências | Renomear declaração + TODAS as referências internas |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre encapsulamento, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações