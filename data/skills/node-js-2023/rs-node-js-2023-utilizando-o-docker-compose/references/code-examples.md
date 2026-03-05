# Code Examples: Docker Compose para Desenvolvimento

## Exemplo 1: docker-compose.yml completo da aula

```yaml
version: '3'

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=ignitenode03
```

## Exemplo 2: Comando docker run original (antes do Docker Compose)

```bash
docker run \
  --name api-solid-pg \
  -e POSTGRESQL_USERNAME=docker \
  -e POSTGRESQL_PASSWORD=docker \
  -e POSTGRESQL_DATABASE=ignitenode03 \
  -p 5432:5432 \
  bitnami/postgresql
```

## Exemplo 3: Comandos de gerenciamento

```bash
# Subir todos os containers em background
docker compose up -d

# Verificar containers rodando
docker ps

# Parar containers (PRESERVA dados)
docker compose stop

# Reiniciar containers (reusa existentes)
docker compose up -d

# CUIDADO: Deletar containers (PERDE dados)
docker compose down
```

## Exemplo 4: Fluxo completo apos clonar o projeto

```bash
# 1. Clonar o repositorio
git clone <repo-url>
cd <projeto>

# 2. Instalar dependencias
npm install

# 3. Subir banco de dados
docker compose up -d

# 4. Rodar migrations para criar tabelas
npx prisma migrate dev

# 5. Verificar banco funcionando
npx prisma studio
```

## Exemplo 5: Quando o container foi deletado acidentalmente

```bash
# Container foi removido (docker rm ou docker compose down)
# Subir novamente cria container novo VAZIO
docker compose up -d

# OBRIGATORIO: recriar tabelas no banco vazio
npx prisma migrate dev

# Dados anteriores foram perdidos — apenas estrutura e recriada
```

## Exemplo 6: Resolvendo conflito de nome de container

```bash
# Se ja existe container com mesmo nome de um docker run anterior
docker stop api-solid-pg
docker rm api-solid-pg

# Agora o docker compose pode criar sem conflito
docker compose up -d
```

## Exemplo 7: Docker Compose com multiplos servicos (extensao)

```yaml
version: '3'

services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=ignitenode03

  api-solid-redis:
    image: bitnami/redis
    ports:
      - 6379:6379
    environment:
      - REDIS_PASSWORD=docker
```

```bash
# Um comando sobe TODOS os servicos
docker compose up -d

# Um comando para TODOS
docker compose stop
```

## Alternativa: docker-compose com hifen

```bash
# Se "docker compose" nao funcionar (versao antiga do Docker)
docker-compose up -d
docker-compose stop
docker-compose down
```