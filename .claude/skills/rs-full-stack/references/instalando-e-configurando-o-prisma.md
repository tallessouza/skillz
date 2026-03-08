---
name: rs-full-stack-instalando-e-configurando-o-prisma
description: "Applies Prisma ORM setup workflow when initializing a Node.js project with PostgreSQL. Use when user asks to 'install prisma', 'setup ORM', 'configure database', 'connect to postgres', or 'init prisma with postgresql'. Covers installation with specific version pinning, prisma init with provider flag, DATABASE_URL configuration, env-file loading in dev scripts, and .env-example pattern for secrets. Make sure to use this skill whenever setting up Prisma in a new project or configuring database connections. Not for Prisma schema modeling, migrations, or query writing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: prisma-config
  tags: [prisma, postgresql, orm, env, database]
---

# Instalando e Configurando o Prisma

> Instale o Prisma como dependência de desenvolvimento, inicialize com o provider correto, configure a variável de ambiente e proteja dados sensíveis com .env-example.

## Prerequisites

- Node.js project inicializado com `package.json`
- PostgreSQL rodando (local ou Docker)
- Nome do banco de dados já definido (ex: no `docker-compose.yml`)

## Steps

### Step 1: Instalar o Prisma como dev dependency

```bash
npm i prisma@5.19.1 -D
```

Sempre fixe a versão para evitar breaking changes entre ambientes, porque o Prisma faz releases frequentes com mudanças significativas.

### Step 2: Inicializar o Prisma com provider PostgreSQL

```bash
npx prisma init --datasource-provider postgresql
```

Isso cria a pasta `prisma/` com `schema.prisma` e um arquivo `.env` com a variável `DATABASE_URL`.

### Step 3: Configurar a DATABASE_URL

```env
DATABASE_URL="postgresql://postguis:postguis@localhost:5432/rocketlog"
```

Substitua usuário, senha, porta e nome do banco conforme definido no seu Docker Compose ou servidor PostgreSQL. Copie o nome do banco diretamente da configuração Docker para garantir que está exatamente igual.

### Step 4: Garantir carregamento do .env no script de dev

```json
{
  "scripts": {
    "dev": "tsx watch --env-file .env src/server.ts"
  }
}
```

A flag `--env-file .env` garante que as variáveis de ambiente estejam disponíveis na execução do projeto.

### Step 5: Criar .env-example para referência

```env
DATABASE_URL=
```

Duplique o `.env`, renomeie para `.env-example`, e remova os valores sensíveis. Mantenha apenas as chaves como referência para outros desenvolvedores.

### Step 6: Verificar o .gitignore

```gitignore
.env
```

Confirme que `.env` está no `.gitignore` (o Prisma init já adiciona). O `.env-example` **não** deve estar no gitignore — ele vai para o repositório como referência.

## Output format

Após a configuração, a estrutura deve ser:

```
project/
├── prisma/
│   └── schema.prisma      # provider = postgresql
├── .env                    # DATABASE_URL com credenciais reais (gitignored)
├── .env-example            # DATABASE_URL= sem valores (commitado)
├── .gitignore              # inclui .env
└── package.json            # script dev com --env-file .env
```

## Error handling

- Se `npx prisma init` falhar com "directory already exists": delete a pasta `prisma/` e tente novamente
- Se a conexão falhar: verifique se o PostgreSQL está rodando e se usuário/senha/porta/nome do banco estão corretos na `DATABASE_URL`
- Se variáveis de ambiente não carregam: confirme que `--env-file .env` está no script de dev

## Verification

- `prisma/schema.prisma` existe com `provider = "postgresql"`
- `.env` contém `DATABASE_URL` com formato correto
- `npm run dev` não mostra erro de variável de ambiente indefinida

## Heuristics

| Situação | Faça |
|----------|------|
| Projeto novo sem ORM | Siga todos os 6 steps |
| Já tem Prisma, precisa trocar provider | Apague pasta prisma/ e re-init com novo provider |
| Time compartilha repo | Sempre mantenha .env-example atualizado com novas variáveis |
| Dados sensíveis (API keys, senhas) | Nunca commite no .env, use .env-example só com chaves vazias |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `npm i prisma` (sem -D) | `npm i prisma -D` (é ferramenta de dev) |
| `npx prisma init` (sem provider) | `npx prisma init --datasource-provider postgresql` |
| Commitar `.env` com credenciais | Manter `.env` no `.gitignore`, usar `.env-example` |
| Hardcodar DATABASE_URL no código | Usar variável de ambiente via `.env` |
| Confiar que .env carrega automaticamente | Adicionar `--env-file .env` no script de dev |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `npx prisma init` falha com "directory already exists" | Pasta prisma/ ja existe | Delete a pasta `prisma/` e tente novamente |
| Variaveis de ambiente nao carregam | `--env-file .env` ausente no script dev | Adicionar `--env-file .env` no script de dev do package.json |
| Conexao com banco falha | PostgreSQL nao rodando ou credenciais incorretas | Verificar se PostgreSQL esta ativo e conferir DATABASE_URL |
| `.env` commitado no repositorio | `.gitignore` nao inclui `.env` | Adicionar `.env` ao `.gitignore` e remover do tracking com `git rm --cached .env` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre segurança de credenciais, versionamento do Prisma e padrão env-example
- [code-examples.md](references/code-examples.md) — Todos os exemplos de configuração expandidos com variações