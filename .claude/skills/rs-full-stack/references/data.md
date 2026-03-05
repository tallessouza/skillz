---
name: rs-full-stack-data
description: "Applies HTML data-* attribute conventions when writing HTML markup. Use when user asks to 'create an element', 'add custom data', 'store data in HTML', 'use data attributes', or any HTML generation involving custom metadata. Enforces naming rules: no spaces, no numbers, no special characters, use hyphens. Make sure to use this skill whenever generating HTML elements that need custom data storage for CSS or JavaScript access. Not for ARIA attributes, standard HTML attributes, or JavaScript dataset API implementation details."
---

# Atributos data-* no HTML

> Ao adicionar dados personalizados em elementos HTML, use atributos `data-*` com nomes significativos separados por hifens.

## Rules

1. **Sempre prefixe com `data-`** — `data-user-id` nao `user-id`, porque o prefixo `data-` e o padrao HTML5 para atributos customizados
2. **Nomes separados por hifen** — `data-product-name` nao `data-productname`, porque hifens garantem legibilidade e consistencia
3. **Nunca use espacos no nome** — `data-user id` cria um atributo `data-user` e um atributo invalido `id`, porque o espaco separa atributos em HTML
4. **Nunca use numeros no inicio do nome** — `data-1item` e invalido, use `data-item-1` se necessario, porque nomes devem comecar com letras
5. **Nunca use caracteres especiais** — apenas letras minusculas e hifens, porque caracteres especiais causam problemas no CSS e JavaScript
6. **Nomes significativos** — `data-user-role` nao `data-x`, porque o nome sera usado no CSS e JavaScript para acessar o valor

## How to write

### Atributos data-* basicos

```html
<!-- Armazenar ID do sistema -->
<div data-user-id="42">João Silva</div>

<!-- Multiplos atributos customizados (ilimitado) -->
<article data-category="tech" data-author="maria" data-published="2024-01-15">
  <h2>Titulo do artigo</h2>
</article>
```

### Acesso posterior (CSS e JavaScript)

```css
/* CSS pode selecionar pelo atributo */
[data-category="tech"] {
  border-left: 3px solid blue;
}
```

```javascript
// JavaScript acessa via dataset
const element = document.querySelector('[data-user-id="42"]');
const userId = element.dataset.userId; // "42"
```

## Example

**Before (erros comuns):**
```html
<div data-user id="42">Nome</div>       <!-- ERRO: espaco cria atributo separado -->
<div data-2col="true">Grid</div>         <!-- ERRO: numero no inicio -->
<div data-item@type="book">Livro</div>   <!-- ERRO: caractere especial -->
<div data-x="42">Nome</div>              <!-- ERRO: nome sem significado -->
```

**After (com esta skill aplicada):**
```html
<div data-user-id="42">Nome</div>
<div data-columns="2">Grid</div>
<div data-item-type="book">Livro</div>
<div data-user-id="42">Nome</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa guardar ID do sistema no elemento | `data-{entidade}-id="valor"` |
| Precisa de metadata para estilizacao CSS | `data-{propriedade}="valor"` com seletor `[data-x]` |
| Precisa passar info para JavaScript | `data-{nome-descritivo}="valor"`, acesse via `element.dataset` |
| Nome composto | Separe com hifen: `data-first-name` |
| Quantidade ilimitada de dados | Adicione quantos `data-*` precisar no mesmo elemento |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `data-user id="42"` | `data-user-id="42"` |
| `data-2column="true"` | `data-column-count="2"` |
| `data-item@name="x"` | `data-item-name="x"` |
| `data-x="42"` | `data-user-id="42"` |
| `userId="42"` (atributo inventado) | `data-user-id="42"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre data attributes, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-data/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-data/references/code-examples.md)
