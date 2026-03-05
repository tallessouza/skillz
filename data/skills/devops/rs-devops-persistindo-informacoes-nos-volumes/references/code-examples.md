# Code Examples: Persistencia de Dados com Docker Volumes

## Exemplo 1: Fluxo completo da aula

### Passo 1 — Verificar container rodando
```bash
docker ps
# CONTAINER ID   IMAGE           STATUS          PORTS
# def123abc      api-skillz:v3   Up 5 minutes    0.0.0.0:3000->3000/tcp
```

### Passo 2 — Entrar no container
```bash
docker exec -it def123abc bash
```

### Passo 3 — Listar arquivos e criar novo
```bash
ls src/
# index.js  package.json  node_modules/

touch src/file.log

ls src/
# index.js  package.json  node_modules/  file.log
```

### Passo 4 — Sair, parar e recriar com volume
```bash
exit
docker stop def123abc
docker run -d -v meu-volume:/app/src --network minha-rede -p 3000:3000 api-skillz:v3
```

### Passo 5 — Verificar persistencia
```bash
docker exec -it <novo-id> bash
ls src/
# index.js  package.json  node_modules/  file.log  ← PERSISTIU
cat src/file.log
# (vazio, porque so fizemos touch)
```

## Exemplo 2: Recriar SEM volume (dados inacessiveis)

```bash
# Parar container atual
docker stop <container-id>

# Rodar SEM -v
docker run -d --network minha-rede -p 3000:3000 api-skillz:v3

# Verificar — sem volume montado
docker inspect <novo-id> | grep -A 10 "Mounts"
# "Mounts": []   ← VAZIO

# Entrar e verificar
docker exec -it <novo-id> bash
ls src/
# index.js  package.json  node_modules/   ← SEM file.log
```

## Exemplo 3: Volume continua existindo independentemente

```bash
# Mesmo sem container usando, o volume existe
docker volume inspect meu-volume
# [
#     {
#         "CreatedAt": "2024-01-15T10:30:00Z",
#         "Driver": "local",
#         "Labels": {},
#         "Mountpoint": "/var/lib/docker/volumes/meu-volume/_data",
#         "Name": "meu-volume",
#         "Options": {},
#         "Scope": "local"
#     }
# ]

# Reassociar — dados voltam
docker run -d -v meu-volume:/app/src -p 3000:3000 api-skillz:v3
docker exec -it <id> bash
ls src/
# file.log EXISTE novamente
```

## Exemplo 4: Aplicacao pratica — banco de dados

```bash
# Criar volume nomeado para PostgreSQL
docker volume create postgres-data

# Rodar Postgres COM volume
docker run -d \
  --name meu-postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  postgres:15

# Mesmo deletando o container, os dados do banco persistem
docker rm -f meu-postgres

# Recriar — banco com todos os dados intactos
docker run -d \
  --name meu-postgres \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=senha123 \
  -p 5432:5432 \
  postgres:15
```

## Exemplo 5: docker-compose com volumes (padrao recomendado)

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    image: api-skillz:v3
    ports:
      - "3000:3000"
    volumes:
      - app-data:/app/src
    networks:
      - app-network

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: senha123
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  app-data:      # volume nomeado — persiste entre docker-compose down/up
  postgres-data:  # volume nomeado — dados do banco seguros

networks:
  app-network:
```

```bash
# Subir
docker-compose up -d

# Derrubar (volumes preservados)
docker-compose down

# Derrubar E deletar volumes (CUIDADO — perda de dados)
docker-compose down -v
```

## Comandos uteis para debug de volumes

```bash
# Listar todos os volumes
docker volume ls

# Inspecionar volume especifico
docker volume inspect <nome-do-volume>

# Ver quais containers usam um volume
docker ps -a --filter volume=<nome-do-volume>

# Remover volumes orfaos (sem container associado)
docker volume prune

# Remover volume especifico
docker volume rm <nome-do-volume>

# Backup de volume para arquivo tar
docker run --rm -v <volume>:/data -v $(pwd):/backup alpine \
  tar czf /backup/volume-backup.tar.gz -C /data .

# Restaurar volume de backup
docker run --rm -v <volume>:/data -v $(pwd):/backup alpine \
  tar xzf /backup/volume-backup.tar.gz -C /data
```