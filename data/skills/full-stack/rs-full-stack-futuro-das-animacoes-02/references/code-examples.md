# Code Examples: CSS view() Animation Timeline

## Exemplo 1: Setup basico com view()

```css
@keyframes fade-in {
  from {
    opacity: 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.image {
  animation: fade-in linear both;
  animation-timeline: view();
}
```

**Comportamento:** A imagem comeca invisivel e pequena. Ao entrar na viewport, anima ate visivel e tamanho normal. Ao sair, reverte.

## Exemplo 2: Com offsets em pixels

```css
.image {
  animation: fade-in linear both;
  animation-timeline: view(100px 200px);
}
```

**Comportamento:**
- Animacao finaliza quando topo do elemento chega a 100px do topo da viewport
- Animacao inicia quando fundo do elemento passa 200px acima do fundo da viewport

## Exemplo 3: Offsets invertidos

```css
.image {
  animation: fade-in linear both;
  animation-timeline: view(200px 100px);
}
```

**Comportamento:** Finaliza mais cedo (200px do topo), inicia mais tarde (100px do fundo). Zona ativa menor.

## Exemplo 4: Com porcentagens

```css
.image {
  animation: fade-in linear both;
  animation-timeline: view(50% 10%);
}
```

**Comportamento:** Responsivo — offsets se adaptam ao tamanho da viewport.

## Exemplo 5: Valor unico (mesmo offset top e bottom)

```css
.image {
  animation: fade-in linear both;
  animation-timeline: view(100px);
}
```

**Comportamento:** 100px de offset tanto do topo quanto do fundo. Equivale a `view(100px 100px)`.

## Exemplo 6: Configuracao preferida do instrutor

```css
.image {
  animation: fade-in linear both;
  animation-timeline: view(90% 10%);
}
```

**Comportamento:** Inicia a animacao muito cedo (10% do fundo) e finaliza muito cedo (90% do topo). Resultado: animacao completa acontece logo que o elemento aparece.

## Exemplo 7: Helpers visuais para debug de offsets

O instrutor criou pseudo-elementos para visualizar os limites:

```css
.container::before {
  content: "top";
  position: fixed;
  top: 100px; /* mesmo valor do primeiro argumento */
  left: 0;
  right: 0;
  height: 2px;
  background: red;
}

.container::after {
  content: "bottom";
  position: fixed;
  bottom: 200px; /* mesmo valor do segundo argumento */
  left: 0;
  right: 0;
  height: 2px;
  background: green;
}
```

**Uso:** Permite visualizar exatamente onde a animacao inicia e finaliza na viewport. Remova apos encontrar os valores ideais.

## Exemplo 8: Sem fill-mode (problema)

```css
/* PROBLEMA: flash visual */
.image {
  animation: fade-in linear;
  animation-timeline: view();
  /* Falta animation-fill-mode: both */
}
```

**Problema:** Elemento aparece normal, depois pula para `opacity: 0` quando a animacao inicia. Flash visual.

## Exemplo 9: Com fill-mode corrigido

```css
/* CORRETO: sem flash */
.image {
  animation: fade-in linear both;
  animation-timeline: view();
}
```

**Correto:** `both` no shorthand garante que propriedades do `from` se aplicam antes da animacao iniciar.

## Variacoes de keyframes

### Apenas opacidade
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Opacidade + escala (recomendado)
```css
@keyframes fade-in {
  from {
    opacity: 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
```

### Slide lateral + opacidade
```css
@keyframes slide-in {
  from {
    opacity: 0;
    translate: -50px 0;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
```

### Slide vertical
```css
@keyframes rise-up {
  from {
    opacity: 0;
    translate: 0 30px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
```