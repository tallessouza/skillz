# Code Examples: Tags Genéricas Div e Span

## Exemplo base da aula

O instrutor demonstra a diferença visual básica:

```html
<div>texto qualquer</div>
<div>div</div>

<span>outro</span>
<span>ainda outro</span>
```

**Resultado visual:**
```
texto qualquer
div
outro ainda outro
```

As divs ficam em linhas separadas (bloco). Os spans ficam na mesma linha (inline).

## Variação 1: Div como layout container

```html
<div class="page-wrapper">
  <div class="sidebar">
    <ul>
      <li>Menu item 1</li>
      <li>Menu item 2</li>
    </ul>
  </div>
  <div class="main-content">
    <h1>Título da página</h1>
    <p>Conteúdo principal.</p>
  </div>
</div>
```

Aqui as divs estruturam o layout sem adicionar semântica. O CSS fará o trabalho visual (flexbox/grid).

## Variação 2: Span para estilização inline

```html
<p>
  Seu pedido <span class="order-number">#12345</span> foi
  <span class="status status--shipped">enviado</span> em
  <span class="date">28/02/2026</span>.
</p>
```

Cada span marca um trecho de texto para receber estilo ou comportamento JS específico, sem alterar a semântica do parágrafo.

## Variação 3: Div com data attributes para JavaScript

```html
<div class="accordion-item" data-accordion="open">
  <div class="accordion-header" data-action="toggle">
    Pergunta frequente
  </div>
  <div class="accordion-body">
    Resposta detalhada aqui.
  </div>
</div>
```

Os atributos `data-*` dão significado programático a elementos que não têm semântica própria.

## Variação 4: Combinando div e span

```html
<div class="notification notification--warning">
  <span class="notification-icon">⚠️</span>
  <span class="notification-text">Sua sessão expira em <span class="countdown" data-seconds="300">5:00</span>.</span>
</div>
```

A div é o container de bloco. Os spans organizam partes inline dentro dele. Note o span aninhado dentro de outro span — perfeitamente válido (inline dentro de inline).

## Anti-exemplo: div dentro de span (evitar)

```html
<!-- ERRADO: bloco dentro de inline -->
<span>
  <div>Isso causa comportamento inesperado</div>
</span>

<!-- CORRETO: inline dentro de bloco -->
<div>
  <span>Isso funciona como esperado</span>
</div>
```