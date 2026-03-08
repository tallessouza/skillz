# Code Examples: Gerando Tabelas e Abrindo Banco de Dados

## Comando principal: executar migration

```bash
# No terminal integrado do VS Code
npx prisma migrate dev
```

Quando solicitado o nome:
```
? Enter a name for the new migration: › Create-tables
```

Output esperado:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "rocketlog", schema "public" at "localhost:5432"

Applying migration `20240315120000_create_tables`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240315120000_create_tables/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.x.x) to ./node_modules/@prisma/client in 85ms
```

## Verificar via Beekeeper Studio

Configuração de conexão:
```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: rocketlog
```

Após conectar, navegar em: `Public > Tables` para ver as tabelas criadas.

## Abrir Prisma Studio

```bash
npx prisma studio
```

Output:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
```

Abre automaticamente no navegador com interface visual das tabelas.

## Variações úteis

### Resetar banco e reaplicar todas migrations

```bash
# CUIDADO: apaga todos os dados!
npx prisma migrate reset
```

### Verificar status das migrations

```bash
npx prisma migrate status
```

Output esperado:
```
1 migration found in prisma/migrations

Status:
  Database schema is up to date!
```

### Gerar migration sem aplicar (apenas SQL)

```bash
npx prisma migrate dev --create-only
```

Isso gera o arquivo SQL mas não executa — útil para revisar antes de aplicar.

### Aplicar em produção

```bash
# NUNCA use "migrate dev" em produção
npx prisma migrate deploy
```

## Estrutura de arquivos após migration

```
prisma/
├── schema.prisma          # Definição dos models
└── migrations/
    ├── 20240315120000_create_tables/
    │   └── migration.sql  # SQL gerado automaticamente
    └── migration_lock.toml # Lock do provider (postgresql)
```

### Conteúdo típico do migration.sql gerado

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    -- ... outros campos

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_logs" (
    "id" TEXT NOT NULL,
    "delivery_id" TEXT NOT NULL,
    -- ... outros campos

    CONSTRAINT "delivery_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_logs" ADD CONSTRAINT "delivery_logs_delivery_id_fkey"
    FOREIGN KEY ("delivery_id") REFERENCES "deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```