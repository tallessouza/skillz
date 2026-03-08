---
name: rs-full-stack-conhecendo-o-docker-hub
description: "Navigates Docker Hub image discovery when setting up containers. Use when user asks to 'find a docker image', 'choose a base image', 'create a container', 'pick a node image', or 'search docker hub'. Applies rules: prefer official images, check vulnerability reports, use specific version tags, prefer Alpine variants. Make sure to use this skill whenever selecting Docker images for containers or Dockerfiles. Not for writing Dockerfiles, docker-compose, or container orchestration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker
  tags: [docker-hub, docker-images, alpine, official-images, container, version-tags]
---

# Docker Hub — Descoberta de Imagens

> Ao escolher imagens Docker, priorize imagens oficiais com tags de versao especificas e verifique vulnerabilidades antes de usar.

## Rules

1. **Use imagens oficiais (badge Docker Official Image)** — porque imagens da comunidade podem conter software desatualizado ou vulnerabilidades nao rastreadas
2. **Especifique versao exata na tag** — `node:18-alpine` nao `node:latest`, porque `latest` muda sem aviso e quebra builds reproduziveis
3. **Prefira variantes Alpine** — `postgres:16-alpine` nao `postgres:16`, porque Alpine resulta em imagens menores e com menor superficie de ataque
4. **Verifique vulnerabilidades no Docker Hub** — antes de adotar uma imagem, consulte a aba de vulnerabilidades no hub, porque vulnerabilidades conhecidas viram risco em producao
5. **Pesquise pelo nome exato do servico** — `node`, `postgres`, `mysql`, nao termos genericos como "database image", porque o Docker Hub retorna resultados mais precisos

## Como buscar imagens

### Fluxo de descoberta

1. Acessar [hub.docker.com](https://hub.docker.com)
2. Pesquisar pelo nome do servico (ex: `node`, `postgres`)
3. Filtrar por **Docker Official Image** (medalha oficial)
4. Abrir a imagem e navegar pelas **Tags**
5. Escolher versao especifica + variante (ex: `18-alpine`)
6. Verificar vulnerabilidades na pagina da tag

### Formato da referencia

```dockerfile
# Formato: imagem:versao-variante
FROM node:18-alpine
FROM postgres:16-alpine
FROM python:3.12-slim
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Aplicacao Node.js | `node:{versao}-alpine` |
| Banco PostgreSQL | `postgres:{versao}-alpine` |
| Banco MySQL | `mysql:{versao}` |
| Machine Learning | `tensorflow/tensorflow` ou `pytorch/pytorch` (imagens verificadas) |
| Precisa de compilacao nativa | Evite Alpine (musl vs glibc), use `-slim` |
| Ambiente de producao | Sempre versao fixa, nunca `latest` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `FROM node` | `FROM node:18-alpine` |
| `FROM postgres:latest` | `FROM postgres:16-alpine` |
| Usar imagem da comunidade sem verificar | Filtrar por Docker Official Image |
| Ignorar vulnerabilidades listadas | Verificar aba de vulnerabilidades antes de adotar |
| Escolher imagem sem checar tamanho | Comparar variantes (alpine < slim < full) |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Build quebra com dependencia nativa em Alpine | musl vs glibc incompatibilidade | Usar variante `-slim` em vez de `-alpine` |
| Imagem com vulnerabilidades criticas | Versao desatualizada da imagem base | Atualizar para versao mais recente e verificar aba de vulnerabilidades |
| `docker pull` falha com "not found" | Tag inexistente ou nome incorreto | Verificar tags disponiveis na pagina da imagem no Docker Hub |
| Imagem muito grande (>1GB) | Usando variante full em vez de Alpine/slim | Trocar para `{imagem}:{versao}-alpine` ou `-slim` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha de imagens e o ecossistema Docker Hub
- [code-examples.md](references/code-examples.md) — Exemplos de selecao de imagens para diferentes cenarios