---
name: rs-devops-entendendo-mais-sobre-o-docker
description: "Applies Docker image vs container distinction and core CLI operations. Use when user asks to 'understand Docker images vs containers', 'list Docker images', 'manage containers', or 'explain Docker build vs run'. Enforces image/container separation, ephemeral container mindset, volume usage for persistence, and build-before-run workflow. Make sure to use this skill whenever explaining Docker fundamentals or running basic Docker CLI commands. Not for Dockerfile writing (use entendendo-sobre-uma-imagem-base) or Docker Compose (use declarando-multiplos-containers)."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: docker-fundamentos
  tags: [docker, images, containers, cli, build, run, ephemeral]
---

# Docker: Imagens e Containers

> Imagens sao modelos imutaveis de leitura que definem como um container sera executado; containers sao instancias efemeras de tempo de execucao dessas imagens.

## Rules

1. **Separe imagem de container** — imagem e o build (receita), container e o run (execucao)
2. **Containers sao efemeros por padrao** — dados salvos dentro sao perdidos quando ele para
3. **Use volumes para persistencia**
4. **Build antes de Run** — sempre `docker build` para criar a imagem, depois `docker run`

## CLI Principal

```bash
# Imagens
docker image ls
docker image rm <id>
docker build -t app .

# Containers
docker container ls
docker container ls -a
docker run <imagem>
docker container rm <id>
```

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar uploads no filesystem do container sem volume | Montar volume |
| Confundir `docker build` com `docker run` | Build cria imagem, Run executa container |
| Editar arquivos dentro do container em producao | Rebuildar a imagem |
| Rodar `docker run` sem ter feito `docker build` | Sempre buildar primeiro |

## Troubleshooting

### Alteracoes no codigo nao refletem no container
**Symptom:** Container roda mas mostra versao antiga do codigo
**Cause:** Imagem nao foi rebuilda apos as alteracoes — container usa imagem antiga
**Fix:** Rodar `docker build -t app .` novamente e recriar o container com `docker run`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
