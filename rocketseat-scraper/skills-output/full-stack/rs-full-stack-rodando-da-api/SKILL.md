---
name: rs-full-stack-rodando-da-api
description: "Follows the workflow for downloading, setting up, and running a Node.js API project from GitHub alongside a frontend project. Use when user asks to 'download an API', 'setup backend project', 'run the API', 'open Prisma Studio', 'organize frontend and backend folders', or 'start the dev server'. Make sure to use this skill whenever setting up a pre-built API to integrate with a frontend application. Not for creating APIs from scratch, deploying to production, or writing API routes."
---

# Rodando da API

> Configure e execute uma API Node.js existente para integrar com a aplicacao frontend.

## Prerequisites

- Node.js instalado
- npm disponivel no terminal
- Projeto frontend ja criado em pasta separada
- API disponivel como repositorio GitHub ou ZIP

## Steps

### Step 1: Download do projeto

Acesse o repositorio no GitHub, clique em **Code > Download ZIP**. Extraia o arquivo na pasta do projeto.

### Step 2: Organize a estrutura de pastas

```
projeto/
├── api/          # Backend (API extraida e renomeada)
└── web/          # Frontend (projeto existente)
```

Renomeie a pasta extraida para `api` e mova para dentro da pasta raiz do projeto, ao lado da pasta `web`.

### Step 3: Instale as dependencias

```bash
cd api
npm i
```

Isso gera a pasta `node_modules` necessaria para execucao.

### Step 4: Inicie o servidor

```bash
npm run dev
```

Mantenha este terminal aberto com o servidor rodando.

### Step 5: Acesse o banco de dados (opcional)

Abra um segundo terminal na mesma pasta `api`:

```bash
npx prisma studio
```

O Prisma Studio abre no navegador para visualizar e gerenciar dados.

### Step 6: Limpe dados de teste (opcional)

No Prisma Studio:
1. Delete registros de tabelas dependentes primeiro (ex: `Refund`)
2. Depois delete registros da tabela principal (ex: `User`)
3. Respeite a ordem por causa de foreign keys

## Output format

Tres terminais/processos rodando simultaneamente:

| Terminal | Comando | Proposito |
|----------|---------|-----------|
| 1 | `npm run dev` (na pasta api) | Servidor da API |
| 2 | `npx prisma studio` (na pasta api) | Visualizador do banco |
| 3 | Livre | Comandos adicionais / frontend |

## Error handling

- Se `npm i` falhar: verifique a versao do Node.js e se o `package.json` existe na pasta
- Se `npm run dev` falhar: confirme que `node_modules` foi gerado e que a porta nao esta em uso
- Se Prisma Studio nao abrir: verifique se o arquivo `.env` com `DATABASE_URL` existe
- Se nao conseguir deletar usuarios: delete primeiro os registros das tabelas que referenciam `User` (foreign key constraint)

## Verification

- Servidor responde em `http://localhost:{PORT}` (verifique a porta no console)
- Prisma Studio abre no navegador mostrando as tabelas do banco
- Tabelas estao acessiveis e editaveis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao de monorepo frontend+backend e fluxo de setup
- [code-examples.md](references/code-examples.md) — Todos os comandos expandidos com variacoes e troubleshooting