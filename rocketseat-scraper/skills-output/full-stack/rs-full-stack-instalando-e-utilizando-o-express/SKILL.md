---
name: rs-full-stack-instalando-express
description: "Guides Express.js setup with TypeScript including type declarations. Use when user asks to 'install express', 'setup express', 'create an API with express', 'start a node server', or 'add express to project'. Covers production vs dev dependencies, @types packages, and import verification. Make sure to use this skill whenever setting up Express in a TypeScript project. Not for Express routing, middleware configuration, or API endpoint implementation."
---

# Instalando e Utilizando o Express

> Ao configurar Express com TypeScript, instale o framework como dependencia de producao e as tipagens como dependencia de desenvolvimento.

## Rules

1. **Express e dependencia de producao** — instale com `npm i` (sem -D), porque o Express e necessario tanto em desenvolvimento quanto em producao
2. **Tipagens sao dependencias de desenvolvimento** — instale `@types/express` com `-D`, porque tipagens so existem em tempo de compilacao
3. **Fixe a versao do Express** — use `express@4.19.2` (ou versao especifica), porque evita quebras por atualizacoes inesperadas
4. **Verifique o sublinhado vermelho apos importar** — se o VS Code mostra "Could not find declaration module", faltam as tipagens `@types/`
5. **Sempre importe no topo do arquivo** — `import express from 'express'` antes de qualquer uso

## Steps

### Step 1: Instalar o Express
```bash
npm i express@4.19.2
```
Verifique no `package.json` que Express aparece em `dependencies` (nao `devDependencies`).

### Step 2: Instalar tipagens do TypeScript
```bash
npm i -D @types/express
```
Verifique que aparece em `devDependencies`.

### Step 3: Importar e verificar
```typescript
// server.ts
import express from 'express'
```
Salve o arquivo e confirme que o sublinhado vermelho desapareceu. Pode levar alguns segundos para o VS Code atualizar.

### Step 4: Executar a aplicacao
```bash
npm run dev
```

## Output format

Apos a instalacao, o `package.json` deve conter:
```json
{
  "dependencies": {
    "express": "4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.x.x"
  }
}
```

## Error handling

- Se o import mostra "Could not find a declaration file for module 'express'" → instale `@types/express`
- Se `npm run dev` falha apos instalacao → verifique se o `tsconfig.json` esta configurado corretamente
- Se o sublinhado nao some apos instalar types → reinicie o VS Code ou execute "TypeScript: Restart TS Server"

## Heuristics

| Situacao | Faca |
|----------|------|
| Biblioteca sem tipagem propria | Instale `@types/{nome}` separadamente |
| Erro "cannot find module" no TS | Verifique se `@types/` esta instalado |
| Dependencia usada em runtime | `npm i` (producao) |
| Dependencia so para build/dev | `npm i -D` (desenvolvimento) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre dependencias de producao vs desenvolvimento e tipagens separadas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes