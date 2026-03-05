---
name: rs-node-js-2023-entendendo-o-type-script
description: "Applies TypeScript fundamentals and setup patterns when configuring new Node.js projects with TypeScript. Use when user asks to 'setup TypeScript', 'create a Node project', 'configure tsconfig', 'convert JS to TS', or 'add types to a project'. Covers tsconfig target selection, interface-first typing, and the JS compilation workflow. Make sure to use this skill whenever setting up TypeScript in a Node.js backend project. Not for React/frontend TypeScript setup, advanced generics, or type gymnastics."
---

# Entendendo o TypeScript

> Configure TypeScript em projetos Node.js com interfaces claras, target correto e workflow de compilacao TS→JS.

## Rules

1. **Instale TypeScript como devDependency** — `npm i -D typescript`, porque TypeScript so e necessario em desenvolvimento, nao em producao
2. **Use `npx tsc --init` para criar tsconfig.json** — gera todas as configuracoes comuns automaticamente, porque configurar manualmente e propenso a erros
3. **Defina target como ES2020 ou superior** — Node.js moderno suporta async/await, generators e features ES2020 nativamente, porque target muito antigo gera codigo desnecessariamente verboso
4. **Type parametros de funcao com interfaces** — nunca deixe parametros sem tipo, porque sem tipagem estatica erros so aparecem em runtime (quando o usuario ja foi afetado)
5. **Prefira `interface` para shapes de objetos** — use `interface User { birthYear: number }` ao inves de tipos inline, porque interfaces sao extensiveis e reutilizaveis
6. **Nunca execute .ts diretamente com Node** — Node nao entende TypeScript nativamente, compile com `npx tsc` primeiro, porque vai dar erro de sintaxe

## How to write

### Interface para parametros de funcao

```typescript
interface User {
  birthYear: number
}

function calculateAgeOfUser(user: User) {
  const age = new Date().getFullYear() - user.birthYear
  return age
}
```

### Setup inicial do projeto

```bash
npm init -y
npm i -D typescript
npx tsc --init
# Editar tsconfig.json: "target": "ES2020"
mkdir src && touch src/index.ts
```

### Compilacao e execucao

```bash
npx tsc src/index.ts   # Gera src/index.js
node src/index.js       # Executa o JS compilado
```

## Example

**Before (JavaScript sem tipos — erros so em runtime):**
```javascript
function calculateAgeOfUser(user) {
  const age = new Date().getFullYear() - user.birthYear
  return age
}

calculateAgeOfUser("Diego")  // Sem erro no editor, quebra em runtime
calculateAgeOfUser()          // Sem erro no editor, quebra em runtime
calculateAgeOfUser({})        // Sem erro no editor, retorna NaN
```

**After (TypeScript com interface — erros no editor):**
```typescript
interface User {
  birthYear: number
}

function calculateAgeOfUser(user: User) {
  const age = new Date().getFullYear() - user.birthYear
  return age
}

calculateAgeOfUser("Diego")  // ERRO: string nao e assinavel a User
calculateAgeOfUser()          // ERRO: parametro obrigatorio faltando
calculateAgeOfUser({})        // ERRO: birthYear obrigatorio faltando
calculateAgeOfUser({ birthYear: 1990 })  // OK, autocomplete funciona
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto Node.js | Comece com TypeScript desde o inicio |
| Target do tsconfig | ES2020 para Node.js moderno |
| Parametro de funcao | Sempre defina interface com campos obrigatorios |
| Campo opcional na interface | Use `?` — `birthYear?: number` |
| Arquivo .js gerado pelo tsc | Nao commite, adicione ao .gitignore |
| Node reclama de sintaxe TS | Compile antes com `npx tsc`, execute o .js |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `node src/index.ts` | `npx tsc src/index.ts && node src/index.js` |
| `"target": "ES2016"` em Node moderno | `"target": "ES2020"` ou superior |
| Funcao sem tipo no parametro | `function fn(user: User)` com interface |
| `npm i typescript` (dependencia normal) | `npm i -D typescript` (devDependency) |
| Tipos inline complexos em parametros | Interface nomeada separada |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
