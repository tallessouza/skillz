# Code Examples: Classes Utilitárias CSS — Container Responsivo

## Exemplo 1: Setup completo (mobile-first)

### global.css
```css
:root {
  --px-lg: 1.5rem; /* 24px — padding lateral mobile */
}

@media (width >= 80em) {
  :root {
    --px-lg: 2rem; /* 32px — padding lateral desktop */
  }
}
```

### utility.css
```css
.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

@media (width >= 80em) {
  .container {
    --maxWidth: 80rem; /* 1280px */
  }
}
```

### index.html
```html
<link rel="stylesheet" href="./styles/global.css" />
<link rel="stylesheet" href="./styles/utility.css" />

<header>
  <div class="container">
    <h1>Teste</h1>
  </div>
</header>
```

## Exemplo 2: Abordagem equivalente SEM min() (para comparacao)

```css
/* Isso produz o mesmo resultado, mas com mais codigo */
.container {
  --maxWidth: 375px;
  width: calc(100% - var(--px-lg) * 2);
  max-width: var(--maxWidth);
  margin-inline: auto;
}
```

O instrutor mostra que `min()` condensa `width` + `max-width` em uma unica propriedade.

## Exemplo 3: Debug visual (usado na aula)

```css
/* Temporario — para visualizar os limites do container */
.container {
  border: 1px solid violet;
}
```

O instrutor usa essa borda para demonstrar visualmente como o container se comporta em diferentes larguras.

## Exemplo 4: Variacao com breakpoint intermediario (tablet)

```css
:root {
  --px-lg: 1rem; /* mobile pequeno */
}

@media (width >= 48em) {
  :root {
    --px-lg: 1.5rem; /* tablet */
  }
}

@media (width >= 80em) {
  :root {
    --px-lg: 2rem; /* desktop */
  }
}

.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

@media (width >= 48em) {
  .container {
    --maxWidth: 48rem; /* 768px */
  }
}

@media (width >= 80em) {
  .container {
    --maxWidth: 80rem; /* 1280px */
  }
}
```

## Exemplo 5: Multiplos containers com larguras diferentes

```css
.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

.container--narrow {
  --maxWidth: 600px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

.container--wide {
  --maxWidth: 1440px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}
```

Ou com heranca para evitar repeticao:

```css
.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

.container--narrow { --maxWidth: 600px; }
.container--wide { --maxWidth: 1440px; }
```

## Demonstracao passo a passo do min()

O instrutor faz 3 demonstracoes ao vivo:

**1. Com `* 2` (correto):**
```css
width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
/* Em 375px: min(375px, 375px - 48px) = 327px ✓ espaco lateral correto */
```

**2. Sem `* 2` (incorreto):**
```css
width: min(var(--maxWidth), 100% - var(--px-lg));
/* Em 375px: min(375px, 375px - 24px) = 351px ✗ espaco lateral pela metade */
```

**3. Sem subtracao (100% puro):**
```css
width: min(var(--maxWidth), 100%);
/* Em 375px: min(375px, 375px) = 375px ✗ sem espaco lateral */
```