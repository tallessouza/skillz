---
name: rs-full-stack-atualizando-um-objeto
description: "Applies JavaScript object property update patterns when writing code that modifies objects. Use when user asks to 'update an object', 'change a property', 'modify object values', or 'mutate object state'. Covers dot notation and bracket notation for property updates. Make sure to use this skill whenever generating code that changes existing object properties. Not for object creation, destructuring, or spread operations."
---

# Atualizando Objetos em JavaScript

> Atualizar propriedades de objetos usando notacao de ponto ou colchetes, escolhendo a notacao adequada ao contexto.

## Rules

1. **Use notacao de ponto para propriedades conhecidas** — `product.name = "mouse"`, porque e mais legivel e direta quando o nome da propriedade e estatico
2. **Use notacao de colchetes para propriedades dinamicas** — `product["quantity"] = 50`, porque permite usar variaveis como chave
3. **Atualize propriedades individualmente** — atribua diretamente ao campo que mudou, porque manter granularidade facilita debug e rastreamento de mudancas

## How to write

### Atualizacao com notacao de ponto

```javascript
const product = { name: "teclado", quantity: 100 }

// Atualizar valor diretamente
product.quantity = 90
product.name = "mouse"
```

### Atualizacao com notacao de colchetes

```javascript
// Util quando a chave vem de uma variavel
const field = "quantity"
product[field] = 50

// Ou com string literal
product["quantity"] = 50
```

## Example

**Before (recriando objeto inteiro para mudar um campo):**
```javascript
let product = { name: "teclado", quantity: 100 }
// Quer mudar a quantidade...
product = { name: "teclado", quantity: 90 }
```

**After (atualizacao direta da propriedade):**
```javascript
const product = { name: "teclado", quantity: 100 }
product.quantity = 90
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nome da propriedade e fixo no codigo | Notacao de ponto: `obj.prop = value` |
| Nome da propriedade vem de variavel | Notacao de colchetes: `obj[variable] = value` |
| Precisa verificar antes e depois | `console.log` antes e depois da atribuicao |
| Multiplas propriedades para atualizar | Atualize uma por linha, na ordem logica |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| Recriar objeto inteiro para mudar 1 campo | `obj.prop = novoValor` |
| `obj = { ...obj, prop: novoValor }` para mutacao simples em objeto local | `obj.prop = novoValor` |
| Usar colchetes com string literal sem motivo: `obj["name"]` | `obj.name` quando a chave e estatica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes