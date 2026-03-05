# Code Examples: Docker Compose

## Exemplo 1: Arquivo completo da aula (Pet Shop)

O arquivo docker-compose.yml usado no projeto Pet Shop do curso:

```yaml
version: '3'

services:
  postgres:
    image: postgres:17
    container_name: petshop-pg
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### Walkthrough linha por linha:

1. **`version: '3'`** — Define o formato do Compose file. Versao 3 e padrao moderno.
2. **`services:`** — Bloco que lista todos os containers a serem criados.
3. **`postgres:`** — Nome do servico (escolhido pelo dev, nao e keyword).
4. **`image: postgres:17`** — Imagem oficial do Postgres, versao 17 (LTS).
5. **`container_name: petshop-pg`** — Nome fixo para facil identificacao.
6. **`restart: always`** — Reinicia automaticamente se o container cair.
7. **`ports: - "5432:5432"`** — Mapeia porta do host para o container.
8. **`environment:`** — Variaveis lidas na primeira inicializacao do Postgres.
9. **`volumes: - pgdata:/var/lib/postgresql/data`** — Persiste dados no volume nomeado.
10. **`volumes: pgdata:`** — Declaracao top-level do volume para gerenciamento pelo Docker.

## Exemplo 2: Variacao com porta alternativa

Quando a porta 5432 ja esta em uso (outro Postgres instalado localmente):

```yaml
services:
  postgres:
    image: postgres:17
    container_name: petshop-pg
    restart: always
    ports:
      - "5433:5432"  # host 5433 -> container 5432
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

A connection string do app usaria `localhost:5433` em vez de `localhost:5432`.

## Exemplo 3: Multiplos servicos

Extensao natural do conceito — adicionando Redis e a aplicacao:

```yaml
version: '3'

services:
  postgres:
    image: postgres:17
    container_name: petshop-pg
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: petshop
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: petshop-redis
    restart: always
    ports:
      - "6379:6379"

  app:
    build: .
    container_name: petshop-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://docker:docker@postgres:5432/petshop

volumes:
  pgdata:
```

Pontos importantes:
- `depends_on` garante ordem de inicializacao
- Na `DATABASE_URL`, o host e `postgres` (nome do servico), nao `localhost`
- Servicos na mesma rede Docker se comunicam pelo nome do servico

## Comandos uteis

```bash
# Subir todos os servicos
docker compose up -d

# Ver containers rodando
docker compose ps

# Ver logs de um servico
docker compose logs postgres

# Parar e remover containers (volumes preservados)
docker compose down

# Parar e remover TUDO incluindo volumes (CUIDADO: perde dados)
docker compose down -v

# Recriar um servico especifico
docker compose up -d --force-recreate postgres
```