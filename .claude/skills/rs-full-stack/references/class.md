---
name: rs-full-stack-class
description: "Applies correct HTML class attribute usage when writing markup. Use when user asks to 'create HTML', 'add a class', 'classify elements', 'style elements', or 'write a component template'. Enforces multiple class syntax with spaces, no special characters, and semantic class naming for CSS/JS selection. Make sure to use this skill whenever generating HTML with class attributes. Not for CSS selectors, JavaScript DOM manipulation, or CSS-in-JS class generation."
---

# Atributo Class no HTML

> Use o atributo `class` para classificar elementos semanticamente, permitindo selecao eficiente por CSS e JavaScript.

## Rules

1. **`class` e um atributo global** — pode ser usado em qualquer elemento HTML, porque serve para classificacao, nao para estrutura ou comportamento
2. **Separe multiplas classes com espaco** — `class="produto calcado"` cria duas classificacoes independentes, porque cada classe vira um seletor separado no CSS/JS
3. **Nunca use caracteres especiais** — sem acentos, cedilhas ou simbolos no nome da classe, porque quebra seletores CSS e queries JS
4. **Nomeie pela funcao/conteudo** — `class="produto"` nao `class="div1"`, porque a classe descreve O QUE o elemento representa
5. **O atributo nao altera renderizacao** — `class` sozinho nao muda nada visualmente, porque e apenas metadata para CSS e JS consumirem

## How to write

### Classe unica
```html
<div class="produto">Tenis</div>
<div class="produto">Camiseta</div>
```

### Multiplas classes (espaco separa)
```html
<div class="produto calcado">Tenis</div>
<div class="produto camisa">Camiseta</div>
```

## Example

**Before (errado):**
```html
<div class="produto-calçado">Tênis</div>
<div class="item1">Camiseta</div>
```

**After (com esta skill):**
```html
<div class="produto calcado">Tenis</div>
<div class="produto camisa">Camiseta</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elementos do mesmo tipo na pagina | Mesma classe base (`produto`) |
| Elemento com sub-categoria | Adicione segunda classe (`produto calcado`) |
| Precisa selecionar grupo no CSS/JS | Use a classe compartilhada |
| Precisa selecionar especifico | Use a classe mais especifica |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `class="produto-calçado"` | `class="produto calcado"` |
| `class="div1"` | `class="produto"` |
| `class="item_número-1!"` | `class="item destaque"` |
| Sem class em elementos repetidos | `class="nome-semantico"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre classificacao e selecao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-class/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-class/references/code-examples.md)
