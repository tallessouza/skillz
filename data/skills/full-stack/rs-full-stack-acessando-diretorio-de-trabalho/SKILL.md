---
name: rs-full-stack-acessando-dir-trabalho
description: "Applies Docker container inspection workflow using docker exec to access working directories and verify file contents. Use when user asks to 'access container files', 'inspect container', 'check workdir', 'list files inside container', or 'debug container contents'. Make sure to use this skill whenever exploring or verifying what is inside a running Docker container. Not for building images, writing Dockerfiles, or container orchestration."
---

# Acessando Diretório de Trabalho do Container

> Use `docker exec -it` para entrar no container e verificar fisicamente o conteudo do diretorio de trabalho definido pelo WORKDIR.

## Prerequisites

- Docker instalado e funcionando
- Container em execucao (`docker ps` para verificar)
- Imagem construida com WORKDIR definido no Dockerfile

## Steps

### Step 1: Verificar container em execucao

```bash
docker ps
```

Copie o CONTAINER ID do container alvo.

### Step 2: Acessar o container interativamente

```bash
# Padrao (funciona na maioria dos containers)
docker exec -it <container_id> bash

# Se bash nao estiver disponivel (ex: Alpine, imagens minimas)
docker exec -it <container_id> /bin/sh
```

A flag `-it` combina `-i` (interativo) e `-t` (pseudo-TTY), permitindo interacao via terminal.

### Step 3: Explorar o diretorio de trabalho

```bash
# Voce ja entra no WORKDIR definido no Dockerfile
ls

# Verificar caminho atual (deve bater com WORKDIR do Dockerfile)
pwd
```

### Step 4: Verificar o que foi copiado vs ignorado

```bash
# Listar conteudo — compare com seu projeto local
ls -la
```

**Presente no container:** arquivos copiados pelo `COPY` + gerados por `RUN` (ex: `dist/`, `node_modules/`)

**Ausente no container:** arquivos listados no `.dockerignore` (ex: `.dockerignore`, `.gitignore`, `Dockerfile`)

### Step 5: Sair do container

```bash
exit
```

## Heuristics

| Situacao | Do |
|----------|-----|
| `bash` nao encontrado | Use `/bin/sh` — containers Alpine nao tem bash |
| Precisa apenas listar arquivos sem entrar | `docker exec <id> ls /usr/src/app` |
| Verificar se .dockerignore funciona | Entre no container e confirme que arquivos ignorados nao existem |
| Container parado | Nao e possivel usar `exec` — inicie com `docker start <id>` primeiro |

## Verification

- `pwd` dentro do container deve retornar o mesmo path do `WORKDIR` no Dockerfile
- Arquivos do `.dockerignore` NAO devem aparecer no `ls`
- `dist/` e `node_modules/` devem existir se o Dockerfile tem `RUN npm run build` e `RUN npm install`

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Assumir que arquivos foram copiados sem verificar | Entre no container e confirme com `ls` |
| Usar `docker exec` em container parado | `docker start <id>` antes, depois `exec` |
| Esquecer `-it` e esperar terminal interativo | Sempre passe `-it` para sessao interativa |
| Hardcodar `bash` sem testar | Tente `bash`, fallback para `/bin/sh` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre containers efemeros e WORKDIR
- [code-examples.md](references/code-examples.md) — Fluxo completo de build, run e exec com exemplos