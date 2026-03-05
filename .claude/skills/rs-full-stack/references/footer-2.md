---
name: rs-full-stack-footer-2
description: "Applies footer layout patterns using CSS Grid and Flexbox when building page footers or multi-column layouts. Use when user asks to 'create a footer', 'build a site footer', 'layout footer columns', 'responsive footer', or 'footer with navigation links'. Enforces grid-based top/bottom section split, even-columns nav pattern, and smooth scroll behavior. Make sure to use this skill whenever generating footer HTML/CSS structure. Not for header navigation, hero sections, or JavaScript functionality."
---

# Footer Layout com Grid e Flexbox

> Estruture footers dividindo em seções top/bottom, usando CSS Grid para layout de colunas e Flexbox para alinhamento interno.

## Rules

1. **Divida o footer em top e bottom** — seção top contém logo + navegação, seção bottom contém redes sociais + copyright, porque facilita responsividade independente
2. **Use Grid no container principal** — `grid-template-columns: auto 1fr` posiciona logo à esquerda e nav à direita, porque Grid distribui espaço sem hacks de margin
3. **Nav com even-columns** — classe reutilizável que empilha no mobile e alinha lado a lado no desktop, porque o padrão se repete em múltiplos contextos
4. **Títulos de seção como uppercase pequenos** — `font-size: 0.75rem`, `letter-spacing: 0.08em`, `text-transform: uppercase` com cor primária da marca, porque cria hierarquia visual clara
5. **align-content: start nas listas** — evita que Grid distribua espaço vertical igualmente entre itens, porque o comportamento padrão cria gaps estranhos
6. **scroll-behavior: smooth no HTML** — adicione globalmente para navegação suave entre âncoras, porque melhora UX sem JavaScript

## How to write

### Estrutura HTML do footer

```html
<footer>
  <div class="container">
    <section class="top">
      <img src="assets/logo.svg" alt="Logo" />
      <nav class="even-columns">
        <ul role="list" class="grid">
          <li class="title">Produto</li>
          <li><a href="#features">Funcionalidades</a></li>
          <li><a href="#pricing">Planos e Preços</a></li>
          <li><a href="#download">Download</a></li>
        </ul>
        <ul role="list" class="grid">
          <li class="title">Empresa</li>
          <li><a href="#about">Sobre nós</a></li>
          <li><a href="#">Trabalhe conosco</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <ul role="list" class="grid">
          <li class="title">Legal</li>
          <li><a href="#">Termos de Uso</a></li>
          <li><a href="#">Política de Privacidade</a></li>
        </ul>
      </nav>
    </section>
    <section class="bottom">
      <div class="flex" style="gap: 1.5rem;">
        <!-- social icons -->
      </div>
      <span class="copy">&copy; 2024 Company. All rights reserved.</span>
    </section>
  </div>
</footer>
```

### CSS do footer

```css
footer {
  color: var(--text-color-secondary);
  font-weight: var(--fw-md);
}

footer .container,
footer .top {
  gap: 3rem;
}

footer .container {
  padding-inline: 3rem;
  padding-bottom: 2rem;
}

footer .top {
  display: grid;
  grid-template-columns: auto 1fr;
}

footer .top nav {
  margin-left: auto;
}

footer .top nav ul {
  width: 14rem;
}

footer .top ul {
  align-content: start;
}

footer .even-columns {
  gap: 4rem;
}

footer .title {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-color-primary);
}

footer .bottom {
  text-wrap: wrap;
  gap: 1.5rem;
}

footer .bottom span {
  font-size: 0.875rem;
}

@media (width >= 80em) {
  footer .container {
    padding-inline: 0;
  }
}

/* Global — smooth scroll */
html {
  scroll-behavior: smooth;
}
```

## Example

**Before (footer sem estrutura):**
```html
<footer>
  <img src="logo.svg" />
  <div>
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </div>
  <p>Copyright</p>
</footer>
```

**After (com este skill aplicado):**
```html
<footer>
  <div class="container">
    <section class="top">
      <img src="assets/logo.svg" alt="Logo" />
      <nav class="even-columns">
        <ul role="list" class="grid" style="gap: 1.5rem;">
          <li class="title">Produto</li>
          <li><a href="#features">Funcionalidades</a></li>
        </ul>
        <!-- more columns -->
      </nav>
    </section>
    <section class="bottom">
      <div class="flex" style="gap: 1.5rem;">
        <a href="#" class="social" aria-label="Instagram"><!-- icon --></a>
      </div>
      <span class="copy">&copy; 2024 Company</span>
    </section>
  </div>
</footer>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Footer com logo + nav colunas | Grid `auto 1fr` no top, nav com margin-left auto |
| Listas de links no footer | `ul[role="list"]` com classe grid e gap 1.5rem |
| Títulos de categoria | Li com classe title, sem link, uppercase pequeno |
| Ícones sociais + copyright | Seção bottom com flex e text-wrap: wrap |
| Links internos da página | Use âncoras `#id` + scroll-behavior: smooth global |
| Mobile vs desktop padding | padding-inline maior no mobile, zero no desktop |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| Footer sem divisão semântica | Seções top e bottom separadas |
| `float: left` para colunas | CSS Grid com template-columns |
| Espaçamento com `<br>` ou margin em cada item | Gap no grid/flex container |
| Links de nav sem `role="list"` no ul | `<ul role="list">` para acessibilidade |
| Scroll instantâneo entre seções | `scroll-behavior: smooth` no html |
| Padding fixo em todos os breakpoints | Padding responsivo com media query |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre decisões de layout Grid vs Flex no footer
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-footer-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-footer-2/references/code-examples.md)
