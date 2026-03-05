---
name: rs-full-stack-instalacao-configurando-prisma
description: "Guides Prisma ORM installation and configuration with PostgreSQL in Node.js projects. Use when user asks to 'setup Prisma', 'install Prisma', 'configure ORM', 'connect to Postgres', or 'initialize database with Prisma'. Covers prisma init, schema.prisma setup, .env database URL configuration. Make sure to use this skill whenever setting up Prisma from scratch in a new project. Not for Prisma migrations, model creation, or query writing."
---

# Instalacao e Configuracao do Prisma

> Instalar o Prisma, inicializar com provider PostgreSQL e configurar a URL de conexao no .env antes de criar qualquer modelo.

## Prerequisites

- Node.js 18+ com projeto ja inicializado (`package.json` existente)
- PostgreSQL instalado e rodando
- Credenciais do banco (usuario, senha, porta)

## Steps

### Step 1: Instalar o Prisma

```bash
npm install prisma@5.19.1
```

Fixar a versao garante reproducibilidade entre ambientes, porque versoes diferentes podem gerar migrations incompativeis.

### Step 2: Inicializar o Prisma com PostgreSQL

```bash
npx prisma init --datasource-provider postgresql
```

Isso cria:
- `prisma/schema.prisma` — arquivo de definicao do schema
- `.env` — arquivo de variaveis de ambiente com `DATABASE_URL`

### Step 3: Configurar a URL de conexao no .env

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:PORT/DBNAME?schema=public"
```

**Exemplo concreto:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api?schema=public"
```

| Segmento | Significado | Exemplo |
|----------|------------|---------|
| `USER` | Usuario do banco | `postgres` |
| `PASSWORD` | Senha do usuario | `postgres` |
| `localhost` | Host do banco | `localhost` |
| `PORT` | Porta do PostgreSQL | `5432` |
| `DBNAME` | Nome do banco (Prisma cria se nao existir) | `api` |
| `schema` | Schema do PostgreSQL | `public` |

### Step 4: Verificar o schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

O `env("DATABASE_URL")` referencia a variavel definida no `.env`, porque separar credenciais do codigo evita vazamentos em repositorios.

## Output format

Apos configuracao, a estrutura do projeto deve conter:

```
project/
├── prisma/
│   └── schema.prisma    # generator + datasource configurados
├── .env                 # DATABASE_URL definida
└── package.json         # prisma nas devDependencies
```

## Error handling

- Se `npx prisma init` falhar com "prisma not found": verificar se `npm install prisma` rodou corretamente
- Se conexao falhar depois: verificar se PostgreSQL esta rodando na porta configurada (`pg_isready -p PORT`)
- Se banco nao existir: o Prisma cria automaticamente ao rodar a primeira migration

## Verification

```bash
# Verificar que prisma esta instalado
npx prisma --version

# Verificar que .env tem DATABASE_URL
grep DATABASE_URL .env

# Verificar conexao (apos criar primeiro model e migration)
npx prisma db pull
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo sem ORM | Seguir todos os steps sequencialmente |
| Porta do Postgres diferente da padrao (5432) | Ajustar PORT na DATABASE_URL |
| Banco ja existe | Usar o nome existente no DBNAME — Prisma nao sobrescreve |
| `.env` ja existe no projeto | Adicionar DATABASE_URL sem apagar outras variaveis |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Hardcode URL no schema.prisma | Use `env("DATABASE_URL")` |
| Commitar `.env` no git | Adicione `.env` ao `.gitignore` |
| Instalar sem fixar versao | `prisma@5.19.1` com versao explicita |
| Usar porta errada e tentar debug no Prisma | Verificar `pg_isready` primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre .env, variaveis de ambiente e separacao de configuracao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de configuracao com variacoes de ambiente

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-instalacao-e-configurando-o-prisma/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-instalacao-e-configurando-o-prisma/references/code-examples.md)
