# Code Examples: Footer Layout

## Exemplo completo do HTML

```html
<footer>
  <div class="container">
    <section class="top">
      <img src="assets/logo.svg" alt="Logo" />
      <nav class="even-columns">
        <ul role="list" class="grid" style="gap: 1.5rem;">
          <li class="title">Produto</li>
          <li><a href="#features">Funcionalidades</a></li>
          <li><a href="#pricing">Planos e Preços</a></li>
          <li><a href="#download">Download</a></li>
        </ul>
        <ul role="list" class="grid" style="gap: 1.5rem;">
          <li class="title">Empresa</li>
          <li><a href="#about">Sobre nós</a></li>
          <li><a href="#">Trabalhe conosco</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <ul role="list" class="grid" style="gap: 1.5rem;">
          <li class="title">Legal</li>
          <li><a href="#">Termos de Uso</a></li>
          <li><a href="#">Política de Privacidade</a></li>
        </ul>
      </nav>
    </section>
    <section class="bottom">
      <div class="flex" style="gap: 1.5rem;">
        <a href="#" class="social" aria-label="TikTok">
          <!-- TikTok icon -->
        </a>
        <a href="#" class="social" aria-label="Instagram">
          <!-- Instagram icon -->
        </a>
        <a href="#" class="social" aria-label="Twitter">
          <!-- Twitter icon -->
        </a>
        <a href="#" class="social" aria-label="Discord">
          <!-- Discord icon -->
        </a>
      </div>
      <span class="copy">&copy; 2024 Company. Todos os direitos reservados.</span>
    </section>
  </div>
</footer>
```

## CSS completo do footer (footer.css)

```css
footer {
  color: var(--text-color-secondary);
  font-weight: var(--fw-md);
}

/* Container e top compartilham o mesmo gap */
footer .container,
footer .top {
  gap: 3rem;
}

/* Container com padding responsivo */
footer .container {
  padding-inline: 3rem;
  padding-bottom: 2rem;
}

/* Top section: grid com logo + nav */
footer .top {
  display: grid;
  grid-template-columns: auto 1fr;
}

/* Nav empurrada para a direita */
footer .top nav {
  margin-left: auto;
}

/* Largura fixa para cada coluna de links */
footer .top nav ul {
  width: 14rem;
}

/* Itens alinhados ao topo (sem distribuição vertical) */
footer .top ul {
  align-content: start;
}

/* Espaço entre colunas de navegação */
footer .even-columns {
  gap: 4rem;
}

/* Títulos de categoria */
footer .title {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-color-primary);
}

/* Bottom section */
footer .bottom {
  text-wrap: wrap;
  gap: 1.5rem;
}

/* Copyright texto menor */
footer .bottom span {
  font-size: 0.875rem;
}

/* Desktop: remove padding inline extra */
@media (width >= 80em) {
  footer .container {
    padding-inline: 0;
  }
}
```

## Adição global: smooth scroll

```css
/* Adicionar no CSS global/index */
html {
  scroll-behavior: smooth;
}
```

## Variação: Footer com 4 colunas

```html
<nav class="even-columns">
  <ul role="list" class="grid" style="gap: 1.5rem;">
    <li class="title">Produto</li>
    <li><a href="#features">Funcionalidades</a></li>
    <li><a href="#pricing">Planos</a></li>
    <li><a href="#download">Download</a></li>
    <li><a href="#integrations">Integrações</a></li>
  </ul>
  <ul role="list" class="grid" style="gap: 1.5rem;">
    <li class="title">Recursos</li>
    <li><a href="#">Documentação</a></li>
    <li><a href="#">API</a></li>
    <li><a href="#">Guias</a></li>
  </ul>
  <ul role="list" class="grid" style="gap: 1.5rem;">
    <li class="title">Empresa</li>
    <li><a href="#about">Sobre nós</a></li>
    <li><a href="#">Carreiras</a></li>
    <li><a href="#">Blog</a></li>
  </ul>
  <ul role="list" class="grid" style="gap: 1.5rem;">
    <li class="title">Legal</li>
    <li><a href="#">Termos</a></li>
    <li><a href="#">Privacidade</a></li>
    <li><a href="#">Cookies</a></li>
  </ul>
</nav>
```

## Variação: Bottom com mais elementos

```html
<section class="bottom">
  <div class="flex" style="gap: 1.5rem;">
    <a href="#" class="social" aria-label="TikTok"><!-- icon --></a>
    <a href="#" class="social" aria-label="Instagram"><!-- icon --></a>
    <a href="#" class="social" aria-label="Twitter"><!-- icon --></a>
    <a href="#" class="social" aria-label="Discord"><!-- icon --></a>
  </div>
  <div class="flex" style="gap: 1rem;">
    <a href="#">Termos</a>
    <a href="#">Privacidade</a>
    <a href="#">Sitemap</a>
  </div>
  <span class="copy">&copy; 2024 Company. Todos os direitos reservados.</span>
</section>
```

## Padrão: grid-template-columns auto 1fr

Este padrão aparece frequentemente em footers:

```css
/* Logo à esquerda, conteúdo à direita */
.top {
  display: grid;
  grid-template-columns: auto 1fr;
}

/* Equivalente com Flexbox (menos controle): */
.top-flex {
  display: flex;
  justify-content: space-between;
  align-items: start;
}
```

A vantagem do Grid: o `1fr` garante que o segundo elemento preenche todo o espaço restante, independente do conteúdo. Com Flexbox e `space-between`, o comportamento depende do conteúdo dos filhos.