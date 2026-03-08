---
name: rs-full-stack-acessando-elementos-no-dom
description: "Enforces correct DOM element selection patterns when writing vanilla JavaScript. Use when user asks to 'select an element', 'get element by id', 'access DOM', 'query the DOM', 'get elements by class', or 'manipulate HTML elements'. Applies getElementById for unique elements, getElementsByClassName for groups, getElementsByTagName for tag-based selection, console.dir for inspecting properties. Make sure to use this skill whenever writing vanilla JS DOM access code. Not for React/Vue/Angular component code, jQuery, or CSS selectors with querySelector."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, dom, selectors, html-collection, getElementById]
---

# Acessando Elementos no DOM

> Sempre acesse elementos do DOM atraves do objeto `document`, usando o seletor mais especifico disponivel para o caso.

## Rules

1. **Use `document` diretamente** — `document` ja e uma variavel global disponivel no JavaScript, nunca crie uma variavel chamada `document` nem tente importa-la, porque o browser ja fornece
2. **`getElementById` para elemento unico** — retorna um unico elemento, use quando o elemento tem `id` definido, porque IDs sao unicos no documento
3. **`getElementsByClassName` para grupos** — retorna uma `HTMLCollection` (multiplos elementos), use quando varios elementos compartilham a mesma classe, porque classes sao reutilizaveis
4. **`getElementsByTagName` para selecao por tag** — retorna uma `HTMLCollection` baseada no nome da tag HTML, use quando precisa selecionar todos elementos de um tipo
5. **`console.dir()` para inspecionar propriedades** — use `console.dir(element)` ao inves de `console.log(element)` quando quiser ver todas as propriedades do objeto DOM, porque `console.log` mostra a referencia visual do elemento
6. **Indices comecam em 0** — ao acessar itens de uma `HTMLCollection`, o primeiro elemento esta no indice `0`, o segundo no `1`

## How to write

### Visualizar o documento

```javascript
console.log(document)
console.log(document.title)
```

### Selecionar por ID

```javascript
const guest = document.getElementById("guest-2")
console.log(guest)
console.dir(guest) // mostra todas as propriedades
```

### Selecionar por classe

```javascript
const guests = document.getElementsByClassName("guest")
console.log(guests) // HTMLCollection com N elementos
console.log(guests[0]) // primeiro elemento
console.log(guests.item(1)) // segundo elemento
```

### Selecionar por tag

```javascript
const listItems = document.getElementsByTagName("li")
console.log(listItems)
```

## Example

**Before (erros comuns):**

```javascript
// Tentando criar document manualmente
const document = getDocument() // ERRADO — document ja existe

// Esperando elemento unico de getElementsByClassName
const btn = document.getElementsByClassName("btn") // retorna HTMLCollection, nao elemento
btn.textContent = "Click" // ERRO — HTMLCollection nao tem textContent

// Usando console.log para inspecionar propriedades
console.log(element) // mostra referencia visual, nao propriedades
```

**After (com esta skill aplicada):**

```javascript
// document ja esta disponivel globalmente
console.log(document.title)

// getElementsByClassName retorna colecao — acesse pelo indice
const buttons = document.getElementsByClassName("btn")
buttons[0].textContent = "Click"

// console.dir para ver propriedades do objeto DOM
console.dir(element)
```

## Heuristics

| Situacao | Seletor |
|----------|---------|
| Elemento com ID unico | `getElementById("id")` |
| Varios elementos com mesma classe | `getElementsByClassName("class")` |
| Todos elementos de uma tag | `getElementsByTagName("tag")` |
| Quero ver propriedades do elemento | `console.dir(elemento)` |
| Quero ver referencia visual no console | `console.log(elemento)` |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `const document = ...` | Use `document` diretamente |
| `getElementsByClassName("x").textContent` | `getElementsByClassName("x")[0].textContent` |
| `console.log(el)` para ver propriedades | `console.dir(el)` para ver propriedades |
| `guests[1]` achando que e o primeiro | `guests[0]` e o primeiro elemento |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `getElementById` retorna `null` | Elemento nao existe no DOM ou script roda antes do HTML | Mova o `<script>` para antes de `</body>` ou use `defer` |
| `getElementsByClassName` retorna colecao vazia | Nome da classe esta errado ou elementos nao existem ainda | Verifique o nome exato da classe no HTML |
| `textContent` retorna `undefined` em HTMLCollection | Tentando acessar propriedade de colecao, nao de elemento | Acesse pelo indice: `colecao[0].textContent` |
| `console.log` mostra elemento visual, nao propriedades | Comportamento padrao do `console.log` para elementos DOM | Use `console.dir(elemento)` para ver propriedades |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o objeto document, referencias no DOM e HTMLCollection
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes