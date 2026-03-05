---
name: rs-full-stack-adicionando-com-typescript
description: "Applies TypeScript setup conventions when initializing a Node.js project with TypeScript. Use when user asks to 'add typescript', 'setup typescript in node', 'initialize a node project', or 'configure typescript'. Enforces correct dependency installation as devDependencies, proper @types/node usage, and explains node_modules structure. Make sure to use this skill whenever setting up TypeScript in a new Node.js backend project. Not for frontend-specific TypeScript config, tsconfig tuning, or advanced TypeScript type gymnastics."
---

# Adicionando TypeScript ao Node.js

> Instale TypeScript e suas tipagens como dependencias de desenvolvimento, porque em producao o codigo ja foi convertido para JavaScript.

## Rules

1. **Instale TypeScript como devDependency (`-D`)** — porque TypeScript so e necessario durante desenvolvimento; em producao, o codigo ja e JavaScript puro
2. **Sempre instale `@types/node` junto com `typescript`** — porque sem as tipagens do Node, o TypeScript nao reconhece APIs como `fs`, `path`, `http`
3. **Fixe versoes nas aulas/projetos compartilhados** — use `typescript@5.5.4` e `@types/node@20.14.12` para evitar incompatibilidades entre ambientes
4. **Nunca coloque TypeScript em `dependencies`** — apenas em `devDependencies`, porque o runtime de producao nao executa TypeScript

## Steps

### Step 1: Instalar TypeScript e tipagens do Node

```bash
npm i typescript@5.5.4 @types/node@20.14.12 -D
```

- `typescript` — compilador e ferramentas de tipagem
- `@types/node` — definicoes de tipo para APIs do Node.js
- `-D` — instala como dependencia de desenvolvimento

### Step 2: Verificar package.json

Apos instalacao, `package.json` deve conter:

```json
{
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/node": "^20.14.12"
  }
}
```

O acento `^` indica que versoes compativeis podem ser atualizadas sem quebrar a aplicacao.

### Step 3: Verificar node_modules

A pasta `node_modules/` contera:
- `typescript/` — com seu proprio `package.json` e dependencias
- `@types/node/` — tipagens do Node

## Output format

Apos execucao, o projeto deve ter:
- `node_modules/` com as dependencias instaladas
- `package.json` com `devDependencies` contendo `typescript` e `@types/node`

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto Node novo | Instale typescript + @types/node como -D |
| Dependencia so usada em dev | Use flag `-D` no npm install |
| Dependencia usada em producao | Use `npm i` sem `-D` (vai para `dependencies`) |
| Outras dependencias aparecem em node_modules | Normal — dependencias tem suas proprias dependencias |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `npm i typescript` (sem -D) | `npm i typescript -D` |
| Ignorar @types/node | Sempre instalar junto com typescript |
| Versoes diferentes do time/curso | Fixar mesma versao para evitar problemas |
| Commitar node_modules | Adicionar `node_modules/` ao `.gitignore` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre devDependencies vs dependencies e como TypeScript funciona no pipeline
- [code-examples.md](references/code-examples.md) — Todos os exemplos de instalacao e verificacao expandidos

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-adicionando-com-typescript/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-adicionando-com-typescript/references/code-examples.md)
