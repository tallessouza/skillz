# Code Examples: Named Colors e RGB Hexadecimal

## Exemplo basico do instrutor

```html
<p>Lorem ipsum dolor sit amet...</p>
```

```css
/* Named color */
p {
  color: red;
}

/* Outra named color */
p {
  color: aliceblue;
}
```

## Hex 3 digitos vs 6 digitos

```css
/* 3 digitos — cada digito duplica */
p {
  color: #F09; /* equivale a #FF0099 */
}

/* 6 digitos — mesma cor, escrita explicitamente */
p {
  color: #FF0099;
}

/* 6 digitos — controle granular impossivel em 3 */
p {
  color: #FD059A;
}
```

## Transparencia com hex

```css
/* 4 digitos: #RGBA */
p {
  color: #F098; /* #FF009988 — semi-transparente */
}

/* 8 digitos: #RRGGBBAA */
p {
  color: #FD059A80; /* mesma cor, ~50% opacidade */
}

/* Transparencia 0 = invisivel */
p {
  color: #F090; /* totalmente transparente */
}

/* Transparencia F = opaco (padrao) */
p {
  color: #F09F; /* sem transparencia, igual a #F09 */
}
```

## Tabela de referencia rapida

```css
/* Escala de transparencia em hex (1 digito) */
/* 0 = 0%   (invisivel) */
/* 8 = ~53% (meio termo) */
/* F = 100% (opaco) */

/* Escala de transparencia em hex (2 digitos) */
/* 00 = 0%   */
/* 40 = 25%  */
/* 80 = 50%  */
/* BF = 75%  */
/* FF = 100% */
```

## Variacoes praticas

### Cores com transparencia para overlays
```css
.overlay {
  background-color: #00000080; /* preto 50% transparente */
}

.glass-effect {
  background-color: #FFFFFF20; /* branco quase transparente */
}
```

### Cores de texto com hierarquia
```css
.text-primary {
  color: #1A1A2E; /* quase preto, mais suave */
}

.text-secondary {
  color: #1A1A2E99; /* mesma cor, 60% opacidade */
}

.text-disabled {
  color: #1A1A2E40; /* mesma cor, 25% opacidade */
}
```

### Named colors uteis para prototipacao
```css
/* Apenas essas valem a pena lembrar */
.debug { outline: 2px solid red; }
.hidden { color: transparent; }
.base { background: white; color: black; }
```