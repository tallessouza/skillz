---
name: rs-full-stack-compreendendo-o-npx
description: "Applies correct npx vs npm usage when setting up Node.js projects or running package binaries. Use when user asks to 'run a package', 'execute typescript compiler', 'setup node project', 'use npx or npm', or any task involving package execution vs installation. Ensures npx for execution and npm for installation. Make sure to use this skill whenever running CLI tools from node_modules. Not for package publishing, npm scripts configuration, or package.json authoring."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, npm, npx, cli, tooling]
---

# NPX vs NPM — Execucao vs Instalacao

> Use `npm` para instalar pacotes e `npx` para executar binarios de pacotes.

## Key concept

NPM (Node Package Manager) instala pacotes. NPX (Node Package Execute) executa pacotes. O NPX funciona como atalho para executar binarios que ficam em `node_modules/.bin/`, evitando digitar o caminho completo toda vez.

## Decision framework

| Quando voce quer | Use | Exemplo |
|-----------------|-----|---------|
| Instalar dependencias no projeto | `npm install` | `npm install typescript @types/node` |
| Executar binario de pacote instalado | `npx` | `npx tsc server.ts` |
| Executar pacote sem instalar | `npx` | `npx create-next-app` |
| Instalar multiplos pacotes de uma vez | `npm install` separando por espaco | `npm install typescript @types/node` |

## How to think about it

### NPX como atalho

Sem NPX, para executar o compilador TypeScript voce precisaria do caminho completo:

```bash
# Sem npx — caminho completo ate o binario
./node_modules/.bin/tsc server.ts

# Com npx — atalho direto
npx tsc server.ts
```

Ambos fazem a mesma coisa. O NPX resolve automaticamente o binario dentro de `node_modules/.bin/`.

### NPX com pacotes remotos

NPX tambem executa pacotes registrados no NPM sem precisar instala-los localmente:

```bash
# Executa direto do registro npm, sem instalar
npx create-react-app my-app
npx prisma init
```

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| NPX instala pacotes | NPX apenas executa — quem instala e o NPM |
| NPX so funciona com pacotes locais | NPX executa pacotes locais E remotos do registro npm |
| Precisa sempre do caminho completo para binarios | NPX resolve o caminho automaticamente |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `./node_modules/.bin/tsc file.ts` | `npx tsc file.ts` |
| `npm tsc file.ts` | `npx tsc file.ts` |
| Instalar globalmente so para executar uma vez | `npx <pacote>` sem instalar |


## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Comando npx nao encontrado | Node.js muito antigo ou npx nao instalado | Atualize Node.js para versao 8+ que inclui npx por padrao |
| npx executa versao errada do pacote | Versao em cache diferente da desejada | Use `npx --yes pacote@versao` para forcar versao especifica |
| Erro 'command not found' ao executar binario | Pacote nao instalado localmente | Instale com `npm install pacote` antes de usar `npx` |
| npx baixa pacote toda vez | Pacote nao esta instalado localmente | Instale como devDependency para evitar download repetido |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre npm vs npx, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes