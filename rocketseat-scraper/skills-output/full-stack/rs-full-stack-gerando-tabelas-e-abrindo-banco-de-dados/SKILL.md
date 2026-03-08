---
name: rs-full-stack-gerando-tabelas-e-abrindo-banco
description: "Applies Prisma migration and database inspection workflow when setting up database tables, running migrations, or visualizing data with Prisma Studio. Use when user asks to 'run migrations', 'create tables', 'open prisma studio', 'check database tables', or 'setup prisma migrate'. Guides the full flow from migrate dev to verification via Beekeeper or Prisma Studio. Make sure to use this skill whenever initializing a Prisma-based database or verifying schema changes. Not for writing Prisma schema models, seed scripts, or production deployment migrations."
---

# Gerando Tabelas e Abrindo Banco de Dados

> Execute migrations com Prisma, verifique as tabelas criadas e use Prisma Studio para visualizar dados.

## Prerequisites

- Schema Prisma definido com os models (tabelas) desejados
- Banco de dados PostgreSQL rodando (ex: via Docker Compose)
- `DATABASE_URL` configurada no `.env`
- Se quiser verificar via GUI: Beekeeper Studio instalado (opcional)

## Steps

### Step 1: Executar a migration

```bash
npx prisma migrate dev
```

Quando solicitado, informe um nome descritivo para a migration:

```
? Enter a name for the new migration: › Create-tables
```

Isso gera o SQL em `prisma/migrations/`, aplica no banco e regenera o Prisma Client.

### Step 2: Verificar as tabelas criadas

**Opção A — Beekeeper Studio:**

Conectar usando as credenciais do `.env` (host, porta, usuário, senha, nome do banco). As tabelas aparecem em `Public > Tables`.

**Opção B — Prisma Studio (recomendado):**

```bash
npx prisma studio
```

Abre uma interface web (porta 5555 por padrão) mostrando todas as tabelas e seus registros.

### Step 3: Validar a estrutura

Confirme que cada tabela possui as colunas esperadas (id, campos, relações). Mesmo sem registros, a estrutura deve refletir exatamente o schema Prisma.

## Output format

Após a migration, a estrutura esperada:

```
prisma/
├── schema.prisma
└── migrations/
    └── 20240101120000_create_tables/
        └── migration.sql
```

## Error handling

- Se a migration falhar por conflito: verifique se o banco está limpo ou use `npx prisma migrate reset` (apaga dados — apenas em dev)
- Se o Prisma Studio não abrir: confirme que nenhum processo usa a porta 5555
- Se as tabelas não aparecem no Beekeeper: verifique se está conectado ao banco correto e no schema `public`

## Verification

- [ ] Migration executada sem erros
- [ ] Tabelas visíveis no Prisma Studio ou Beekeeper
- [ ] Colunas correspondem ao schema Prisma definido

## Heuristics

| Situação | Ação |
|----------|------|
| Primeira migration do projeto | Nomeie como `Create-tables` ou `initial-schema` |
| Adicionou novos models ao schema | Execute `npx prisma migrate dev` com nome descritivo da mudança |
| Precisa visualizar dados rapidamente | Use `npx prisma studio` em vez de instalar GUI externa |
| Ambiente de produção | Use `npx prisma migrate deploy` (nunca `dev`) |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Executar `migrate dev` em produção | Use `migrate deploy` em produção |
| Ignorar o nome da migration | Dê nomes descritivos: `Add-delivery-status`, `Create-users-table` |
| Editar arquivos SQL gerados manualmente | Altere o `schema.prisma` e gere nova migration |
| Usar apenas GUI para confirmar schema | Verifique também via `npx prisma studio` que é integrado ao Prisma |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre o fluxo de migrations e ferramentas de visualização
- [code-examples.md](references/code-examples.md) — Comandos completos e variações do workflow