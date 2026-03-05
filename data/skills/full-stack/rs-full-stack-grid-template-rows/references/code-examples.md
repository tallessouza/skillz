# Code Examples: Grid Template Rows

## Exemplo 1: Rows com valores mistos

```css
.app-grid {
  display: grid;
  grid-template-rows: 200px 1fr 2fr 1fr;
}
```

**Explicacao:** A primeira linha tem 200px fixos. As demais dividem o espaco restante em 4 fracoes (1+2+1=4). A segunda linha recebe 1/4, a terceira 2/4 (metade), a quarta 1/4.

**Problema:** Sem `height` definido, as fracoes colapsam para a altura do conteudo.

## Exemplo 2: Com altura de viewport

```css
.app-grid {
  display: grid;
  grid-template-rows: 200px 1fr 2fr 1fr;
  height: 100vh;
}
```

**Explicacao:** Agora o grid ocupa toda a viewport. A primeira linha usa 200px, restam `100vh - 200px` para distribuir entre as fracoes.

## Exemplo 3: Usando percentual

```css
.app-grid {
  display: grid;
  grid-template-rows: 200px 50%;
}
```

**Explicacao:** Primeira linha 200px, segunda linha 50% da altura do container. Se ha mais de 2 filhos, linhas adicionais recebem altura automatica.

## Exemplo 4: Combo columns + rows (grid 3x3)

```css
.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100vh;
}

body {
  margin: 0;
}
```

**Explicacao:** Grid simetrico 3x3 ocupando toda a viewport. Cada celula tem exatamente 1/3 da largura e 1/3 da altura.

## Exemplo 5: Combo columns + rows assimetrico

```css
.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 200px 1fr;
  height: 100vh;
}
```

**Explicacao:** 4 colunas iguais, mas a primeira linha tem 200px e a segunda ocupa todo o restante. Com 4 elementos, eles preenchem a primeira linha; com 8, preenchem ambas.

## Exemplo 6: Layout com header fixo e sidebar

```css
.app-grid {
  display: grid;
  grid-template-columns: 200px 150px 1fr;
  grid-template-rows: 200px 150px 1fr;
  height: 100vh;
}

body {
  margin: 0;
}
```

**Explicacao:** Tres colunas (200px, 150px, flexivel) e tres linhas (200px, 150px, flexivel). Cria um "molde" para layouts com header, sidebar e area de conteudo.

## Exemplo 7: Grid com borda para debug

```css
.app-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100vh;
  border: 2px solid green; /* Debug: visualizar limites do grid */
}
```

**Dica:** Use bordas ou o DevTools (F12) para visualizar a grade durante o desenvolvimento. No DevTools, selecione o elemento grid para ver as linhas numeradas.

## Variacoes uteis

### Auto-fill vs valores explicitos

```css
/* Explicito: sempre 3 rows */
grid-template-rows: repeat(3, 1fr);

/* Parcial: define 2, resto automatico */
grid-template-rows: 100px 200px;
/* Linhas 3+ serao auto (altura do conteudo) */
```

### Combinando unidades

```css
/* Header fixo + conteudo + footer fixo */
grid-template-rows: 80px 1fr 60px;

/* Hero grande + secoes iguais */
grid-template-rows: 400px repeat(3, 1fr);

/* Tudo proporcional mas desigual */
grid-template-rows: 1fr 2fr 1fr;
```