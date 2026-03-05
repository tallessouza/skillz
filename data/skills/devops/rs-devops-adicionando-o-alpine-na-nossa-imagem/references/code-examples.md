# Code Examples: Alpine em Imagens Docker

## Exemplo 1: Build com cache (sem alteracao)

```bash
# Nenhuma alteracao no Dockerfile — cache total
$ docker build -t api-skillz:v4 .

# Output mostra todas as etapas como CACHED:
# [1/5] FROM node:18-slim CACHED
# [2/5] WORKDIR /app CACHED
# [3/5] COPY package*.json ./ CACHED
# [4/5] RUN npm install CACHED
# [5/5] COPY . . CACHED
```

Build roda em menos de 1 segundo porque nada mudou.

## Exemplo 2: Trocar base image para Alpine

```dockerfile
# ANTES (slim)
FROM node:18-slim

# DEPOIS (alpine)
FROM node:18-alpine3.19
```

## Exemplo 3: Build apos troca de base image

```bash
# Nova tag v5 para a versao com Alpine
$ docker build -t api-skillz:v5 .

# Output mostra pull da nova imagem + rebuild completo:
# [1/5] FROM node:18-alpine3.19
# => resolve docker.io/library/node:18-alpine3.19
# => downloading sha256:...
# [2/5] WORKDIR /app
# [3/5] COPY package*.json ./
# [4/5] RUN npm install
# [5/5] COPY . .
```

Cache invalidado porque a base image mudou.

## Exemplo 4: Parar container antigo e rodar novo

```bash
# Verificar containers rodando
$ docker container ls

# Parar o container da versao anterior
$ docker stop <container_id>

# Rodar a nova versao com Alpine
$ docker run -d -v $(pwd):/app api-skillz:v5
```

## Exemplo 5: Verificar que a aplicacao funciona

```bash
# Checar logs do container
$ docker logs <container_id>
# Deve mostrar a aplicacao iniciando normalmente
```

## Exemplo 6: Comparar tamanhos das imagens

```bash
$ docker image ls api-skillz

# REPOSITORY    TAG    SIZE
# api-skillz    v5     473MB   (Alpine)
# api-skillz    v4     597MB   (Slim)
#
# Reducao: ~124MB apenas trocando a base image
```

## Exemplo 7: Padrao para outras tecnologias

```dockerfile
# Python com Alpine
FROM python:3.11-alpine

# Go com Alpine
FROM golang:1.21-alpine

# Ruby com Alpine
FROM ruby:3.2-alpine
```

O sufixo `-alpine` e padrao universal. A logica e identica independente da tecnologia.