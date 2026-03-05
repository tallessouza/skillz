# Code Examples: Secao Pricing — HTML Semantico e CSS Responsivo

## Exemplo 1: HTML completo da secao pricing

```html
<section id="pricing">
  <div class="container px-l">
    <header>
      <strong>Planos e precos</strong>
      <h2>Texto descritivo da secao de planos</h2>
    </header>

    <div class="cards even-columns items-center">
      <!-- Card Basico -->
      <div class="card py-lg px-lg">
        <h3>Plano Basico</h3>
        <p>Descricao curta do plano basico</p>

        <zin-pricing>
          Gratis
        </zin-pricing>

        <a href="#download" aria-label="Baixar agora" class="btn btn-md"></a>

        <div class="separator"></div>

        <ul role="list" class="grid gap-1">
          <li>Com anuncios</li>
          <li>Ate 5 musicas por dia</li>
        </ul>
      </div>

      <!-- Card Familia -->
      <div class="card py-lg px-lg">
        <h3>Familia</h3>
        <p>Descricao do plano familia</p>

        <zin-pricing>
          21,90<small>/mes por pessoa</small>
        </zin-pricing>

        <a href="#download" aria-label="Assinar agora" class="btn btn-md"></a>

        <div class="separator"></div>

        <ul role="list" class="grid gap-1">
          <li>Cante toda a musica da biblioteca</li>
          <li>Cante quantas musicas quiser</li>
          <li>Sem interrupcao de anuncio</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

## Exemplo 2: CSS completo do pricing

```css
/* === Secao Pricing === */

#pricing {
  --font-size-price: 2rem;
}

#pricing header {
  text-align: center;
}

#pricing .cards {
  margin-top: 2rem;
}

#pricing .card h3 {
  font-size: 1.25rem;
  margin-top: 0;
}

#pricing .card p {
  margin-top: 0.25rem;
}

/* Custom element de preco */
zin-pricing {
  display: block;
  padding-block: 1.5rem;
  font-weight: bold;
  font-size: var(--font-size-price);
  line-height: 1.2;
  font-family: var(--ff-sans);
}

zin-pricing small {
  font: var(--font-weight-base) 1rem/125% var(--ff-sans);
  color: var(--text-color-secondary);
}

/* Botao full width dentro do card */
#pricing .btn {
  width: 100%;
}

/* Separador com radial gradient */
#pricing .separator {
  height: 1px;
  margin-block: 2rem;
  background: radial-gradient(
    var(--text-color-secondary),
    var(--surface-color) 70%
  );
}

/* Desktop */
@media (min-width: 80rem) {
  #pricing {
    --font-size-price: 2.5rem;
  }

  #pricing header {
    max-width: 50rem;
    margin-inline: auto;
  }
}
```

## Exemplo 3: Variacao — custom element para outro contexto

Se o app se chama "MelodyApp", o custom element seguiria o padrao:

```html
<melody-pricing>
  14,90<small>/mes</small>
</melody-pricing>
```

```css
melody-pricing {
  display: block;
  padding-block: 1.5rem;
  font-weight: bold;
  font-size: var(--font-size-price);
  line-height: 1.2;
}
```

## Exemplo 4: ul com role="list" e icones customizados

```html
<ul role="list" class="grid gap-1">
  <li>
    <img src="./assets/check.svg" alt="" aria-hidden="true">
    Com anuncios
  </li>
  <li>
    <img src="./assets/check.svg" alt="" aria-hidden="true">
    Ate 5 musicas por dia
  </li>
</ul>
```

Nota: os icones de check substituem os bullet points. O `aria-hidden="true"` esconde a imagem decorativa de leitores de tela, e o `alt=""` indica que e decorativa.

## Exemplo 5: Correcao do aria-label (find and replace)

Erro comum encontrado na aula:
```html
<!-- ERRADO -->
<a href="#" arial-label="Baixar agora" class="btn btn-md"></a>

<!-- CORRETO -->
<a href="#" aria-label="Baixar agora" class="btn btn-md"></a>
```

No editor, use find-and-replace:
- Find: `arial-label`
- Replace: `aria-label`
- Replace All

## Exemplo 6: Separador com diferentes estilos de gradient

```css
/* Radial — fade nas extremidades (usado na aula) */
.separator {
  background: radial-gradient(var(--text-color-secondary), var(--surface-color) 70%);
}

/* Linear — fade so na direita */
.separator-linear {
  background: linear-gradient(to right, var(--text-color-secondary), var(--surface-color));
}

/* Linear — fade nos dois lados */
.separator-both {
  background: linear-gradient(
    to right,
    var(--surface-color),
    var(--text-color-secondary) 20%,
    var(--text-color-secondary) 80%,
    var(--surface-color)
  );
}
```