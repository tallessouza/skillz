---
name: rs-devops-principios-de-isolamento
description: "Applies container isolation principles (namespaces, cgroups, unshare) when designing, debugging, or configuring containers. Use when user asks to 'create a Dockerfile', 'configure container resources', 'limit CPU/memory', 'isolate processes', or 'debug container networking'. Ensures correct understanding of Linux kernel isolation mechanisms. Make sure to use this skill whenever discussing container architecture or resource management. Not for application-level code, CI/CD pipelines, or orchestration (Kubernetes scheduling)."
---

# Principios de Isolamento em Containers

> Cada container opera em escopo proprio: recursos limitados por cgroups, visibilidade isolada por namespaces.

## Rules

1. **Sempre limite recursos com cgroups** — defina CPU e memoria por container, porque sem limites um container pode monopolizar o host e derrubar os demais
2. **Trate cada container como escopo isolado** — um container so enxerga seus proprios processos, filesystem e interfaces de rede, porque namespaces garantem essa separacao a nivel de kernel
3. **Nao assuma visibilidade entre containers** — container 1 nao acessa arquivos ou processos do container 3, porque cada um tem seu proprio namespace
4. **Use unshare para isolamento sem container runtime** — quando nao ha Docker disponivel, `unshare` cria namespaces manualmente para processos existentes
5. **Siga a OCI para compatibilidade** — a Open Container Initiative padroniza interfaces, porque garante que diferentes runtimes (Docker, containerd, podman) trabalhem de forma uniforme

## Modelo Mental

```
┌─────────── HOST (Linux Kernel) ───────────┐
│                                            │
│  ┌─ Container 1 ──┐  ┌─ Container 2 ──┐   │
│  │ namespace:      │  │ namespace:      │  │
│  │  - filesystem   │  │  - filesystem   │  │
│  │  - processos    │  │  - processos    │  │
│  │  - rede         │  │  - rede         │  │
│  │ cgroup:         │  │ cgroup:         │  │
│  │  - CPU limit    │  │  - CPU limit    │  │
│  │  - RAM limit    │  │  - RAM limit    │  │
│  │  - I/O limit    │  │  - I/O limit    │  │
│  └────────────────┘  └────────────────┘   │
└────────────────────────────────────────────┘
```

## Como aplicar

### Limitar recursos (cgroups)

```yaml
# docker-compose.yml
services:
  api:
    image: my-api:latest
    deploy:
      resources:
        limits:
          cpus: "0.5"       # max 500 millicores
          memory: 256M      # max 256MB RAM
        reservations:
          cpus: "0.25"
          memory: 128M
```

```bash
# docker run com limites
docker run --cpus="0.5" --memory="256m" my-api:latest
```

### Verificar isolamento (namespaces)

```bash
# Ver namespaces de um container
docker inspect --format '{{.State.Pid}}' <container_id>
ls -la /proc/<PID>/ns/

# Listar processos visiveis DENTRO do container
docker exec <container_id> ps aux
# Resultado: apenas processos do proprio container
```

### Criar namespace sem Docker (unshare)

```bash
# Criar namespace isolado de PID e rede
sudo unshare --pid --net --fork /bin/bash
# Agora voce esta em um namespace separado
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Container consumindo toda RAM do host | Adicionar `--memory` limit via cgroup |
| Container acessando arquivos de outro | Verificar se ha volume compartilhado quebrando isolamento de namespace |
| Precisa isolar processo sem Docker | Usar `unshare` para criar namespace manual |
| Multiplos runtimes no mesmo projeto | Seguir OCI spec para garantir compatibilidade |
| Debug de rede entre containers | Lembrar que cada container tem interface de rede propria (namespace) |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Rodar container sem limites de recursos | Sempre definir `--cpus` e `--memory` |
| Assumir que container A ve processos de B | Tratar cada container como maquina isolada |
| Compartilhar namespace de rede sem necessidade | Usar redes Docker dedicadas para comunicacao |
| Ignorar OCI e depender de features especificas do Docker | Usar interfaces padronizadas OCI |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/devops/rs-devops-principios-de-isolamento/references/deep-explanation.md)
- [Code examples](../../../data/skills/devops/rs-devops-principios-de-isolamento/references/code-examples.md)
