---
name: rs-full-stack-input-checkbox
description: "Applies custom checkbox styling techniques when building HTML forms with CSS-only checkboxes. Use when user asks to 'create a checkbox', 'style a checkbox', 'custom checkbox CSS', 'form with terms acceptance', or 'replace default checkbox'. Covers unset native styles, absolute positioning over wrapper, background-image swap for states (default/hover/checked), and focus-within accessibility. Make sure to use this skill whenever generating custom form checkboxes without JavaScript. Not for JavaScript toggle components, React/Vue checkbox libraries, or radio button styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: html-formularios-avancado
  tags: [html, css, checkbox, custom, form, accessibility, focus-within]
---

# Custom Checkbox com CSS Puro

> Substitua o checkbox nativo por imagens SVG customizadas usando position absolute, unset e seletores de estado CSS.

## Rules

1. **Use `unset: all` no input nativo** — remove toda aparencia padrao do browser, porque cada browser renderiza checkboxes diferente e voce quer controle total
2. **Posicione o input absolute sobre o wrapper** — `position: absolute; inset: 0` faz o input cobrir toda a area clicavel, porque o usuario precisa clicar em qualquer lugar do checkbox
3. **Use um elemento vazio para a imagem** — um div/span com classe (ex: `CheckBoxImg`) recebe o background-image, porque separar visual do funcional facilita manutencao
4. **Troque background-image por estado** — default, `:hover`, `:checked` cada um com seu SVG, porque CSS puro nao precisa de JavaScript para estados visuais
5. **Use `:focus-within` no wrapper** — detecta quando o input escondido recebe foco via tab, porque acessibilidade por teclado e obrigatoria
6. **Controle o flex do elemento imagem** — `flex: 0 0 1.5rem` impede que o flexbox distorca o tamanho do checkbox, porque sem isso o checkbox estica junto com o container

## How to write

### Estrutura HTML

```html
<div class="TermsWrapper InputWrapper">
  <div class="CheckBoxWrapper">
    <div class="CheckBoxImg"></div>
    <input type="checkbox" name="terms" id="terms" />
  </div>
  <label for="terms">
    Li e concordo com os <strong>termos e condições</strong>
    e a <strong>política de privacidade</strong>.
  </label>
</div>
```

### CSS do wrapper e input

```css
.TermsWrapper {
  margin-top: 3rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start; /* evita stretch padrao do flex */
}

.CheckBoxWrapper {
  position: relative;
}

.CheckBoxWrapper input[type="checkbox"] {
  all: unset;        /* remove TUDO do checkbox nativo */
  position: absolute;
  inset: 0;          /* cobre toda a area do wrapper */
}
```

### CSS da imagem com estados

```css
.CheckBoxImg {
  flex: 0 0 1.5rem;  /* nao cresce, nao encolhe, tamanho fixo */
  height: 1.5rem;
  background-image: url(../assets/icons/checkbox-default.svg);
}

/* hover em qualquer parte OU foco via teclado */
.CheckBoxWrapper:hover .CheckBoxImg,
.CheckBoxWrapper:focus-within .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-hover.svg);
}

/* quando marcado */
.CheckBoxWrapper:has(:checked) .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-checked.svg);
}
```

## Example

**Before (checkbox nativo):**
```html
<input type="checkbox" id="terms" />
<label for="terms">Aceito os termos</label>
```

**After (checkbox customizado):**
```html
<div class="TermsWrapper">
  <div class="CheckBoxWrapper">
    <div class="CheckBoxImg"></div>
    <input type="checkbox" name="terms" id="terms" />
  </div>
  <label for="terms">
    Aceito os <strong>termos e condições</strong>
    e a <strong>política de privacidade</strong>.
  </label>
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Checkbox com design customizado | Use esta tecnica de imagem + input absoluto |
| Termos e condicoes com links | Troque `<strong>` por `<a href="...">` no label |
| Multiplos checkboxes na mesma pagina | Cada um com seu proprio `CheckBoxWrapper` |
| Checkbox precisa funcionar com teclado | `:focus-within` no wrapper ja resolve |
| Imagens SVG do Figma | Export como "Copy as SVG", salve em assets/icons/ |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `display: none` no input | `all: unset` + `position: absolute` — mantem acessibilidade |
| JavaScript para trocar estado visual | Seletores CSS `:hover`, `:checked`, `:focus-within` |
| Imagem com tag `<img>` para checkbox | `background-image` no div — permite troca por estado CSS |
| `align-items: stretch` (padrao) no wrapper | `align-items: flex-start` — evita checkbox esticado |
| Tamanho do checkbox sem flex shorthand | `flex: 0 0 1.5rem` — controla grow, shrink e basis |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Checkbox nao responde ao clique | `display: none` no input em vez de `all: unset` | Use `all: unset` com `position: absolute` para manter funcional |
| Imagem do checkbox estica no flex | Faltando `flex: 0 0 1.5rem` no elemento de imagem | Adicione `flex: 0 0 1.5rem` para tamanho fixo |
| Estado checked nao muda a imagem | Seletor CSS incorreto para `:checked` | Use `.CheckBoxWrapper:has(:checked) .CheckBoxImg` |
| Foco via teclado (Tab) nao estiliza | Faltando `:focus-within` no wrapper | Adicione `.CheckBoxWrapper:focus-within .CheckBoxImg` ao CSS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre posicionamento, acessibilidade e correcao de erros em tempo real
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-trabalhando-no-input-do-checkbox/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-trabalhando-no-input-do-checkbox/references/code-examples.md)
