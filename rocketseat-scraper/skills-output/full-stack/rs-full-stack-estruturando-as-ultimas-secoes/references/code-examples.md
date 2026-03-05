# Code Examples: Estruturando Secoes de Portal de Noticias

## Secao Artificial Intelligence completa

```html
<section>
  <div>
    <img src="assets/ads.png" alt="Anuncio" />
  </div>

  <section class="more">
    <header>
      <h3>Destaques da Inteligencia Artificial</h3>
      <a href="#">
        <span class="grid grid-flow-col">
          <strong>Ver tudo</strong>
          <span>→</span>
        </span>
      </a>
    </header>

    <div class="grid gap-32">
      <article class="grid grid-flow-col gap-16">
        <div>
          <img src="assets/images/image-10.png" alt="Empresas e IA" />
        </div>
        <div>
          <span class="content-tag">Inteligencia Artificial</span>
          <h3 class="text-extra-large">Empresas adotam IA para otimizar processos...</h3>
          <p class="text-small">Texto descritivo do artigo...</p>
        </div>
      </article>

      <article class="grid grid-flow-col gap-16">
        <div>
          <img src="assets/images/image-11.png" alt="Avancos em IA" />
        </div>
        <div>
          <span class="content-tag">Inteligencia Artificial</span>
          <h3 class="text-extra-large">Segundo titulo de artigo...</h3>
          <p class="text-small">Texto descritivo...</p>
        </div>
      </article>

      <article class="grid grid-flow-col gap-16">
        <div>
          <img src="assets/images/image-12.png" alt="Uso de IA" />
        </div>
        <div>
          <span class="content-tag">Inteligencia Artificial</span>
          <h3 class="text-extra-large">Terceiro titulo...</h3>
          <p class="text-small">Texto descritivo...</p>
        </div>
      </article>

      <article class="grid grid-flow-col gap-16">
        <div>
          <img src="assets/images/image-13.png" alt="IA no dia a dia" />
        </div>
        <div>
          <span class="content-tag">Inteligencia Artificial</span>
          <h3 class="text-extra-large">Quarto titulo...</h3>
          <p class="text-small">Texto descritivo...</p>
        </div>
      </article>
    </div>
  </section>
</section>
```

## Secao "More" com 5 articles e inversao

```html
<section>
  <header>
    <h3>View isso aqui</h3>
    <a href="#">
      <span class="grid grid-flow-col">
        <strong>Ver tudo</strong>
        <span>→</span>
      </span>
    </a>
  </header>

  <div class="grid gap-32">
    <!-- Article com texto ANTES da imagem (invertido) -->
    <article class="grid grid-flow-col gap-16">
      <div>
        <span class="content-tag">Realidade Virtual</span>
        <h3 class="text-extra-large">Titulo sobre realidade virtual...</h3>
      </div>
      <div>
        <img src="assets/images/image-14.png" alt="Realidade virtual" />
      </div>
    </article>

    <!-- Article padrao (imagem antes do texto) -->
    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-15.png" alt="Realidade virtual" />
      </div>
      <div>
        <span class="content-tag">Realidade Virtual</span>
        <h3 class="text-extra-large">Titulo completo...</h3>
      </div>
    </article>

    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-16.png" alt="Criptomoedas" />
      </div>
      <div>
        <span class="content-tag">Criptomoedas</span>
        <h3 class="text-extra-large">Titulo sobre criptomoedas...</h3>
      </div>
    </article>

    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-17.png" alt="Drones" />
      </div>
      <div>
        <span class="content-tag">Drones</span>
        <h3 class="text-extra-large">Cenario de drones...</h3>
      </div>
    </article>

    <article class="grid grid-flow-col gap-16">
      <div>
        <img src="assets/images/image-18.png" alt="Impressao 3D" />
      </div>
      <div>
        <span class="content-tag">Impressao 3D</span>
        <h3 class="text-extra-large">Titulo sobre impressao 3D...</h3>
      </div>
    </article>
  </div>
</section>
```

## Utility classes criadas nesta aula

```css
/* Arquivo de utilitarios */
.grid {
  display: grid;
}

.grid-flow-col {
  grid-auto-flow: column;
}

.gap-16 {
  gap: 16px;
}

.gap-32 {
  gap: 32px;
}

.text-extra-large {
  font-size: 1.5rem; /* ajustar conforme design */
}

.text-small {
  font-size: 0.875rem; /* ajustar conforme design */
}
```

## Variacoes: article sem paragrafo

Alguns articles nao tem `<p>` — apenas content-tag e titulo:

```html
<article class="grid grid-flow-col gap-16">
  <div>
    <span class="content-tag">Realidade Virtual</span>
    <h3 class="text-extra-large">Promovendo inovacao em realidade virtual...</h3>
  </div>
  <div>
    <img src="assets/images/image-14.png" alt="Realidade virtual" />
  </div>
</article>
```

## Variacoes: diferentes content-tags usadas

| Imagem | Content Tag |
|--------|-------------|
| image-10 a image-13 | Inteligencia Artificial |
| image-14, image-15 | Realidade Virtual |
| image-16 | Criptomoedas |
| image-17 | Drones |
| image-18 | Impressao 3D |