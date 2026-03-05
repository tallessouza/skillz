# Code Examples: Custom Checkbox com CSS Puro

## Exemplo completo do HTML

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

## Exemplo completo do CSS (checkbox.css)

```css
/* Container do checkbox + label */
.TermsWrapper {
  margin-top: 3rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

/* Strong dentro do label (em site real, seria <a>) */
.TermsWrapper strong {
  font-weight: 500;
  color: var(--text-highlight);
}

/* Wrapper posicional do checkbox */
.CheckBoxWrapper {
  position: relative;
}

/* Input nativo resetado e cobrindo toda a area */
.CheckBoxWrapper input[type="checkbox"] {
  all: unset;
  position: absolute;
  inset: 0;
}

/* Imagem visual do checkbox */
.CheckBoxImg {
  flex: 0 0 1.5rem;
  height: 1.5rem;
  background-image: url(../assets/icons/checkbox-default.svg);
}

/* Estado hover (mouse) e focus-within (teclado) */
.CheckBoxWrapper:hover .CheckBoxImg,
.CheckBoxWrapper:focus-within .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-hover.svg);
}

/* Estado checked */
.CheckBoxWrapper:has(:checked) .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-checked.svg);
}
```

## Variacao: com link ao inves de strong

```html
<label for="terms">
  Li e concordo com os
  <a href="/termos-e-condicoes">termos e condições</a>
  e a
  <a href="/politica-de-privacidade">política de privacidade</a>.
</label>
```

```css
.TermsWrapper a {
  color: var(--text-highlight);
  text-decoration: underline;
}

.TermsWrapper a:hover {
  opacity: 0.8;
}
```

## Variacao: multiplos checkboxes

```html
<div class="TermsWrapper InputWrapper">
  <div class="CheckBoxWrapper">
    <div class="CheckBoxImg"></div>
    <input type="checkbox" name="newsletter" id="newsletter" />
  </div>
  <label for="newsletter">Desejo receber novidades por email</label>
</div>

<div class="TermsWrapper InputWrapper">
  <div class="CheckBoxWrapper">
    <div class="CheckBoxImg"></div>
    <input type="checkbox" name="terms" id="terms" />
  </div>
  <label for="terms">
    Li e concordo com os <strong>termos e condições</strong>.
  </label>
</div>
```

## Variacao: usando :has() para compatibilidade moderna

```css
/* Abordagem moderna com :has() */
.CheckBoxWrapper:has(:checked) .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-checked.svg);
}

/* Fallback com seletor irmao (se :has() nao for suportado) */
.CheckBoxWrapper input[type="checkbox"]:checked ~ .CheckBoxImg {
  background-image: url(../assets/icons/checkbox-checked.svg);
}
```

Nota: para o fallback funcionar, o input precisa vir ANTES do `CheckBoxImg` no HTML:

```html
<div class="CheckBoxWrapper">
  <input type="checkbox" name="terms" id="terms" />
  <div class="CheckBoxImg"></div>  <!-- depois do input para ~ funcionar -->
</div>
```

## Estrutura de arquivos dos SVGs

```
assets/
└── icons/
    ├── checkbox-default.svg   # Estado padrao (quadrado vazio)
    ├── checkbox-hover.svg     # Estado hover (quadrado com destaque)
    └── checkbox-checked.svg   # Estado marcado (quadrado com check)
```

## Import no HTML

```html
<link rel="stylesheet" href="checkbox.css" />
```