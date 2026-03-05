---
name: rs-full-stack-conhecendo-o-strict-mode
description: "Enforces JavaScript strict mode usage when writing vanilla JS or configuring projects. Use when user asks to 'write JavaScript', 'create a script', 'fix silent errors', 'debug unexpected behavior', or 'setup a JS project'. Applies strict mode activation, catches silent failures like undeclared variables, duplicate parameters, read-only property assignment, and undeletable property deletion. Make sure to use this skill whenever generating vanilla JavaScript that runs outside modules/frameworks. Not for TypeScript (already strict), ES modules (implicit strict), or framework-specific configuration."
---

# Strict Mode do JavaScript

> Ative `"use strict"` para transformar erros silenciosos em exceções explicitas, eliminando armadilhas da flexibilidade do JavaScript.

## Rules

1. **Sempre ative strict mode no topo do arquivo** — `"use strict";` como primeira instrucao, porque erros silenciosos em producao custam horas de debug
2. **Declare variaveis explicitamente** — use `let`, `const` ou `var`, porque sem declaracao o JS cria variaveis globais silenciosamente via hoisting
3. **Nunca duplique nomes de parametros** — `function sum(a, a, c)` silenciosamente sobrepoe o primeiro `a` com o ultimo valor, gerando calculos errados sem aviso
4. **Nao tente atribuir a propriedades somente-leitura** — getters sem setters aceitam atribuicao silenciosamente sem strict mode, mascarando bugs de logica
5. **Nao tente deletar propriedades nao-deletaveis** — `delete window.document` falha silenciosamente sem strict mode, dando falsa impressao de sucesso
6. **Prefira escopo global ao escopo de funcao** — coloque `"use strict"` no topo do arquivo para proteger todo o codigo, use escopo de funcao apenas quando migrando codigo legado incrementalmente

## How to write

### Ativacao global (preferido)

```javascript
"use strict";

// Todo o codigo abaixo esta protegido
const userName = "Rodrigo";
console.log(userName);
```

### Ativacao por funcao (migracao gradual)

```javascript
function showMessage() {
  "use strict";
  // Apenas esta funcao esta protegida
  const personName = "Rodrigo";
  console.log("Hola,", personName);
}
```

## Example

**Before (erros silenciosos sem strict mode):**

```javascript
function sum(a, a, c) {
  return a + a + c;
}

console.log(sum(1, 3, 2)); // Resultado: 8 (nao 6!)
// O segundo parametro 'a' sobrepoe o primeiro
// Conta real: 3 + 3 + 2 = 8
```

**After (strict mode captura o erro):**

```javascript
"use strict";

function sum(a, b, c) {
  return a + b + c;
}

console.log(sum(1, 3, 2)); // Resultado: 6
// SyntaxError se tentar duplicar parametros
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Arquivo `.js` vanilla (script tag) | `"use strict";` no topo |
| ES Module (`import`/`export`) | Nao precisa — strict mode implicito |
| TypeScript | Nao precisa — compilador ja e estrito |
| Migrando codigo legado | `"use strict"` por funcao, gradualmente |
| Classe ES6 | Nao precisa — corpo de classe ja e strict |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `personName = "X"` (sem declaracao) | `const personName = "X"` |
| `function f(a, a, c)` | `function f(a, b, c)` |
| `student.point = 10` (getter sem setter) | Crie um setter ou use outro metodo |
| `delete window.document` | Nao tente deletar propriedades nativas |
| Arquivo `.js` sem `"use strict"` | Primeira linha: `"use strict";` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases do strict mode
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes