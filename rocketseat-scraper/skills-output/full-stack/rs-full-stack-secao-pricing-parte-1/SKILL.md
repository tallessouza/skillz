---
name: rs-full-stack-secao-pricing-parte-1
description: "Enforces semantic HTML structure and CSS patterns for pricing sections in landing pages. Use when user asks to 'create a pricing section', 'build pricing cards', 'make a plans and prices layout', or 'structure pricing HTML'. Applies custom HTML tags with hyphenated names, role attributes for accessibility, aria-label on buttons, radial gradients for separators, and CSS custom properties for responsive font sizes. Make sure to use this skill whenever building pricing or plan comparison sections. Not for JavaScript logic, payment integration, or backend pricing APIs."
---

# Secao Pricing — HTML Semantico e CSS Responsivo

> Construa secoes de pricing com HTML semantico, tags customizadas com hifen, acessibilidade via role e aria-label, e CSS responsivo com custom properties.

## Rules

1. **Use tags customizadas com hifen** — `<zin-pricing>` nao `<pricing>`, porque o HTML recomenda hifen em custom elements para evitar conflito com tags futuras do padrao
2. **Hierarquia de headings segue contexto, nao tamanho visual** — se o titulo da secao e h2, os cards usam h3, porque a leitura de prioridade importa mais que o tamanho renderizado
3. **Use role="list" ao remover bullet points** — ao estilizar ul sem marcadores, adicione `role="list"` para manter semantica para leitores de tela
4. **aria-label em botoes sem texto visivel** — botoes com conteudo visual (icone/CSS) precisam de `aria-label` descritivo, porque leitores de tela dependem disso
5. **Custom properties para tamanhos responsivos** — use `--font-size-price` que muda entre breakpoints, porque evita duplicacao de regras de fonte
6. **Radial gradient para separadores sutis** — use `radial-gradient()` com cor secundaria para cor de fundo, criando efeito de fade nas bordas

## How to write

### Estrutura HTML da secao pricing

```html
<section id="pricing">
  <div class="container px-l">
    <header>
      <strong>Planos e precos</strong>
      <h2>Texto principal da secao</h2>
    </header>

    <div class="cards even-columns items-center">
      <div class="card py-lg px-lg">
        <h3>Plano Basico</h3>
        <p>Descricao do plano</p>

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
    </div>
  </div>
</section>
```

### Custom element com preco variavel

```html
<zin-pricing>
  21,90<small>/mes por pessoa</small>
</zin-pricing>
```

### CSS responsivo com custom properties

```css
#pricing {
  --font-size-price: 2rem;
}

@media (min-width: 80rem) {
  #pricing {
    --font-size-price: 2.5rem;
  }

  #pricing header {
    max-width: 50rem;
    margin-inline: auto;
  }
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
```

### Custom element styling

```css
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
```

### Separador com radial gradient

```css
.separator {
  height: 1px;
  margin-block: 2rem;
  background: radial-gradient(var(--text-color-secondary), var(--surface-color) 70%);
}
```

## Example

**Before (sem semantica):**
```html
<div class="pricing">
  <div class="title">Planos</div>
  <div class="card">
    <div class="plan-name">Basico</div>
    <div class="price">Gratis</div>
    <button>Baixar</button>
    <hr>
    <div>Com anuncios</div>
  </div>
</div>
```

**After (com esta skill):**
```html
<section id="pricing">
  <div class="container px-l">
    <header>
      <strong>Planos e precos</strong>
      <h2>Escolha seu plano ideal</h2>
    </header>
    <div class="cards even-columns items-center">
      <div class="card py-lg px-lg">
        <h3>Plano Basico</h3>
        <p>Para quem quer comecar</p>
        <zin-pricing>Gratis</zin-pricing>
        <a href="#download" aria-label="Baixar agora" class="btn btn-md"></a>
        <div class="separator"></div>
        <ul role="list" class="grid gap-1">
          <li>Com anuncios</li>
          <li>Ate 5 musicas por dia</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento de preco sem tag semantica existente | Crie custom element com hifen: `<app-pricing>` |
| Lista visual sem bullet points | Adicione `role="list"` na `<ul>` |
| Botao sem texto visivel | Use `aria-label` com acao descritiva |
| Tamanho de fonte muda entre breakpoints | Use CSS custom property `--font-size-*` |
| Separador visual entre secoes do card | Use `div.separator` com `radial-gradient` |
| Header de secao precisa centralizar com limite | `text-align: center` + `max-width` + `margin-inline: auto` |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|------------------|
| `<pricing>` (sem hifen) | `<zin-pricing>` (com hifen) |
| `<h1>` dentro de card quando secao ja tem `<h2>` | `<h3>` respeitando hierarquia |
| `<ul>` sem `role="list"` quando remove marcadores | `<ul role="list">` |
| `arial-label` (typo comum) | `aria-label` |
| `font-size: 2.5rem` hardcoded em media query | `font-size: var(--font-size-price)` com custom property |
| `<hr>` para separador estilizado | `<div class="separator">` com gradient |
| `border: 1px solid` para separador com fade | `background: radial-gradient(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre custom elements, hierarquia de headings e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes