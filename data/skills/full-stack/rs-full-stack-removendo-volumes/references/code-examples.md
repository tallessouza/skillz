# Code Examples: Removendo Volumes no Docker

## Listando volumes

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     api-volume
local     3a7f8c2e1b...
local     outro-volume
```

## Tentativa de remoção bloqueada

```bash
$ docker volume rm api-volume
Error response from daemon: remove api-volume: volume is in use - [container1_id, container2_id, container3_id]
```

O erro lista os IDs dos containers que estão usando o volume.

## Verificando containers em execução

```bash
$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS   NAMES
abc123def456   node      "..."     2h ago    Up 2h     3000    api-container
```

## Parando container em execução

```bash
$ docker stop abc123def456
abc123def456
```

## Verificando que nenhum container está rodando

```bash
$ docker ps
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
# (vazio)
```

## Verificando containers parados

```bash
$ docker ps -a
CONTAINER ID   IMAGE     COMMAND   CREATED    STATUS                     NAMES
abc123def456   node      "..."     2h ago     Exited (0) 5 seconds ago   api-container
def789ghi012   node      "..."     3h ago     Exited (0) 1 hour ago      api-container-2
# ... potencialmente muitos mais
```

## Tentativa de remoção após stop (ainda falha)

```bash
$ docker volume rm api-volume
Error response from daemon: remove api-volume: volume is in use - [abc123def456, def789ghi012]
```

Mesmo com containers parados, o bloqueio persiste.

## Removendo todos os containers parados em lote

```bash
$ docker container prune
WARNING! This will remove all stopped containers.
Are you sure you want to continue? [y/N] y
Deleted Containers:
abc123def456...
def789ghi012...

Total reclaimed space: 150MB
```

## Confirmando que não há mais containers

```bash
$ docker ps -a
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
# (vazio)
```

## Removendo o volume com sucesso

```bash
$ docker volume rm api-volume
api-volume
```

## Confirmando remoção do volume

```bash
$ docker volume ls
DRIVER    VOLUME NAME
local     3a7f8c2e1b...
local     outro-volume
# api-volume não aparece mais
```

## Variações úteis

### Remover container individual (em vez de prune)
```bash
$ docker rm abc123def456
abc123def456
```

### Remover volume com flag force (não existe!)
```bash
# NOTA: docker volume rm NÃO tem flag --force
# Você PRECISA remover os containers primeiro
# Não há atalho para isso
```

### Remover todos os volumes não utilizados
```bash
$ docker volume prune
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
api-volume
outro-volume-orfao

Total reclaimed space: 500MB
```

### Parar e remover container em sequência
```bash
$ docker stop abc123 && docker rm abc123
abc123
abc123
```

### Limpeza completa (containers + volumes)
```bash
# 1. Para todos os containers
$ docker stop $(docker ps -q)

# 2. Remove todos os containers parados
$ docker container prune -f    # -f pula confirmação

# 3. Remove todos os volumes órfãos
$ docker volume prune -f
```