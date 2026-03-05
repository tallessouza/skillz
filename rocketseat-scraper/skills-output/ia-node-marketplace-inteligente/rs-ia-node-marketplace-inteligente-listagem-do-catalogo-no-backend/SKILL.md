---
name: rs-ia-node-marketplace-listagem-catalogo-backend
description: "Applies NestJS catalog module backend setup pattern when user asks to 'create a module', 'setup postgres service', 'list products', 'catalog endpoint', or 'nestjs backend with postgres'. Follows structure: database dump with pgVector, NestJS module/controller/service layers, shared PostgreSQL service with ConfigService, and e2e tests. Make sure to use this skill whenever building NestJS API modules that interact with PostgreSQL. Not for frontend UI, cart logic, or AI/embedding search implementation."
---

# Listagem do Catalogo no Backend

> Ao criar um modulo de backend com NestJS e PostgreSQL, estruture em camadas separadas: dump SQL manual, modulo com controller/service, servico compartilhado de Postgres com ConfigService, e testes e2e desde o inicio.

## Rules

1. **Comece pelo banco de dados** — crie um `dump.sql` manual com CREATE TABLE e seeds, porque para projetos praticos migracao automatica adiciona complexidade desnecessaria
2. **Use pgVector desde o inicio** — `CREATE EXTENSION IF NOT EXISTS vector` no dump, porque embeddings serao necessarios para busca por similaridade
3. **Precos como inteiros** — armazene precos como `INTEGER` (centavos), porque evita problemas de ponto flutuante
4. **Um servico compartilhado de Postgres** — crie `shared/postgres.service.ts` como Injectable separado, porque multiplos modulos vao precisar de acesso ao banco
5. **Use ConfigService do NestJS** — nunca hardcode variaveis de ambiente, use `configService.getOrThrow()` porque falha rapido na inicializacao se faltar variavel
6. **Conecte no onApplicationBootstrap** — nao no construtor, porque o NestJS precisa resolver todas as dependencias antes de conectar
7. **Testes e2e primeiro** — escreva o teste antes de implementar, porque valida o setup completo sem depender de Postman/Insomnia

## How to write

### Dump SQL com pgVector

```sql
CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  store_id INTEGER REFERENCES stores(id),
  embeddings vector
);

-- Seeds
INSERT INTO stores (name) VALUES ('Loja A'), ('Loja B');
INSERT INTO products (name, description, price, store_id) VALUES
  ('Produto 1', 'Descricao', 2990, 1);
```

### Modulo NestJS com camadas

```typescript
// catalog.module.ts
@Module({
  controllers: [CatalogController],
  providers: [CatalogService, PostgresService],
})
export class CatalogModule {}

// catalog.controller.ts
@Controller('catalog')
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @Get()
  async getCatalog() {
    return this.catalogService.getCatalog()
  }
}

// catalog.service.ts
@Injectable()
export class CatalogService {
  constructor(private postgresService: PostgresService) {}

  async getCatalog() {
    return this.postgresService.query('SELECT * FROM products')
  }
}
```

### PostgresService compartilhado

```typescript
// shared/postgres.service.ts
@Injectable()
export class PostgresService implements OnApplicationBootstrap {
  private client: Client
  private readonly logger = new Logger(PostgresService.name)

  constructor(private configService: ConfigService) {
    this.client = new Client({
      user: this.configService.getOrThrow('POSTGRES_USER'),
      password: this.configService.getOrThrow('POSTGRES_PASSWORD'),
      host: this.configService.getOrThrow('POSTGRES_HOST'),
      port: Number(this.configService.getOrThrow('POSTGRES_PORT')),
      database: this.configService.getOrThrow('POSTGRES_DB'),
    })
  }

  async onApplicationBootstrap() {
    try {
      await this.client.connect()
      this.logger.log('Connected to PostgreSQL')
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL', error)
    }
  }
}
```

## Example

**Before (setup incompleto, sem testes):**
```typescript
// Hardcoded, sem ConfigService, conexao no construtor
const client = new Client({ host: 'localhost', port: 5432 })
client.connect() // promise nao tratada no construtor
```

**After (with this skill applied):**
```typescript
// ConfigService + onApplicationBootstrap + Logger
@Injectable()
export class PostgresService implements OnApplicationBootstrap {
  private client: Client
  private readonly logger = new Logger(PostgresService.name)

  constructor(private configService: ConfigService) {
    this.client = new Client({
      user: this.configService.getOrThrow('POSTGRES_USER'),
      // ... demais variaveis
    })
  }

  async onApplicationBootstrap() {
    await this.client.connect()
    this.logger.log('Connected to PostgreSQL')
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto pratico/MVP | Dump SQL manual, sem migrations |
| Vai ter busca por similaridade | Ative pgVector no dump desde o inicio |
| Multiplos modulos acessam banco | Crie PostgresService em pasta shared |
| Variavel de ambiente obrigatoria | Use `getOrThrow()`, nunca `get()` |
| Precisa testar rota completa | Teste e2e com supertest, verifique status e body |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.POSTGRES_HOST` direto | `configService.getOrThrow('POSTGRES_HOST')` |
| `await client.connect()` no constructor | Implemente `OnApplicationBootstrap` |
| `console.log('connected')` | `this.logger.log('Connected')` com Logger do NestJS |
| `price DECIMAL` para precos | `price INTEGER` (centavos) |
| Controller chamando banco direto | Controller → Service → PostgresService |
| Testar so com Postman | Escreva teste e2e com Jest + supertest |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
