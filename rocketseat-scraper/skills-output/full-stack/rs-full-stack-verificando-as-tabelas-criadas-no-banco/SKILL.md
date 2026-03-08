---
name: rs-full-stack-verificando-tabelas-banco
description: "Guides verification of database tables in production after deploy using a database client like Beekeeper Studio. Use when user asks to 'verify tables after deploy', 'check if migrations ran', 'compare database with Prisma models', 'inspect production database', or 'confirm deploy created tables'. Make sure to use this skill whenever validating that a deploy successfully executed database migrations. Not for writing migrations, creating Prisma schemas, or configuring database connections."
---

# Verificando Tabelas Criadas no Banco

> Apos cada deploy, verifique se as migrations foram executadas comparando as tabelas do banco de producao com os modelos do Prisma.

## Prerequisites

- Banco de dados em producao acessivel
- Cliente de banco de dados (Beekeeper Studio, DBeaver, pgAdmin ou similar)
- Conexao salva com as credenciais do banco de producao
- Schema Prisma com os modelos definidos

## Steps

### Step 1: Conectar ao banco de producao

Abrir o cliente de banco de dados e usar a conexao previamente configurada para o banco em producao.

```
Host: {production-host}
Port: {port}
Database: {database-name}
User: {user}
Password: {password}
```

### Step 2: Listar as tabelas criadas

Apos conectar, verificar quais tabelas existem no banco. Comparar com os modelos definidos no `prisma/schema.prisma`.

```sql
-- PostgreSQL: listar tabelas
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### Step 3: Comparar colunas com os modelos Prisma

Para cada modelo no schema Prisma, abrir a tabela correspondente e verificar se as colunas foram criadas corretamente.

**Checklist por tabela:**
- Nome da tabela corresponde ao modelo (snake_case)
- Todas as colunas existem com os tipos corretos
- Campos `id`, `createdAt`, `updatedAt` presentes quando definidos
- Relacionamentos (foreign keys) criados corretamente

```sql
-- PostgreSQL: verificar colunas de uma tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users';
```

### Step 4: Confirmar que a migration foi executada no build

A migration e executada automaticamente durante o processo de build/deploy. Verificar a tabela `_prisma_migrations` para confirmar:

```sql
SELECT migration_name, finished_at, applied_steps_count
FROM _prisma_migrations
ORDER BY finished_at DESC;
```

## Output format

Relatorio de verificacao:

```
Verificacao pos-deploy:
[x] Tabela users — colunas: id, name, email, password, rule, createdAt, updatedAt
[x] Tabela delivers — colunas: id, userId, description, status, createdAt, updatedAt
[x] Tabela deliver_logs — colunas: id, description, deliverId, createdAt, updatedAt
[x] Migrations aplicadas: {count} migrations executadas com sucesso
```

## Error handling

- Se tabelas nao existem: verificar logs do build/deploy para erros na migration
- Se colunas estao faltando: comparar versao do schema com a ultima migration gerada
- Se conexao falha: verificar credenciais e regras de firewall/security group

## Verification

- Cada modelo Prisma tem uma tabela correspondente no banco
- Cada campo do modelo tem uma coluna correspondente com tipo correto
- Tabela `_prisma_migrations` mostra todas as migrations como aplicadas
- Nenhuma tabela orfã (sem modelo correspondente) existe inesperadamente

## Heuristics

| Situacao | Acao |
|----------|------|
| Tabela existe mas falta coluna | Verificar se migration mais recente foi aplicada |
| Tabela nao existe | Verificar se `npx prisma migrate deploy` rodou no build |
| Tipos diferentes do esperado | Comparar migration SQL com schema Prisma |
| Foreign key ausente | Verificar relacoes no schema e re-gerar migration |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre verificacao pos-deploy e fluxo de migrations
- [code-examples.md](references/code-examples.md) — Queries de verificacao e exemplos de schema Prisma