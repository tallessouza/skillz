---
name: rs-devops-camada-de-abstracao
description: "Applies Docker network architecture patterns when creating containers, configuring networking, or setting up multi-container projects. Use when user asks to 'create a docker network', 'connect containers', 'setup docker compose networking', 'isolate a container', or 'organize container communication'. Enforces project-scoped networks with bridge driver, correct use of null/host drivers, and network-per-project organization. Make sure to use this skill whenever working with Docker networking or multi-container setups. Not for Kubernetes networking, cloud VPCs, or non-Docker container runtimes."
---

# Docker Network — Camada de Abstracao

> Organize redes Docker por projeto, usando bridge para comunicacao entre containers e drivers especificos para isolamento ou acesso total.

## Rules

1. **Nunca use a rede bridge default para projetos reais** — crie uma rede nomeada por projeto com `docker network create`, porque a bridge default mistura todos os containers sem escopo
2. **Uma rede por dominio de projeto** — agrupe containers do mesmo projeto na mesma rede, porque isso cria isolamento logico e organizacional
3. **Use null para containers sem comunicacao externa** — associe `--network none` quando o container nao precisa de rede, porque a unica interface disponivel sera localhost (seguranca)
4. **Host (roast) so existe uma instancia** — nunca tente criar uma segunda rede host, porque Docker permite apenas uma rede host no sistema
5. **Bridge e o driver default** — ao criar redes com `docker network create`, o driver sera bridge automaticamente, nao precisa especificar exceto para documentacao explicita
6. **Use tags nas imagens** — sempre trabalhe com tags especificas nas imagens, nunca latest implicito, porque facilita rastreabilidade e otimizacao

## How to write

### Criar rede por projeto

```bash
# Crie uma rede nomeada para cada projeto/dominio
docker network create meu-projeto-network

# Se quiser ser explicito sobre o driver (opcional, bridge e default)
docker network create --driver bridge meu-projeto-network
```

### Associar container a rede do projeto

```bash
# No docker run, especifique a rede do projeto
docker run --network meu-projeto-network --name api-skillz api-skillz:v1.0
```

### Isolar container sem rede

```bash
# Container sem acesso externo — apenas localhost interno
docker run --network none --name worker-isolado worker:v1.0
```

### Usar host para acesso total as interfaces

```bash
# Container com todas as interfaces do host Docker
docker run --network host --name monitor monitor:v1.0
```

## Example

**Before (tudo na bridge default, sem organizacao):**

```bash
docker run --name api api:latest
docker run --name db postgres:latest
docker run --name cache redis:latest
docker run --name outro-projeto-api outro:latest
# Todos no mesmo bridge default, sem isolamento entre projetos
```

**After (redes por projeto, tags especificas):**

```bash
# Projeto A
docker network create projeto-a-network
docker run --network projeto-a-network --name api api:v1.2
docker run --network projeto-a-network --name db postgres:15
docker run --network projeto-a-network --name cache redis:7

# Projeto B — rede separada
docker network create projeto-b-network
docker run --network projeto-b-network --name outro-api outro:v2.0
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Novo projeto com multiplos containers | Criar rede bridge nomeada para o projeto |
| Container que processa dados sem rede | Usar `--network none` |
| Container de monitoramento que precisa ver tudo | Usar `--network host` |
| `docker run` sem `--network` | Container vai para bridge default — evite em projetos reais |
| Precisa de comunicacao TCP/IP entre containers | Mesma rede bridge nomeada |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Deixar todos containers na bridge default | Criar rede nomeada por projeto |
| `docker network create --driver host segunda-host` | Usar a rede host existente com `--network host` |
| Misturar containers de projetos diferentes na mesma rede | Uma rede por dominio/projeto |
| `docker run --name api api:latest` sem rede | `docker run --network projeto-net --name api api:v1.0` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
