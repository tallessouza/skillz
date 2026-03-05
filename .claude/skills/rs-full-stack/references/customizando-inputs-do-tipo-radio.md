---
name: rs-full-stack-customizando-inputs-radio
description: "Enforces custom radio input styling patterns using CSS grid, absolute positioning, and SVG backgrounds. Use when user asks to 'style radio buttons', 'customize radio inputs', 'create custom radio group', 'CSS radio design', or 'accessible radio buttons'. Applies rules: CSS file organization by component, grid auto-fit for responsive radio groups, absolute-positioned invisible inputs for full clickable area, SVG background swap for states. Make sure to use this skill whenever styling radio inputs or creating custom selection UI components. Not for checkbox styling, toggle switches, or general form validation."
---

# Customizando Inputs do Tipo Radio

> Inputs radio customizados usam um input invisivel com position absolute cobrindo toda a area clicavel, enquanto SVGs de background representam os estados visuais.

## Rules

1. **Organize CSS por componente** — crie arquivos separados (`input.css`, `radial.css`) e importe na ordem correta no `index.css`, porque a cascata CSS depende da ordem de importacao e estilos genericos de input devem vir antes dos especificos
2. **Use `all: unset` para resetar inputs nativos** — remova todos os estilos padrao do browser antes de customizar, porque estilos nativos de radio/checkbox interferem no design custom
3. **Posicione o input com `position: absolute` e `inset: 0`** — o input real fica invisivel mas cobre toda a area do container (`position: relative`), porque isso garante que cliques em qualquer lugar da caixa ativem o input
4. **Use `grid-template-columns: repeat(auto-fit, minmax())` para layout responsivo** — o grid se adapta automaticamente de 1 a N colunas baseado no espaco disponivel, porque elimina a necessidade de media queries para o layout do grupo de radios
5. **Troque SVGs via `background-image` nos estados** — default, hover e checked usam SVGs diferentes, porque isso permite controle total do visual sem depender de pseudo-elements do browser
6. **Estilize via `:has(:checked)` e `:hover`/`:focus-within`** — aplique estilos no container baseado no estado do input filho, porque o seletor `:has()` permite estilizar ancestrais com base no estado de descendentes

## How to write

### Grid responsivo para grupo de radios

```css
.radial-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
  gap: 1rem;
}
```

### Container do radio individual

```css
.radial-inner {
  position: relative;
  border: 1px solid var(--stroke-default);
  border-radius: 0.5rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 2rem 0.5rem 0.5rem;
}
```

### Input invisivel cobrindo toda area

```css
.radial-inner input {
  all: unset;
  position: absolute;
  inset: 0;
}
```

### Estados visuais com SVG

```css
.radial-image {
  background-image: url("../assets/icons/radial-default.svg");
  width: 120px;
  height: 120px;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

.radial-inner:hover .radial-image,
.radial-inner:focus-within .radial-image {
  background-image: url("../assets/icons/radial-hover.svg");
}

.radial-inner:has(:checked) .radial-image {
  background-image: url("../assets/icons/radial-checked.svg");
}
```

### Estados do container

```css
.radial-inner:hover,
.radial-inner:focus-within {
  border: 1px solid var(--stroke-highlight);
}

.radial-inner:has(:checked) {
  border: 2px solid var(--stroke-highlight);
}
```

## Example

**Before (radio nativo sem customizacao):**
```html
<div class="radio-group">
  <label><input type="radio" name="turno"> Manha</label>
  <label><input type="radio" name="turno"> Tarde</label>
</div>
```

**After (com esta skill aplicada):**
```html
<div class="radial-wrapper">
  <label class="radial-inner">
    <input type="radio" name="turno" value="manha">
    <div class="radial-image"></div>
    <span>Manhã</span>
  </label>
  <label class="radial-inner">
    <input type="radio" name="turno" value="tarde">
    <div class="radial-image"></div>
    <span>Tarde</span>
  </label>
</div>
```

```css
/* Reset + invisivel + cobertura total */
.radial-inner input { all: unset; position: absolute; inset: 0; }
.radial-inner { position: relative; /* ... */ }

/* SVG swap por estado */
.radial-image { background-image: url("radial-default.svg"); }
.radial-inner:hover .radial-image { background-image: url("radial-hover.svg"); }
.radial-inner:has(:checked) .radial-image { background-image: url("radial-checked.svg"); }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Grupo de radios com imagens/cards | Use grid auto-fit + input absolute |
| Minimo de largura por opcao conhecido | Use `minmax(Xrem, 1fr)` onde X = largura minima / 16 |
| Precisa de acessibilidade via teclado | Input absolute garante Tab + setas funcionando nativamente |
| Label seguido de radial-wrapper | Aplique `margin-top` via seletor adjacente `label + .radial-wrapper` |
| Estilos genericos de input conflitam | Importe `input.css` antes dos arquivos especificos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `display: none` no input radio | `all: unset; position: absolute; inset: 0` — esconde visualmente mas mantem acessibilidade |
| Media queries para colunas do grupo | `repeat(auto-fit, minmax(7.5rem, 1fr))` — responsivo automaticamente |
| Pseudo-elements `::before`/`::after` para bolinha | SVG via `background-image` — mais controle e facil de trocar |
| `opacity: 0` no input sem position | `position: absolute` + `inset: 0` — garante area clicavel total |
| Estilos de radio inline no CSS principal | Arquivo separado `radial.css` importado na ordem correta |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre organizacao CSS, auto-fit vs auto-fill, e por que position absolute funciona para acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e anotacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-customizando-inputs-do-tipo-radio/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-customizando-inputs-do-tipo-radio/references/code-examples.md)
