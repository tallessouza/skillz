# Code Examples: Footer Layout com Flexbox e nth-child

## Exemplo 1: Footer basico da aula

### HTML
```html
<footer class="container">
  <span>TravelGram &copy; 2024</span>
  <span>Termos de uso</span>
  <span>Política de privacidade</span>
</footer>
```

### CSS (footer.css)
```css
footer {
  display: flex;
  padding-block: 24px;
  gap: 24px;
}

footer span:nth-child(1) {
  margin-right: auto;
}
```

### Resultado visual
```
[TravelGram © 2024]                    [Termos de uso] [Política de privacidade]
```

## Exemplo 2: nth-child com elementos misturados

### HTML
```html
<footer class="container">
  <a href="/">Logo</a>
  <span>TravelGram &copy; 2024</span>
  <span>Termos de uso</span>
  <span>Política de privacidade</span>
</footer>
```

### CSS — ERRADO
```css
/* Isso NAO funciona como esperado */
footer span:nth-child(1) {
  margin-right: auto;
}
/* nth-child(1) e o <a>, nao o primeiro <span> */
/* Nada sera selecionado porque o filho 1 nao e um span */
```

### CSS — CORRETO
```css
footer a:nth-child(1) {
  margin-right: auto;
}
/* OU use nth-of-type se quiser contar apenas spans */
footer span:nth-of-type(1) {
  font-weight: bold;
}
```

## Exemplo 3: Footer com links reais (evolucao do projeto)

```html
<footer class="container">
  <span>TravelGram &copy; 2024</span>
  <a href="/termos">Termos de uso</a>
  <a href="/privacidade">Política de privacidade</a>
</footer>
```

```css
footer {
  display: flex;
  padding-block: 24px;
  gap: 24px;
  align-items: center;
}

footer span:nth-child(1) {
  margin-right: auto;
}

footer a {
  color: inherit;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
```

## Exemplo 4: Variacao com justify-content (comparacao)

```css
/* Alternativa sem nth-child — resultado visual diferente */
footer {
  display: flex;
  justify-content: space-between;
  padding-block: 24px;
}
/* Resultado: [TravelGram]     [Termos]     [Politica] */
/* Os itens ficam igualmente espacados, nao agrupados */
```

## Exemplo 5: Entidades HTML comuns em footers

```html
<footer class="container">
  <span>TravelGram &copy; 2024 &mdash; Todos os direitos reservados</span>
  <span>TravelGram&reg;</span>
  <span>Feito com &hearts; no Brasil</span>
</footer>
```

## Exemplo 6: nth-child numerico — contagem explicada

```html
<div class="parent">
  <p>Paragrafo</p>    <!-- :nth-child(1) -->
  <span>Span A</span> <!-- :nth-child(2) -->
  <span>Span B</span> <!-- :nth-child(3) -->
  <a>Link</a>         <!-- :nth-child(4) -->
  <span>Span C</span> <!-- :nth-child(5) -->
</div>
```

```css
/* Seleciona Span A (filho 2 E e um span) */
.parent span:nth-child(2) { color: red; }

/* NAO seleciona nada (filho 1 e <p>, nao <span>) */
.parent span:nth-child(1) { color: blue; }

/* Seleciona Span C (filho 5 E e um span) */
.parent span:nth-child(5) { color: green; }

/* Se quiser o primeiro span independente da posicao: */
.parent span:nth-of-type(1) { color: red; } /* Seleciona Span A */
```