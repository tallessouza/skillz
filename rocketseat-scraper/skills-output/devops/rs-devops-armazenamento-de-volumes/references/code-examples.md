# Code Examples: Armazenamento de Volumes no Docker

## Exemplo completo da aula

O `docker-compose.yml` final do modulo inclui rede, variaveis de ambiente e volume:

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://root:root@mysql:3306/app
    networks:
      - app-network

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:

volumes:
  db:
```

## Comandos de verificacao

### Subir containers em background

```bash
docker compose up -d
```

### Verificar containers rodando

```bash
docker ps
```

### Inspecionar container para ver volume montado

```bash
docker container inspect <container_id>
```

No output, procurar pela secao "Mounts":

```json
"Mounts": [
  {
    "Type": "volume",
    "Name": "api_db",
    "Source": "/docker/volumes/api_db/_data",
    "Destination": "/var/lib/mysql",
    "Driver": "local",
    "Mode": "rw",
    "RW": true
  }
]
```

O prefixo `api_` vem do nome do diretorio do projeto.

### Verificar rede do container

No mesmo inspect, a secao "Networks" mostra a rede atribuida:

```json
"Networks": {
  "api-primeira-network": {
    ...
  }
}
```

## Variacoes: volumes para outros bancos

### PostgreSQL

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: root
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### MongoDB

```yaml
services:
  mongo:
    image: mongo:7
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
```

### Redis (quando persistencia e necessaria)

```yaml
services:
  redis:
    image: redis:7
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data

volumes:
  redisdata:
```

## Teste de persistencia

Para validar que o volume funciona:

```bash
# 1. Subir containers
docker compose up -d

# 2. Inserir dados no banco
docker exec -it <mysql_container> mysql -uroot -proot -e "CREATE DATABASE teste; USE teste; CREATE TABLE t(id INT); INSERT INTO t VALUES(1);"

# 3. Derrubar containers
docker compose down

# 4. Subir novamente
docker compose up -d

# 5. Verificar que dados persistiram
docker exec -it <mysql_container> mysql -uroot -proot -e "USE teste; SELECT * FROM t;"
# Resultado: id = 1 (dados persistidos)
```

Sem volume, o passo 5 falharia porque o database `teste` nao existiria mais.