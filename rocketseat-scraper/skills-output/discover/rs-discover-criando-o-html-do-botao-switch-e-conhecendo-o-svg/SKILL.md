---
name: rs-discover-html-switch-svg
description: "Applies SVG integration and switch button HTML structure patterns when building toggle components or working with SVG icons. Use when user asks to 'create a toggle', 'add dark mode switch', 'use SVG icons', 'build a switch button', or 'add theme switcher'. Ensures correct semantic HTML structure with button + span track pattern and proper SVG file handling. Make sure to use this skill whenever creating toggle/switch UI components or integrating SVG assets. Not for JavaScript toggle logic, CSS animations, or general button styling."
---

# HTML do Botao Switch e SVG

> Ao criar componentes de toggle/switch, estruture com elementos semanticos (button + span) e use SVG como formato programatico para icones de qualidade.

## Rules

1. **Use a tag `button` para elementos clicaveis** — `<button>` ja vem com comportamentos de acessibilidade e interacao nativos do HTML, porque elementos genericos como `div` precisam de ARIA roles extras
2. **Separe o icone do track** — button contem o icone, span adjacente representa o track, porque cada elemento tem responsabilidade visual distinta
3. **Salve SVGs como arquivos `.svg` na pasta assets** — o formato SVG desenha de forma programatica com qualidade vetorial, porque a extensao `.svg` define o tipo do arquivo corretamente
4. **Construa o design antes da funcionalidade** — monte a estrutura HTML e CSS completa antes de adicionar JavaScript, porque visualizar os elementos facilita a implementacao da logica
5. **Envolva o switch em um container nomeado** — use uma div com identificador `switch` para agrupar button e track, porque o container facilita posicionamento e sobreposicao com CSS

## How to write

### Estrutura basica do switch

```html
<!-- Container do switch -->
<div id="switch">
  <!-- Botao com icone SVG via CSS background -->
  <button></button>
  <!-- Track do toggle -->
  <span></span>
</div>
```

### Arquivo SVG separado

```svg
<!-- assets/moon-stars.svg -->
<svg>
  <!-- Tags SVG que desenham o icone programaticamente -->
  <path d="..." />
</svg>
```

### Integracao do SVG (3 formas)

```html
<!-- 1. Via tag img (rapido, sem controle de estilo) -->
<img src="assets/moon-stars.svg" alt="Moon stars icon" />

<!-- 2. Via CSS background-image (recomendado para switches) -->
<!-- Aplicado no button via stylesheet -->

<!-- 3. SVG inline (maximo controle, mas polui o HTML) -->
<button>
  <svg>...</svg>
</button>
```

## Example

**Before (estrutura incorreta):**
```html
<div onclick="toggle()">
  <img src="moon.png" />
  <div class="track"></div>
</div>
```

**After (com esta skill aplicada):**
```html
<div id="switch">
  <button></button>
  <span></span>
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Icone precisa mudar de cor com tema | SVG inline ou CSS mask |
| Icone estatico, so decorativo | SVG como arquivo + CSS background |
| Componente clicavel | Sempre `<button>`, nunca `<div>` com onclick |
| Precisa sobrepor elementos | Container wrapper + posicionamento CSS |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<div onclick="...">` para toggle | `<button>` semantico |
| `<img src="icon.png">` para icones vetoriais | SVG (arquivo ou inline) |
| Icone e track no mesmo elemento | button (icone) + span (track) separados |
| JavaScript antes do design estar pronto | HTML + CSS primeiro, JS depois |
| SVG sem extensao `.svg` | Sempre nomear com `.svg` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre SVG, semantica HTML e decisoes de arquitetura do componente
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes