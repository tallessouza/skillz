---
name: rs-full-stack-criando-elementos
description: "Enforces correct DOM element creation and insertion patterns when writing vanilla JavaScript. Use when user asks to 'create elements', 'add to DOM', 'manipulate DOM', 'insert HTML elements', 'build list items dynamically', or 'generate elements with JavaScript'. Applies createElement, append/prepend, classList.add, and proper element nesting. Make sure to use this skill whenever generating code that dynamically creates and inserts DOM elements. Not for React/Vue components, innerHTML manipulation, or template literals for HTML."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, createElement, append, prepend, classList]
---

# Criando Elementos na DOM

> Crie elementos programaticamente com createElement, monte a estrutura aninhando filhos com append, e insira no DOM apenas quando o elemento estiver completo.

## Rules

1. **Use createElement para cada tag** — `document.createElement('li')` nao `innerHTML = '<li>'`, porque createElement retorna uma referencia manipulavel e segura contra XSS
2. **Monte a arvore de baixo pra cima** — crie filhos primeiro, adicione conteudo, depois insira no pai, porque evita reflows desnecessarios
3. **Use append para multiplos filhos** — `parent.append(child1, child2)` aceita multiplos argumentos, enquanto `appendChild` aceita apenas um
4. **Use prepend para inserir no inicio** — `parent.prepend(child)` adiciona antes do primeiro filho, `append` adiciona apos o ultimo
5. **Adicione classes com classList.add** — `element.classList.add('guest')` nao `element.className = 'guest'`, porque classList preserva classes existentes
6. **Defina texto com textContent** — `span.textContent = 'Diego'` nao `span.innerHTML = 'Diego'`, porque textContent e seguro e performatico

## How to write

### Criar elemento com estrutura aninhada

```javascript
// 1. Crie o container
const listItem = document.createElement('li')
listItem.classList.add('guest')

// 2. Crie os filhos com conteudo
const nameSpan = document.createElement('span')
nameSpan.textContent = 'Diego'

// 3. Monte a estrutura
listItem.append(nameSpan)

// 4. Insira no DOM
const list = document.querySelector('ul')
list.append(listItem) // adiciona no final
```

### append vs prepend vs appendChild

```javascript
// append — adiciona apos o ultimo filho (aceita multiplos)
parent.append(child1, child2, child3)

// prepend — adiciona antes do primeiro filho
parent.prepend(child) // child fica no topo

// appendChild — mais antigo, aceita apenas UM argumento
parent.appendChild(child)
```

## Example

**Before (innerHTML inseguro):**
```javascript
const list = document.querySelector('ul')
list.innerHTML += '<li class="guest"><span>Diego</span></li>'
```

**After (createElement seguro e manipulavel):**
```javascript
const list = document.querySelector('ul')

const newGuest = document.createElement('li')
newGuest.classList.add('guest')

const guestName = document.createElement('span')
guestName.textContent = 'Diego'

newGuest.append(guestName)
list.append(newGuest)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionar item no final da lista | `list.append(item)` |
| Adicionar item no inicio da lista | `list.prepend(item)` |
| Elemento precisa de classe visual | `element.classList.add('classe')` logo apos criar |
| Multiplos filhos no mesmo pai | `parent.append(filho1, filho2)` em uma chamada |
| Apenas um filho, compatibilidade antiga | `parent.appendChild(filho)` |
| Texto simples dentro do elemento | `element.textContent = 'texto'` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `el.innerHTML = '<span>Nome</span>'` | `span = createElement('span'); span.textContent = 'Nome'` |
| `el.className = 'guest'` | `el.classList.add('guest')` |
| `parent.appendChild(a); parent.appendChild(b)` | `parent.append(a, b)` |
| Inserir no DOM antes de montar a arvore | Montar arvore completa, depois inserir no DOM |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Elemento criado nao aparece na pagina | `append` ou `prepend` nao foi chamado no pai | Verifique que o elemento foi inserido no DOM com `parent.append(child)` |
| `append is not a function` | Tentando chamar append em elemento que nao existe | Verifique que `querySelector` retorna o elemento correto (nao null) |
| Ordem dos elementos errada | Usando `append` quando deveria usar `prepend` | Use `prepend` para inserir no inicio, `append` para o final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre append vs prepend vs appendChild e ordem de montagem
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes