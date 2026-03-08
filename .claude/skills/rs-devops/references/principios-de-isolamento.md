---
name: rs-devops-principios-de-isolamento
description: "Applies container isolation principles when configuring resource limits and understanding namespace separation. Use when user asks to 'limit container resources', 'isolate containers', 'configure cgroups', 'understand namespaces', or 'prevent container resource monopolization'. Enforces cgroup limits and namespace awareness. Make sure to use this skill whenever running containers in shared environments. Not for Kubernetes pod security, network policies, or application-level security."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: devops
  module: container-isolation
  tags: [containers, cgroups, namespaces, isolation, docker, oci, resources]
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

## Troubleshooting

### Container consome toda a memoria do host e causa OOM killer
**Symptom:** Outros containers e processos do host morrem por falta de memoria
**Cause:** Container rodando sem `--memory` limit, permitindo consumo ilimitado de RAM
**Fix:** Adicionar `--memory="256m"` (ou valor adequado) ao `docker run` e definir limits no docker-compose

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

# Deep Explanation: Principios de Isolamento

## Por que isolamento importa

Diferente de maquinas virtuais (que virtualizam hardware completo), containers compartilham o kernel do host. Isso traz performance mas exige mecanismos de isolamento a nivel de kernel para que containers nao interfiram entre si.

O instrutor destaca tres pilares:

### 1. Control Groups (cgroups)

Funcionalidade do kernel Linux que controla e limita recursos de um processo. Fica no kernel e e usado para impor limites de:
- **CPU** (millicores)
- **Memoria** (RAM)
- **I/O** (disco, rede)

**Insight do instrutor:** "A ideia e que o container nao monopolize todos os recursos daquele host." Sem cgroups, um container poderia consumir toda a RAM disponivel, prejudicando todos os outros containers e ate o proprio host.

O cenario problematico: voce tem 10 containers rodando. Um deles tem um memory leak. Sem cgroup limits, esse container consome toda a RAM do host, causando OOM killer nos outros containers. Com cgroups, apenas o container com leak e afetado.

### 2. Namespaces

Isolamento de visibilidade. Cada container tem seu proprio:
- **Filesystem** — arvore de diretorios propria
- **Processos** — PID namespace separado (PID 1 dentro do container)
- **Rede** — interfaces de rede proprias, tabela de roteamento propria

**Insight do instrutor:** "Container 1 nao consegue enxergar os arquivos do container 3, os processos que estao sendo executados no container 3, e vice-versa." Essa separacao e o que permite rodar aplicacoes completamente diferentes (e ate concorrentes) no mesmo host.

Tipos de namespaces Linux relevantes:
- `mnt` — pontos de montagem (filesystem)
- `pid` — IDs de processo
- `net` — stack de rede
- `ipc` — comunicacao inter-processo
- `uts` — hostname e domainname
- `user` — UIDs/GIDs

### 3. Unshare

Comando Linux que cria novos namespaces para processos existentes. O instrutor menciona como curiosidade, mas e importante porque:
- Permite isolamento sem container runtime (sem Docker)
- E a ferramenta "manual" por tras do que Docker faz automaticamente
- Util para debugging e entendimento do que containers realmente fazem

### OCI (Open Container Initiative)

Padronizacao de interfaces de container. Garante que Docker, containerd, podman, CRI-O e outros runtimes sigam o mesmo padrao. O instrutor descreve como "uma iniciativa que traz padroes para que as interfaces de container consigam trabalhar de forma mais unanime."

## Resumo da hierarquia

```
Kernel Linux
├── cgroups → LIMITA quanto recurso cada processo pode usar
├── namespaces → ISOLA o que cada processo pode VER
└── unshare → CRIA namespaces para processos existentes

OCI → PADRONIZA como runtimes implementam isso
```

---

# Code Examples: Principios de Isolamento

## 1. Configurando cgroups via Docker

### Docker run com limites

```bash
# Limitar CPU a 500 millicores e memoria a 256MB
docker run -d \
  --name api \
  --cpus="0.5" \
  --memory="256m" \
  --memory-swap="512m" \
  my-api:latest

# Verificar limites aplicados
docker stats api --no-stream
```

### Docker Compose com resource limits

```yaml
version: "3.8"
services:
  api:
    image: my-api:latest
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 256M
        reservations:
          cpus: "0.25"
          memory: 128M
    # Sem limits: container pode monopolizar o host
```

## 2. Inspecionando namespaces

```bash
# Obter PID do processo principal do container
CONTAINER_PID=$(docker inspect --format '{{.State.Pid}}' my-container)

# Ver todos os namespaces desse processo
ls -la /proc/$CONTAINER_PID/ns/
# lrwxrwxrwx cgroup -> cgroup:[4026531835]
# lrwxrwxrwx ipc    -> ipc:[4026532486]
# lrwxrwxrwx mnt    -> mnt:[4026532484]
# lrwxrwxrwx net    -> net:[4026532489]
# lrwxrwxrwx pid    -> pid:[4026532487]
# lrwxrwxrwx user   -> user:[4026531837]
# lrwxrwxrwx uts    -> uts:[4026532485]

# Comparar com namespaces do host
ls -la /proc/1/ns/
# Numeros diferentes = isolamento ativo
```

### Verificando isolamento de processos

```bash
# No host: ve todos os processos
ps aux | wc -l
# 150+

# Dentro do container: ve apenas seus processos
docker exec my-container ps aux
# PID 1 = processo principal do container
# Poucos processos
```

### Verificando isolamento de rede

```bash
# No host
ip addr
# eth0, docker0, veth*, etc.

# Dentro do container
docker exec my-container ip addr
# Apenas lo e eth0 do container (namespace de rede proprio)
```

## 3. Unshare — Isolamento manual

```bash
# Criar namespace de PID isolado
sudo unshare --pid --fork --mount-proc /bin/bash
# Agora 'ps aux' mostra apenas o bash (PID 1)

# Criar namespace de rede isolado
sudo unshare --net /bin/bash
# 'ip addr' mostra apenas loopback

# Combinacao completa (simula o que Docker faz)
sudo unshare --pid --net --mount --uts --ipc --fork /bin/bash
```

## 4. Cenario problematico: sem cgroup limits

```bash
# Container sem limites — PERIGOSO
docker run -d --name hungry-app hungry-image:latest

# Se a app tiver memory leak, vai consumir TODA a RAM do host
# Outros containers e o proprio host podem cair

# CORRETO: sempre com limites
docker run -d \
  --name hungry-app \
  --memory="512m" \
  --cpus="1.0" \
  hungry-image:latest
# Se exceder 512MB, container e morto (OOM) sem afetar o host
```

## 5. Verificando OCI compliance

```bash
# Ver runtime OCI em uso
docker info | grep -i runtime
# Default runtime: runc (OCI-compliant)

# Inspecionar config OCI de um container
docker inspect my-container | jq '.[0].HostConfig'
# Mostra cgroup limits, namespace config, etc. no formato OCI
```
