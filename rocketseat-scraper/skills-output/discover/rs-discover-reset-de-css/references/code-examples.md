# Code Examples: Reset de CSS

## Reset minimo (da aula)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

## Demonstracao do problema: margin do body

```html
<body>
  <div class="container">
    <p>Conteudo</p>
  </div>
</body>
```

```css
/* SEM reset: body tem 8px de margin, p tem margin vertical */
/* Resultado: espacamentos inesperados que nao foram definidos pelo dev */

.container {
  width: 360px;
  background: #333;
}
```

```css
/* COM reset: tudo zerado, controle total */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 360px;
  background: #333;
}
```

## Demonstracao do box-sizing

### Sem border-box (content-box padrao)

```css
.container {
  width: 360px;
  padding: 100px;
  /* Largura real: 360 + 100 + 100 = 560px — QUEBRA o layout */
}
```

### Com border-box

```css
* {
  box-sizing: border-box;
}

.container {
  width: 360px;
  padding: 100px;
  /* Largura real: 360px — padding acomodado internamente */
  /* Area de conteudo: 360 - 200 = 160px */
}
```

## Variacao: reset com heranca (projetos maiores)

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

Inclui pseudo-elementos `::before` e `::after` no reset, evitando que herdem `content-box` de forma inesperada.

## Variacao: reset com base tipografica

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%; /* 1rem = 10px para facilitar calculos */
}

body {
  font-size: 1.6rem; /* 16px como base */
  line-height: 1.5;
}
```

## Quando NAO fazer reset manual

Se usar Tailwind CSS, ele ja inclui o **Preflight** (baseado no modern-normalize) que faz reset automaticamente. Bootstrap tambem tem seu proprio reset (`reboot.css`). Nesses casos, nao duplique o reset.