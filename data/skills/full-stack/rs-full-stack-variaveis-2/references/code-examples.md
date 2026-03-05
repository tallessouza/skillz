# Code Examples: Variáveis no CSS

## Exemplo 1: Declaração global e uso (da aula)

```css
:root {
  --bg-color: lightblue;
}

body {
  background-color: var(--bg-color);
}
```

Resultado: body recebe fundo `lightblue` herdado de `:root`.

## Exemplo 2: Sobrescrita de escopo (da aula)

```css
:root {
  --bg-color: lightblue;
}

body {
  --bg-color: lightgreen;
  background-color: var(--bg-color); /* lightgreen */
}

div {
  width: 40px;
  height: 40px;
  background-color: var(--bg-color); /* lightgreen (herda do body, não do :root) */
}
```

A `div` está dentro de `body`, então herda o valor redefinido por `body`.

## Exemplo 3: Escopo em componente

```css
:root {
  --bg-color: lightblue;
  --text-color: #333;
}

.card {
  --bg-color: white; /* só .card e filhos usam white */
  background-color: var(--bg-color);
  color: var(--text-color); /* herda #333 de :root */
}

.card .title {
  /* herda --bg-color: white do .card */
  border-bottom: 1px solid var(--bg-color);
}
```

## Exemplo 4: Fallback value

```css
.element {
  /* Se --accent não existir, usa hotpink */
  color: var(--accent, hotpink);
}
```

## Exemplo 5: Tema claro/escuro com variáveis

```css
:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
}

.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

Adicionar classe `.dark` ao `<html>` ou `<body>` troca todo o tema sem alterar nenhuma outra regra CSS.

## Exemplo 6: Variáveis compostas (spacing system)

```css
:root {
  --spacing-unit: 8px;
  --spacing-sm: var(--spacing-unit);
  --spacing-md: calc(var(--spacing-unit) * 2);
  --spacing-lg: calc(var(--spacing-unit) * 4);
}

.container {
  padding: var(--spacing-md);
  gap: var(--spacing-sm);
}
```

## Exemplo 7: Alteração via JavaScript

```javascript
// Muda a variável global
document.documentElement.style.setProperty('--bg-color', 'coral');

// Muda só em um elemento específico
document.querySelector('.card').style.setProperty('--bg-color', 'navy');
```