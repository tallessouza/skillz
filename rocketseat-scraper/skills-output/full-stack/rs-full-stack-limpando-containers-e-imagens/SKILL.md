---
name: rs-full-stack-limpando-containers-e-imagens
description: "Applies Docker cleanup procedures when user asks to 'clean docker', 'remove containers', 'delete images', 'reset docker environment', or 'organize docker'. Executes safe removal of containers and images to maintain a clean development environment. Make sure to use this skill whenever the user wants to remove unused Docker resources or start fresh. Not for Docker Compose management, volume cleanup, or production container orchestration."
---

# Limpando Containers e Imagens Docker

> Mantenha o ambiente Docker limpo removendo containers parados e imagens nao utilizadas antes de iniciar novo trabalho.

## Prerequisites

- Docker instalado e rodando
- Nenhum container em uso que precise ser preservado
- Desconectar de servicos dependentes (banco de dados, GUI clients) antes de remover

## Steps

### Step 1: Desconectar servicos dependentes

Antes de deletar containers, desconectar de qualquer cliente conectado (Beekeeper, DBeaver, pgAdmin, aplicacao).

### Step 2: Listar todos os containers

```bash
docker ps -a
```

Verificar quais containers existem, incluindo os parados (`-a` mostra todos).

### Step 3: Remover containers

```bash
# Remover containers especificos por ID (com force)
docker rm -f <container_id_1> <container_id_2>

# Ou remover todos os containers parados de uma vez
docker container prune -f
```

O flag `-f` forca a remocao mesmo de containers rodando.

### Step 4: Verificar que containers foram removidos

```bash
docker ps -a
```

Deve retornar lista vazia.

### Step 5: Listar imagens

```bash
docker image ls
```

### Step 6: Remover imagens

```bash
# Remover por ID
docker rmi <image_id_1> <image_id_2>

# Ou remover todas as imagens nao utilizadas
docker image prune -a -f
```

### Step 7: Verificar ambiente limpo

```bash
docker ps -a
docker image ls
```

Ambos devem retornar listas vazias.

## Output format

Ambiente Docker completamente limpo: zero containers, zero imagens nao utilizadas.

## Error handling

- Se `docker rm` falhar porque container esta rodando: usar `docker rm -f` ou `docker stop` antes
- Se `docker rmi` falhar por imagem em uso: remover o container dependente primeiro
- Se imagem tem tags multiplas: remover por ID com `docker rmi -f <id>`

## Verification

```bash
docker ps -a      # Deve estar vazio
docker image ls   # Deve estar vazio
```

## Heuristics

| Situacao | Comando |
|----------|---------|
| Remover containers especificos | `docker rm -f <id1> <id2>` |
| Remover TODOS containers parados | `docker container prune -f` |
| Remover imagens especificas | `docker rmi <id1> <id2>` |
| Remover TODAS imagens orfas | `docker image prune -f` |
| Remover TODAS imagens (incluindo tagged) | `docker image prune -a -f` |
| Limpeza total (containers + images + networks + cache) | `docker system prune -a -f` |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deletar containers sem desconectar clients | Fechar Beekeeper/DBeaver antes de remover |
| Usar `docker system prune` sem verificar o que sera removido | Listar com `docker ps -a` e `docker image ls` antes |
| Remover imagens sem remover containers dependentes | Remover containers primeiro, depois imagens |
| Esquecer de verificar apos limpeza | Rodar `docker ps -a` e `docker image ls` para confirmar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de ambiente Docker
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes