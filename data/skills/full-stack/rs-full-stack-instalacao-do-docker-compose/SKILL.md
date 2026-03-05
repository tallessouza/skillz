---
name: rs-full-stack-instalacao-docker-compose
description: "Guides Docker Compose installation and version verification on any OS. Use when user asks to 'install docker compose', 'setup docker compose', 'check docker compose version', or 'configure compose for a project'. Ensures correct installation method per platform and verifies with version check. Make sure to use this skill whenever setting up a new development environment that requires Docker Compose. Not for Dockerfile authoring, container orchestration with Kubernetes, or Docker Engine installation."
---

# Instalacao do Docker Compose

> Verificar se o Docker Compose esta instalado antes de qualquer uso, e instalar pela documentacao oficial quando necessario.

## Prerequisites

- Docker Engine instalado e funcionando
- Acesso ao terminal com permissoes de instalacao

## Steps

### Step 1: Verificar se ja esta instalado

```bash
docker compose version
# ou para versao legacy:
docker-compose --version
```

Se retornar uma versao (ex: `Docker Compose version v2.x.x`), a instalacao ja esta completa. Pular para Verificacao.

### Step 2: Acessar documentacao oficial

Acessar `docs.docker.com/compose/install/` e escolher o metodo de acordo com o sistema operacional.

### Step 3: Instalar conforme o SO

#### Linux

```bash
# Instalar via plugin do Docker (metodo recomendado)
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

#### macOS / Windows

Docker Compose ja vem incluido no Docker Desktop. Instalar ou atualizar o Docker Desktop resolve.

### Step 4: Verificar instalacao

```bash
docker compose version
```

Confirmar que a versao aparece sem erros.

## Output format

```
Docker Compose version v2.x.x
```

## Error handling

- Se `docker compose` nao for reconhecido apos instalacao, verificar se o Docker Engine esta rodando
- Se apenas `docker-compose` (com hifen) funciona, a versao instalada e a legacy (v1) — atualizar para v2 via plugin
- Se permissao negada, usar `sudo` ou adicionar usuario ao grupo `docker`

## Verification

- `docker compose version` retorna versao sem erro
- `docker compose ps` executa sem erro (mesmo que liste zero containers)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Diferenca entre v1 e v2, arquitetura do plugin, troubleshooting
- [code-examples.md](references/code-examples.md) — Comandos de instalacao por SO e exemplos de uso inicial