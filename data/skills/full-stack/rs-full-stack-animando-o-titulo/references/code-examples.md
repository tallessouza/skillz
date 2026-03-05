# Code Examples: Animando o Título

## HTML completo da section hero

```html
<section class="hero">
  <h1>Sua vida mais
    <div>
      <span>radical</span>
      <span>divertida</span>
      <span>saudável</span>
      <span>radical</span> <!-- duplicado para loop infinito -->
    </div>
  </h1>
</section>
```

## CSS completo do hero (hero.css)

```css
section.hero {
  max-width: 80rem;
  width: 100%;
  padding: 2.5rem 2rem;
  margin-inline: auto;
}

section.hero h1 {
  max-width: 40rem;
}

section.hero h1 div {
  display: inline-block;
  overflow: hidden;
  height: 5rem;
  width: min-content;
  vertical-align: bottom;
}

section.hero h1 span {
  display: block;
  animation: slide-up 6s ease infinite;
}

/* Cores por posição */
section.hero h1 span:nth-child(1) {
  color: var(--sky-mid);
}

section.hero h1 span:nth-child(2) {
  color: var(--joy-mid);
}

section.hero h1 span:nth-child(3) {
  color: var(--mid);
}

/* Duplicado — mesma cor do primeiro */
section.hero h1 span:nth-child(4) {
  color: var(--sky-mid);
}
```

## Keyframes completo com bounce

```css
@keyframes slide-up {
  /* ===== RADICAL — estático ===== */
  0%, 22% {
    transform: translateY(0);
  }

  /* ===== DIVERTIDA — bounce in ===== */
  23% { transform: translateY(calc(-5rem - 15px)); }  /* overshoot */
  25% { transform: translateY(calc(-5rem + 10px)); }  /* undershoot */
  27% { transform: translateY(calc(-5rem - 5px)); }   /* micro-overshoot */
  29% { transform: translateY(calc(-5rem + 5px)); }   /* micro-undershoot */

  /* ===== DIVERTIDA — estático ===== */
  33%, 55% {
    transform: translateY(-5rem);
  }

  /* ===== SAUDÁVEL — bounce in ===== */
  56% { transform: translateY(calc(-10rem - 15px)); }
  58% { transform: translateY(calc(-10rem + 10px)); }
  60% { transform: translateY(calc(-10rem - 5px)); }
  62% { transform: translateY(calc(-10rem + 5px)); }

  /* ===== SAUDÁVEL — estático ===== */
  66%, 88% {
    transform: translateY(-10rem);
  }

  /* ===== RADICAL (duplicado) — bounce in ===== */
  89% { transform: translateY(calc(-15rem - 15px)); }
  91% { transform: translateY(calc(-15rem + 10px)); }
  93% { transform: translateY(calc(-15rem - 5px)); }
  95% { transform: translateY(calc(-15rem + 5px)); }

  /* ===== Posição final = radical duplicado (loop reset invisível) ===== */
  100% {
    transform: translateY(-15rem);
  }
}
```

## Variação: 4 palavras ciclando

Para 4 palavras, divida em ~25% cada e duplique a primeira:

```html
<div>
  <span>rápido</span>
  <span>seguro</span>
  <span>simples</span>
  <span>moderno</span>
  <span>rápido</span> <!-- duplicado -->
</div>
```

```css
.container div {
  height: 3rem; /* ajuste à fonte */
}

@keyframes slide-up-4 {
  0%, 17% { transform: translateY(0); }
  /* bounce 18-24% */
  25%, 42% { transform: translateY(-3rem); }
  /* bounce 43-49% */
  50%, 67% { transform: translateY(-6rem); }
  /* bounce 68-74% */
  75%, 92% { transform: translateY(-9rem); }
  /* bounce 93-99% */
  100% { transform: translateY(-12rem); }
}
```

## Variação: sem bounce (versão simples)

```css
@keyframes slide-up-simple {
  0%, 25%  { transform: translateY(0); }
  33%, 58% { transform: translateY(-5rem); }
  66%, 91% { transform: translateY(-10rem); }
  100%     { transform: translateY(-15rem); }
}
```

## Debug: visualizando a caixa

Para entender o que está acontecendo durante o desenvolvimento:

```css
/* Temporário — remover depois */
section.hero h1 div {
  overflow: visible; /* mostra todos os spans */
  border: 2px solid red;
}

section.hero h1 span {
  border: 1px solid red;
}
```

## Padrão do bounce reutilizável

O bounce segue sempre a mesma estrutura — só muda a base:

```
offset+0%: calc(BASE - 15px)   /* overshoot */
offset+2%: calc(BASE + 10px)   /* undershoot */
offset+4%: calc(BASE - 5px)    /* micro-overshoot */
offset+6%: calc(BASE + 5px)    /* micro-undershoot */
offset+10%: BASE               /* estabiliza (início do estático) */
```

Onde BASE = `-Nrem` (N = posição do item × altura da linha).