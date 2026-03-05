# Code Examples: CSS Transition — Shorthand, Placement & Accessibility

## 1. Shorthand basico (all)

```css
div {
  width: 100px;
  height: 100px;
  background: blue;
  transition: all 400ms ease;
}

div:hover {
  transform: scale(1.2);
  opacity: 0.5;
}
```

## 2. Shorthand com delay

```css
div {
  transition: all 400ms 2s ease;
  /* 400ms de duracao, 2s de delay */
  /* Ao fazer hover: espera 2s, depois anima em 400ms */
  /* Ao tirar hover: espera 2s, depois volta em 400ms */
}
```

## 3. Multiplas propriedades com tempos diferentes

```css
div {
  opacity: 1;
  transform: scale(1);
  transition: opacity 1s ease, transform 400ms linear;
  /* Opacidade: 1 segundo com ease */
  /* Transform: 400ms linear */
}

div:hover {
  opacity: 0.5;
  transform: scale(1.2);
}
```

## 4. Transicao no elemento vs no trigger

### ERRADO — Transicao so no trigger
```css
div {
  background: blue;
  /* Sem transition aqui */
}

div:hover {
  background: red;
  transition: all 200ms ease;
  /* Problema: entrada anima, saida e instantanea */
}
```

### CORRETO — Transicao no elemento
```css
div {
  background: blue;
  transition: all 200ms ease;
  /* Cobre entrada E saida */
}

div:hover {
  background: red;
}
```

## 5. Transicoes diferentes para entrada e saida

```css
div {
  transform: scale(1);
  /* Saida: 500ms (mais devagar) */
  transition: all 500ms ease;
}

div:hover {
  transform: scale(1.2);
  /* Entrada: 100ms (mais rapida, sobrescreve) */
  transition: all 100ms ease;
}
```

**Resultado**: hover entra rapido (100ms), sai devagar (500ms).

## 6. Prefers Reduced Motion

### Remocao total
```css
.card {
  transition: all 400ms ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
```

### Reducao parcial (so opacidade)
```css
@media (prefers-reduced-motion: reduce) {
  .card {
    /* Remove movimentos, mantém fade suave */
    transition: opacity 300ms ease;
  }
  .card:hover {
    transform: none; /* Remove movimento */
    /* Opacidade ainda anima suavemente */
  }
}
```

## 7. Minimo necessario (so 2 valores)

```css
/* Funciona perfeitamente */
div {
  transition: opacity 300ms;
  /* timing-function padrao: ease */
  /* delay padrao: 0 */
}
```

## 8. Usando propriedades separadas (referencia)

```css
div {
  transition-property: opacity, transform;
  transition-duration: 1s, 400ms;
  transition-timing-function: ease, linear;
  transition-delay: 0s, 0s;
}

/* Equivalente shorthand: */
div {
  transition: opacity 1s ease, transform 400ms linear;
}
```

## 9. Exemplo completo com acessibilidade

```css
.interactive-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  opacity: 1;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: 
    opacity 300ms ease,
    transform 200ms ease-out,
    box-shadow 200ms ease;
}

.interactive-card:hover {
  opacity: 0.95;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

@media (prefers-reduced-motion: reduce) {
  .interactive-card {
    transition: none;
  }
  .interactive-card:hover {
    transform: none;
    /* Mantem mudanca de cor/sombra sem animacao */
  }
}
```