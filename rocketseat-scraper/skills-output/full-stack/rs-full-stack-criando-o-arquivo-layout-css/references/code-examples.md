# Code Examples: Layout CSS com Painel Fixo e Rolagem

## Estrutura HTML completa

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles/global.css">
  <link rel="stylesheet" href="styles/layout.css">
  <title>Formulario de Matricula</title>
</head>
<body>
  <main>
    <div class="main-container">
      <!-- conteudo com rolagem -->
    </div>
  </main>
  <aside>
    <div class="aside-container">
      <!-- painel fixo -->
    </div>
  </aside>
</body>
</html>
```

## global.css — Reset completo

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden;
}
```

## layout.css — Layout com CSS Nesting

```css
body {
  display: grid;
  grid-template-columns: 51.25% 48.75%;
  height: 100vh;
}

main {
  overflow: auto;
  padding: 4rem;

  & .main-container {
    max-width: 33rem;
    margin-left: auto;
  }
}

aside {
  padding: 4rem;
  background-color: var(--surface-secondary);

  & .aside-container {
    max-width: 31rem;
  }
}
```

## layout.css — Versao sem CSS Nesting (fallback)

```css
body {
  display: grid;
  grid-template-columns: 51.25% 48.75%;
  height: 100vh;
}

main {
  overflow: auto;
  padding: 4rem;
}

main .main-container {
  max-width: 33rem;
  margin-left: auto;
}

aside {
  padding: 4rem;
  background-color: var(--surface-secondary);
}

aside .aside-container {
  max-width: 31rem;
}
```

## Variacao: colunas com fr units

```css
/* Alternativa usando fr em vez de porcentagem */
body {
  display: grid;
  grid-template-columns: 656fr 624fr;
  height: 100vh;
}
```

## Variacao: centralizacao bilateral

```css
/* Quando o conteudo deve ficar centralizado (nao alinhado a direita) */
.main-container {
  max-width: 33rem;
  margin: 0 auto; /* centraliza horizontalmente */
}
```

## Variacao: aside a esquerda, main a direita

```html
<body>
  <aside>
    <div class="aside-container"><!-- fixo --></div>
  </aside>
  <main>
    <div class="main-container"><!-- rola --></div>
  </main>
</body>
```

```css
body {
  display: grid;
  grid-template-columns: 48.75% 51.25%; /* invertido */
  height: 100vh;
}

.aside-container {
  max-width: 31rem;
  margin-right: auto; /* alinha a esquerda */
}

.main-container {
  max-width: 33rem;
  margin-right: auto;
}
```

## Calculo de proporcoes — passo a passo

```
Design:
  main = 656px
  aside = 624px
  total = 656 + 624 = 1280px

Regra de 3:
  main%  = (656 * 100) / 1280 = 51.25%
  aside% = (624 * 100) / 1280 = 48.75%
  
Verificacao: 51.25 + 48.75 = 100% ✓
```

## Conversao px → rem — valores da aula

```
padding:          64px  / 16 = 4rem
max-width main:   528px / 16 = 33rem
max-width aside:  496px / 16 = 31rem
```