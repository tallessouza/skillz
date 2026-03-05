---
name: rs-full-stack-conectando-beekeeper
description: "Guides connecting Beekeeper Studio to a Dockerized Postgres database. Use when user asks to 'connect to database', 'setup Beekeeper', 'connect GUI to Postgres container', 'test database connection', or 'use Beekeeper with Docker'. Covers connection config, port mapping verification, and container state troubleshooting. Make sure to use this skill whenever setting up a database GUI client with a containerized Postgres. Not for CLI-only psql usage, database schema design, or ORM configuration."
---

# Conectando Beekeeper ao Postgres em Container

> Configure a conexao entre o Beekeeper Studio e um banco Postgres rodando em Docker, verificando mapeamento de portas e estado do container.

## Prerequisites

- Docker rodando com container Postgres ativo (`docker ps` deve listar o container)
- Beekeeper Studio instalado
- Porta 5432 mapeada do host para o container (flag `-p 5432:5432` no `docker run`)

## Steps

### Step 1: Verificar o container

```bash
docker ps
# Confirme que o container Postgres esta rodando e a porta 5432 esta mapeada
# PORTS: 0.0.0.0:5432->5432/tcp
```

### Step 2: Configurar conexao no Beekeeper

1. Abrir Beekeeper → **New Connection**
2. Selecionar **Postgres** como tipo de banco
3. Preencher:

| Campo    | Valor       | Origem                                    |
|----------|-------------|-------------------------------------------|
| Host     | `localhost` | Porta mapeada do container para o host    |
| Port     | `5432`      | Porta padrao do Postgres (ou a mapeada)   |
| User     | `postgres`  | Variavel `POSTGRES_USER` do container     |
| Password | `postgres`  | Variavel `POSTGRES_PASSWORD` do container |

4. Clicar **Test** — deve retornar conexao bem-sucedida
5. Clicar **Connect**

### Step 3: Validar acesso

```sql
SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public';
```

Se retornar resultados (ou vazio sem erro), a conexao esta funcionando.

## Example

**Criando uma tabela de teste via Beekeeper:**

```sql
CREATE TABLE product (
  id SERIAL PRIMARY KEY,
  nome VARCHAR NOT NULL,
  price DECIMAL NOT NULL
);

INSERT INTO product (nome, price) VALUES
  ('teclado', 120),
  ('mouse', 64.59);

SELECT * FROM product;
-- Retorna os 2 registros inseridos
```

## Error handling

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Conexao recusada / timeout | Container parado ou pausado | `docker ps` → se pausado: `docker unpause <id>` |
| Porta em uso | Outro processo na 5432 | `lsof -i :5432` e liberar a porta |
| Credenciais invalidas | User/password diferem das env vars | Verificar `POSTGRES_USER` e `POSTGRES_PASSWORD` do `docker run` |
| Beekeeper trava ao conectar | Container pausado durante conexao ativa | Fechar Beekeeper, despausar container, reabrir e reconectar |

## Verification

1. `docker ps` — container com status `Up` (nao `Paused`)
2. No Beekeeper, **Test Connection** retorna sucesso
3. `SELECT 1;` executa sem erro

## Heuristics

| Situacao | Acao |
|----------|------|
| Container pausado e Beekeeper travou | Fechar Beekeeper, `docker unpause`, reabrir |
| Mudou a porta no docker run | Atualizar Port no Beekeeper para a nova porta do host |
| Precisa persistir dados entre restarts | Usar volume Docker: `-v pgdata:/var/lib/postgresql/data` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre mapeamento de portas e ciclo de vida do container
- [code-examples.md](references/code-examples.md) — Todos os exemplos de SQL e comandos Docker expandidos