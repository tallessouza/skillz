# Code Examples: Customizando Inputs do Tipo Radio

## Estrutura HTML completa

```html
<!-- Seletor adjacente: label + radial-wrapper recebe margin-top -->
<label>Selecione o turno de estudo</label>

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

  <label class="radial-inner">
    <input type="radio" name="turno" value="noite">
    <div class="radial-image"></div>
    <span>Noite</span>
  </label>

  <label class="radial-inner">
    <input type="radio" name="turno" value="integral">
    <div class="radial-image"></div>
    <span>Integral</span>
  </label>
</div>
```

## CSS completo da aula

### input.css — Reset generico

```css
/* Reset de todos os inputs customizados */
.radial-inner input,
.radial-inner input:focus,
.radial-inner input:hover {
  all: unset;
}
```

### radial.css — Estilos especificos

```css
/* Seletor adjacente: label seguido de radial-wrapper */
label + .radial-wrapper {
  margin-top: 1rem;
}

/* Grid responsivo para o grupo de radios */
.radial-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
  gap: 1rem;
}

/* Container individual de cada radio */
.radial-inner {
  position: relative;
  border: 1px solid var(--stroke-default);
  border-radius: 0.5rem;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 2rem 0.5rem 0.5rem;
}

/* Input invisivel cobrindo toda a area */
.radial-inner input {
  position: absolute;
  inset: 0;
}

/* Bolinha do radio — estado default */
.radial-image {
  background-image: url("../assets/icons/radial-default.svg");
  width: 120px;
  height: 120px;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
}

/* === ESTADO: Hover e Focus === */

.radial-inner:hover,
.radial-inner:focus-within {
  border: 1px solid var(--stroke-highlight);
}

.radial-inner:hover .radial-image,
.radial-inner:focus-within .radial-image {
  background-image: url("../assets/icons/radial-hover.svg");
}

/* === ESTADO: Checked === */

.radial-inner:has(:checked) {
  border: 2px solid var(--stroke-highlight);
}

.radial-inner:has(:checked) .radial-image {
  background-image: url("../assets/icons/radial-checked.svg");
}
```

## Organizacao de imports no index.css

```css
/* index.css — ordem importa! */
@import "input.css";       /* resets genericos de input */
@import "droparea.css";    /* estilos de drag-and-drop */
@import "radial.css";      /* estilos custom de radio */
```

## Variacao: Radio group com tamanhos diferentes

```css
/* Para cards maiores (ex: planos de assinatura) */
.radial-wrapper--large {
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1.5rem;
}

/* Para opcoes compactas (ex: cores, tamanhos) */
.radial-wrapper--compact {
  grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
  gap: 0.5rem;
}
```

## Variacao: Sem imagem, apenas texto com indicador

```css
/* Quando nao ha imagem, apenas texto + bolinha indicadora */
.radial-inner--text-only {
  position: relative;
  border: 1px solid var(--stroke-default);
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.radial-inner--text-only input {
  all: unset;
  position: absolute;
  inset: 0;
}

.radial-inner--text-only .indicator {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 2px solid var(--stroke-default);
  flex-shrink: 0;
}

.radial-inner--text-only:has(:checked) .indicator {
  border-color: var(--stroke-highlight);
  background: var(--stroke-highlight);
  box-shadow: inset 0 0 0 3px white;
}
```

## Exportando SVGs do Figma

O instrutor usa "Copy/Paste SVG" direto do Figma:

1. Selecione o icone no Figma
2. Clique direito → Copy/Paste as SVG
3. Crie o arquivo `.svg` na pasta `assets/icons/`
4. Cole o conteudo SVG

Tres arquivos necessarios:
- `radial-default.svg` — estado normal
- `radial-hover.svg` — estado hover (cor highlight)
- `radial-checked.svg` — estado selecionado (preenchido)

## Navegacao por teclado (resultado final)

| Tecla | Acao |
|-------|------|
| Tab | Foca no grupo de radios |
| Seta direita/baixo | Move para proximo radio |
| Seta esquerda/cima | Move para radio anterior |
| Espaco | Seleciona o radio focado |
| Tab (novamente) | Sai do grupo de radios |