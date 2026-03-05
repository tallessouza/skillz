# Code Examples: Align-Items no Flexbox

## Setup basico usado na aula

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

```css
.container {
  display: flex;
  height: 400px;
  background: #eee;
}

.item {
  width: 20px;
  background: #3498db;
  color: white;
}
```

## Todos os valores de align-items em row

### Stretch (padrao)

```css
.container {
  display: flex;
  height: 400px;
  align-items: stretch; /* Itens ocupam toda a altura */
}
```

### Flex Start

```css
.container {
  display: flex;
  height: 400px;
  align-items: flex-start; /* Itens colados no topo */
}
```

### Center

```css
.container {
  display: flex;
  height: 400px;
  align-items: center; /* Itens centralizados verticalmente */
}
```

### Flex End

```css
.container {
  display: flex;
  height: 400px;
  align-items: flex-end; /* Itens colados no fundo */
}
```

### Baseline

```css
.container {
  display: flex;
  height: 400px;
  align-items: baseline;
}

.item:nth-child(1) {
  font-size: 30px; /* Texto maior */
}

.item:nth-child(2) {
  font-size: 45px; /* Texto ainda maior */
}

.item:nth-child(3) {
  font-size: 16px; /* Texto padrao */
}
/* Resultado: todos alinhados pela base do texto, nao pelas bordas */
```

## Align-items com flex-direction: column

### Center em column (move horizontalmente)

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza horizontalmente agora */
}
```

### Flex End em column

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Itens a direita */
}
```

### Stretch em column — comportamento diferente

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* Se os itens tiverem width definida, stretch NAO estica */
.item {
  width: 20px; /* Esta propriedade impede o stretch horizontal */
}

/* Remova o width para o stretch funcionar: */
.item-sem-width {
  /* Sem width explicita — stretch preenche toda a largura */
}
```

## Caso pratico: centralizacao perfeita

```css
.container {
  display: flex;
  justify-content: center; /* Centraliza no eixo principal */
  align-items: center;     /* Centraliza no eixo cruzado */
  height: 100vh;
}
```

## Caso pratico: navbar com itens de tamanhos diferentes

```css
.navbar {
  display: flex;
  align-items: baseline; /* Textos alinhados pela base */
  gap: 16px;
}

.navbar-brand {
  font-size: 24px;
  font-weight: bold;
}

.navbar-link {
  font-size: 14px;
}
/* O logo e os links ficam alinhados pela base do texto */
```