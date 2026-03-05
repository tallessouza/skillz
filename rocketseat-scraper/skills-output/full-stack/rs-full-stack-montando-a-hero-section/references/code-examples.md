# Code Examples: Montando a Hero Section

## Estrutura HTML Completa

```html
<section id="hero">
  <div class="container py-xl">
    <img src="./assets/music-bars.svg" alt="" />

    <h1>Cante que encanta, se os mails espanta</h1>

    <p>Cantar nunca foi tão fácil</p>

    <div class="buttons flex items-center gap-1">
      <a href="#download" class="btn btn-md">Baixar agora</a>
      <a href="#pricing" class="btn btn-md" aria-label="Ver planos">
        Ver planos
      </a>
    </div>
  </div>
</section>
```

## CSS Completo (hero.css)

```css
/* ===========================
   MOBILE FIRST (default)
   =========================== */

#hero {
  text-align: center;
}

/* Seletor de atributo: seleciona img cujo src contem "music" */
#hero img[src*="music"] {
  width: 12.875rem; /* 206px / 16 */
}

#hero h1 {
  margin-top: 1rem;
}

#hero p {
  margin-top: 1rem;
  font-weight: var(--font-weight-medium);
  font-size: 2.5rem; /* 40px */
  line-height: 1.4;
  color: var(--text-color-secondary);
}

#hero .buttons {
  margin-top: 2rem;
  justify-content: center;
}

/* ===========================
   DESKTOP (min-width breakpoint)
   =========================== */

@media (min-width: 1024px) {
  #hero img[src*="music"] {
    width: 25.75rem; /* 412px / 16 */
  }

  #hero h1 {
    margin-top: 1.5rem;
  }

  #hero p {
    margin-top: 1.5rem;
  }

  #hero .buttons {
    margin-top: 3rem;
  }

  #hero {
    background: url('../assets/bg-hero-desktop.svg') no-repeat bottom center / contain;
    padding-bottom: 15rem;
  }
}
```

## Import no CSS Principal

```css
/* styles.css ou main.css */
@import url('./header.css');
@import url('./hero.css');
/* ... demais secoes */
```

A ordem de import importa: hero vem depois do header porque aparece depois no DOM.

## Variacoes do Seletor de Atributo

```css
/* Contem "music" em qualquer posicao */
img[src*="music"] { width: 12.875rem; }

/* Comeca com "./assets/" */
img[src^="./assets/"] { max-width: 100%; }

/* Termina com ".svg" */
img[src$=".svg"] { height: auto; }

/* Valor exato */
img[src="./assets/music-bars.svg"] { width: 12.875rem; }
```

## Variacao: Hero com Flexbox vertical

```css
#hero .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Remove margin-top individuais quando usando gap */
#hero h1,
#hero p,
#hero .buttons {
  margin-top: 0;
}
```

## Variacao: Background com cover vs contain

```css
/* contain: imagem inteira visivel, pode ter espaco vazio */
#hero {
  background: url('../assets/bg-hero.svg') no-repeat bottom center / contain;
}

/* cover: preenche todo o espaco, pode cortar a imagem */
#hero {
  background: url('../assets/bg-hero.svg') no-repeat bottom center / cover;
}
```

## Exportacao de Assets do Figma

Processo demonstrado na aula:
1. Selecionar elemento no Figma
2. Botao direito → Copy as → Copy as SVG
3. Salvar como arquivo `.svg` na pasta `assets/`
4. Nomenclatura: `bg-hero-desktop.svg`, `music-bars.svg`