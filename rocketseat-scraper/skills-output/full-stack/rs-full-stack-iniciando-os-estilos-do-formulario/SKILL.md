---
name: rs-full-stack-iniciando-estilos-formulario
description: "Applies CSS form styling patterns when building HTML forms with fieldset, legend, inputs, selects, and textareas. Use when user asks to 'style a form', 'add CSS to form fields', 'create form layout', or 'fix form focus styles'. Covers appearance reset, grid layout for fieldsets, focus states with outline-offset hack for Safari, and label block display. Make sure to use this skill whenever styling form elements in CSS. Not for form validation, JavaScript form handling, or backend form processing."
---

# Estilizacao de Formularios com CSS

> Estilize formularios com reset de aparencia, layout grid em fieldsets, e estados de foco cross-browser.

## Rules

1. **Use grid no fieldset para espacamento** — `display: grid` com `gap` distribui campos uniformemente, porque fieldset agrupa campos semanticamente e grid da controle de espacamento sem margins individuais
2. **Remova borda padrao do fieldset** — `border: none` porque o fieldset vem com borda nativa que conflita com designs customizados
3. **Aplique appearance: none em campos de formulario** — remove estilos nativos do navegador (como a seta do select), porque garante consistencia visual cross-browser
4. **Labels precisam de display: block** — elementos inline nao aceitam `margin-bottom`, entao block e necessario para espacamento vertical
5. **Use outline-offset para compatibilidade Safari** — `outline-offset: 1px` resolve o bug onde Safari nao exibe o outline de foco, porque Safari renderiza outlines de forma diferente
6. **Borda de 1px pode ficar em pixels** — nao precisa converter para rem, porque 1px e 1px em qualquer resolucao

## How to write

### Layout do fieldset

```css
fieldset {
  border: none;
  display: grid;
  gap: 1.5rem;
}
```

### Reset de campos (input, select, textarea)

```css
input,
textarea,
select {
  appearance: none;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--stroke-default);
  padding: 0.75rem 1rem;
  font: var(--text);
}
```

### Labels com espacamento

```css
label {
  font: var(--text-small);
  color: var(--text-secondary);
  display: block;
  margin-bottom: 0.25rem;
}
```

### Estados de foco cross-browser

```css
input:focus,
select:focus,
textarea:focus {
  outline: 0.125rem solid var(--surface-secondary);
  border: 0.125rem solid var(--stroke-highlight);
  outline-offset: 1px; /* hack para Safari exibir o outline */
}
```

## Example

**Before (campos sem estilizacao):**
```css
/* Fieldset com borda nativa, campos colados, sem foco customizado */
fieldset { }
input { }
```

**After (com esta skill aplicada):**
```css
form {
  margin-top: 3rem;
}

fieldset {
  border: none;
  display: grid;
  gap: 1.5rem;
}

legend {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  font-family: var(--font-default);
  margin-bottom: 1.5rem;
}

input, textarea, select {
  appearance: none;
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--stroke-default);
  padding: 0.75rem 1rem;
  font: var(--text);
}

input:focus, select:focus, textarea:focus {
  outline: 0.125rem solid var(--surface-secondary);
  border: 0.125rem solid var(--stroke-highlight);
  outline-offset: 1px;
}

label {
  font: var(--text-small);
  color: var(--text-secondary);
  display: block;
  margin-bottom: 0.25rem;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Fieldset com multiplos campos | `display: grid` + `gap` |
| Select precisa de seta customizada | `appearance: none` + seta via CSS/SVG |
| Label nao aceita margin | Troque para `display: block` |
| Outline de foco nao aparece no Safari | Adicione `outline-offset: 1px` |
| Borda fina (1px) | Mantenha em pixels, nao converta para rem |
| Organizando CSS de formulario | Separe em `forms.css` + pasta `fields/` com `index.css` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Fieldset sem `border: none` | `fieldset { border: none; }` |
| Margins individuais em cada campo | `fieldset { display: grid; gap: 1.5rem; }` |
| Label inline com margin-bottom | `label { display: block; margin-bottom: 0.25rem; }` |
| Focus sem outline-offset | Inclua `outline-offset: 1px` para Safari |
| `appearance: auto` em campos customizados | `appearance: none` para reset consistente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cross-browser, organizacao de arquivos CSS e decisoes de unidades
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes