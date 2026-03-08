---
name: rs-full-stack-executando-docker-compose
description: "Applies Docker Compose execution workflow when starting PostgreSQL containers, verifying images and containers, or connecting database clients. Use when user asks to 'run docker compose', 'start the database', 'test database connection', 'execute container in background', or 'connect to postgres'. Covers docker-compose up with detached mode, image and container verification, and Beekeeper Studio connection setup. Make sure to use this skill whenever launching Docker Compose services or validating database accessibility. Not for writing Dockerfiles, Kubernetes deployments, or application-level database queries."
---

# Executando Docker Compose

> Execute o Docker Compose em modo detached, verifique imagem e container, e valide a conexao com um cliente de banco de dados.

## Prerequisites

- Docker e Docker Compose instalados
- Arquivo `docker-compose.yml` configurado com servico PostgreSQL
- Cliente de banco de dados (Beekeeper Studio ou similar)
- Se Docker nao estiver instalado: instalar via `apt`, `brew`, ou Docker Desktop

## Steps

### Step 1: Executar o container em background

```bash
docker-compose up -d
```

A flag `-d` (detached) executa o container em background, porque sem ela o terminal fica preso ao processo e voce perde o controle do terminal.

### Step 2: Verificar a imagem baixada

```bash
docker image ls
```

Confirme que a imagem do PostgreSQL aparece na listagem.

### Step 3: Verificar o container em execucao

```bash
docker ps
```

Confirme que o container esta com status `Up` e a porta mapeada corretamente.

### Step 4: Conectar com cliente de banco de dados

No Beekeeper Studio (ou cliente equivalente):

| Campo | Valor |
|-------|-------|
| Tipo | PostgreSQL |
| Host | localhost |
| Porta | 5432 (ou a definida no compose) |
| Usuario | O definido em `POSTGRES_USER` |
| Senha | O definido em `POSTGRES_PASSWORD` |
| Database | O definido em `POSTGRES_DB` |

### Step 5: Salvar a conexao

Salve a conexao no cliente para reutilizar sem redigitar credenciais.

## Output format

Apos execucao bem-sucedida:
- Container rodando em background (`docker ps` mostra status `Up`)
- Banco de dados acessivel via cliente na porta configurada
- Conexao salva no cliente de banco de dados

## Error handling

| Situacao | Recuperacao |
|----------|-------------|
| `port already in use` | Parar o processo na porta: `lsof -i :5432` e matar, ou alterar a porta no compose |
| Imagem nao aparece em `docker image ls` | Verificar conexao com internet e rodar `docker-compose pull` |
| Container para imediatamente | Verificar logs: `docker-compose logs` |
| Conexao recusada no cliente | Confirmar que o container esta `Up` e a porta esta correta |
| Credenciais invalidas | Conferir variaveis `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` no `docker-compose.yml` |

## Verification

- `docker ps` mostra o container com status `Up`
- `docker-compose logs` nao mostra erros
- Cliente de banco conecta com sucesso (banco vazio, sem tabelas ainda)

## Heuristics

| Situacao | Faca |
|----------|------|
| Primeiro `docker-compose up` | Use `-d` para liberar o terminal |
| Precisa ver logs em tempo real | `docker-compose logs -f` |
| Mudou o `docker-compose.yml` | `docker-compose down && docker-compose up -d` para recriar |
| Quer resetar o banco completamente | `docker-compose down -v` (remove volumes) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre modo detached, verificacao de containers e fluxo de conexao
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e cenarios reais