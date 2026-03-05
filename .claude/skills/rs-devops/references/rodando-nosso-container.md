---
name: rs-devops-rodando-nosso-container
description: "Applies Docker container execution best practices when running containers from images. Use when user asks to 'run a container', 'docker run', 'start a container', 'map ports', 'run in background', or 'check container logs'. Enforces --rm for ephemeral containers, correct port mapping with -p, detached mode with -d, and proper lifecycle management with docker stop/start/ps/logs. Make sure to use this skill whenever executing or managing Docker containers locally. Not for Dockerfile creation, image building, or container orchestration (Kubernetes/Swarm)."
---

# Rodando Containers Docker

> Ao executar containers, trate-os como efemeros: use flags que reforcam o ciclo de vida correto e mapeie portas explicitamente.

## Rules

1. **Use `--rm` para containers descartaveis** — `docker run --rm` deleta o container ao parar, porque containers devem ser efemeros e recriados a partir da imagem sem prejuizo
2. **Mapeie portas explicitamente com `-p`** — `docker run -p HOST:CONTAINER`, porque sem mapeamento a aplicacao roda isolada e inacessivel
3. **Rode em background com `-d`** — `docker run -d` libera o terminal, porque modo interativo prende o console e impede outros comandos
4. **Use `docker ps` para inspecionar containers ativos** — mostra container ID, imagem, portas, status e nome
5. **Use `docker logs` para depurar containers em background** — `docker logs CONTAINER_ID` exibe o historico completo de execucao
6. **Entenda que `--rm` impede restart** — com `--rm`, `docker stop` deleta o container permanentemente; sem `--rm`, voce pode usar `docker start` para reiniciar

## How to write

### Container efemero (desenvolvimento rapido)
```bash
# --rm: deleta ao parar | -p: mapeia porta | imagem no final
docker run --rm -p 3000:3000 api-skillz
```

### Container persistente em background
```bash
# -d: background | sem --rm: permite stop/start
docker run -d -p 3001:3000 api-skillz
```

### Inspecionar e gerenciar
```bash
# Ver containers rodando
docker ps

# Ver logs de container em background
docker logs CONTAINER_ID

# Parar container (com --rm, sera deletado)
docker stop CONTAINER_ID

# Reiniciar container (somente sem --rm)
docker start CONTAINER_ID
```

## Example

**Before (preso no terminal, sem boas praticas):**
```bash
docker run api-skillz
# Terminal preso, sem mapeamento de porta, container orfao apos Ctrl+C
```

**After (com boas praticas aplicadas):**
```bash
# Desenvolvimento: efemero + porta mapeada
docker run --rm -p 3000:3000 api-skillz

# Teste prolongado: background + persistente
docker run -d -p 3001:3000 --name api-test api-skillz
docker logs api-test
docker stop api-test
docker start api-test
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Teste rapido local | `--rm -p HOST:CONTAINER` |
| Precisa ver logs depois | `-d` e depois `docker logs` |
| Precisa parar e reiniciar | NAO use `--rm` |
| Porta do host ja em uso | Mude a porta do host (ex: 3001:3000) |
| Quer nomear o container | Adicione `--name meu-container` |
| Precisa depurar interativamente | Rode sem `-d` para ver output em tempo real |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `docker run imagem` (sem -p) | `docker run -p 3000:3000 imagem` |
| Rodar sem `-d` e ficar preso | `docker run -d -p 3000:3000 imagem` |
| Usar `--rm` e esperar fazer restart | Remova `--rm` se precisa de stop/start |
| Ignorar `docker ps` apos rodar | Sempre confirme com `docker ps` |
| Tentar `docker start` com `--rm` ativo | Rode novo `docker run` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-rodando-nosso-container/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-rodando-nosso-container/references/code-examples.md)
