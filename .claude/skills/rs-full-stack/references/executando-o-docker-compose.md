---
name: rs-full-stack-executando-o-docker-compose
description: "Applies Docker Compose execution workflow when running multi-container setups. Use when user asks to 'run docker compose', 'start containers', 'docker compose up', 'spin up services', or 'run the database and API together'. Guides correct flags, container naming, and verification steps. Make sure to use this skill whenever executing docker-compose files or troubleshooting container startup. Not for writing Dockerfiles, building single images, or Kubernetes orchestration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: docker-fundamentals
  tags: [docker, docker-compose, containers, multi-container, orchestration]
---

# Executando o Docker Compose

> Suba todos os containers de uma aplicacao com um unico comando e verifique que cada servico esta funcionando.

## Prerequisites

- Docker e Docker Compose instalados
- Arquivo `docker-compose.yaml` ja criado com os servicos definidos
- Se nao encontrar o arquivo: verificar diretorio atual com `ls docker-compose*`

## Steps

### Step 1: Verificar estado limpo

```bash
# Listar imagens existentes
docker images

# Listar todos os containers (incluindo parados)
docker ps -a
```

Saber o estado atual evita conflitos de porta ou nome.

### Step 2: Executar o docker-compose

```bash
# Subir todos os containers em background
docker compose up -d
```

A flag `-d` (detached) libera o terminal. Sem ela, os logs travam o terminal e Ctrl+C derruba os containers.

### Step 3: Verificar containers rodando

```bash
docker ps
```

Confirmar que cada servico aparece com status `Up`. Verificar:
- **Nomes** — devem ser os definidos em `container_name` no yaml
- **Portas** — mapeamento correto (ex: `0.0.0.0:5432->5432/tcp`)
- **Imagens** — nome da imagem corresponde ao esperado

### Step 4: Testar cada servico

```bash
# API — testar via curl ou navegador
curl http://localhost:3333

# Banco — conectar via cliente (beekeeper, psql, etc)
psql -h localhost -p 5432 -U postgres
```

Cada container deve responder independentemente.

## Output format

Apos execucao bem-sucedida, `docker ps` mostra algo como:

```
CONTAINER ID   IMAGE      COMMAND                  STATUS         PORTS                    NAMES
abc123         node:20    "node server.js"         Up 2 minutes   0.0.0.0:3333->3333/tcp   api
def456         postgres   "docker-entrypoint..."   Up 2 minutes   0.0.0.0:5432->5432/tcp   postgres
```

## Error handling

- Se porta ja em uso: `docker ps -a` para encontrar container conflitante, `docker stop <id>` para liberar
- Se build falhar: verificar Dockerfile referenciado no servico
- Se container reiniciar em loop: `docker logs <container_name>` para diagnosticar

## Verification

1. `docker ps` mostra todos os servicos com status `Up`
2. API responde no navegador/curl
3. Banco aceita conexao com credenciais definidas no yaml

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeira execucao (sem imagens locais) | Aguardar download completo, sera mais rapido nas proximas |
| Mudou o Dockerfile | `docker compose up -d --build` para forcar rebuild |
| Quer ver logs em tempo real | `docker compose logs -f` em outro terminal |
| Precisa derrubar tudo | `docker compose down` (para e remove containers) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `docker compose up` sem `-d` em producao | `docker compose up -d` para liberar o terminal |
| Containers sem `container_name` definido | Nomear explicitamente cada container no yaml |
| Subir containers sem verificar `docker ps` depois | Sempre verificar status apos `up` |
| Testar so a API e ignorar o banco | Testar cada servico individualmente |
| `docker run` manual para cada servico | `docker compose up -d` para orquestrar tudo junto |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Porta ja em uso ao subir containers | Container anterior ainda rodando | `docker ps -a` para encontrar, `docker stop <id>` para liberar |
| Container reinicia em loop | Erro na aplicacao dentro do container | `docker logs <container_name>` para diagnosticar |
| Build falha durante `docker compose up` | Dockerfile com erro | Verificar Dockerfile referenciado no servico |
| Banco nao aceita conexao | Container do banco ainda inicializando | Aguardar status `Up` no `docker ps` e tentar novamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre orquestracao de containers e boas praticas
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios