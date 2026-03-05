# Code Examples: CSS Padding

## Setup da Aula (Estrutura HTML)

O instrutor cria uma div e um span para comparar block vs inline:

```html
<div class="padding">Conteudo block</div>
<span class="padding">Conteudo inline</span>
```

```css
.padding {
  width: 200px;
  height: 100px;
  border: 1px solid black;
}
```

## Exemplo 1: Padding com 1 valor

```css
.padding {
  padding: 20px;
}
```

Resultado: 20px de preenchimento em **todas** as direcoes (top, right, bottom, left).

No `<span>` (inline): padding horizontal funciona, mas o vertical encavala sobre elementos adjacentes.

## Exemplo 2: Padding com 2 valores

```css
.padding {
  padding: 20px 40px;
}
```

- `20px` → top e bottom (eixo vertical / block)
- `40px` → left e right (eixo horizontal / inline)

## Exemplo 3: Padding com 3 valores

```css
.padding {
  padding: 20px 40px 0;
}
```

- `20px` → top
- `40px` → left e right (horizontal)
- `0` → bottom

## Exemplo 4: Padding com 4 valores (relogio)

```css
.padding {
  padding: 20px 40px 10px 0;
}
```

- `20px` → top
- `40px` → right
- `10px` → bottom
- `0` → left

## Variacoes Praticas

### Card com padding simetrico
```css
.card {
  padding: 16px 24px; /* mais espaco horizontal que vertical */
}
```

### Header com padding apenas horizontal
```css
.header {
  padding: 0 32px; /* sem padding vertical, 32px nas laterais */
}
```

### Secao com padding diferente em cima e embaixo
```css
.hero {
  padding: 64px 24px 32px; /* mais espaco no topo */
}
```

### Corrigindo padding em inline
```css
/* ERRADO: padding vertical nao funciona corretamente */
span.badge {
  padding: 8px 12px;
}

/* CORRETO: mude o display primeiro */
span.badge {
  display: inline-block;
  padding: 8px 12px;
}
```

### Usando propriedades logicas (alternativa ao shorthand)
```css
.box {
  padding-block: 20px;  /* top + bottom */
  padding-inline: 40px; /* left + right */
}
```