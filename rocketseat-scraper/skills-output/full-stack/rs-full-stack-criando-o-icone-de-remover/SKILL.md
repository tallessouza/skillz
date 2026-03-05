---
name: rs-full-stack-criando-o-icone-de-remover
description: "Applies DOM element creation patterns when building interactive list items with action icons in vanilla JavaScript. Use when user asks to 'add an icon', 'create a remove button', 'build a list item with actions', or 'add delete functionality to list'. Follows pattern: createElement, classList.add, setAttribute for src/alt, then appendChild. Make sure to use this skill whenever generating vanilla JS DOM manipulation for list items with icons. Not for React/Vue components, CSS styling, or SVG creation."
---

# Criando Icone de Remover em Itens de Lista

> Ao adicionar icones de acao em itens de lista, crie o elemento img com createElement, configure classe e atributos com classList.add e setAttribute, e adicione ao item com appendChild.

## Rules

1. **Use createElement para imagens de icone** — `document.createElement("img")` nao innerHTML, porque createElement e seguro contra XSS e permite manipulacao programatica
2. **Adicione classe via classList.add** — nao atribua className diretamente, porque classList.add nao sobrescreve classes existentes
3. **Use setAttribute para src e alt** — `setAttribute("src", path)` e `setAttribute("alt", descricao)`, porque alt e obrigatorio para acessibilidade
4. **Comente blocos logicos** — separe criacao do icone com comentario descritivo como `// Cria o icone de remover`, porque facilita leitura em funcoes longas de DOM
5. **Adicione o icone ao item APOS configurar todos os atributos** — appendChild so no final, porque evita repaint desnecessario durante configuracao

## How to write

### Icone de acao em item de lista

```javascript
// Cria o icone de remover
const removeIcon = document.createElement("img")
removeIcon.classList.add("remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "Remover")

item.append(removeIcon)
```

## Example

**Before (innerHTML inseguro):**
```javascript
item.innerHTML += '<img class="remove-icon" src="img/remove.svg" alt="Remover">'
```

**After (com este skill aplicado):**
```javascript
const removeIcon = document.createElement("img")
removeIcon.classList.add("remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "Remover")

item.append(removeIcon)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Icone estatico (mesmo para todos os itens) | Crie com createElement, nao precisa de src dinamico |
| Icone com acao futura (delete, edit) | Crie o elemento agora, adicione event listener depois |
| Multiplos atributos no elemento | Use setAttribute para cada um individualmente |
| Classe unica no elemento | classList.add com string simples |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `item.innerHTML += '<img ...>'` | `document.createElement("img")` + setAttribute |
| `removeIcon.className = "remove-icon"` | `removeIcon.classList.add("remove-icon")` |
| `removeIcon.src = "img/remove.svg"` | `removeIcon.setAttribute("src", "img/remove.svg")` |
| Esquecer o atributo alt | Sempre `setAttribute("alt", "descricao")` |
| appendChild antes de configurar | Configure todos os atributos, depois append |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre DOM manipulation segura e padrao createElement
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes