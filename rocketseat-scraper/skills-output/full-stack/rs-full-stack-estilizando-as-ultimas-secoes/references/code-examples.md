# Code Examples: Estilizando Seções com CSS Grid Areas

## Layout completo do Main com Grid Areas

```css
/* global.css */
main {
  display: grid;
  grid-template-areas:
    "featured featured"
    "weekly weekly"
    "ai aside";
  grid-template-columns: 2fr 1.4fr;
  row-gap: 80px;
  column-gap: 32px;
  margin-block: 40px;
}
```

## Atribuição de grid-area por seção

```css
/* sections.css */

/* Featured ocupa duas colunas (linha inteira) */
.section-featured {
  grid-area: featured;
}

/* Weekly também ocupa duas colunas */
.section-weekly {
  grid-area: weekly;
}

/* AI ocupa primeira coluna da terceira linha */
.section-ai {
  grid-area: ai;
}

/* Aside ocupa segunda coluna da terceira linha */
aside {
  grid-area: aside;
}
```

## Imagem da seção AI (176x176)

```css
/* sections.css */
.section-ai img {
  width: 176px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
```

## Imagem da seção More (72x72)

```css
.more img {
  width: 72px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
```

## Tipografia dos H3 com margin-block

```css
/* sections.css */
.section-ai h3 {
  margin-block: 8px 4px;
}

.more h3 {
  margin-top: 8px;
}

.more {
  margin-top: 32px;
}
```

## Variação: Grid Areas com 3 colunas

```css
/* Se precisasse de 3 colunas na última linha */
main {
  display: grid;
  grid-template-areas:
    "featured featured featured"
    "weekly weekly weekly"
    "ai aside sidebar";
  grid-template-columns: 2fr 1fr 1fr;
  row-gap: 80px;
  column-gap: 32px;
}
```

## Variação: Ajustando proporção das colunas

```css
/* Mais espaço para a coluna principal */
grid-template-columns: 2fr 1.3fr;  /* aside menor */
grid-template-columns: 2fr 1.4fr;  /* aside um pouco maior */
grid-template-columns: 2fr 1.5fr;  /* aside ainda maior */
grid-template-columns: 3fr 1fr;    /* aside bem menor */
```

## Variação: Imagem retangular forçada a quadrado

```css
/* Qualquer imagem vira quadrado sem distorção */
.card-image {
  width: 200px;
  aspect-ratio: 1 / 1;
  object-fit: cover;      /* preenche cortando excesso */
  border-radius: 8px;     /* opcional: cantos arredondados */
}

/* Variação: imagem 16:9 */
.banner-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* Variação: imagem 4:3 */
.thumbnail {
  width: 120px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

## Padrão completo: seção com imagem + texto

```css
.card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.card img {
  width: 72px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  flex-shrink: 0; /* impede que a imagem encolha */
}

.card h3 {
  margin-block: 8px 4px;
}
```