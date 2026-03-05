---
name: rs-full-stack-campo-envio-arquivos
description: "Applies custom file upload drop zone patterns when styling HTML form file inputs. Use when user asks to 'style file upload', 'create drop zone', 'customize input file', 'hide file input', or 'inline SVG for color change'. Covers hidden input overlay, dashed border drop zones, inline SVG with CSS stroke control, and :has(:focus) accessibility patterns. Make sure to use this skill whenever building file upload UI in HTML/CSS. Not for JavaScript drag-and-drop logic, FormData handling, or server-side upload processing."
---

# Campo de Envio de Arquivos — Drop Zone Customizada

> Esconda o input nativo com overlay transparente e construa a UI visual ao redor dele, mantendo acessibilidade via :has(:focus).

## Rules

1. **Input file fica invisivel sobre a drop zone** — `position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0`, porque o clique ainda funciona mas a UI nativa desaparece
2. **Drop zone container precisa ser `position: relative`** — porque o input absoluto precisa de referencia de posicionamento
3. **Use SVG inline no HTML ao inves de img** — porque permite controlar cores via CSS (`stroke`, `fill`), eliminando necessidade de trocar imagens em hover/focus
4. **Mude cor do SVG via propriedade `stroke` no CSS** — `svg path { stroke: var(--color) }`, porque SVGs de linha usam stroke, nao fill
5. **Use `:has(:focus)` para estados de foco no container** — `.drop-zone:has(input:focus)` aplica estilos quando o input invisivel recebe foco via Tab, porque garante acessibilidade de teclado
6. **Use `focus-within` para inputs compostos** — `input[type="date"]:focus-within` detecta foco em sub-elementos internos (como o picker do calendario), porque no Safari os elementos internos recebem foco individualmente

## How to write

### Estrutura HTML da drop zone

```html
<div class="drop-zone">
  <label for="birth-file">Certidão de Nascimento</label>
  <div class="drop-area">
    <svg><!-- SVG inline aqui --></svg>
    <p>Arraste ou clique para enviar</p>
    <input type="file" id="birth-file" name="birth-file" />
  </div>
</div>
```

### CSS da drop zone

```css
.drop-area {
  position: relative;
  border: 1px dashed var(--stroke);
  border-radius: 0.25rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1.75rem 1rem;
}

.drop-area input {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
```

### Hover e focus com :has()

```css
.drop-area:hover,
.drop-area:has(input:focus) {
  border-width: 2px;
  border-color: var(--stroke-highlight);
  background-color: var(--surface-secondary);
}

.drop-area:hover p,
.drop-area:has(input:focus) p {
  color: var(--text-tertiary);
}

.drop-area:hover svg path,
.drop-area:has(input:focus) svg path {
  stroke: var(--stroke-highlight);
}
```

### focus-within para inputs compostos

```css
input[type="date"]:focus-within {
  border-color: var(--stroke-highlight);
  background-color: var(--surface-secondary);
}
```

## Example

**Before (input file padrao):**
```html
<input type="file" name="document" />
```

**After (drop zone customizada):**
```html
<div class="drop-area">
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
  </svg>
  <p>Envie sua certidão</p>
  <input type="file" name="document" />
</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Icone precisa mudar cor em hover | Use SVG inline, controle via `stroke` ou `fill` no CSS |
| Input file precisa de UI custom | Overlay invisivel (`opacity: 0`) sobre container estilizado |
| Container precisa reagir ao foco do input filho | Use `:has(input:focus)` no container |
| Input com sub-elementos (date picker) | Use `:focus-within` para capturar foco interno |
| Border de 1px | Pode usar `px` direto — 1px e 1px, sem necessidade de rem |
| Textarea muito grande | Ajuste `rows` (ex: de 10 para 6) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<img src="icon.svg">` quando precisa mudar cor | SVG inline com `stroke`/`fill` controlado por CSS |
| `display: none` no input file | `opacity: 0` com position absolute (mantem clicavel) |
| JS para detectar foco no container | CSS `:has(:focus)` ou `:focus-within` |
| Imagem diferente para cada estado (hover/focus) | SVG inline + CSS variables por estado |
| Hover styles sem equivalente focus | Sempre duplicar hover com `:has(:focus)` para acessibilidade |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre SVG inline vs img, :has() vs :focus-within, e comportamento cross-browser
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações