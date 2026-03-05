# Code Examples: Dicas de Responsividade CSS

## 1. Media queries com em — sempre 16px base

```css
/* Mesmo com font-size alterado no root, media queries usam 16px */
:root {
  font-size: 200%; /* 32px para o documento */
}

h1 {
  font-size: 2rem; /* 2 × 32px = 64px (usa o root) */
}

/* Mas aqui, 20em = 20 × 16px = 320px (ignora o root) */
@media (min-width: 20em) {
  h1 {
    font-size: 3rem; /* 3 × 32px = 96px */
  }
}

/* E 30em = 30 × 16px = 480px (sempre 16px base) */
@media (min-width: 30em) {
  h1 {
    font-size: 4rem;
  }
}
```

## 2. Trick do 62.5% — conversao facil

```css
:root {
  font-size: 62.5%; /* 62.5% de 16px = 10px → 1rem = 10px */
}

/* Conversao direta: px / 10 = rem */
h1 {
  font-size: 4rem;    /* 40px */
}

h2 {
  font-size: 3.2rem;  /* 32px */
}

p {
  font-size: 1.6rem;  /* 16px */
}

small {
  font-size: 1.2rem;  /* 12px */
}

.container {
  max-width: 120rem;   /* 1200px */
  padding: 2rem;       /* 20px */
  margin: 0 auto;
}

/* Media queries continuam com base 16px! */
/* 48em = 48 × 16px = 768px (NAO 48 × 10px) */
@media (min-width: 48em) {
  h1 {
    font-size: 4.8rem; /* 48px */
  }
}
```

## 3. Regra de tres para o 62.5%

```
16px ------ 100%
10px ------   x%

x = (10 × 100) / 16
x = 1000 / 16
x = 62.5%
```

## 4. Sem o trick — conversao com 16px base

```css
/* Sem 62.5%, 1rem = 16px */
/* Conversao: px / 16 = rem */

h1 {
  font-size: 3rem;     /* 48px → 48/16 = 3rem */
}

p {
  font-size: 1rem;     /* 16px → 16/16 = 1rem */
}

.container {
  max-width: 75rem;    /* 1200px → 1200/16 = 75rem */
  padding: 1.25rem;    /* 20px → 20/16 = 1.25rem */
}
```

## 5. Media queries proximas ao codigo relacionado

```css
/* === ROOT === */
:root {
  --color-primary: #6200ee;
  --spacing-sm: 0.8rem;
  --spacing-md: 1.6rem;
  --spacing-lg: 3.2rem;
  --font-base: 1.6rem;
  --font-heading: 3.2rem;
}

@media (min-width: 48em) {
  :root {
    --spacing-sm: 1.2rem;
    --spacing-md: 2.4rem;
    --spacing-lg: 4.8rem;
    --font-heading: 4.8rem;
  }
}

/* === HEADER === */
.header {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (min-width: 48em) {
  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

/* === HERO === */
.hero {
  padding: var(--spacing-lg);
  text-align: center;
}

@media (min-width: 48em) {
  .hero {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }
}
```

## 6. Anti-pattern: media queries em arquivo separado

```css
/* styles.css — toda a estilizacao */
:root { --font-base: 1.6rem; }
.header { padding: 1rem; }
.hero { padding: 2rem; }
.footer { padding: 1rem; }

/* responsive.css — todas as media queries separadas */
/* PROBLEMA: precisa ir e voltar entre arquivos */
@media (min-width: 48em) {
  :root { --font-base: 1.8rem; }
  .header { padding: 2rem; }
  .hero { padding: 4rem; }
  .footer { padding: 2rem; }
}
```

## 7. Desenvolvimento simultaneo mobile + desktop

```css
/* Construindo para ambos desde o inicio */
.pricing-grid {
  display: grid;
  gap: 1.6rem;
  padding: 1.6rem;

  /* Mobile: empilhado */
  grid-template-columns: 1fr;
}

@media (min-width: 48em) {
  .pricing-grid {
    /* Desktop: 3 colunas */
    grid-template-columns: repeat(3, 1fr);
    gap: 2.4rem;
    padding: 3.2rem;
  }
}

.pricing-card {
  padding: 2.4rem;
  border-radius: 0.8rem;
  /* A estrutura base funciona em ambos */
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}
```

## 8. Bundler awareness — link tags vs bundler

```html
<!-- SEM bundler: cada link = 1 requisicao HTTP -->
<link rel="stylesheet" href="reset.css">
<link rel="stylesheet" href="variables.css">
<link rel="stylesheet" href="header.css">
<link rel="stylesheet" href="hero.css">
<link rel="stylesheet" href="footer.css">
<!-- 5 requisicoes = carregamento mais lento -->

<!-- COM bundler: tudo vira 1 arquivo -->
<link rel="stylesheet" href="bundle.css">
<!-- 1 requisicao = carregamento rapido -->
```