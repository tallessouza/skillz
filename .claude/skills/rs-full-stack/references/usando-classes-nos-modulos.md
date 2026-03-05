---
name: rs-full-stack-usando-classes-nos-modulos
description: "Applies class-based module patterns when organizing JavaScript/TypeScript code into modules. Use when user asks to 'refactor functions into a class', 'create a module', 'organize code with classes', 'export a class', or 'convert functions to class methods'. Enforces proper class syntax: no function keyword in methods, PascalCase class names, named exports, instantiation before use. Make sure to use this skill whenever refactoring standalone functions into class-based modules. Not for React components, decorators, or inheritance patterns."
---

# Classes em Módulos JavaScript

> Ao organizar código em módulos, agrupe funções relacionadas em uma classe exportada com métodos, usando PascalCase e instanciação explícita.

## Rules

1. **Exporte a classe diretamente** — `export class Calc {}` na declaração, porque evita exportações individuais para cada função
2. **PascalCase para nomes de classe** — `Calc` não `calc`, porque é a convenção universal que diferencia classes de variáveis
3. **Sem `function` dentro da classe** — métodos usam sintaxe curta `sum(a, b) {}`, porque a classe já sabe que é um método
4. **Instancie antes de usar** — `const calc = new Calc()` antes de chamar métodos, porque classe é um blueprint, não um objeto pronto
5. **Acesse com ponto** — `calc.sum()` não `sum()`, porque o método pertence à instância da classe
6. **Importe a classe, não os métodos** — `import { Calc } from './calc.js'`, porque a classe agrupa tudo

## How to write

### Módulo com classe exportada

```javascript
// calc.js
export class Calc {
  sum(a, b) {
    return a + b
  }

  multiply(a, b) {
    return a * b
  }
}
```

### Consumindo o módulo

```javascript
// main.js
import { Calc } from './calc.js'

const calc = new Calc()
console.log(calc.sum(2, 3))
console.log(calc.multiply(4, 5))
```

### Propriedades na classe

```javascript
export class Calc {
  name = 'Calculator'

  sum(a, b) {
    return a + b
  }
}

// Uso: calc.name → 'Calculator'
```

## Example

**Before (funções soltas exportadas):**

```javascript
// calc.js
export function sum(a, b) {
  return a + b
}

export function multiply(a, b) {
  return a * b
}

// main.js
import { sum, multiply } from './calc.js'
console.log(sum(2, 3))
```

**After (classe como módulo):**

```javascript
// calc.js
export class Calc {
  sum(a, b) {
    return a + b
  }

  multiply(a, b) {
    return a * b
  }
}

// main.js
import { Calc } from './calc.js'
const calc = new Calc()
console.log(calc.sum(2, 3))
```

## Heuristics

| Situação | Faça |
|----------|------|
| 2+ funções relacionadas no mesmo domínio | Agrupe em uma classe |
| Função utilitária isolada sem estado | Mantenha como função exportada |
| Módulo precisa de estado compartilhado | Use propriedades na classe |
| Apenas 1 função no módulo | Função exportada é suficiente |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `function sum()` dentro da classe | `sum()` (sintaxe curta de método) |
| `class calc` (minúsculo) | `class Calc` (PascalCase) |
| `import { sum } from './calc.js'` (método solto de classe) | `import { Calc } from './calc.js'` (importar a classe) |
| `Calc.sum(2, 3)` sem instanciar | `const calc = new Calc(); calc.sum(2, 3)` |
| Exportar métodos individualmente + classe | Exportar apenas a classe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar classes vs funções em módulos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-usando-classes-nos-modulos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-usando-classes-nos-modulos/references/code-examples.md)
