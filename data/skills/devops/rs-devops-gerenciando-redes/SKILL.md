---
name: rs-devops-gerenciando-redes
description: "Applies Docker network management commands when working with container networking. Use when user asks to 'connect container to network', 'create docker network', 'inspect container network', 'associate network', or any Docker networking task. Covers docker network connect/disconnect, --network flag on docker run, and inspect commands for both networks and containers. Make sure to use this skill whenever managing Docker container networks or debugging container connectivity. Not for Docker volume management, Dockerfile creation, or docker-compose networking."
---

# Gerenciando Redes Docker

> Associe redes a containers usando `docker network connect` para containers existentes ou `--network` no `docker run` para novos containers.

## Rules

1. **Use `docker network connect` para containers ja em execucao** — `docker network connect <rede-id> <container-id>`, porque evita recriar o container apenas para mudar a rede
2. **Use `--network` no `docker run` para containers novos** — `docker run --network <nome-rede> ...`, porque o container ja nasce na rede correta sem precisar de comando adicional
3. **Prefira IDs a nomes** — IDs garantem unicidade, nomes podem colidir em ambientes com muitas redes
4. **Ordem dos argumentos importa** — no `connect`, primeiro vem a rede, depois o container
5. **Container criado com `--network` NAO recebe a bridge** — diferente de adicionar via `connect`, onde a bridge permanece, porque o Docker so atribui bridge quando nenhuma rede e especificada
6. **Um container pode pertencer a varias redes** — comum em arquiteturas de microservicos onde servicos e bancos compartilham redes de dominio

## How to write

### Associar rede a container existente

```bash
# Pegar IDs
docker network ls
docker ps

# Conectar (rede primeiro, container depois)
docker network connect <network-id> <container-id>
```

### Criar container ja na rede

```bash
docker run -p 3000:3000 -d --network primeira-network minha-imagem:tag
```

### Inspecionar associacao

```bash
# Ver containers dentro da rede
docker network inspect <network-id>

# Ver redes do container (secao Networks)
docker container inspect <container-id>
```

### Desconectar rede

```bash
docker network disconnect <network-id> <container-id>
```

## Example

**Before (container sem rede customizada):**
```bash
docker run -p 3000:3000 -d minha-app:latest
# Container fica apenas na rede bridge default
```

**After (container na rede correta):**
```bash
# Opcao 1: Container novo
docker run -p 3000:3000 -d --network minha-rede minha-app:latest

# Opcao 2: Container existente
docker network connect minha-rede <container-id>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Container ja esta rodando | `docker network connect` |
| Container ainda nao existe | `docker run --network` |
| Precisa verificar se conectou | `docker network inspect <rede>` ou `docker container inspect <container>` |
| Container precisa sair da rede | `docker network disconnect` |
| Microservicos do mesmo dominio | Agrupar na mesma rede customizada |
| Container precisa de multiplas redes | Criar com `--network` + adicionar outras com `connect` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Recriar container so para mudar rede | `docker network connect` no container existente |
| Usar apenas bridge default para multiplos servicos | Criar rede customizada por dominio |
| Confiar apenas no nome para identificar rede | Usar ID para garantir unicidade |
| Passar container antes da rede no `connect` | Ordem: `connect <rede> <container>` |
| Assumir que `--network` mantem a bridge | Verificar com `docker container inspect` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
