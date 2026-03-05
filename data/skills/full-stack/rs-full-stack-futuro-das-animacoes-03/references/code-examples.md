# Code Examples: CSS Animation Range

## Exemplo 1: animation-range-start e animation-range-end separados

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range-start: 10px;
  animation-range-end: 100px;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

A animacao comeca quando o elemento esta a 10px do bottom da viewport e termina quando esta a 100px do bottom. A "janela" de animacao e de 90px de scroll.

## Exemplo 2: Shorthand com porcentagem

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: 20% 50%;
}
```

Inicia a 20% do bottom da viewport, finaliza a 50%. Usa porcentagem ao inves de pixels — mais responsivo.

## Exemplo 3: Contain

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: contain;
}
```

A animacao so comeca quando o elemento esta **completamente** dentro da viewport. Assim que qualquer parte sai, a animacao ja finalizou.

## Exemplo 4: Cover

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: cover;
}
```

Comeca assim que qualquer parte aparece, termina quando sai completamente. Comportamento mais parecido com o padrao do `view()`.

## Exemplo 5: Entry (recomendado para a maioria dos casos)

```css
img, h1, h2, h3 {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: entry;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Aplicado a multiplos elementos. Cada um anima individualmente conforme entra na viewport. Elementos que ja estao na tela quando a pagina carrega nao animam (porque ja "entraram").

## Exemplo 6: Entry + Exit (animacao bidirecional)

```css
.element {
  animation: fade linear both, out linear both;
  animation-timeline: view(), view();
  animation-range: entry, exit;
}

@keyframes fade {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes out {
  to {
    transform: scale(1.1);
    opacity: 0;
  }
}
```

Duas animacoes separadas:
- `fade` controlada por `entry` — anima a entrada
- `out` controlada por `exit` — anima a saida com scale + fade

O elemento entra suavemente, fica visivel, e sai com efeito de "zoom out + desaparecimento".

## Exemplo 7: Contain com deslocamento

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: contain 100px;
}
```

O elemento precisa estar inteiro na tela **E** a 100px do bottom para a animacao comecar. Efeito: a animacao so inicia quando o elemento ja esta bem posicionado na viewport.

## Exemplo 8: Shorthand 1 valor numerico (cover implicito)

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: 100px;
}
```

Com apenas 1 valor numerico, o padrao e cover. Inicia a 100px do bottom, finaliza quando sair da tela.

## Exemplo 9: Shorthand 2 valores numericos

```css
.element {
  animation: fade linear both;
  animation-timeline: view();
  animation-range: 100px 200px;
}
```

Inicia a 100px do bottom, finaliza a 200px do bottom. A animacao completa acontece em uma "janela" de 100px de scroll.

## Variacoes praticas

### Landing page com sections

```css
.section-title {
  animation: slide-up linear both;
  animation-timeline: view();
  animation-range: entry;
}

.section-image {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry;
}

.section-content {
  animation: slide-up linear both, fade-out linear both;
  animation-timeline: view(), view();
  animation-range: entry, exit;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  to { opacity: 0; transform: scale(0.95); }
}
```

### Cards com contain (anima so quando totalmente visivel)

```css
.card {
  animation: pop-in linear both;
  animation-timeline: view();
  animation-range: contain;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```