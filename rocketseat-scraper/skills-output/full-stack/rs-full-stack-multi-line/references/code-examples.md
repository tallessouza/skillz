# Code Examples: Flex Wrap — Multilinhas

## Setup basico da aula

### HTML

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
  <div class="item">7</div>
  <div class="item">8</div>
</div>
```

### CSS base

```css
.container {
  display: flex;
  border: 2px solid #333;
  height: 300px;
}

.item {
  width: 120px;
  height: 80px;
  background: #4a90d9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
```

## Demonstracao: sem wrap (padrao)

```css
.container {
  display: flex;
  /* flex-wrap: nowrap; — este e o padrao */
}

.item {
  width: 100px; /* NAO sera respeitado — flex-shrink comprime os itens */
}
```

Resultado: todos os 8 itens ficam numa unica linha, cada um menor que 100px.

## Demonstracao: com wrap ativo

```css
.container {
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: 120px; /* agora respeitado — excesso quebra linha */
  height: 80px;
}
```

Resultado: itens que nao cabem na largura do container vao automaticamente para a proxima linha.

## Demonstracao: wrap-reverse

```css
.container {
  display: flex;
  flex-wrap: wrap-reverse;
}
```

Resultado: itens 1-4 ficam na linha de baixo, 5-8 ficam na linha de cima. A direcao de empilhamento e invertida.

## Demonstracao: align-items com wrap (dois eixos independentes)

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  height: 400px;
}
```

Resultado: cada linha centraliza seus itens independentemente no espaco vertical disponivel para aquela linha.

### align-items: flex-start (com wrap)

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  height: 400px;
}
```

Cada sub-container alinha seus itens no topo do seu espaco.

### align-items: flex-end (com wrap)

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  height: 400px;
}
```

Cada sub-container alinha seus itens na base do seu espaco.

## Demonstracao: align-content (eixo unificado)

### align-content: flex-start

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 400px;
}
```

Todas as linhas agrupadas no topo. Sem espaco entre elas.

### align-content: flex-end

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  height: 400px;
}
```

Todas as linhas agrupadas na base.

### align-content: center

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  height: 400px;
}
```

Todas as linhas agrupadas no centro vertical.

### align-content: space-between

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  height: 400px;
}
```

Primeira linha no topo, ultima na base, espaco distribuido entre elas.

### align-content: space-around

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  height: 400px;
}
```

Espaco ao redor de cada linha (metade do espaco nas bordas superior e inferior).

### align-content: space-evenly

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-evenly;
  height: 400px;
}
```

Espaco identico entre bordas e entre linhas.

## Variacao: combinando align-items e align-content

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;    /* sem efeito visivel quando align-content esta ativo */
  align-content: center;  /* domina o posicionamento */
  height: 400px;
}
```

Nota: align-content comprime as linhas, eliminando o espaco para align-items atuar.

## Caso pratico: galeria de cards responsiva

```css
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-content: flex-start;
  padding: 16px;
}

.card {
  width: 280px;
  min-height: 200px;
  border-radius: 8px;
  background: #f5f5f5;
}
```

Cards quebram linha automaticamente conforme a largura do viewport.

## Caso pratico: tags/badges que quebram linha

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  border-radius: 16px;
  background: #e0e7ff;
  font-size: 0.875rem;
  white-space: nowrap;
}
```

Tags fluem naturalmente, quebrando para a proxima linha quando necessario.