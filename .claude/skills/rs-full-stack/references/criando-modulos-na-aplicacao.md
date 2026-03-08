---
name: rs-full-stack-criando-modulos
description: "Enforces JavaScript ES module patterns when structuring code into separate files. Use when user asks to 'create a module', 'split code into files', 'import/export functions', 'organize project structure', or any JS file separation task. Applies rules: one responsibility per module, explicit exports, type=module in HTML, relative paths with extension. Make sure to use this skill whenever organizing JavaScript code across multiple files. Not for Node.js CommonJS require/module.exports, bundler config, or TypeScript-only module syntax."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-es-modules
  tags: [javascript, es-modules, import, export, modules]
---

# Modulos JavaScript (ES Modules)

> Separe funcionalidades em arquivos independentes usando export para compartilhar e import para consumir.

## Rules

1. **Um modulo = uma responsabilidade** — `calc.js` contem funcoes de calculo, `auth.js` contem autenticacao, porque facilita localizacao e manutencao
2. **Exporte explicitamente** — use `export` antes da declaracao ou `export { fn1, fn2 }` no final, porque funcoes sem export sao privadas ao modulo (isso e intencional, nao um bug)
3. **Importe com chaves e caminho relativo** — `import { sum } from "./calc.js"`, porque o browser precisa do caminho exato com extensao
4. **Declare type=module no HTML** — `<script type="module" src="./main.js">`, porque sem isso o browser rejeita sintaxe import/export
5. **Arquivo principal se chama main.js** — porque sinaliza o ponto de entrada da aplicacao
6. **Separe por virgula multiplos imports** — `import { sum, multiply } from "./calc.js"`, porque cada funcao e importada individualmente

## How to write

### Modulo com export inline

```javascript
// calc.js
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}
```

### Modulo com export agrupado no final

```javascript
// calc.js
function sum(a, b) {
  return a + b
}

function multiply(a, b) {
  return a * b
}

export { sum, multiply }
```

### Importando no arquivo principal

```javascript
// main.js
import { sum, multiply } from "./calc.js"

console.log(`4 + 6 = ${sum(4, 6)}`)
console.log(`4 x 6 = ${multiply(4, 6)}`)
```

### HTML com type module

```html
<script type="module" src="./main.js"></script>
```

## Example

**Before (tudo num arquivo so):**
```javascript
// main.js
function sum(a, b) { return a + b }
function multiply(a, b) { return a * b }
console.log(sum(4, 6))
console.log(multiply(4, 6))
```

**After (separado em modulos):**
```javascript
// calc.js
export function sum(a, b) { return a + b }
export function multiply(a, b) { return a * b }

// main.js
import { sum, multiply } from "./calc.js"
console.log(sum(4, 6))
console.log(multiply(4, 6))
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao usada em multiplos arquivos | Extraia para modulo proprio, exporte |
| Funcao auxiliar interna do modulo | Nao exporte — ela e privada por padrao |
| Arquivo principal da aplicacao | Nomeie `main.js`, importe o que precisa |
| Multiplas funcoes do mesmo modulo | Um unico import com virgulas: `{ a, b, c }` |
| Erro "Cannot use import statement" | Adicione `type="module"` na tag script |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Tudo num arquivo so | Separe por responsabilidade em modulos |
| `import { sum } from "calc.js"` (sem ./) | `import { sum } from "./calc.js"` |
| `<script src="main.js">` sem type | `<script type="module" src="./main.js">` |
| Exportar todas as funcoes do modulo | Exporte apenas o que precisa ser compartilhado |
| Importar sem chaves (named export) | `import { sum }` com chaves para named exports |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre modulos, privacidade e dois estilos de export
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| "Cannot use import statement outside a module" | Faltou `type="module"` na tag script | Adicione `<script type="module" src="./main.js">` |
| "Failed to resolve module specifier" | Caminho relativo sem `./` ou sem extensao | Use `import { fn } from "./arquivo.js"` com `./` e `.js` |
| Funcao importada retorna undefined | Funcao nao foi exportada no modulo | Adicione `export` antes da declaracao da funcao |
| CORS error ao abrir HTML direto | Browser bloqueia modules em `file://` | Use um servidor local (Live Server, `npx serve`) |
| Import funciona mas funcao nao executa | Importou mas nao chamou a funcao | Verifique se a funcao esta sendo invocada apos o import |