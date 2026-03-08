---
name: rs-full-stack-prisma-studio
description: "Configures usage of Prisma Studio for database visualization during development. Use when user asks to 'view database', 'open prisma studio', 'check db content', 'visualize tables', or 'inspect models'. Launches the built-in Prisma GUI at localhost:5555 for browsing models and data. Make sure to use this skill whenever the user needs to inspect database state in a Prisma project. Not for database migrations, schema changes, or Prisma Client query writing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: prisma-orm
  tags:
    - prisma
    - database
    - studio
    - visualization
---

# Prisma Studio

> Use Prisma Studio para visualizar e inspecionar o conteudo do banco de dados diretamente no navegador.

## Prerequisites

- Prisma configurado no projeto com `schema.prisma` valido
- Banco de dados acessivel (connection string configurada no `.env`)
- Se Prisma Studio nao abrir: verificar se a porta 5555 esta livre

## Steps

### Step 1: Abrir o Prisma Studio

```bash
npx prisma studio
```

Abre automaticamente o navegador em `http://localhost:5555`.

### Step 2: Navegar pelos modelos

A interface lista todos os modelos definidos no `schema.prisma`. Clicar em um modelo exibe os registros da tabela correspondente.

### Step 3: Inspecionar dados

- Visualizar registros existentes em cada tabela
- Filtrar e ordenar dados pela interface
- Adicionar registros manualmente (util para testes rapidos, mas preferir codigo para dados reais)

## Output format

Prisma Studio roda como servidor local:
- **URL:** `http://localhost:5555`
- **Processo:** bloqueia o terminal (usar terminal separado para continuar desenvolvendo)

## Error handling

- Se porta 5555 ocupada: encerrar processo anterior ou usar `npx prisma studio --port 5556`
- Se modelos nao aparecem: executar `npx prisma generate` antes
- Se dados desatualizados: atualizar a pagina no navegador (F5)

## Verification

- Todos os modelos do `schema.prisma` aparecem listados na interface
- Dados inseridos via codigo sao visiveis ao atualizar a pagina

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa verificar se seed/migration funcionou | Abrir Prisma Studio e conferir registros |
| Debug de dados inconsistentes | Inspecionar registros diretamente na interface |
| Adicionar dado de teste rapido | Usar o botao "Add record" (apenas para testes) |
| Producao | Nunca usar Prisma Studio — apenas desenvolvimento local |

## Anti-patterns

| Evitar | Fazer em vez disso |
|--------|--------------------|
| Usar Prisma Studio para inserir dados de producao | Inserir dados via codigo (seeds, API) |
| Manter Prisma Studio aberto em producao | Usar apenas em ambiente de desenvolvimento |
| Editar dados manualmente como padrao | Criar scripts de seed para dados reproduziveis |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e contexto do Prisma Studio
- [code-examples.md](references/code-examples.md) — Exemplos de uso e integracoes com workflow de desenvolvimento

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Prisma Studio nao abre no navegador | Porta 5555 ja esta em uso por outro processo | Use `npx prisma studio --port 5556` ou encerre o processo na porta |
| Modelos nao aparecem na interface | Prisma Client nao foi gerado apos mudanca no schema | Execute `npx prisma generate` antes de abrir o Studio |
| Dados inseridos via codigo nao aparecem | Pagina do Studio esta com cache | Atualize a pagina no navegador com F5 |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-prisma-studio/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-prisma-studio/references/code-examples.md)
