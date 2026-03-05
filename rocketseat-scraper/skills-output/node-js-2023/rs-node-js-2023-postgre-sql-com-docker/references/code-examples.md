# Code Examples: PostgreSQL com Docker

## Exemplo completo da aula — Setup do zero

### 1. Verificar Docker instalado

```bash
docker -v
# Docker version 24.x.x (sua versao pode ser diferente)
```

### 2. Criar container PostgreSQL com Bitnami

```bash
docker run --name api-solid-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE=apisolid \
  -p 5432:5432 \
  bitnamilegacy/postgresql
```

**Saida esperada:**
```
postgresql 15:23:45.12 INFO  ==> ** Starting PostgreSQL setup **
postgresql 15:23:45.15 INFO  ==> Creating user "docker"
postgresql 15:23:45.20 INFO  ==> Creating database "apisolid"
...
LOG:  database system is ready to accept connections
```

### 3. Gerenciamento do container

```bash
# Parar (Ctrl+C no terminal onde esta rodando, ou:)
docker stop api-solid-pg

# Listar containers parados
docker ps -a
# CONTAINER ID  IMAGE                          CREATED        STATUS                     NAMES
# abc123def     bitnamilegacy/postgresql       1 minute ago   Exited (0) 25 seconds ago  api-solid-pg

# Reiniciar (sem re-digitar tudo)
docker start api-solid-pg
# Banco no ar instantaneamente

# Ver logs
docker logs api-solid-pg

# Seguir logs em tempo real
docker logs -f api-solid-pg
# (Ctrl+C para sair dos logs sem parar o container)

# Verificar que esta rodando
docker ps
# CONTAINER ID  IMAGE                          STATUS         PORTS                    NAMES
# abc123def     bitnamilegacy/postgresql       Up 5 seconds   0.0.0.0:5432->5432/tcp   api-solid-pg
```

### 4. Remover e recriar (se necessario)

```bash
# Remover container
docker rm api-solid-pg

# Verificar que sumiu
docker ps -a
# (vazio)

# Recriar com docker run (mesmo comando do passo 2)
docker run --name api-solid-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE=apisolid \
  -p 5432:5432 \
  bitnamilegacy/postgresql
```

### 5. Configurar .env para Prisma

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"
```

### 6. Rodar primeira migration

```bash
npx prisma migrate dev
# ? Enter a name for the new migration: createUsers
```

**Resultado:** Cria `prisma/migrations/{timestamp}_create_users/migration.sql`:

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

### 7. Visualizar dados com Prisma Studio

```bash
npx prisma studio
# Environment variables loaded from .env
# Prisma Studio is up on http://localhost:5555
```

Abre no navegador uma interface para ver/editar tabelas e registros.

## Variacoes para outros projetos

### Projeto com nome diferente

```bash
docker run --name meu-ecommerce-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE=ecommerce \
  -p 5432:5432 \
  bitnamilegacy/postgresql
```

### Porta diferente (quando 5432 ja esta em uso)

```bash
docker run --name segundo-projeto-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE=segundoprojeto \
  -p 5433:5432 \
  bitnamilegacy/postgresql
```

```env
# .env para o segundo projeto (nota: porta 5433)
DATABASE_URL="postgresql://docker:docker@localhost:5433/segundoprojeto?schema=public"
```