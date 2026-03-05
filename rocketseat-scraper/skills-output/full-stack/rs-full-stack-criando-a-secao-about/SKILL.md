---
name: rs-full-stack-criando-a-secao-about
description: "Enforces patterns for building responsive HTML/CSS sections with mobile-first approach. Use when user asks to 'create a section', 'build an about page', 'add responsive layout', 'structure HTML sections', or 'hide elements on mobile/desktop'. Applies rules: semantic heading hierarchy, mobile-first visibility classes, background images with cover, CSS resets for images, even-columns layout. Make sure to use this skill whenever building landing page sections or responsive layouts. Not for JavaScript logic, backend code, or React components."
---

# Criando Secoes Responsivas (About Section)

> Estruture secoes HTML com hierarquia semantica correta e controle de visibilidade mobile/desktop separando conteudo por breakpoint.

## Rules

1. **Separe conteudo mobile-only em sections proprias** — crie uma section dedicada para conteudo que so aparece no mobile (ex: imagem de fundo com smartphones), porque facilita o controle via `display: none` no desktop
2. **Use heading hierarchy correta** — h1 unico por pagina, h2 para secoes principais, h3 para subsecoes, porque leitores de tela e SEO dependem dessa hierarquia
3. **Reset global de imagens** — aplique `max-width: 100%` e `display: inline-block` globalmente, porque evita overflow e problemas de layout em todas as secoes
4. **Background images com cover** — use `background: url() top / cover no-repeat` para ilustracoes de fundo, porque garante preenchimento completo sem distorcao
5. **Visibility classes semanticas** — use `.desktop-only` com `display: none` no mobile e `.mobile-only` escondido no desktop, porque evita duplicacao de logica em media queries
6. **Agrupe estilos de section headers em arquivo compartilhado** — crie `sections.css` para estilos comuns (strong, h2, p dentro de headers), porque evita repeticao entre secoes

## How to write

### Section com imagem mobile-only

```html
<section class="smartphones-img">
  <img src="assets/smartphones.png" alt="" />
</section>
```

```css
.smartphones-img {
  background: url(../assets/illustration.svg) top / cover no-repeat;
}

.smartphones-img img {
  margin-top: 5rem;
}

@media (min-width: 80em) {
  .smartphones-img {
    display: none;
  }
}
```

### Section About com even-columns

```html
<section id="about" class="section-about">
  <div class="container py-extralarge">
    <div class="even-columns items-center">
      <div>
        <header>
          <strong>Conheça o app</strong>
          <h2>Headline do about</h2>
        </header>
        <p>Descricao do about</p>
      </div>
      <div class="desktop-only">
        <img src="assets/smartphones.png" alt="" />
      </div>
    </div>
  </div>
</section>
```

### Header pattern reutilizavel (sections.css)

```css
header strong {
  display: block;
  font-size: var(--font-size-small);
  font-family: var(--font-family-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-color-primary);
}

header h2 {
  margin-top: 0.5rem;
}

header + p,
header p {
  margin-top: 0.5rem;
  color: var(--text-color-secondary);
}
```

## Example

**Before (sem organizacao):**
```html
<section id="about">
  <h1>Sobre</h1>
  <img src="phones.png" />
  <p>texto</p>
</section>
```

**After (com esta skill):**
```html
<!-- Mobile-only section -->
<section class="smartphones-img">
  <img src="assets/smartphones.png" alt="" />
</section>

<!-- About section -->
<section id="about" class="section-about">
  <div class="container py-extralarge">
    <div class="even-columns items-center">
      <div>
        <header>
          <strong>Conheça o app</strong>
          <h2>Titulo do about</h2>
        </header>
        <p>Descricao</p>
      </div>
      <div class="desktop-only">
        <img src="assets/smartphones.png" alt="" />
      </div>
    </div>
  </div>
</section>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem aparece em mobile e desktop com layouts diferentes | Crie duas instancias, controle com visibility classes |
| Imagem decorativa sem valor para leitor de tela | `alt=""` vazio |
| Secao precisa de background decorativo | `background: url() top / cover no-repeat` na section |
| Multiplas secoes compartilham estilos de header | Extraia para `sections.css` |
| Link de navegacao precisa rolar ate secao | Use `id` na section e `href="#id"` no link (ancora) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<h1>` em secao que nao e a principal | `<h2>` ou `<h3>` respeitando hierarquia |
| `display: none` inline no HTML | Classe `.desktop-only` ou `.mobile-only` |
| `width: 100%` em img sem max-width | Reset global `img { max-width: 100%; display: inline-block }` |
| Arquivo CSS unico para uma section minima | `sections.css` compartilhado entre secoes |
| Duplicar media queries por elemento | Agrupar regras do mesmo breakpoint |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre hierarquia HTML, ancoras e organizacao CSS
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes