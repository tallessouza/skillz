# Code Examples: Limpando Containers e Imagens Docker

## Fluxo completo da aula

### Listar todos os containers (incluindo parados)

```bash
docker ps -a
```

Output esperado antes da limpeza:
```
CONTAINER ID   IMAGE              COMMAND                  STATUS
abc123def456   bitnami/postgres   "docker-entrypoint.s…"  Exited (0) 2 hours ago
789ghi012jkl   bitnami/redis      "docker-entrypoint.s…"  Up 5 minutes
```

### Remover containers especificos por ID

```bash
docker rm -f abc123def456 789ghi012jkl
```

O `-f` forca remocao mesmo de containers rodando.

### Verificar remocao

```bash
docker ps -a
```

Output esperado:
```
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

### Listar imagens

```bash
docker image ls
```

Output esperado antes da limpeza:
```
REPOSITORY         TAG       IMAGE ID       SIZE
bitnami/postgres   latest    aaa111bbb222   389MB
bitnami/redis      latest    ccc333ddd444   125MB
```

### Remover imagens por ID

```bash
docker rmi aaa111bbb222 ccc333ddd444
```

### Verificar ambiente limpo

```bash
docker image ls
```

Output esperado:
```
REPOSITORY   TAG   IMAGE ID   CREATED   SIZE
```

## Variacoes e alternativas

### Remover todos containers parados de uma vez

```bash
docker container prune -f
```

Mais rapido que copiar IDs individuais quando tem muitos containers.

### Remover todas imagens nao utilizadas

```bash
# So imagens "dangling" (sem tag)
docker image prune -f

# TODAS imagens nao referenciadas por containers
docker image prune -a -f
```

### Limpeza total do Docker

```bash
# Remove containers, images, networks e build cache nao utilizados
docker system prune -a -f

# Incluindo volumes (CUIDADO: perde dados persistidos)
docker system prune -a --volumes -f
```

### Remover por nome ao inves de ID

```bash
# Container por nome
docker rm -f meu-postgres meu-redis

# Imagem por nome:tag
docker rmi bitnami/postgresql:latest bitnami/redis:latest
```

### Remover com filtro

```bash
# Remover containers parados ha mais de 24h
docker container prune -f --filter "until=24h"

# Remover imagens criadas ha mais de 7 dias
docker image prune -a -f --filter "until=168h"
```

### Script de limpeza completa

```bash
#!/bin/bash
echo "Parando todos os containers..."
docker stop $(docker ps -q) 2>/dev/null

echo "Removendo containers..."
docker container prune -f

echo "Removendo imagens..."
docker image prune -a -f

echo "Removendo networks orfas..."
docker network prune -f

echo "Ambiente limpo!"
docker ps -a
docker image ls
```