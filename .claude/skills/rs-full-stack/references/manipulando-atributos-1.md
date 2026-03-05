---
name: rs-full-stack-manipulando-atributos-1
description: "Applies DOM attribute manipulation patterns when writing JavaScript that interacts with HTML elements. Use when user asks to 'disable an input', 'change element attributes', 'manipulate the DOM', 'work with forms', or 'modify HTML elements with JS'. Covers setAttribute, removeAttribute, and dynamic form control. Make sure to use this skill whenever generating frontend JS that modifies element properties. Not for CSS styling, event handling, or React/framework component props."
---

# Manipulando Atributos do DOM

> Use setAttribute para adicionar/atualizar e removeAttribute para remover atributos de elementos HTML via JavaScript.

## Rules

1. **Selecione o elemento antes de manipular** — use `querySelector` para obter referencia ao elemento, porque manipular sem referencia causa erro silencioso
2. **setAttribute recebe dois parametros** — `(nomeAtributo, valor)`, porque passar apenas um nao funciona e nao gera erro claro
3. **Se o atributo ja existe, setAttribute atualiza** — nao duplica, porque o metodo faz upsert automaticamente
4. **Se o atributo nao existe, setAttribute cria** — comportamento de upsert, porque elimina a necessidade de verificar existencia antes
5. **Use removeAttribute para remover completamente** — nao use `setAttribute(attr, '')` para "limpar", porque o atributo continua existindo no DOM
6. **Nomeie variaveis pelo elemento, nao pela acao** — `const input = querySelector('input')` nao `const el = querySelector('input')`, porque descreve o conteudo

## How to write

### Selecionar e desabilitar elemento

```javascript
const input = document.querySelector('input')
input.setAttribute('disabled', true)
```

### Alterar tipo de input dinamicamente

```javascript
const input = document.querySelector('input')
input.setAttribute('type', 'file')
```

### Remover atributo

```javascript
const input = document.querySelector('input')
input.removeAttribute('id')
```

## Example

**Before (manipulacao incorreta):**

```javascript
const el = document.querySelector('input')
el.disabled = ''
el.type = undefined
el.removeAttribute() // sem argumento
```

**After (com esta skill aplicada):**

```javascript
const input = document.querySelector('input')
input.setAttribute('disabled', true)
input.setAttribute('type', 'file')
input.removeAttribute('id')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Bloquear campo ate usuario concordar com termos | `setAttribute('disabled', true)` e remover apos evento |
| Mudar input de texto para upload | `setAttribute('type', 'file')` |
| Remover atributo que nao deveria existir | `removeAttribute('nomeDoAtributo')` |
| Adicionar atributo novo que nao existia | `setAttribute` — cria automaticamente |
| Atualizar valor de atributo existente | `setAttribute` — atualiza automaticamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `element.removeAttribute()` (sem argumento) | `element.removeAttribute('disabled')` |
| `setAttribute('disabled', '')` para habilitar | `removeAttribute('disabled')` |
| `const el = querySelector(...)` | `const input = querySelector('input')` |
| Manipular atributo sem selecionar elemento | Sempre `querySelector` primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-manipulando-atributos-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-manipulando-atributos-1/references/code-examples.md)
