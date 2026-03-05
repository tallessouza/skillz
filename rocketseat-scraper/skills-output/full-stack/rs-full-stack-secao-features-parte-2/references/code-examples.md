# Code Examples: Seção Features parte 2

## Exemplo 1: Card base com contenção e imagem decorativa

```css
/* Card container */
.card {
  position: relative;
  overflow: hidden;
}

/* Imagem decorativa (desktop only) dentro do card */
.card .desktop-only {
  position: absolute;
  max-width: 15rem;
}

/* Limita largura da primeira div dentro do card */
.card > div:first-child {
  max-width: 16rem;
}
```

**Por que `max-width` em vez de `width`?** Permite que o conteúdo seja menor que o limite em telas pequenas, mas nunca maior.

## Exemplo 2: Posicionamento da imagem decorativa no card 2

```css
/* Imagem no canto inferior direito */
.card:nth-child(2) .desktop-only {
  bottom: 2rem;
  right: 2rem;
}
```

## Exemplo 3: Drop-shadow sutil em imagens

```css
/* Sombra quase imperceptível mas que dá profundidade */
.card img {
  filter: drop-shadow(1rem 1rem 4rem rgba(0, 0, 0, 0.34));
}
```

### Variações de intensidade:

```css
/* Sombra forte (debug/visualização) */
filter: drop-shadow(1rem 1rem 0 black);

/* Sombra média */
filter: drop-shadow(1rem 1rem 1rem rgba(0, 0, 0, 0.5));

/* Sombra sutil (produção) */
filter: drop-shadow(1rem 1rem 4rem rgba(0, 0, 0, 0.34));
```

## Exemplo 4: Grid positioning — Card 3

```css
.card:nth-child(3) {
  grid-column: 4 / 5;
}
```

Ocupa apenas a 4ª coluna do grid.

## Exemplo 5: Grid positioning — Card 4 (linha inferior, invertido)

```css
.card:nth-child(4) {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  margin-left: auto;
}

/* Imagem invertida para o lado esquerdo */
.card:nth-child(4) .desktop-only {
  left: 2rem;
}
```

O `margin-left: auto` empurra o conteúdo textual para a direita, enquanto a imagem decorativa vai para a esquerda com `left: 2rem`.

## Exemplo 6: Grid positioning — Card 5

```css
.card:nth-child(5) {
  grid-column: 3 / 5;
  grid-row: 2 / 3;
}
```

## Exemplo 7: Catálogo de CSS Filters

```css
/* Preto e branco */
filter: grayscale(1);

/* Embaçar */
filter: blur(5px);

/* Girar matiz (hue) */
filter: hue-rotate(230deg);

/* Inverter cores */
filter: invert(1);

/* Sépia (envelhecido) */
filter: sepia(1);

/* Combinando filtros */
filter: grayscale(0.5) drop-shadow(1rem 1rem 4rem rgba(0, 0, 0, 0.34));
```

## Exemplo 8: HTML structure dos cards (inferido)

```html
<section class="features">
  <!-- Card 1 -->
  <div class="card">
    <div>
      <i class="ph ph-microphone-stage"></i>
      <h3>Grave suas performances</h3>
      <p>Descrição da funcionalidade...</p>
    </div>
    <img class="desktop-only" src="screen-1.png" alt="Tela do app" />
  </div>

  <!-- Card 2 (com imagem posicionada à direita) -->
  <div class="card">
    <div>
      <i class="ph ph-users-three"></i>
      <h3>Título da feature</h3>
      <p>Descrição...</p>
    </div>
    <img class="desktop-only" src="screen-2.png" alt="Tela do app" />
  </div>

  <!-- Card 3 -->
  <div class="card">
    <div>
      <i class="ph ph-music-notes"></i>
      <h3>Título da feature</h3>
      <p>Descrição...</p>
    </div>
    <img class="desktop-only" src="screen-3.png" alt="Tela do app" />
  </div>
</section>
```

## Exemplo 9: Visualização do Grid Layout completo

```
Grid de 4 colunas x 2 rows:

     Col1    Col2    Col3    Col4
    ┌───────┬───────┬───────┬───────┐
R1  │ Card1         │ Card2 │ Card3 │
    │ (1/3)         │ (3/4) │ (4/5) │
    ├───────┬───────┼───────┴───────┤
R2  │ Card4         │ Card5         │
    │ (1/3, ml:auto)│ (3/5)         │
    └───────┴───────┴───────────────┘
```