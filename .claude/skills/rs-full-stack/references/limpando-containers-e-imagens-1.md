---
name: rs-full-stack-limpando-containers-e-imagens
description: "Enforces Docker cleanup best practices when removing containers and images to reset the environment. Use when user asks to 'clean docker', 'remove containers', 'reset docker environment', 'start fresh with docker', or 'remove docker images'. Applies correct sequence: stop/remove containers first, then remove images. Make sure to use this skill whenever preparing a clean Docker environment for a new project or database setup. Not for Docker Compose orchestration, Dockerfile creation, or Kubernetes pod management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker, containers, images, cleanup, devops]
---

# Limpando Containers e Imagens Docker

> Antes de criar novos containers, limpe o ambiente removendo containers primeiro, depois imagens, para evitar conflitos e confusao.

## Prerequisites

- Docker instalado e rodando
- Acesso ao terminal com permissoes Docker

## Steps

### Step 1: Listar todos os containers

```bash
docker ps -a
```

Lista todos os containers, incluindo os parados. Identifique os que serao removidos pelo container ID ou nome.

### Step 2: Remover containers

```bash
docker rm -f <container_id>
```

Use `-f` para forcar a remocao mesmo que o container esteja rodando. Passe o container ID (hash) copiado da listagem.

### Step 3: Verificar que containers foram removidos

```bash
docker ps -a
```

Confirme que a lista esta vazia ou sem os containers indesejados.

### Step 4: Listar imagens

```bash
docker image ls
```

Identifique as imagens a serem removidas pelo IMAGE ID ou nome.

### Step 5: Remover imagens

```bash
docker rmi <image_id>
```

Passe o ID da imagem ou o nome. So funciona apos remover containers que dependem dela.

### Step 6: Verificar ambiente limpo

```bash
docker ps -a
docker image ls
```

Ambos os comandos devem retornar listas vazias (ou sem os itens removidos).

## Output format

Terminal limpo com:
- `docker ps -a` sem containers indesejados
- `docker image ls` sem imagens indesejadas

## Error handling

- Se `docker rmi` falhar com "image is referenced in multiple repositories", remova primeiro os containers dependentes
- Se `docker rm` falhar sem `-f`, o container esta rodando — use `docker rm -f` ou `docker stop` antes

## Heuristics

| Situacao | Acao |
|----------|------|
| Ambiente de estudo/aprendizado | Limpe tudo para comecar do zero |
| Projeto em producao com outros containers | Remova apenas os containers/imagens do projeto especifico |
| Imagem usada por multiplos containers | Remova todos os containers dependentes antes da imagem |
| Limpeza total rapida | `docker system prune -a` (remove tudo de uma vez) |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Remover imagem antes dos containers dependentes | Remova containers primeiro, depois imagens |
| Ignorar containers parados antes de criar novos | Liste com `docker ps -a` e limpe antes |
| Usar `docker system prune -a` sem verificar | Liste containers e imagens antes para confirmar o que sera removido |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `docker rmi` falha com "image is referenced" | Containers dependentes ainda existem | Remova todos os containers dependentes primeiro com `docker rm -f` |
| `docker rm` falha sem `-f` | Container esta rodando | Use `docker rm -f` ou `docker stop` antes |
| Imagem nao aparece no `docker image ls` | Ja foi removida ou nunca foi baixada | Verifique com `docker image ls -a` para incluir intermediarias |
| Espaco em disco nao liberou apos remocao | Volumes orfaos ainda existem | Execute `docker volume prune` para limpar volumes nao usados |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de limpeza e dependencias Docker
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios