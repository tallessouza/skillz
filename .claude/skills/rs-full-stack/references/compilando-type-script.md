---
name: rs-full-stack-compilando-type-script
description: "Applies TypeScript compilation workflow when setting up or configuring TypeScript in Node.js projects. Use when user asks to 'add TypeScript', 'setup TypeScript', 'compile ts', 'convert ts to js', or 'run TypeScript with Node'. Covers renaming files to .ts, adding type annotations, compiling with tsc, and understanding the TS-to-JS pipeline. Make sure to use this skill whenever configuring TypeScript compilation in a Node.js backend project. Not for frontend bundler setups, tsconfig deep tuning, or runtime type validation libraries."
---

# Compilando TypeScript

> TypeScript existe apenas em desenvolvimento — em producao, Node executa JavaScript puro gerado pela compilacao.

## Rules

1. **Renomeie arquivos para .ts ao adicionar TypeScript** — `server.ts` nao `server.js`, porque o editor ativa verificacao de tipos apenas com a extensao correta
2. **Sempre defina tipagens explicitas nos parametros** — `a: number` nao `a` sozinho, porque parametros sem tipo recebem `any` implicitamente e anulam o beneficio do TypeScript
3. **Defina o tipo de retorno explicitamente** — `function sum(a: number, b: number): number`, porque torna o contrato da funcao visivel e pega erros de retorno em tempo de compilacao
4. **Nunca execute .ts diretamente com Node em producao** — Node nao entende tipagens TypeScript nativamente, o arquivo deve ser compilado para .js primeiro
5. **Use `npx tsc` para compilar** — gera o .js correspondente sem tipagens, pronto para execucao pelo Node
6. **TypeScript em dev, JavaScript em prod** — o fluxo e: escrever .ts → compilar com tsc → executar .js com Node

## How to write

### Funcao com tipagem completa

```typescript
function sum(a: number, b: number): number {
  return a + b
}

const result: number = sum(5, 3)
console.log(`Resultado da soma: ${result}`)
```

### Compilar e executar

```bash
# Compilar TypeScript para JavaScript
npx tsc src/server.ts

# Executar o JavaScript gerado
node src/server.js
```

## Example

**Before (sem tipagem — roda no Node mas sem seguranca):**
```typescript
// server.ts
function sum(a, b) {
  return a + b
}
const result = sum(5, "3") // Bug silencioso: retorna "53"
console.log(result)
```

**After (com tipagem — erro detectado em compilacao):**
```typescript
// server.ts
function sum(a: number, b: number): number {
  return a + b
}
const result: number = sum(5, 3)
console.log(`Resultado da soma: ${result}`) // 8
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Arquivo .ts com erro de "unexpected token :" ao rodar com Node | Compilar com `npx tsc` antes de executar |
| Parametro mostrando "..." no editor (implicit any) | Adicionar tipo explicito: `param: type` |
| Projeto novo Node.js | Renomear .js para .ts e instalar typescript como devDependency |
| Deploy para producao | Executar apenas os .js compilados, nunca os .ts |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `node src/server.ts` (em producao) | `npx tsc src/server.ts && node src/server.js` |
| `function sum(a, b)` em arquivo .ts | `function sum(a: number, b: number): number` |
| Commitar arquivos .js gerados pelo tsc | Adicionar `*.js` (na pasta src) ao `.gitignore` |
| Deixar parametros com tipo `any` implicito | Definir tipo explicito em cada parametro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que Node nao executa TypeScript e o papel do compilador
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-compilando-type-script/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-compilando-type-script/references/code-examples.md)
