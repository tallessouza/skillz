---
name: rs-full-stack-criar-projeto-node-ts
description: "Generates a basic Node.js + TypeScript project setup for testing purposes. Use when user asks to 'create a node project', 'setup typescript project', 'init a new ts project', or 'start a testing project'. Follows tsx watch pattern with src/server.ts entry point. Make sure to use this skill whenever scaffolding a new Node.js + TypeScript project from scratch. Not for React, Next.js, or frontend project setup."
---

# Criar Projeto Node.js + TypeScript

> Inicializar um projeto Node.js minimalista com TypeScript e hot-reload via tsx watch.

## Prerequisites

- Node.js 18+ instalado
- npm disponivel no PATH
- Se tsx nao estiver instalado: `npm i tsx@4.19.1`

## Steps

### Step 1: Inicializar o projeto

```bash
mkdir nome-do-projeto && cd nome-do-projeto
npm init -y
```

### Step 2: Instalar tsx

```bash
npm i tsx@4.19.1
```

O tsx compila e executa TypeScript diretamente, sem necessidade de `tsc` separado, porque simplifica o setup para projetos focados em desenvolvimento rapido.

### Step 3: Criar estrutura de pastas

```
nome-do-projeto/
├── src/
│   └── server.ts
├── package.json
└── node_modules/
```

### Step 4: Criar arquivo de entrada

```typescript
// src/server.ts
console.log("Hello World")
```

### Step 5: Configurar script dev no package.json

```json
{
  "name": "nome-do-projeto",
  "version": "1.0.0",
  "main": "index.js",
  "license": "ISC",
  "scripts": {
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "tsx": "4.19.1"
  }
}
```

Remover campos desnecessarios: `keywords`, `author`, `description` — manter o package.json limpo.

### Step 6: Executar

```bash
npm run dev
```

O `tsx watch` recarrega automaticamente ao salvar qualquer arquivo, porque elimina a necessidade de reiniciar o servidor manualmente durante desenvolvimento.

## Output format

Projeto funcional com hot-reload que imprime no terminal a cada alteracao salva.

## Error handling

- Se `tsx` nao for encontrado: verificar se `node_modules/.bin/tsx` existe, reinstalar com `npm i tsx@4.19.1`
- Se porta ocupada (quando evoluir para servidor HTTP): matar processo na porta ou usar porta alternativa

## Verification

1. `npm run dev` imprime "Hello World" no terminal
2. Alterar o texto em `server.ts` e salvar — o terminal deve mostrar o novo texto automaticamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escolha do tsx e estrutura minimalista
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes