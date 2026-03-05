# Code Examples: Atributos Globais HTML

## Identificacao basica

```html
<!-- id: identificador unico -->
<header id="main-header">
  <h1>Meu Site</h1>
</header>

<!-- class: agrupamento para estilo -->
<p class="text-large text-bold">Paragrafo estilizado</p>

<!-- Combinando id e class -->
<section id="hero" class="section section-primary">
  <h2>Bem-vindo</h2>
</section>
```

## Dados customizados (data-*)

```html
<!-- Armazenando dados no elemento -->
<button data-product-id="42" data-action="add-to-cart">
  Adicionar ao carrinho
</button>

<!-- Acessando via JavaScript -->
<script>
  const button = document.querySelector('[data-action="add-to-cart"]')
  const productId = button.dataset.productId // "42"
</script>

<!-- Multiplos data attributes -->
<div
  data-user-name="Maria"
  data-user-role="admin"
  data-user-active="true"
>
  Perfil do usuario
</div>
```

## Acessibilidade

```html
<!-- aria-label para elementos sem texto visivel -->
<button aria-label="Fechar menu">
  <svg><!-- icone X --></svg>
</button>

<!-- aria-hidden para decoracao visual -->
<span aria-hidden="true">🎨</span>
<span>Personalizar tema</span>

<!-- aria-describedby para descricoes extras -->
<input type="password" aria-describedby="password-hint" />
<p id="password-hint">Minimo 8 caracteres, incluindo numero e simbolo</p>

<!-- aria-expanded para menus -->
<button aria-expanded="false" aria-controls="nav-menu">
  Menu
</button>
<nav id="nav-menu" hidden>
  <ul>...</ul>
</nav>
```

## Tabindex

```html
<!-- tabindex="0": entra na ordem natural de navegacao -->
<div tabindex="0" role="button" onclick="handleClick()">
  Elemento clicavel acessivel
</div>

<!-- tabindex="-1": focavel por JS, nao por Tab -->
<div id="modal" tabindex="-1">
  Conteudo do modal (recebe foco quando abre)
</div>

<!-- NUNCA use tabindex > 0 (quebra ordem natural) -->
```

## Hidden

```html
<!-- hidden: semanticamente "nao relevante agora" -->
<div id="error-message" hidden>
  Ocorreu um erro. Tente novamente.
</div>

<!-- Revelando via JS -->
<script>
  function showError() {
    document.getElementById('error-message').hidden = false
  }
</script>
```

## Lang

```html
<!-- No elemento raiz -->
<html lang="pt-BR">

<!-- Em trechos especificos -->
<p>O termo <span lang="en">responsive design</span> se refere a...</p>

<!-- Importante para leitores de tela pronunciarem corretamente -->
<blockquote lang="en">
  "The only way to do great work is to love what you do."
</blockquote>
```

## Title

```html
<!-- Tooltip informativo -->
<abbr title="Hypertext Markup Language">HTML</abbr>

<!-- Em links para contexto adicional -->
<a href="/docs" title="Abrir documentacao completa">Docs</a>

<!-- CUIDADO: title nao e acessivel de forma confiavel -->
<!-- Use aria-label para acessibilidade real -->
```

## Contenteditable

```html
<!-- Tornando conteudo editavel -->
<div contenteditable="true">
  Clique aqui para editar este texto.
</div>

<!-- Util para editores rich-text simples -->
<article contenteditable="true" class="editable-area">
  <h2>Titulo editavel</h2>
  <p>Paragrafo editavel</p>
</article>
```

## Combinando atributos globais

```html
<!-- Exemplo real: card de produto acessivel -->
<article
  id="product-42"
  class="card card-product"
  data-product-id="42"
  data-category="electronics"
  lang="pt-BR"
  tabindex="0"
  role="article"
  aria-label="Fone Bluetooth XYZ - R$ 199,90"
>
  <h3>Fone Bluetooth XYZ</h3>
  <p class="price">R$ 199,90</p>
  <button
    class="btn btn-primary"
    data-action="add-to-cart"
    aria-label="Adicionar Fone Bluetooth XYZ ao carrinho"
  >
    Comprar
  </button>
</article>
```