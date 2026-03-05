---
name: rs-full-stack-criando-icone-categoria
description: "Applies dynamic DOM element creation with setAttribute for image icons mapped to data IDs. Use when user asks to 'create icons dynamically', 'add images based on selection', 'map category to icon', 'render list items with images', or 'build expense list UI'. Enforces pattern of matching data IDs to filenames for dynamic asset loading. Make sure to use this skill whenever generating code that maps data values to image assets or builds list items with icons. Not for CSS styling, SVG manipulation, or icon library integration."
---

# Criando Icones Dinamicos por Categoria

> Ao criar icones dinamicos, use o ID dos dados como nome do arquivo de imagem, eliminando mapeamentos manuais.

## Rules

1. **Use createElement para cada elemento visual** — `document.createElement("img")` nao innerHTML, porque createElement permite controle granular de atributos e e mais seguro contra XSS
2. **Use setAttribute para propriedades dinamicas** — `element.setAttribute("src", value)` para src e alt, porque permite interpolacao dinamica de valores
3. **Nomeie arquivos de assets pelo ID dos dados** — se o value do select e `food`, o icone deve ser `food.svg`, porque elimina a necessidade de switch/case ou objetos de mapeamento
4. **Sempre defina o atributo alt** — use o nome legivel da categoria (`category_name`) no alt, porque acessibilidade nao e opcional
5. **Construa elementos internos antes de adicionar ao DOM** — adicione filhos ao item, depois adicione o item a lista, porque minimiza reflows do browser
6. **Separe selecao de elementos do formulario e da lista** — organize seletores em blocos logicos com comentarios, porque facilita manutencao

## How to write

### Criar icone dinamico com setAttribute

```javascript
// Cria elemento de imagem e define src dinamicamente pelo ID da categoria
const expenseIcon = document.createElement("img")
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
expenseIcon.setAttribute("alt", newExpense.category_name)
```

### Montar item e adicionar na lista

```javascript
// Adiciona informacoes no item
expenseItem.append(expenseIcon)

// Adiciona o item completo na lista
expenseList.append(expenseItem)
```

### Selecionar a lista (separado dos elementos do formulario)

```javascript
// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
```

## Example

**Before (mapeamento manual — fragil):**
```javascript
function getIconPath(categoryId) {
  const icons = {
    food: "img/food.svg",
    accommodation: "img/accommodation.svg",
    transport: "img/transport.svg",
    services: "img/services.svg",
    others: "img/others.svg",
  }
  return icons[categoryId] || "img/default.svg"
}

const img = document.createElement("img")
img.src = getIconPath(expense.category_id)
```

**After (ID como nome do arquivo — sem mapeamento):**
```javascript
const expenseIcon = document.createElement("img")
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
expenseIcon.setAttribute("alt", newExpense.category_name)
expenseItem.append(expenseIcon)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Values do select tem nomes iguais aos arquivos de assets | Use o value diretamente no path da imagem |
| Precisa trocar extensao (png, webp) | Mude apenas o sufixo na template string |
| Multiplos elementos filhos no item | Adicione todos ao item com append, depois item na lista |
| Organizando seletores no topo do script | Agrupe por contexto: formulario vs lista |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `img.src = "img/" + id + ".svg"` (concatenacao) | `` img.setAttribute("src", `img/${id}.svg`) `` (template literal) |
| Objeto de mapeamento ID→path quando IDs ja sao nomes de arquivos | Template literal com ID direto no path |
| `innerHTML += '<img src="...">'` | `document.createElement("img")` + setAttribute |
| Adicionar item na lista antes de colocar os filhos | Montar item completo, depois append na lista |
| Esquecer o atributo alt | Sempre definir alt com `category_name` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a estrategia de naming de assets e fluxo de construcao do DOM
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-o-icone-da-categoria/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-o-icone-da-categoria/references/code-examples.md)
