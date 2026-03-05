# Code Examples: Ajustando o Conteúdo do Card

## Estrutura HTML completa do card

```html
<!-- Antes: divs genéricas -->
<div class="card">
  <img src="./assets/image-01.jpg" alt="" />
  <div>
    <span>robótica</span>
    <h2>Título do artigo sobre robôs</h2>
  </div>
</div>

<!-- Depois: semântico com figure -->
<figure class="card">
  <img src="./assets/image-01.jpg" alt="Robôs modernos em ação" />
  <figcaption>
    <span class="content-tag">ROBÓTICA</span>
    <h2 class="text-2xl">Título do artigo sobre robôs</h2>
  </figcaption>
</figure>
```

## CSS do card com figcaption posicionado

```css
.card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card figcaption {
  position: absolute;
  bottom: 0;
  padding: 24px;
}

.card figcaption h2 {
  margin-top: 8px;
}
```

## Content tag completa

```css
.content-tag {
  display: inline-block;
  background-color: var(--brand-color-dark);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.2;
  font-family: var(--font-family);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-color-primary);
  box-shadow: 0px 4px 16px rgba(17, 18, 19, 0.4);
}
```

## Demonstração: inline vs block vs inline-block

```css
/* BLOCK: tag ocupa toda a largura */
.content-tag-block {
  display: block;
  background-color: var(--brand-color-dark);
  padding: 4px 8px;
  /* Problema: background se estende além do texto */
}

/* INLINE: padding vertical não é calculado no layout */
.content-tag-inline {
  display: inline;
  background-color: var(--brand-color-dark);
  padding: 4px 8px;
  /* Problema: padding top/bottom existe visualmente 
     mas não empurra elementos vizinhos */
}

/* INLINE-BLOCK: melhor dos dois mundos */
.content-tag {
  display: inline-block;
  background-color: var(--brand-color-dark);
  padding: 4px 8px;
  /* Correto: tamanho ajustado ao texto + padding calculado */
}
```

## Utility classes de tipografia

```css
/* Em utilities.css ou similar */
.text-2xl {
  font-size: var(--font-size-2xl);
}

.text-xl {
  font-size: var(--font-size-xl);
}

.text-lg {
  font-size: var(--font-size-lg);
}

.text-sm {
  font-size: var(--font-size-sm);
}
```

## Box-shadow: variações para aprendizado

```css
/* Apenas offset horizontal (10px para direita) */
.example-1 {
  box-shadow: 10px 0px 0px black;
}

/* Offset horizontal + vertical */
.example-2 {
  box-shadow: 10px 10px 0px black;
}

/* Com blur (espalhamento) */
.example-3 {
  box-shadow: 10px 10px 20px black;
}

/* Produção: sutil, com transparência */
.card .content-tag {
  box-shadow: 0px 4px 16px rgba(17, 18, 19, 0.4);
}
```

## Debugging: texto invisível por overflow

```css
/* O problema */
.card {
  position: relative;
  overflow: hidden; /* Isso corta o figcaption! */
}

/* Debug: remova temporariamente para ver o conteúdo */
.card {
  position: relative;
  /* overflow: hidden; — descomente para ver textos escondidos */
}

/* A solução: posicionar dentro da área visível */
.card figcaption {
  position: absolute;
  bottom: 0; /* Ancora na base, dentro do overflow */
  padding: 24px;
}
```