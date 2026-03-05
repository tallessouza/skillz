# Code Examples: Docker Compose — Declarando Multiplos Containers

## Exemplo 1: Verificar instalacao do Docker Compose

```bash
docker compose version
# Docker Compose version v2.x.x
```

Se o Docker Desktop esta instalado, o Docker Compose vem incluido.

## Exemplo 2: Estrutura minima (apenas servico)

Este foi o primeiro exemplo do instrutor — o minimo necessario para funcionar:

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
```

**Resultado:** O container sobe mas falha porque faltam variaveis de ambiente obrigatorias do MySQL.

## Exemplo 3: Servico com variaveis de ambiente (funcional)

Apos o erro, o instrutor adicionou as variaveis:

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
      - MYSQL_USER=admin
      - MYSQL_PASSWORD=secret
```

**Resultado:** Container MySQL inicia corretamente.

## Exemplo 4: Equivalencia docker run vs docker-compose.yml

O que era feito imperativamente:

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=myapp \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWORD=secret \
  mysql:8
```

Se torna declarativo no compose:

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
      - MYSQL_USER=admin
      - MYSQL_PASSWORD=secret
```

## Exemplo 5: Executando e gerenciando

```bash
# Subir em foreground (logs visiveis, Ctrl+C para parar)
docker compose up

# Subir em background
docker compose up -d

# Verificar containers rodando
docker ps

# Parar todos os containers do compose
docker compose down
```

## Exemplo 6: Estrutura completa com rede e volume (preview da proxima aula)

```yaml
version: "3.7"

services:
  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=myapp
    networks:
      - app-network
    volumes:
      - mysql-data:/var/lib/mysql

  api:
    image: my-api:latest
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - app-network

networks:
  app-network:

volumes:
  mysql-data:
```

## Naming automatico

Dado um diretorio chamado `api` com este compose:

```yaml
services:
  mysql:
    image: mysql:8
```

O Docker Compose gera:
- Container: `api_mysql_1`
- Rede default: `api_default`

Dentro da rede, outros containers acessam o MySQL pelo hostname `mysql` (nome do servico).