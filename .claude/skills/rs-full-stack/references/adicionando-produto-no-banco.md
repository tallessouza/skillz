---
name: rs-full-stack-adicionando-produto-no-banco
description: "Enforces Knex insert patterns with typed repositories when writing database insert operations in Node.js/TypeScript. Use when user asks to 'insert into database', 'create a record', 'add to table', 'knex insert', or 'cadastrar no banco'. Applies rules: typed table generics, global .d.ts type files, validate before insert, return 201 status. Make sure to use this skill whenever generating Knex database operations. Not for SELECT queries, migrations, or schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [knex, insert, typescript, database, repository]
---

# Adicionando Produto no Banco com Knex

> Toda operação de insert no banco deve usar tipagem explícita via Generic no Knex para garantir consistência dos dados inseridos.

## Rules

1. **Importe o knex do arquivo de conexão centralizado** — `import { knect } from "@/database/knect"`, porque centralizar a conexão evita duplicação e facilita troca de configuração
2. **Sempre passe o Generic da tabela no knex** — `knect<ProductRepository>("products")`, porque sem tipagem o insert aceita qualquer campo, permitindo erros silenciosos
3. **Crie arquivos .d.ts para tipagens de tabela** — em `database/types/`, porque tipos em `.d.ts` com tipos primitivos ficam disponíveis globalmente sem import
4. **Valide os dados antes do insert** — execute validação antes de `await knect...insert()`, porque dados inválidos no banco são mais caros de corrigir depois
5. **Retorne 201 sem corpo após insert** — `return response.status(201).json()`, porque 201 Created é o status semântico correto para criação de recurso
6. **Nomeie tipos como `{Entity}Repository`** — singular, porque representa tanto um registro quanto a estrutura da tabela

## How to write

### Tipo da tabela (.d.ts global)

```typescript
// database/types/product-repository.d.ts
type ProductRepository = {
  id: number
  name: string
  price: number
  created_at: number
}
```

### Insert tipado com Knex

```typescript
import { knect } from "@/database/knect"

// Após validação dos dados
await knect<ProductRepository>("products").insert({
  name,
  price,
})

return response.status(201).json()
```

## Example

**Before (sem tipagem — aceita qualquer campo):**
```typescript
await knect("products").insert({
  nome: name,       // campo errado, sem erro
  valor: price,     // campo errado, sem erro
  foo: "bar",       // campo inexistente, sem erro
})
```

**After (com tipagem — erro em tempo de desenvolvimento):**
```typescript
await knect<ProductRepository>("products").insert({
  name,    // ✓ autocomplete disponível
  price,   // ✓ tipo validado
  // foo: "bar"  → erro: propriedade não existe em ProductRepository
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Novo insert em tabela existente | Use o tipo `{Entity}Repository` existente como Generic |
| Nova tabela | Crie `.d.ts` em `database/types/` antes de escrever queries |
| Tipos usam apenas primitivos (string, number) | Use `.d.ts` — disponível globalmente sem import |
| Tipos importam outros módulos | Use `.ts` normal com export/import |
| Retorno após insert | 201 sem corpo, a menos que o cliente precise do ID criado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `knect("products").insert({...})` sem Generic | `knect<ProductRepository>("products").insert({...})` |
| Tipos de tabela inline no controller | Arquivo `.d.ts` separado em `database/types/` |
| `return response.status(200).json(...)` após insert | `return response.status(201).json()` |
| Tipo chamado `ProductType` ou `IProduct` | `ProductRepository` (convenção da aplicação) |
| Insert sem validação prévia | Validar campos antes de chamar `.insert()` |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Insert aceita campos inexistentes sem erro | Faltou Generic no `knect()` | Adicione `knect<ProductRepository>("products")` |
| Tipo não encontrado sem import | Arquivo `.d.ts` não está em pasta reconhecida | Mova para `database/types/` e verifique `tsconfig.json` include |
| Erro "column does not exist" no banco | Nome do campo no código difere da coluna real | Compare nomes no tipo com as colunas da migration |
| Response retorna 200 após insert | Status padrão do Express é 200 | Use `response.status(201).json()` explicitamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre .d.ts global, padrão Repository e fluxo validate-then-insert
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações