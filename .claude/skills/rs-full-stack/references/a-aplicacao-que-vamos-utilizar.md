---
name: rs-full-stack-query-builder-setup
description: "Follows the base project setup for the Skillz Query Builder module when user asks to 'setup query builder project', 'start query builder', 'configure express API base', or 'prepare project for knex/query builder'. Applies steps: clone template, npm install, verify Express server, configure Insomnia. Make sure to use this skill whenever starting the Query Builder module from scratch. Not for query builder syntax, SQL queries, or Knex configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [express, project-setup, query-builder, insomnia, typescript]
---

# Setup do Projeto Base — Query Builder

> Configure o projeto Express/TypeScript base antes de iniciar o estudo de Query Builder.

## Prerequisites

- Node.js 18+
- npm instalado
- Insomnia (ou similar) para testar requisicoes HTTP
- Template do projeto: `skillz-education/fullstack-query-builder-template`

## Steps

### Step 1: Obter o projeto base

```bash
git clone https://github.com/skillz-education/fullstack-query-builder-template.git query-builder
cd query-builder
```

### Step 2: Instalar dependencias

```bash
npm install
```

Isso gera a pasta `node_modules`. Sem ela, o editor mostra erros nas importacoes.

### Step 3: Iniciar o servidor

```bash
npm run dev
```

O servidor Express sobe em `localhost:3333`.

### Step 4: Verificar funcionamento

```bash
curl http://localhost:3333
# Esperado: "hello world"
```

### Step 5: Configurar Insomnia

1. Criar nova **Request Collection** chamada `query builder`
2. Adicionar HTTP Request GET chamada `index`
3. URL: `http://localhost:3333`
4. Clicar Send — deve retornar `"hello world"`

## Estrutura do projeto base

```
query-builder/
├── src/
│   └── server.ts       # Unico arquivo — Express + rota GET /
├── package.json
├── package-lock.json
└── tsconfig.json
```

### server.ts (conteudo inicial)

```typescript
import express from "express"

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.json("hello world")
})

app.listen(3333)
```

## Output format

Servidor Express rodando na porta 3333 com uma rota GET `/` retornando `"hello world"`, pronto para receber as rotas do Query Builder.

## Error handling

- Se `npm run dev` falha: verificar se `npm install` foi executado
- Se porta 3333 ocupada: matar processo com `lsof -i :3333` ou trocar a porta
- Se importacoes mostram erro no editor: confirmar que `node_modules/` existe

## Verification

- `curl http://localhost:3333` retorna `"hello world"`
- Insomnia GET `localhost:3333` retorna 200 com body `"hello world"`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que o projeto base e entregue pronto
- [code-examples.md](references/code-examples.md) — Codigo do server.ts com anotacoes detalhadas

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npm run dev` falha | `npm install` nao foi executado | Execute `npm install` antes de iniciar o servidor |
| Porta 3333 ocupada | Outro processo usando a mesma porta | Mate o processo com `lsof -i :3333` ou troque a porta |
| Importacoes mostram erro no editor | `node_modules/` nao existe | Confirme que `npm install` completou com sucesso |
| Insomnia retorna Connection Refused | Servidor nao esta rodando | Verifique se `npm run dev` esta ativo no terminal |