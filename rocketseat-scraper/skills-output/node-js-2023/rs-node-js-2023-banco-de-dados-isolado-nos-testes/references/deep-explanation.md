# Deep Explanation: Banco de Dados Isolado nos Testes E2E

## Por que nao usar mocks em testes E2E?

O Diego enfatiza que testes end-to-end precisam ser o mais proximo possivel do ambiente real. Quanto menos mocks (comportamentos ficticios) voce adicionar, melhor. Mocks em E2E geram:

- **Falsos positivos:** o teste passa mas a aplicacao real quebra
- **Falsos negativos:** o teste falha mas a aplicacao funciona

O fluxo deve ser completo: requisicao → controller → service → repository → banco de dados. Exatamente como o usuario faria ao acessar a aplicacao.

## Por que schemas do PostgreSQL?

No PostgreSQL, schemas funcionam como "subdivisoes" dentro do mesmo banco de dados. Voce nao precisa criar um banco novo — basta trocar o parametro `schema` na URL de conexao.

A URL de conexao do PostgreSQL tem este formato:
```
postgresql://user:password@host:port/database?schema=public
```

Ao trocar `schema=public` por `schema=<uuid>`, voce tem um ambiente completamente isolado com todas as tabelas, mas zerado. O banco de desenvolvimento continua intacto.

## Por que o setup file esta fora do Nest?

O arquivo `test/setup-e2e.ts` e chamado pelo Vitest, nao pelo NestJS. Por isso:

- Nao tem acesso ao `ConfigModule` do Nest para carregar variaveis ambiente
- Precisa usar `dotenv/config` diretamente como dependencia de desenvolvimento
- Cria sua propria instancia do `PrismaClient` (separada da aplicacao)

## O truque do process.env

O ponto-chave do pattern e a sobrescrita do `process.env.DATABASE_URL`:

```typescript
process.env.DATABASE_URL = databaseUrl
```

Como o setup roda ANTES dos testes, quando a aplicacao NestJS inicializa dentro do teste, ela le o `process.env.DATABASE_URL` ja modificado. O Prisma da aplicacao se conecta ao schema isolado, nao ao banco original do `.env`.

## beforeAll vs beforeEach — A decisao de performance

Diego discute explicitamente este tradeoff:

- **`beforeAll`/`afterAll`**: 1 schema por arquivo de testes. 10 testes no arquivo compartilham o mesmo banco.
- **`beforeEach`/`afterEach`**: 1 schema por teste individual. Isolamento maximo.

O problema: criar um schema novo (com migrations) leva ~1 segundo. Com 10 testes, sao 10 segundos so de setup. Diego diz que na Rocketseat eles usam `beforeAll` — o tradeoff de performance nao vale a pena.

A solucao para evitar conflitos entre testes do mesmo arquivo: construir os testes pensando nisso (dados unicos por teste, assertions independentes).

## migrate deploy vs migrate dev

- **`migrate dev`**: le o schema Prisma, compara com o banco, detecta mudancas, gera NOVAS migrations. Usado em desenvolvimento.
- **`migrate deploy`**: apenas executa as migrations que ja existem. Usado em CI/CD e testes.

No setup de testes, voce nao quer gerar migrations novas — so quer aplicar as existentes no schema limpo.

## O CASCADE no DROP SCHEMA

```sql
DROP SCHEMA IF EXISTS "uuid" CASCADE
```

- `IF EXISTS`: evita erro se o schema ja foi deletado manualmente
- `CASCADE`: deleta automaticamente tudo que depende do schema (tabelas, indexes, constraints)
- Sem CASCADE, o PostgreSQL recusaria deletar um schema que contem objetos

## executeRawUnsafe — Por que "unsafe"?

O Prisma tem `$executeRaw` (seguro, com template literals) e `$executeRawUnsafe` (aceita strings dinamicas). O DROP SCHEMA precisa do unsafe porque e uma operacao DDL perigosa. Como e so para testes, nao e um problema de seguranca.