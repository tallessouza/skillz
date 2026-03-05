---
name: rs-full-stack-primeira-funcao
description: "Enforces correct function declaration and invocation patterns when writing JavaScript. Use when user asks to 'create a function', 'write a function', 'declare a function', or 'call a function' in JavaScript. Applies rules: use function keyword with named declaration, define scope with curly braces, invoke with parentheses, reuse instead of duplicating. Make sure to use this skill whenever generating basic JavaScript functions. Not for arrow functions, async functions, or advanced patterns like closures and HOFs."
---

# Primeira Função em JavaScript

> Declare funções com `function` + nome, delimite o escopo com chaves, e invoque pelo nome com parênteses — reutilize em vez de duplicar.

## Rules

1. **Declare com `function` + nome descritivo** — `function showGreeting()` não `function f()`, porque o nome comunica a intenção da função
2. **Escopo dentro das chaves** — tudo que a função executa fica entre `{` e `}`, porque isso delimita a responsabilidade da função
3. **Invoque com parênteses** — `showGreeting()` não `showGreeting`, porque sem parênteses a função é referenciada mas não executada
4. **Reutilize chamando novamente** — chame a função quantas vezes precisar sem recriar o conteúdo, porque funções existem para evitar duplicação
5. **Declarar não é executar** — uma função declarada não roda até ser chamada, porque declaração é definição, invocação é execução

## How to write

### Declaração e invocação básica

```javascript
// Declare a função com nome descritivo
function showGreeting() {
  console.log("Olá, é bom ter você aqui!")
}

// Invoque pelo nome + parênteses
showGreeting()
```

### Reutilização

```javascript
function showGreeting() {
  console.log("Olá, é bom ter você aqui!")
}

// Chame quantas vezes precisar — sem recriar
showGreeting()
showGreeting()
showGreeting()
```

## Example

**Before (código duplicado sem função):**
```javascript
console.log("Olá, é bom ter você aqui!")
console.log("Olá, é bom ter você aqui!")
console.log("Olá, é bom ter você aqui!")
```

**After (com função reutilizável):**
```javascript
function showGreeting() {
  console.log("Olá, é bom ter você aqui!")
}

showGreeting()
showGreeting()
showGreeting()
```

## Heuristics

| Situação | Faça |
|----------|------|
| Mesmo código aparece 2+ vezes | Extraia para uma função |
| Função declarada mas nada acontece | Verifique se chamou com `()` |
| Precisa do mesmo comportamento em vários pontos | Chame a função novamente, não copie o corpo |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Copiar/colar o mesmo bloco várias vezes | Criar função e chamar múltiplas vezes |
| `showGreeting` (sem parênteses para executar) | `showGreeting()` |
| `function()` (sem nome) quando precisa reutilizar | `function showGreeting()` com nome descritivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre declaração vs execução e o conceito de escopo
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-primeira-funcao/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-primeira-funcao/references/code-examples.md)
