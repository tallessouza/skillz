---
name: rs-full-stack-montando-a-hero-section
description: "Applies hero section construction patterns when building landing page hero areas with HTML and CSS. Use when user asks to 'create a hero section', 'build a landing page', 'make a hero banner', 'add a call to action section', or 'responsive hero layout'. Enforces mobile-first approach, semantic HTML structure, CSS attribute selectors for images, and background image containment. Make sure to use this skill whenever constructing hero or above-the-fold sections. Not for navigation headers, footers, or non-hero page sections."
---

# Montando a Hero Section

> Construa hero sections com abordagem mobile-first, HTML semantico e CSS responsivo com background images contidas.

## Rules

1. **Use mobile-first como padrao** — escreva CSS para telas pequenas primeiro, depois use `@media` para desktop, porque o mobile e o baseline e desktop e a excecao
2. **Estruture com section > container** — `<section id="hero">` com um container interno e padding vertical, porque mantem o conteudo contido e semantico
3. **Use seletores de atributo para imagens decorativas** — `img[src*="keyword"]` seleciona imagens pelo nome do arquivo parcial, porque evita classes extras em elementos decorativos
4. **Imagens decorativas sem alt** — se a imagem nao transmite informacao ao leitor de tela, deixe `alt` vazio, porque acessibilidade nao exige alt em elementos puramente visuais
5. **Background images com contain** — use `background: url() no-repeat bottom center / contain` para imagens de fundo que precisam se adaptar, porque `contain` garante que a imagem inteira aparece
6. **Converta px para rem dividindo por 16** — `412px / 16 = 25.75rem`, porque rem escala com preferencias do usuario

## How to write

### Estrutura HTML do Hero

```html
<section id="hero">
  <div class="container py-xl">
    <img src="./assets/music-bars.svg" alt="" />
    <h1>Headline principal aqui</h1>
    <p>Subtitulo ou descricao curta</p>
    <div class="buttons flex items-center gap-1 justify-center">
      <a href="#download" class="btn btn-md">Baixar agora</a>
      <a href="#pricing" class="btn btn-md" aria-label="Ver planos">
        <!-- icone + texto -->
      </a>
    </div>
  </div>
</section>
```

### CSS Mobile-First

```css
/* Mobile (padrao) */
#hero {
  text-align: center;
}

#hero img[src*="music"] {
  width: 12.875rem; /* 206px / 16 */
}

#hero h1 {
  margin-top: 1rem;
}

#hero p {
  margin-top: 1rem;
  font-size: 2.5rem;
}

#hero .buttons {
  margin-top: 2rem;
  justify-content: center;
}

/* Desktop */
@media (min-width: 1024px) {
  #hero img[src*="music"] {
    width: 25.75rem; /* 412px / 16 */
  }

  #hero {
    background: url('../assets/bg-hero-desktop.svg') no-repeat bottom center / contain;
    padding-bottom: 15rem;
  }

  #hero h1 {
    margin-top: 1.5rem;
  }

  #hero .buttons {
    margin-top: 3rem;
  }
}
```

### Seletor de atributo CSS

```css
/* Seleciona qualquer img cujo src CONTENHA "music" */
img[src*="music"] {
  width: 12.875rem;
}
/* O asterisco em *="music" significa: contém essa sequencia em qualquer posicao */
```

## Example

**Before (sem mobile-first, classes desnecessarias):**
```css
.hero-image {
  width: 412px;
}
@media (max-width: 768px) {
  .hero-image {
    width: 206px;
  }
}
```

**After (mobile-first, seletor de atributo):**
```css
#hero img[src*="music"] {
  width: 12.875rem;
}
@media (min-width: 1024px) {
  #hero img[src*="music"] {
    width: 25.75rem;
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem decorativa sem significado semantico | `alt=""` vazio |
| Botao com apenas icone, sem texto visivel | Use `aria-label` com descricao |
| Background image que deve aparecer inteira | `background-size: contain` |
| Background image que deve cobrir tudo | `background-size: cover` |
| Precisa selecionar imagem sem adicionar classe | `img[src*="keyword"]` |
| Convertendo px para rem | Divida por 16 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `width: 412px` (px fixo) | `width: 25.75rem` (rem responsivo) |
| `@media (max-width: 768px)` como padrao | `@media (min-width: 1024px)` mobile-first |
| `<img class="hero-img">` para decorativa | `img[src*="keyword"]` seletor de atributo |
| `background-size: 100% 100%` (distorce) | `background-size: contain` (proporcional) |
| Escrever CSS desktop e depois sobrescrever mobile | Escrever CSS mobile e expandir para desktop |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre mobile-first, seletores de atributo e estrategias de background
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-montando-a-hero-section/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-montando-a-hero-section/references/code-examples.md)
