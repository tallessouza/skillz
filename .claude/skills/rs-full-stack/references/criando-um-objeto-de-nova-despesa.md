---
name: rs-full-stack-criando-objeto-nova-despesa
description: "Enforces structured object creation patterns when building form-based data objects in JavaScript. Use when user asks to 'create an object from form', 'capture form data', 'build expense object', 'get select option text and value', or 'generate unique IDs without database'. Applies rules: timestamp IDs for prototypes, separate select value/text extraction, created_at metadata, named object properties matching domain. Make sure to use this skill whenever creating objects from HTML form inputs. Not for database schemas, API payloads, or TypeScript interfaces."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, objects, forms, DOM, select, id-generation]
---

# Criando Objetos a Partir de Formularios

> Ao capturar dados de formulario, centralize todas as informacoes em um objeto de dominio com propriedades nomeadas, ID unico e metadados de criacao.

## Rules

1. **Crie um objeto centralizado** — nunca passe valores soltos entre funcoes, porque um objeto agrupa contexto e facilita manutencao
2. **Gere IDs com `new Date().getTime()`** — suficiente para prototipos sem banco de dados, porque produz timestamp unico por milissegundo
3. **Extraia value E text de selects** — `select.value` para logica interna (ex: icone), `select.options[select.selectedIndex].text` para exibicao ao usuario, porque servem propositos diferentes
4. **Adicione `created_at: new Date()`** — registre quando o item foi criado, porque e padrao em qualquer sistema de dados e facilita ordenacao
5. **Nomeie propriedades pelo dominio** — `expense`, `category_name`, `amount`, nunca `data`, `value`, `text`, porque o objeto deve ser auto-descritivo
6. **Use `preventDefault()` antes de construir o objeto** — capture o submit sem reload, porque o comportamento padrao do formulario recarrega a pagina

## How to write

### Objeto de dominio a partir de formulario

```javascript
// Dentro do handler de submit
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
}
```

### Extraindo texto de um select

```javascript
// select.value = valor do option (ex: "food", "transport")
// select.options[select.selectedIndex].text = texto visivel (ex: "Alimentação", "Transporte")
const categoryId = category.value
const categoryName = category.options[category.selectedIndex].text
```

## Example

**Before (valores soltos, sem estrutura):**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()
  const name = expense.value
  const cat = category.value
  const val = amount.value
  // valores soltos, sem ID, sem metadados
  addToList(name, cat, val)
}
```

**After (objeto centralizado com metadados):**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  addToList(newExpense)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Prototipo sem banco de dados | `new Date().getTime()` como ID |
| Aplicacao com banco de dados | Use UUID ou ID auto-incrementado do banco |
| Select com value e texto diferentes | Extraia ambos: value para logica, text para UI |
| Formulario com submit | Sempre `preventDefault()` antes de processar |
| Objeto sera exibido ao usuario | Inclua propriedades formatadas para exibicao (ex: `category_name`) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Math.random()` como ID | `new Date().getTime()` (prototipo) ou UUID (producao) |
| `category.value` para exibir ao usuario | `category.options[category.selectedIndex].text` |
| Valores soltos passados como argumentos | Objeto centralizado com todas as propriedades |
| Objeto sem `created_at` | Sempre incluir metadado de criacao |
| `select.text` (nao existe) | `select.options[select.selectedIndex].text` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `select.text` retorna `undefined` | `text` nao e propriedade direta do select | Use `select.options[select.selectedIndex].text` |
| IDs duplicados em lista | Dois itens criados no mesmo milissegundo | Use `crypto.randomUUID()` em producao ou `Date.now() + Math.random()` |
| `amount.value` retorna string, nao numero | Valores de inputs HTML sao sempre strings | Converta com `Number(amount.value)` ou `parseFloat(amount.value)` |
| Formulario recarrega a pagina ao submeter | Falta `preventDefault()` no handler | Adicione `event.preventDefault()` no inicio do handler de submit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre IDs, selects e metadados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes