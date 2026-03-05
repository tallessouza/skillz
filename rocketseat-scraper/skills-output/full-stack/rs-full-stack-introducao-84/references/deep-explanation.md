# Deep Explanation: CSS Value Functions

## O que sao CSS Value Functions

CSS Value Functions sao funcoes aplicadas especificamente como **valores de propriedades CSS**. A distincao e crucial: nao sao seletores, nao sao at-rules — sao valores.

### Anatomia de uma funcao

```
nome( argumento1, argumento2, ... )
 ^        ^
 |        └── Instrucoes para a funcao (o que ela deve fazer)
 └── Identificador da funcao
```

Os **argumentos** sao as "ordens" que voce da para a funcao. Algumas funcoes aceitam zero argumentos, outras aceitam um, e muitas aceitam multiplos. O numero e tipo de argumentos depende da funcao especifica.

## Categorias de CSS Value Functions

O instrutor organizou as funcoes em 8 categorias:

### 1. Transformacao
Funcoes que alteram posicao, rotacao, escala e perspectiva de elementos.
- `translate()`, `translateX()`, `translateY()`, `translate3d()`
- `rotate()`, `rotateX()`, `rotateY()`, `rotate3d()`
- `scale()`, `scaleX()`, `scaleY()`, `scale3d()`
- `skew()`, `skewX()`, `skewY()`
- `matrix()`, `matrix3d()`, `perspective()`

### 2. Matematica
Funcoes que realizam calculos para determinar valores dinamicos.
- `calc()` — operacoes aritmeticas
- `min()` — menor valor entre opcoes
- `max()` — maior valor entre opcoes
- `clamp()` — valor restrito entre minimo e maximo

### 3. Filtros
Funcoes para efeitos visuais aplicados a elementos ou imagens.
- `blur()`, `brightness()`, `contrast()`
- `drop-shadow()`, `grayscale()`, `hue-rotate()`
- `invert()`, `opacity()`, `saturate()`, `sepia()`

### 4. Cores
Funcoes para definir cores usando diferentes espacos de cor.
- `rgb()`, `rgba()`, `hsl()`, `hsla()`
- `oklch()`, `oklab()`, `color()`
- `color-mix()`

### 5. Degrades (Gradients)
Funcoes que criam transicoes entre cores.
- `linear-gradient()`, `repeating-linear-gradient()`
- `radial-gradient()`, `repeating-radial-gradient()`
- `conic-gradient()`, `repeating-conic-gradient()`

### 6. Formatos (Shapes)
Funcoes para definir formas geometricas.
- `circle()`, `ellipse()`, `polygon()`, `path()`
- `inset()`

### 7. Funcoes de Referencia
Funcoes que referenciam outros valores ou recursos.
- `var()` — variavel CSS custom property
- `attr()` — atributo HTML
- `env()` — variavel de ambiente
- `url()` — referencia a recurso externo

### 8. Outras
Funcoes que nao se encaixam nas categorias acima.
- `counter()`, `counters()`
- `image-set()`
- `fit-content()`
- `minmax()` (CSS Grid)

## Distincao importante: o que NAO e CSS Value Function

### Pseudo-funcoes (seletores)
```css
/* ISSO NAO e value function — e um seletor */
:not(.hidden) { display: block; }
:is(h1, h2, h3) { color: blue; }
:where(article, section) { padding: 1rem; }
:has(.active) { border: 1px solid green; }
```

### At-rules com funcoes
```css
/* ISSO NAO e value function — e uma at-rule */
@import url('styles.css');
@supports (display: grid) { ... }
```

A diferenca: value functions aparecem **do lado direito** de uma declaracao CSS (como valor de propriedade), enquanto pseudo-funcoes aparecem como seletores e at-rules aparecem como regras especiais.