---
name: rs-full-stack-secao-download
description: "Applies responsive download section layout patterns when building landing page sections with cards, absolute-positioned images, and app store buttons. Use when user asks to 'create a download section', 'build a CTA card with image', 'add app store buttons', or 'fix horizontal scroll overflow'. Enforces card-based layout with absolute positioning, overflow-x hidden fix, and media query breakpoints. Make sure to use this skill whenever building promotional sections with side-by-side content and decorative images. Not for navigation, hero sections, or form layouts."
---

# Seção Download — Layout Responsivo com Card e Imagem Absoluta

> Construa seções de download usando cards com colunas iguais, imagens em posição absoluta e botões de store, garantindo responsividade sem overflow horizontal.

## Rules

1. **Use card com even-columns para dividir conteúdo e imagem** — `even-columns` + `items-center` separa texto de um lado e imagem decorativa do outro, porque mantém proporção igual em telas grandes
2. **Posicione imagens decorativas com position absolute** — a imagem fica `position: absolute; bottom: 0` dentro de um card `position: relative`, porque ela não deve empurrar o conteúdo do card
3. **Compense a imagem absoluta com padding-bottom no card** — sem padding extra, a imagem absoluta não ocupa espaço no fluxo e o card fica colado, porque position absolute remove o elemento do fluxo normal
4. **Corrija overflow horizontal no HTML global** — `overflow-x: hidden` no `html` elimina scroll lateral causado por imagens que extrapolam o container, porque uma imagem com `right: -3.5rem` vaza para fora da viewport
5. **Botões de store em flex-wrap** — `.buttons { display: flex; flex-wrap: wrap; gap: 1rem }` garante que botões quebrem linha em telas pequenas, porque dois botões lado a lado não cabem em mobile
6. **Sempre coloque alt descritivo em imagens-link** — `alt="Baixar da Apple Store"` não `alt="botão"`, porque leitores de tela precisam saber a ação, não a aparência

## How to write

### Estrutura HTML do card de download

```html
<section id="download">
  <div class="container">
    <div class="card even-columns items-center">
      <div>
        <header>
          <strong>Download</strong>
          <h2>Bora Cantar</h2>
        </header>
        <p>Descrição do app...</p>
        <div class="buttons">
          <a href="#"><img src="./assets/button-apple-store.svg" alt="Baixar da Apple Store"></a>
          <a href="#"><img src="./assets/button-play-store.svg" alt="Baixar da Play Store"></a>
        </div>
      </div>
      <img src="./assets/person-singing.png" alt="">
    </div>
  </div>
</section>
```

### CSS mobile-first

```css
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

html {
  overflow-x: hidden;
}
```

### CSS desktop (media query)

```css
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

## Example

**Before (imagem no fluxo normal, sem card):**
```html
<section>
  <h2>Download</h2>
  <img src="person.png">
  <a href="#">App Store</a>
  <a href="#">Play Store</a>
</section>
```

**After (card estruturado com imagem absoluta):**
```html
<section id="download">
  <div class="container">
    <div class="card even-columns items-center">
      <div>
        <header>
          <strong>Download</strong>
          <h2>Bora Cantar</h2>
        </header>
        <p>Baixe agora e comece a cantar</p>
        <div class="buttons">
          <a href="#"><img src="./assets/button-apple-store.svg" alt="Baixar da Apple Store"></a>
          <a href="#"><img src="./assets/button-play-store.svg" alt="Baixar da Play Store"></a>
        </div>
      </div>
      <img src="./assets/person-singing.png" alt="">
    </div>
  </div>
</section>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Imagem decorativa que deve ficar no canto do card | `position: absolute` + `bottom: 0` + `right` negativo |
| Card precisa de espaço para imagem absoluta | Adicione `padding-bottom` proporcional à altura da imagem |
| Scroll horizontal apareceu após posicionar imagem | `overflow-x: hidden` no `html` |
| Botões de download em tela pequena | `flex-wrap: wrap` para quebrar linha |
| Imagem é link de ação (store button) | Alt descreve a ação: "Baixar da X Store" |
| Imagem é puramente decorativa (pessoa cantando) | Alt vazio `alt=""` é aceitável |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Imagem decorativa no fluxo normal empurrando conteúdo | `position: absolute` com padding compensatório no container |
| `overflow: hidden` (esconde vertical também) | `overflow-x: hidden` (apenas horizontal) |
| `alt="botão"` ou `alt="imagem"` em links de store | `alt="Baixar da Apple Store"` descrevendo a ação |
| Padding fixo sem media query para desktop | Padding mobile-first + padding maior no `@media (min-width: 80em)` |
| Largura fixa na div de texto sem breakpoint | `max-width` apenas dentro da media query desktop |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre position absolute, overflow e compensação de padding
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-secao-download/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-secao-download/references/code-examples.md)
