# Code Examples: Seção Download

## Exemplo completo — HTML

```html
<section id="download">
  <div class="container">
    <div class="card even-columns items-center">
      <div>
        <header>
          <strong>Download</strong>
          <h2>Bora Cantar</h2>
        </header>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, amet.</p>
        <div class="buttons">
          <a href="#">
            <img src="./assets/button-apple-store.svg" alt="Baixar da Apple Store">
          </a>
          <a href="#">
            <img src="./assets/button-play-store.svg" alt="Baixar da Play Store">
          </a>
        </div>
      </div>
      <img src="./assets/person-singing.png" alt="">
    </div>
  </div>
</section>
```

## Exemplo completo — CSS (download.css)

```css
/* ===== Mobile-first ===== */

#download .card {
  position: relative;
  padding: 3rem 1.5rem 15rem;
}

#download .card > img {
  width: 14.5rem;
  position: absolute;
  bottom: 0;
  right: -3.5rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

/* ===== Desktop (80em = 1280px) ===== */

@media (min-width: 80em) {
  #download .card {
    padding: 8.75rem 5rem;
  }

  #download .card > div:first-child {
    max-width: 40rem;
  }

  #download .card > img {
    width: 29.125rem;
  }
}
```

## Fix global de overflow — No arquivo global.css

```css
html {
  overflow-x: hidden;
}
```

## Variação: Sem imagem decorativa (simplificado)

Se não houver imagem absoluta, o card fica mais simples sem necessidade de padding compensatório:

```html
<section id="download">
  <div class="container">
    <div class="card">
      <header>
        <strong>Download</strong>
        <h2>Bora Cantar</h2>
      </header>
      <p>Descrição...</p>
      <div class="buttons">
        <a href="#"><img src="./assets/button-apple-store.svg" alt="Baixar da Apple Store"></a>
        <a href="#"><img src="./assets/button-play-store.svg" alt="Baixar da Play Store"></a>
      </div>
    </div>
  </div>
</section>
```

```css
#download .card {
  padding: 3rem 1.5rem;
}
```

## Variação: Imagem à esquerda (invertido)

Para inverter a ordem (imagem à esquerda, texto à direita):

```html
<div class="card even-columns items-center">
  <img src="./assets/person-singing.png" alt="">
  <div>
    <header>...</header>
    <p>...</p>
    <div class="buttons">...</div>
  </div>
</div>
```

```css
#download .card > img {
  position: absolute;
  bottom: 0;
  left: -3.5rem;  /* left em vez de right */
}
```

## Seletores CSS explicados

```css
/* Primeiro nível de img dentro do card (a imagem decorativa, não os botões) */
#download .card > img { }

/* Primeira div filha do card (o container de texto) */
#download .card > div:first-child { }

/* Links dentro da div de botões */
.buttons a { }
```

O seletor `>` (filho direto) é essencial aqui para diferenciar a imagem decorativa (filha direta do card) das imagens dos botões de store (que estão dentro de `.buttons > a > img`).