# Code Examples: Utilizando o :root e :host no Angular

## Exemplo 1: Definindo variáveis globais no :root

```css
/* styles.css */
:root {
  --primary-color: orange;
  --secondary-color: gray;
}
```

Este é o ponto de partida. O arquivo `styles.css` é o único local onde `:root` deve ser usado em aplicações Angular. Essas variáveis ficam acessíveis para todos os componentes.

## Exemplo 2: Consumindo no AppComponent (Emulated)

```html
<!-- app.component.html -->
<p>App Component</p>
```

```css
/* app.component.css */
p {
  color: var(--primary-color);
}
```

**Resultado:** O parágrafo fica laranja (orange). O componente com encapsulamento Emulated acessa normalmente as variáveis do `:root`.

## Exemplo 3: Consumindo no ShadowHostComponent (Shadow DOM)

```html
<!-- shadow-host.component.html -->
<p>Shadow Host</p>
<app-child></app-child>
```

```css
/* shadow-host.component.css */
p {
  color: var(--secondary-color);
}
```

**Resultado:** O parágrafo fica cinza (gray). Mesmo com Shadow DOM nativo, variáveis CSS herdam do `:root`.

## Exemplo 4: Definindo variáveis escopadas com :host

```css
/* shadow-host.component.css */
:host {
  --shadow-color: blue;
}

p {
  color: var(--secondary-color);
}
```

A variável `--shadow-color` fica disponível para todos os componentes filhos dentro deste Shadow DOM.

## Exemplo 5: Componente filho consumindo variável do :host

```css
/* app-child.component.css (filho dentro do Shadow DOM) */
p {
  color: var(--shadow-color);
}
```

**Resultado:** O parágrafo fica azul. O child component acessa a variável definida no `:host` do Shadow DOM pai.

## Exemplo 6: Tentando usar variável do Shadow DOM fora dele (FALHA)

```css
/* app.component.css (FORA do Shadow DOM) */
p {
  color: var(--shadow-color);
}
```

**Resultado:** Não funciona. A variável `--shadow-color` foi definida dentro do Shadow DOM e não vaza para fora. O encapsulamento impede.

## Exemplo completo: Design System básico

```css
/* styles.css */
:root {
  /* Cores */
  --primary-color: #ff6600;
  --secondary-color: #666666;
  --accent-color: #0066ff;

  /* Tipografia */
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 20px;

  /* Espaçamento */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}
```

```css
/* shadow-host.component.css — variáveis locais do componente */
:host {
  --card-bg: #f5f5f5;
  --card-border: 1px solid #ddd;
  --card-radius: 8px;
}
```

```css
/* card-content.component.css — filho dentro do Shadow DOM */
.card {
  background: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--spacing-md); /* variável global do :root */
  color: var(--primary-color); /* variável global do :root */
}
```