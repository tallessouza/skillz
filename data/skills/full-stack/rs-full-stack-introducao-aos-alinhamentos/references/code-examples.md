# Code Examples: Alinhamento no CSS Grid

## Exemplo 1: Matriz completa de propriedades

```css
/* === CONTAINER (pai) === */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  width: 500px;
  height: 500px;

  /* --- content: posiciona o grid inteiro --- */
  align-content: center;       /* grid centralizado verticalmente */
  justify-content: center;     /* grid centralizado horizontalmente */
  /* shorthand: place-content: center; */

  /* --- items: posiciona itens dentro das celulas --- */
  align-items: stretch;        /* itens esticam verticalmente (padrao) */
  justify-items: stretch;      /* itens esticam horizontalmente (padrao) */
  /* shorthand: place-items: stretch; */
}

/* === ITEM (filho) === */
.grid-item-especial {
  /* --- self: sobrescreve o alinhamento deste item --- */
  align-self: end;             /* este item vai pro fim da celula */
  justify-self: center;        /* este item centraliza horizontalmente */
  /* shorthand: place-self: end / center; */
}
```

## Exemplo 2: Centralizar tudo (caso mais comum)

```css
.container {
  display: grid;
  min-height: 100vh;
  place-content: center;  /* grid inteiro centralizado */
  place-items: center;    /* itens centralizados nas celulas */
}
```

## Exemplo 3: content vs items — diferenca visual

```css
/* Cenario: grid menor que o container */
.container {
  display: grid;
  grid-template-columns: 100px 100px;
  grid-template-rows: 100px 100px;
  width: 600px;
  height: 600px;
  gap: 10px;
}

/* Variacao A: so content */
.container-a {
  justify-content: center;  /* as 2 colunas ficam centralizadas no espaco de 600px */
  align-content: end;       /* as 2 linhas ficam no fim dos 600px */
}

/* Variacao B: so items */
.container-b {
  justify-items: center;    /* texto/conteudo centralizado dentro de cada 100px */
  align-items: end;         /* texto/conteudo no fim de cada celula de 100px */
}

/* Variacao C: ambos */
.container-c {
  place-content: center;    /* grid centralizado no espaco */
  place-items: center;      /* itens centralizados nas celulas */
}
```

## Exemplo 4: self para excecao individual

```html
<div class="grid">
  <div class="item">A</div>
  <div class="item">B</div>
  <div class="item destaque">C</div>
  <div class="item">D</div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, 200px);
  grid-template-rows: repeat(2, 200px);
  place-items: center;  /* todos centralizados */
}

.destaque {
  place-self: end;  /* so este item vai pro canto inferior direito da celula */
}
```

## Exemplo 5: Valores possiveis

```css
/* Valores para content (distribuicao de espaco): */
.container {
  align-content: start | end | center | stretch | space-between | space-around | space-evenly;
  justify-content: start | end | center | stretch | space-between | space-around | space-evenly;
}

/* Valores para items e self (posicao na celula): */
.container {
  align-items: start | end | center | stretch | baseline;
  justify-items: start | end | center | stretch;
}

.item {
  align-self: start | end | center | stretch | baseline;
  justify-self: start | end | center | stretch;
}
```

## Exemplo 6: Layout real — header, main, footer

```css
.page {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;

  /* content nao necessario aqui — grid ocupa 100% */
  /* items para alinhar conteudo dentro de cada area */
  justify-items: center;
}

.header {
  justify-self: stretch;  /* header ocupa toda a largura */
}

.main {
  place-self: center;  /* conteudo principal centralizado */
  max-width: 800px;
}

.footer {
  justify-self: stretch;
  align-self: end;
}
```