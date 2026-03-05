# Code Examples: Estruturando Secoes de Destaque

## Exemplo completo da aula

### HTML (index.html)

```html
<!-- Fechando o header... -->

<main class="container grid">
  <section id="featured" class="grid grid-flow-col gap-16">
    <div>
      <img src="assets/images/image-1.png" alt="Noticia destaque principal" />
    </div>
    <div class="grid grid-cols-2 gap-16">
      <div>
        <img src="assets/images/image-2.png" alt="Noticia destaque 2" />
      </div>
      <div>
        <img src="assets/images/image-3.png" alt="Noticia destaque 3" />
      </div>
      <div>
        <img src="assets/images/image-4.png" alt="Noticia destaque 4" />
      </div>
      <div>
        <img src="assets/images/image-5.png" alt="Noticia destaque 5" />
      </div>
    </div>
  </section>
</main>
```

### CSS imports (no head do index.html ou no CSS principal)

```html
<link rel="stylesheet" href="global.css" />
<link rel="stylesheet" href="utility.css" />
<link rel="stylesheet" href="header.css" />
<link rel="stylesheet" href="sections.css" />
```

### global.css

```css
/* Reset e estilos base */
img {
  max-width: 100%;
}

main {
  margin-top: 40px;
}
```

### utility.css

```css
.container {
  width: 1120px;
  margin: 0 auto;
}

.grid {
  display: grid;
}

.grid-flow-col {
  grid-auto-flow: column;
}

.grid-cols-2 {
  grid-template-columns: 1fr 1fr;
}

.gap-16 {
  gap: 16px;
}
```

### sections.css

```css
#featured img {
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

## Variacoes

### Variacao 1: Grid 1 grande + 3 pequenas (1 em cima, 2 embaixo)

```html
<section id="featured" class="grid grid-flow-col gap-16">
  <div>
    <img src="hero.jpg" alt="Destaque" />
  </div>
  <div class="grid gap-16">
    <div>
      <img src="secondary-1.jpg" alt="" />
    </div>
    <div class="grid grid-cols-2 gap-16">
      <div><img src="secondary-2.jpg" alt="" /></div>
      <div><img src="secondary-3.jpg" alt="" /></div>
    </div>
  </div>
</section>
```

### Variacao 2: Grid uniforme 3 colunas

```css
.grid-cols-3 {
  grid-template-columns: 1fr 1fr 1fr;
}
```

```html
<section class="grid grid-cols-3 gap-16">
  <div><img src="img-1.jpg" alt="" /></div>
  <div><img src="img-2.jpg" alt="" /></div>
  <div><img src="img-3.jpg" alt="" /></div>
  <div><img src="img-4.jpg" alt="" /></div>
  <div><img src="img-5.jpg" alt="" /></div>
  <div><img src="img-6.jpg" alt="" /></div>
</section>
```

### Variacao 3: Imagem principal ocupando 2 linhas com grid areas

```css
#featured-v3 {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

#featured-v3 .hero {
  grid-row: 1 / 3;
}

#featured-v3 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
```

```html
<section id="featured-v3">
  <div class="hero"><img src="hero.jpg" alt="" /></div>
  <div><img src="img-2.jpg" alt="" /></div>
  <div><img src="img-3.jpg" alt="" /></div>
  <div><img src="img-4.jpg" alt="" /></div>
  <div><img src="img-5.jpg" alt="" /></div>
</section>
```

## Demonstracao progressiva do object-fit

### Sem nenhum ajuste (problema: imagem transborda)

```css
#featured img {
  /* nada — imagem renderiza no tamanho original */
}
```

### Apenas max-width (problema: espaco sobrando)

```css
img {
  max-width: 100%;
}
/* Imagem nao transborda mais, mas tem espacos vazios ao redor */
```

### height 100% (problema: imagem distorce)

```css
#featured img {
  height: 100%;
  /* Preenche o espaco, mas perde proporcao */
}
```

### height 100% + object-fit cover (solucao completa)

```css
#featured img {
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  /* Preenche o espaco, mantem proporcao, corta excedente */
}
```