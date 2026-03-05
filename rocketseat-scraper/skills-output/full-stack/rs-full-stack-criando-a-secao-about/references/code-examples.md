# Code Examples: Criando Secoes Responsivas

## Estrutura HTML completa da aula

```html
<!-- Section mobile-only com imagem de smartphones -->
<section class="smartphones-img">
  <img src="assets/smartphones.png" alt="" />
</section>

<!-- Section About -->
<section id="about" class="section-about">
  <div class="container py-extralarge">
    <div class="even-columns items-center">
      <div>
        <header>
          <strong>Conheça o app</strong>
          <h2>Headline do about</h2>
        </header>
        <p>Texto descritivo do about</p>
      </div>
      <div class="desktop-only">
        <img src="assets/smartphones.png" alt="" />
      </div>
    </div>
  </div>
</section>
```

## Reset global de imagens (global.css)

```css
img {
  max-width: 100%;
  display: inline-block;
}
```

**Nota:** O instrutor inicialmente usou `display: block` mas trocou para `inline-block` ao perceber que quebrava imagens inline em outros lugares.

## Smartphones section (sections.css)

```css
.smartphones-img {
  background: url(../assets/illustration.svg) top / cover no-repeat;
}

.smartphones-img img {
  margin-top: 5rem;
}

/* Esconder no desktop */
@media (min-width: 80em) {
  .smartphones-img {
    display: none;
  }
}
```

## Header pattern compartilhado (sections.css)

```css
header strong {
  display: block;
  font-size: var(--font-size-small);
  font-family: var(--font-family-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-color-primary);
}

header h2 {
  margin-top: 0.5rem;
}

header + p {
  margin-top: 0.5rem;
  color: var(--text-color-secondary);
}
```

## About section especifico (about.css)

```css
.section-about {
  background-color: var(--surface-color);
}

.section-about .even-columns {
  gap: 2rem;
}
```

## Importacoes no index.css

```css
@import url(hero.css);
@import url(sections.css);
@import url(about.css);
```

## Variacao: section com mesmo pattern para outra area

```html
<section id="features" class="section-features">
  <div class="container py-extralarge">
    <div class="even-columns items-center">
      <div>
        <header>
          <strong>Recursos</strong>
          <h2>O que voce pode fazer</h2>
        </header>
        <p>Descricao dos recursos</p>
      </div>
      <div class="desktop-only">
        <img src="assets/features.png" alt="" />
      </div>
    </div>
  </div>
</section>
```

O mesmo pattern de header (strong + h2) e even-columns se aplica, e os estilos de `sections.css` funcionam automaticamente.

## Navegacao com ancora

```html
<!-- No nav/header -->
<a href="#about">Sobre</a>
<a href="#features">Recursos</a>

<!-- Nas sections -->
<section id="about">...</section>
<section id="features">...</section>
```

Ao clicar no link, o browser faz scroll automatico ate a section com o id correspondente.