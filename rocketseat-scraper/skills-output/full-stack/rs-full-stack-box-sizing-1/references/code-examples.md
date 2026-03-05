# Code Examples: Box Sizing

## 1. Reset global (padrao da industria)

```css
/* Aplique no topo do seu CSS — todo framework moderno faz isso */
*, *::before, *::after {
  box-sizing: border-box;
}
```

## 2. Demonstracao content-box vs border-box

```html
<div class="parent">
  <div class="content-box-example">Content Box</div>
  <div class="border-box-example">Border Box</div>
</div>
```

```css
.parent {
  width: 300px;
  background: #eee;
  padding: 10px;
}

/* Content-box: largura real = 300 + 80 + 4 = 384px — TRANSBORDA */
.content-box-example {
  box-sizing: content-box; /* padrao */
  width: 300px;
  padding: 40px;
  border: 2px solid red;
  background: salmon;
}

/* Border-box: largura real = 300px — CONTIDO */
.border-box-example {
  box-sizing: border-box;
  width: 300px;
  padding: 40px;
  border: 2px solid green;
  background: lightgreen;
}
```

## 3. Caso classico: width 100% + padding

```css
/* PROBLEMA: transborda o container pai */
.sidebar {
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  /* Largura = 100% + 40px + 2px */
}

/* SOLUCAO: border-box */
.sidebar {
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  /* Largura = 100% (tudo incluso) */
}
```

## 4. Exemplo do instrutor: padding 40px com border-box

```css
.box {
  width: 200px;
  height: 200px;
  padding: 40px;
  border: 1px solid black;
  box-sizing: border-box;
  /* 
    Largura total: 200px (de borda a borda)
    Espaco do conteudo: 200 - 80 (padding) - 2 (border) = 118px
  */
}
```

## 5. Diagnostico no DevTools

Para investigar overflow:

1. F12 → Inspecionar elemento
2. Aba **Computed** → verificar width real
3. Visualizar o box model (mostra content, padding, border, margin)
4. Filtrar por "width" para ver o valor computado
5. Se width computado > width declarado → box-sizing e content-box e padding/border estao somando

## 6. Variacao: grid/flex com padding

```css
/* Mesmo em layouts modernos, border-box e essencial */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.grid-item {
  padding: 24px;
  border: 2px solid #333;
  box-sizing: border-box;
  /* Sem border-box, cada item transbordaria sua coluna */
}
```

## 7. Elementos inline — comportamento diferente

```css
/* Box-sizing NAO afeta width/height de elementos inline */
span {
  padding: 20px;
  background: yellow;
  /* O padding faz o span crescer visualmente,
     mas inline nao tem width/height — box-sizing irrelevante */
}

/* Se precisar controlar, mude o display */
span.controllable {
  display: inline-block;
  box-sizing: border-box;
  width: 150px;
  padding: 20px;
  /* Agora sim, border-box controla o calculo */
}
```