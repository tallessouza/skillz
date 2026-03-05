# Code Examples: Alinhamento de Items no CSS Grid

## Setup base para todos os exemplos

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);
  gap: 10px;
  width: 800px;
  height: 800px;
}

.grid-item {
  background: lightblue;
  padding: 10px;
}
```

```html
<div class="grid-container">
  <div class="grid-item">A</div>
  <div class="grid-item">B</div>
  <div class="grid-item">C</div>
  <div class="grid-item">D</div>
  <div class="grid-item">E</div>
  <div class="grid-item">F</div>
</div>
```

## align-items: controle do eixo Y

### stretch (padrao)
```css
.grid-container {
  align-items: stretch;
  /* Items preenchem toda a altura da celula */
  /* A altura do item = altura da row track (200px) */
}
```

### start
```css
.grid-container {
  align-items: start;
  /* Items no topo da celula */
  /* Altura volta a ser automatica (baseada no conteudo) */
}
```

### center
```css
.grid-container {
  align-items: center;
  /* Items centralizados verticalmente na celula */
}
```

### end
```css
.grid-container {
  align-items: end;
  /* Items no fundo da celula */
}
```

## justify-items: controle do eixo X

### stretch (padrao)
```css
.grid-container {
  justify-items: stretch;
  /* Items preenchem toda a largura da celula */
}
```

### start
```css
.grid-container {
  justify-items: start;
  /* Items na esquerda da celula */
  /* Largura volta a ser automatica */
}
```

### center
```css
.grid-container {
  justify-items: center;
  /* Items centralizados horizontalmente */
}
```

### end
```css
.grid-container {
  justify-items: end;
  /* Items na direita da celula */
}
```

## place-items: shorthand para ambos

### Valor unico (aplica para ambos os eixos)
```css
.grid-container {
  place-items: center;
  /* Equivale a: */
  /* align-items: center; */
  /* justify-items: center; */
  /* Item fica exatamente no centro da celula */
}
```

### Dois valores (align, justify)
```css
.grid-container {
  place-items: end start;
  /* align-items: end (fundo) */
  /* justify-items: start (esquerda) */
  /* Item no canto inferior esquerdo */
}
```

### Canto superior direito
```css
.grid-container {
  place-items: start end;
  /* Item no canto superior direito de cada celula */
}
```

## Combinando items e content

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);
  width: 800px;
  height: 800px;

  /* Distribui as tracks no container */
  place-content: space-between;

  /* Centraliza items dentro de cada celula */
  place-items: center;
}
```

## Cenario real: grid flexivel com centralizacao

```css
/* Cenario mais comum no dia a dia */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  /* Com 1fr, stretch ja faz o trabalho */
  /* Mas se quiser centralizar o conteudo: */
  place-items: center;
}
```

## Combinando align-items e justify-items separados

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-template-rows: repeat(3, 200px);

  align-items: center;    /* centralizado verticalmente */
  justify-items: start;   /* alinhado a esquerda */
  /* Equivale a: place-items: center start */
}
```