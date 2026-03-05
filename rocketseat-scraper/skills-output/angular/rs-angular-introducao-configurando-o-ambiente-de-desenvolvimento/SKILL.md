---
name: rs-angular-setup-ambiente
description: "Guides Angular development environment setup including Node.js, NPM, VSCode, and Angular CLI installation. Use when user asks to 'setup Angular', 'install Angular CLI', 'create Angular project', 'configure Angular environment', or 'start new Angular app'. Covers version compatibility between Angular CLI and Node.js, global vs npx installation strategies. Make sure to use this skill whenever setting up or troubleshooting an Angular development environment. Not for Angular component creation, routing, or application logic."
---

# Configurando o Ambiente de Desenvolvimento Angular

> Antes de criar qualquer aplicacao Angular, garantir compatibilidade entre versoes do Node.js e Angular CLI.

## Prerequisites

- Node.js (versao compativel com a versao Angular desejada)
- NPM (vem com Node.js)
- VSCode (editor recomendado)
- Terminal/shell disponivel

## Steps

### Step 1: Verificar compatibilidade de versoes

Consultar a tabela de compatibilidade Angular CLI x Node.js antes de instalar qualquer coisa, porque uma versao incorreta do Node.js nao consegue executar a versao desejada do Angular.

```bash
# Verificar versao atual do Node.js
node -v

# Verificar versao atual do NPM
npm -v
```

Referencia oficial: https://angular.dev/reference/versions

### Step 2: Instalar Node.js e NPM

Baixar a versao compativel do Node.js em https://nodejs.org. O NPM vem incluso na instalacao do Node.js.

### Step 3: Instalar VSCode

Baixar em https://code.visualstudio.com e instalar.

### Step 4: Instalar Angular CLI (duas estrategias)

**Estrategia 1 — Angular CLI Global (ambiente fixo):**

```bash
# Instala a ultima versao do Angular CLI globalmente
npm install -g @angular/cli

# Verificar instalacao
ng version

# Criar aplicacao
ng new minha-aplicacao
```

**Estrategia 2 — npx (ambiente dinamico, recomendado):**

```bash
# Criar aplicacao com a ultima versao sem instalar globalmente
npx @angular/cli new minha-aplicacao

# Criar aplicacao com versao especifica
npx @angular/cli@17 new minha-aplicacao-v17
```

## Heuristics

| Situacao | Estrategia |
|----------|-----------|
| Trabalha sempre com a mesma versao Angular | Angular CLI global |
| Precisa manter projetos em versoes diferentes | npx com versao especifica |
| Primeira vez configurando ambiente | Instalar global + aprender npx |
| CI/CD ou ambiente temporario | npx sempre, porque nao polui o ambiente |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Instalar Node.js sem checar compatibilidade | Consultar tabela de compatibilidade primeiro |
| Assumir que qualquer Node.js roda qualquer Angular | Verificar versoes antes de criar o projeto |
| Instalar Angular CLI global para cada versao | Usar `npx @angular/cli@VERSAO` para versoes especificas |

## Verification

```bash
# Verificar que tudo esta instalado
node -v && npm -v && ng version
# Ou se usou npx:
node -v && npm -v && npx @angular/cli version
```

## Error handling

- Se `ng` nao e reconhecido apos instalar global: verificar se o path do npm global esta no PATH do sistema
- Se `npx` falha: verificar versao do npm (npx vem com npm 5.2+)
- Se projeto nao compila: primeira coisa a verificar e compatibilidade Node.js x Angular CLI

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
