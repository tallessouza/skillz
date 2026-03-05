---
name: rs-full-stack-criando-volumes
description: "Applies Docker volume creation and mounting patterns when writing docker commands or configuring containers. Use when user asks to 'create a volume', 'persist data', 'run container with volume', 'docker volume', or any container data persistence task. Ensures correct volume lifecycle: create, inspect, mount with -v flag, and verify via container inspect. Make sure to use this skill whenever setting up Docker containers that need persistent storage. Not for Dockerfile authoring, docker-compose files, or bind mounts."
---

# Docker Volumes — Persistencia de Dados em Containers

> Crie volumes nomeados e monte-os nos containers para que dados sobrevivam a recriacao.

## Rules

1. **Sempre use volumes nomeados** — `docker volume create api-volume` nao volumes anonimos, porque volumes nomeados sao identificaveis e gerenciaveis
2. **Monte com -v no docker run** — `-v nome-volume:/caminho/no/container`, porque vincula o volume ao diretorio de trabalho do container
3. **O caminho de montagem deve corresponder ao WORKDIR** — se o Dockerfile define `WORKDIR /usr/src/app`, monte em `/usr/src/app`, porque inconsistencia causa dados perdidos
4. **Inspecione para verificar** — `docker container inspect {id}` e confira a secao `Mounts`, porque confirma visualmente que o volume esta montado
5. **Pare o container antes de recriar** — `docker stop {id}` antes de `docker run` com volume, porque evita conflitos de porta e estado

## How to write

### Criar e montar volume

```bash
# 1. Criar o volume nomeado
docker volume create api-volume

# 2. Inspecionar o volume criado
docker volume inspect api-volume

# 3. Parar container existente
docker stop <container-id>

# 4. Executar container com volume montado
docker run -v api-volume:/usr/src/app -p 3333:3333 -d api

# 5. Verificar montagem
docker container inspect <novo-container-id>
# Procurar secao "Mounts" — deve mostrar o volume
```

### Comando docker run completo com volume

```bash
docker run \
  -v api-volume:/usr/src/app \
  -p 3333:3333 \
  -d \
  api
```

## Example

**Before (container sem volume — dados perdidos ao recriar):**
```bash
docker run -p 3333:3333 -d api
# docker container inspect <id> → Mounts: []
# Recriar container = dados perdidos
```

**After (container com volume — dados persistidos):**
```bash
docker volume create api-volume
docker run -v api-volume:/usr/src/app -p 3333:3333 -d api
# docker container inspect <id> → Mounts: [{ "Name": "api-volume", "Source": "...", "Destination": "/usr/src/app" }]
# Recriar container = dados intactos no volume
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Container roda banco de dados | Sempre criar volume nomeado |
| Container e stateless (API pura) | Volume opcional, mas recomendado para logs |
| Precisa verificar se volume esta montado | `docker container inspect` → secao Mounts |
| Volume ja existe e quer reutilizar | Passe o mesmo nome no `-v`, Docker reutiliza |
| Precisa saber onde o volume armazena fisicamente | `docker volume inspect` → Mountpoint |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Rodar container de banco sem volume | `docker run -v db-volume:/var/lib/postgresql/data ...` |
| Usar volume anonimo para dados importantes | `docker volume create nome-explicito` |
| Montar em caminho diferente do WORKDIR | Verificar WORKDIR no Dockerfile e usar o mesmo caminho |
| Recriar container sem parar o anterior | `docker stop <id>` antes de `docker run` |
| Confiar que o volume esta montado sem verificar | `docker container inspect <id>` → checar Mounts |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre isolamento de dados, ciclo de vida de volumes e analogias
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios reais