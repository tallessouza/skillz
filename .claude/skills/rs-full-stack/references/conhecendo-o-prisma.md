---
name: rs-full-stack-conhecendo-o-prisma
description: "Applies Prisma ORM setup conventions when initializing a Node.js/TypeScript project with Prisma. Use when user asks to 'setup Prisma', 'add an ORM', 'configure database', 'start a new API project', or 'install Prisma'. Ensures VSCode extension, format-on-save config, and Prisma Studio awareness. Make sure to use this skill whenever setting up Prisma in a new or existing project. Not for writing Prisma schemas, queries, or migrations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database
  tags: [prisma, orm, prisma-studio, vscode-extension, format-on-save, database-setup]
---

# Configuracao do Prisma ORM

> Ao configurar o Prisma, garanta que o ambiente de desenvolvimento esteja completo antes de escrever qualquer schema.

## Prerequisites

- Node.js 18+ instalado
- VSCode como editor
- Projeto Node.js/TypeScript inicializado

## Steps

### Step 1: Instalar a extensao do Prisma no VSCode

Instalar a extensao oficial "Prisma" no VSCode, porque ela fornece:
- **Autocomplete** — sugestoes enquanto escreve schemas e queries
- **Syntax highlight** — destaque de palavras reservadas do Prisma
- **Indentacao automatica** — formatacao correta dos arquivos `.prisma`

### Step 2: Configurar format-on-save para arquivos Prisma

Adicionar no `settings.json` do VSCode:

```json
"[prisma]": {
  "editor.formatOnSave": true
}
```

Isso garante que arquivos `.prisma` sejam formatados automaticamente ao salvar, porque erros de indentacao em schemas Prisma causam confusao visual e dificultam code review.

### Step 3: Conhecer o Prisma Studio

O Prisma Studio permite visualizar o banco de dados diretamente no navegador, sem precisar de ferramentas externas como Beekeeper ou DBeaver.

```bash
npx prisma studio
```

## Output format

Ambiente configurado com:
- Extensao Prisma instalada no VSCode
- Format-on-save ativo para arquivos `.prisma`
- Prisma Studio disponivel via `npx prisma studio`

## Verification

- Abrir um arquivo `.prisma` e verificar syntax highlight ativo
- Salvar o arquivo e confirmar que a formatacao automatica funciona
- Rodar `npx prisma studio` e verificar que abre no navegador

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto novo com banco de dados | Configurar Prisma como ORM padrao |
| Precisa visualizar dados no banco | Usar `npx prisma studio` em vez de instalar ferramenta externa |
| Arquivo `.prisma` sem highlight | Verificar se extensao Prisma esta instalada |
| Formatacao quebrada ao salvar | Verificar `[prisma].editor.formatOnSave` no settings.json |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Beekeeper so pra visualizar dados do Prisma | Usar `npx prisma studio` |
| Editar arquivos `.prisma` sem a extensao instalada | Instalar extensao Prisma primeiro |
| Formatar arquivos `.prisma` manualmente | Configurar format-on-save |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Arquivo `.prisma` sem syntax highlight | Extensao Prisma nao instalada no VSCode | Instalar extensao oficial "Prisma" no VSCode |
| Formatacao nao funciona ao salvar | `[prisma].editor.formatOnSave` nao configurado | Adicionar configuracao no `settings.json` do VSCode |
| `npx prisma studio` nao abre | Porta ja em uso ou Prisma nao instalado | Verificar se Prisma esta instalado e porta 5555 esta livre |
| Autocomplete nao funciona em arquivos `.prisma` | Extensao desatualizada ou nao ativa | Atualizar extensao e reiniciar VSCode |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre porque o Prisma e o ecossistema de ferramentas
- [code-examples.md](references/code-examples.md) — Configuracoes completas do VSCode e comandos do Prisma