# Deep Explanation: Migrations no Drizzle

## Por que o Drizzle nao tem CLI para migrations?

Diferente do Prisma e outros ORMs que abstraem a conexao com o banco, o Drizzle funciona como uma camada fina sobre o driver nativo. Ele nao e uma "ponte" entre aplicacao e banco — ele recebe SQL na sintaxe JavaScript, repassa ao driver nativo (postgres.js), e trata a resposta. Por causa dessa arquitetura "zero overhead", migrations sao executadas programaticamente.

O instrutor enfatiza: "O Drizzle nao e uma ponte entre a sua aplicacao e o banco de dados. Ele nao tem nada ali no meio. Todas as operacoes sao executadas diretamente no banco de dados."

## Conexao nativa vs ORM tradicional

O Drizzle usa a conexao nativa do PostgreSQL para Node (postgres.js). Voce cria a conexao com o driver nativo e simplesmente "repassa" ao Drizzle:

```
postgres (driver nativo) → drizzle(connection) → operacoes SQL
```

Isso significa que o Drizzle nao gerencia conexoes — ele delega ao driver. Por isso, ao fazer migrations, voce controla diretamente o pooling via `{ max: 1 }`.

## Por que max: 1?

O parametro `max: 1` desabilita connection pooling. Em migrations, voce quer:
1. Abrir uma unica conexao
2. Executar todas migrations sequencialmente
3. Fechar a conexao

Sem `max: 1`, o postgres.js criaria um pool de conexoes (default: 10), desperdicando recursos para uma operacao que e intrinsecamente sequencial.

## Top-level await

O instrutor destaca que Bun suporta top-level await nativamente — a possibilidade de usar `await` sem uma funcao `async` envolvente, direto na raiz do arquivo. Para funcionar, o tsconfig precisa de:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext"
  }
}
```

## Armadilha do volume Docker compartilhado

O instrutor demonstrou um erro real: ao usar o mesmo nome de volume Docker que outro projeto, o banco ja tinha dados/tabelas de outra aplicacao. O erro "column manager_id of relation restaurants already exists" era causado por isso.

Solucao: cada projeto deve ter volume Docker unico. Renomeie no docker-compose.yml:

```yaml
volumes:
  pizzashop_pg_data:  # Nome unico por projeto
```

E faca `docker compose down` para deletar o container antigo antes de recriar.

## Drizzle Studio vs Prisma Studio

O Drizzle Studio e similar ao Prisma Studio para visualizacao do banco, mas tem uma vantagem: a aba **Query** permite escrever queries usando a sintaxe do Drizzle Query Builder. Isso facilita testar queries antes de integra-las na aplicacao.

Para funcionar, o Studio precisa do pacote `pg` instalado (como devDependency).

## Ecossistema de integrações do Drizzle

O Drizzle tem integrações com diversos drivers e servicos:
- Bun SQLite (banco em memoria)
- PostgresJS (driver nativo Node)
- Neon (serverless Postgres)
- Expo SQL (mobile)
- E muitos outros

Cada integracao e um pacote separado em `drizzle-orm/*`. Para este projeto, usamos `drizzle-orm/postgres-js`.