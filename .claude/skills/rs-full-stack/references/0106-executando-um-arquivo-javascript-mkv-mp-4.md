---
name: rs-full-stack-executando-arquivo-js
description: "Applies Node.js project structure conventions when setting up a new Node.js project or creating entry point files. Use when user asks to 'create a node project', 'setup express server', 'initialize backend', 'create server file', or 'run javascript with node'. Enforces src/ folder separation, server.js entry point, and package.json main field configuration. Make sure to use this skill whenever scaffolding Node.js projects from scratch. Not for frontend projects, browser JavaScript, or Deno/Bun runtimes."
---

# Executando Arquivo JavaScript com Node.js

> Separe arquivos de codigo na pasta src/ e configure o package.json para apontar ao entry point correto.

## Rules

1. **Crie uma pasta `src/` na raiz** — separe codigo do projeto de arquivos de configuracao (package.json, .gitignore), porque misturar tudo na raiz torna o projeto desorganizado conforme cresce
2. **Nomeie o entry point como `server.js`** — coloque em `src/server.js`, porque e a convencao padrao para aplicacoes Node.js backend e ferramentas reconhecem automaticamente
3. **Atualize o campo `main` no package.json** — aponte para `src/server.js`, porque o valor padrao `index.js` nao existe e quebra ferramentas que dependem desse campo
4. **Salve antes de executar** — Node.js le o arquivo do disco, nao do editor, porque executar sem salvar roda a versao anterior do codigo
5. **Execute com `node src/server.js`** — use o path relativo a partir da raiz do projeto, porque o terminal integrado do VS Code ja abre na pasta do projeto

## Steps

### Step 1: Criar estrutura de pastas
```bash
mkdir src
```

### Step 2: Criar entry point
```javascript
// src/server.js
console.log('hello world')
```

### Step 3: Atualizar package.json
```json
{
  "main": "src/server.js"
}
```

### Step 4: Executar
```bash
node src/server.js
```

## Example

**Before (package.json gerado pelo npm init):**
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "index.js"
}
```

**After (com entry point correto):**
```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "main": "src/server.js"
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Node.js novo | Criar `src/` + `src/server.js` + atualizar `main` |
| Arquivo na raiz crescendo | Mover para `src/` e ajustar paths |
| Terminal nao acha o arquivo | Verificar se esta na pasta raiz do projeto |
| Alteracao nao reflete na execucao | Salvar o arquivo antes de rodar `node` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Colocar `server.js` na raiz junto com `package.json` | Colocar em `src/server.js` |
| Deixar `"main": "index.js"` padrao | Atualizar para `"main": "src/server.js"` |
| Executar `node server.js` sem path | Executar `node src/server.js` |
| Rodar sem salvar o arquivo | Salvar (Ctrl+S) e depois executar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0106-executando-um-arquivo-javascript-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0106-executando-um-arquivo-javascript-mkv-mp-4/references/code-examples.md)
