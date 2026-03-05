# Code Examples: Estilos para Seção Mais Lidas da Semana

## Estrutura HTML de referência

```html
<main>
  <section class="feature">...</section>

  <section class="weekly">
    <header>
      <h2>Mais lidas da semana</h2>
      <a href="#">
        Ver todas
        <span></span> <!-- ícone seta -->
      </a>
    </header>
    <div> <!-- grid container -->
      <figure>
        <img src="..." alt="...">
        <span class="content-tag">Tecnologia</span>
        <p>Título da notícia aqui</p>
      </figure>
      <figure>...</figure>
      <figure>...</figure>
      <figure>...</figure>
    </div>
  </section>

  <section class="trending">
    <header>
      <h2>Trending</h2>
      <a href="#">Ver todas <span></span></a>
    </header>
    ...
  </section>
</main>
```

## CSS completo da aula

### Global — padrão reutilizável para todas as sections

```css
section:has(> header) {
  border-top: 1px solid var(--stroke-color);
  padding-block: 12px 24px;
  font: var(--text-span);
}

section header a {
  justify-self: end;
  align-items: center;
  gap: 8px;
}

section header a span {
  background-image: url(../assets/icons/arrow-right.svg);
  width: 16px;
  height: 16px;
}

section header a:hover span {
  background-image: url(../assets/icons/arrow-right-hover.svg);
}
```

### Weekly — estilos específicos da seção

```css
.weekly img {
  height: 160px;
}

.weekly > div {
  grid-template-columns: repeat(4, 1fr);
}

.weekly figure {
  position: relative;
}

.weekly .content-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.weekly figure p {
  margin-top: 8px;
  font-weight: 800;
}
```

### Main — espaçamento entre seções

```css
main {
  gap: 80px;
}
```

## Variações do grid repeat

```css
/* 4 colunas iguais (usado na aula) */
grid-template-columns: repeat(4, 1fr);

/* 3 colunas iguais */
grid-template-columns: repeat(3, 1fr);

/* 4 colunas com largura mínima (auto-responsivo) */
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

/* 2 colunas fixas + 2 flexíveis */
grid-template-columns: 200px 200px 1fr 1fr;
```

## Variações de posicionamento de tag

```css
/* Top-left (usado na aula) */
.content-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

/* Top-right */
.content-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

/* Bottom-left com gradiente para legibilidade */
.content-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
}
figure::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
}
```

## Padrão hover com troca de ícone SVG

```css
/* Padrão base */
.link-icon span {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(../assets/icons/arrow-right.svg);
  background-size: contain;
  background-repeat: no-repeat;
}

/* Hover — troca o SVG */
.link-icon:hover span {
  background-image: url(../assets/icons/arrow-right-hover.svg);
}

/* Alternativa com filter (sem segundo SVG) */
.link-icon:hover span {
  filter: brightness(0.7);
}

/* Alternativa com mask-image (permite mudar cor via CSS) */
.link-icon span {
  width: 16px;
  height: 16px;
  background-color: var(--text-color);
  mask-image: url(../assets/icons/arrow-right.svg);
  mask-size: contain;
}
.link-icon:hover span {
  background-color: var(--accent-color);
}
```

## padding-block vs padding tradicional

```css
/* Moderno — eixo vertical apenas (usado na aula) */
padding-block: 12px 24px; /* top: 12px, bottom: 24px */

/* Equivalente tradicional */
padding-top: 12px;
padding-bottom: 24px;

/* Shorthand tradicional (afeta horizontal também se não cuidar) */
padding: 12px 0 24px 0;
```