---
name: rs-ia-node-marketplace-listagem-catalogo-2
description: "Applies NestJS catalog listing patterns with PostgreSQL integration when building product APIs. Use when user asks to 'list products', 'query database in NestJS', 'join tables in raw SQL', 'add search filtering', or 'integrate Postgres with NestJS service'. Covers typed raw queries, json_build_object for joins, parameterized search with wildcards, and proper connection lifecycle. Make sure to use this skill whenever implementing catalog or product listing endpoints with raw PostgreSQL in NestJS. Not for ORM-based queries (TypeORM/Prisma), frontend catalog display, or AI/embedding search."
---

# Listagem de Catalogo com PostgreSQL Raw Queries no NestJS

> Ao implementar listagem de produtos com raw SQL no NestJS, tipar queries, usar json_build_object para joins, e parametrizar buscas com wildcards.

## Rules

1. **Tipar queries com generics** — `client.query<Product>(sql)` para que o retorno seja tipado, porque sem isso o resultado e `any` e bugs de tipagem passam silenciosamente
2. **Usar json_build_object para relacionamentos** — montar objetos aninhados direto no SQL ao inves de manipular no codigo, porque reduz mapeamento manual e entrega o formato final da API
3. **Parametrizar buscas com $1, $2** — nunca concatenar strings no SQL, usar array de parametros, porque previne SQL injection
4. **Fechar conexao no shutdown** — implementar `onApplicationShutdown` com `client.end()`, porque conexoes abertas impedem testes de encerrar e vazam recursos em producao
5. **Habilitar shutdown hooks** — chamar `app.enableShutdownHooks()` tanto na main quanto nos testes, porque sem isso o lifecycle hook nao executa
6. **Condicionar parametros de busca** — se nao ha search, nao enviar array de parametros; se ha, enviar com wildcards `%search%`, porque array vazio causa erro no pg

## How to write

### Query tipada com join e json_build_object

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  store_id: number;
  embedding: string;
}

const result = await this.postgresService.client.query<Product>(`
  SELECT
    products.id,
    products.name,
    products.price,
    products.embedding,
    json_build_object(
      'id', stores.id,
      'name', stores.name
    ) as store
  FROM products
  JOIN stores ON stores.id = products.store_id
`);

return result.rows;
```

### Busca parametrizada condicional

```typescript
async findAll(search?: string) {
  let query = `
    SELECT products.id, products.name, products.price, products.embedding,
      json_build_object('id', stores.id, 'name', stores.name) as store
    FROM products
    JOIN stores ON stores.id = products.store_id
  `;

  if (search) {
    query += ` WHERE products.name ILIKE $1`;
    const result = await this.postgresService.client.query(query, [`%${search}%`]);
    return result.rows;
  }

  const result = await this.postgresService.client.query(query);
  return result.rows;
}
```

### Lifecycle correto no servico Postgres

```typescript
@Injectable()
export class PostgresService implements OnApplicationShutdown {
  public client: Client;

  async onModuleInit() {
    this.client = new Client({ connectionString: process.env.DATABASE_URL });
    await this.client.connect();
  }

  async onApplicationShutdown() {
    await this.client.end();
  }
}
```

## Example

**Before (conexao vazando, sem tipagem, sem busca):**
```typescript
async findAll() {
  const result = await this.postgresService.client.query('SELECT * FROM products');
  return result;
}
```

**After (tipado, join, busca, lifecycle correto):**
```typescript
async findAll(search?: string) {
  let query = `
    SELECT products.id, products.name, products.price, products.embedding,
      json_build_object('id', stores.id, 'name', stores.name) as store
    FROM products
    JOIN stores ON stores.id = products.store_id
  `;

  if (search) {
    query += ` WHERE products.name ILIKE $1`;
    return (await this.postgresService.client.query(query, [`%${search}%`])).rows;
  }

  return (await this.postgresService.client.query(query)).rows;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de dados de tabela relacionada | JOIN + json_build_object no SQL |
| Parametro de busca opcional | Condicionar query e array de params separadamente |
| Teste nao encerra | Verificar enableShutdownHooks + app.close() no afterAll |
| result retorna any | Passar interface como generic no query<T> |
| Alias de importacao falha nos testes | Usar caminho relativo como fallback |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return result` (objeto inteiro do pg) | `return result.rows` |
| `query('... ' + search + ' ...')` | `query('... $1 ...', [\`%${search}%\`])` |
| `query(sql, [])` (array vazio sem params) | `query(sql)` (sem segundo argumento) |
| `SELECT *` com join | Selecionar colunas explicitas + json_build_object |
| Esquecer client.end() | Implementar onApplicationShutdown |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
