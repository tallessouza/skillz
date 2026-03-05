# Code Examples: Docker Volumes

## Exemplo completo da aula

### 1. Listar containers em execucao
```bash
docker ps
# CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
# abc123def456   api     ...       ...       Up       ...     ...
```

### 2. Inspecionar container SEM volume
```bash
docker container inspect abc123def456
# Na secao "Mounts":
# "Mounts": []
# Nenhum volume montado
```

### 3. Criar volume nomeado
```bash
docker volume create api-volume
# Retorno: api-volume
```

### 4. Inspecionar o volume
```bash
docker volume inspect api-volume
# [
#     {
#         "CreatedAt": "2024-01-15T10:30:00Z",
#         "Driver": "local",
#         "Labels": {},
#         "Mountpoint": "/var/lib/docker/volumes/api-volume/_data",
#         "Name": "api-volume",
#         "Options": {},
#         "Scope": "local"
#     }
# ]
```

### 5. Parar container existente
```bash
docker ps
# Copiar o ID do container
docker stop abc123def456
```

### 6. Executar container com volume
```bash
docker run -v api-volume:/usr/src/app -p 3333:3333 -d api
# Retorno: novo container ID
```

### 7. Verificar montagem do volume
```bash
docker ps
# Copiar novo container ID
docker container inspect <novo-id>
# Na secao "Mounts":
# "Mounts": [
#     {
#         "Type": "volume",
#         "Name": "api-volume",
#         "Source": "/var/lib/docker/volumes/api-volume/_data",
#         "Destination": "/usr/src/app",
#         "Driver": "local",
#         "Mode": "",
#         "RW": true,
#         "Propagation": ""
#     }
# ]
```

## Variacoes para diferentes cenarios

### Volume para PostgreSQL
```bash
docker volume create postgres-data
docker run \
  -v postgres-data:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  -d \
  postgres:16
```

### Volume para MySQL
```bash
docker volume create mysql-data
docker run \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -p 3306:3306 \
  -d \
  mysql:8
```

### Volume para Redis
```bash
docker volume create redis-data
docker run \
  -v redis-data:/data \
  -p 6379:6379 \
  -d \
  redis:7 redis-server --appendonly yes
```

### Volume para MongoDB
```bash
docker volume create mongo-data
docker run \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  -d \
  mongo:7
```

### Multiplos volumes no mesmo container
```bash
docker volume create app-data
docker volume create app-logs
docker run \
  -v app-data:/usr/src/app/data \
  -v app-logs:/usr/src/app/logs \
  -p 3333:3333 \
  -d \
  api
```

## Comandos de gerenciamento de volumes

```bash
# Listar todos os volumes
docker volume ls

# Remover um volume especifico (container deve estar parado/removido)
docker volume rm api-volume

# Remover todos os volumes nao utilizados
docker volume prune

# Remover volumes orfaos com confirmacao
docker volume prune -f
```

## Fluxo completo: recriar container mantendo dados

```bash
# Container original rodando com volume
docker ps
# abc123   api   Up 2 hours

# Parar e remover container
docker stop abc123
docker rm abc123

# Dados continuam no volume!
docker volume inspect api-volume
# Mountpoint ainda existe com dados

# Recriar container apontando para mesmo volume
docker run -v api-volume:/usr/src/app -p 3333:3333 -d api
# Novo container, mesmos dados
```