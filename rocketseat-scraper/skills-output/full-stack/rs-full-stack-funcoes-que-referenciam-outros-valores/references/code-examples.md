# Code Examples: Funções CSS de Referência

## Exemplo 1: Custom properties com var()

### Definição e uso básico

```css
:root {
  --size: 50px;
}

.box {
  width: var(--size);
  height: var(--size);
  background: coral;
}
```

```html
<div class="box"></div>
```

Resultado: quadrado de 50x50px. Mudando `--size` para `80px`, ambas as dimensões atualizam.

### Variação: fallback em var()

```css
.box {
  /* Se --size nao existir, usa 100px */
  width: var(--size, 100px);
}
```

### Variação: override por contexto

```css
:root {
  --size: 50px;
}

.container {
  --size: 120px; /* Override local */
}

.box {
  width: var(--size);
  height: var(--size);
}
```

Dentro de `.container`, boxes terão 120px. Fora, 50px.

---

## Exemplo 2: Background com url()

### Uso demonstrado na aula

```css
.box {
  width: 200px;
  height: 200px;
  background: url("https://images.unsplash.com/photo-example") center no-repeat;
  background-size: contain;
}
```

### Variação: shorthand completo

```css
.hero {
  background: url("hero.jpg") center/cover no-repeat;
}
```

A sintaxe `center/cover` usa a barra para separar `background-position` (center) de `background-size` (cover).

### Variação: múltiplos backgrounds

```css
.overlay {
  background:
    url("overlay.png") center/cover no-repeat,
    url("base.jpg") center/cover no-repeat;
}
```

---

## Exemplo 3: attr() com data attributes

### Uso demonstrado na aula

```html
<div data-content="alô">conteúdo</div>
```

```css
div::before {
  content: attr(data-content);
}
```

Resultado: "alô conteúdo" (before insere antes do texto do elemento).

### Trocando para ::after

```css
div::after {
  content: attr(data-content);
}
```

Resultado: "conteúdo alô" (after insere depois).

---

## Exemplo 4: attr() com aria-label

### Uso demonstrado na aula

```html
<div aria-label="este texto será lido por leitores de tela">alô</div>
```

```css
div::after {
  content: attr(aria-label);
}
```

Resultado: "alô este texto será lido por leitores de tela"

### Variação: tooltip com attr()

```html
<button data-tooltip="Salvar documento">💾</button>
```

```css
button {
  position: relative;
}

button::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

button:hover::after {
  opacity: 1;
}
```

---

## Exemplo 5: Combinando as três funções

```html
<div class="card" data-badge="NEW" aria-label="Novo produto disponível">
  <h2>Produto</h2>
</div>
```

```css
:root {
  --card-width: 300px;
  --badge-bg: #ef4444;
}

.card {
  width: var(--card-width);
  height: 200px;
  background: url("product-bg.jpg") center/cover no-repeat;
  position: relative;
}

.card::before {
  content: attr(data-badge);
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--badge-bg);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}
```

Este exemplo usa `var()` para dimensões e cores, `url()` para imagem de fundo, e `attr()` para badge dinâmico via pseudo-elemento.