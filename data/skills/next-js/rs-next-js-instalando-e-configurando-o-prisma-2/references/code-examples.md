# Code Examples: Instalando e Configurando o Prisma

## 1. Entradas no .gitignore

```gitignore
# Volume do PostgreSQL (gerado pelo Docker Compose)
pgdata

# Prisma Client gerado (regenerado com prisma generate)
generated
```

## 2. Comandos de instalacao completos

```bash
# Instalar o Prisma Client (dependency de producao)
npm install @prisma/client

# Instalar o CLI do Prisma (devDependency)
npm install -D prisma

# Inicializar o Prisma com PostgreSQL como provider
npx prisma init --datasource-provider postgresql
```

O `npx prisma init` cria:
- `prisma/schema.prisma` — arquivo de schema
- `.env` — com DATABASE_URL placeholder

## 3. Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Appointment {
  id          String   @id @default(uuid())
  tutorName   String
  petName     String
  phone       String
  description String
  schedule    DateTime

  @@map("appointments")
}
```

### Explicacao campo a campo:

| Campo | Tipo | Decorators | Proposito |
|-------|------|------------|-----------|
| `id` | `String` | `@id @default(uuid())` | Chave primaria, UUID gerado automaticamente |
| `tutorName` | `String` | — | Nome do dono do pet |
| `petName` | `String` | — | Nome do pet |
| `phone` | `String` | — | Telefone de contato (String, nao Int, porque pode ter formatacao) |
| `description` | `String` | — | Descricao do servico agendado |
| `schedule` | `DateTime` | — | Data e hora do agendamento |

## 4. Arquivos de ambiente

### .env (valores reais, NAO commitado)
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/petshop?schema=public"
```

### .env.example (commitado, sem segredos)
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

## 5. Executar a primeira migration

```bash
# Verificar que o Docker esta rodando
docker compose ps

# Criar e aplicar a migration
npx prisma migrate dev --name init
```

Isso gera a pasta `prisma/migrations/` com:
```
prisma/migrations/
└── 20240101000000_init/
    └── migration.sql
```

## 6. Extensao recomendada do VS Code

Instalar a extensao oficial do Prisma para:
- Syntax highlighting no `.prisma`
- Autoformatacao ao salvar
- Autocomplete de tipos e decorators