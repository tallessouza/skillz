# Code Examples: Layouts e Evolucao CSS

## 1. Normal Flow — Block e Inline

```html
<!-- Block: empilham verticalmente -->
<div>Texto 1</div>
<div>Texto 2</div>

<!-- Inline: ficam na mesma linha -->
<div>
  <span>Continuacao</span>
  <span>do texto</span>
</div>
```

Resultado: as divs ficam uma abaixo da outra (block). Os spans ficam lado a lado (inline), mesmo que no HTML parecam em linhas separadas.

## 2. Table — Linhas e Colunas

```html
<table>
  <tr>
    <td>Conteudo</td>
    <td>Outro</td>
  </tr>
  <tr>
    <td>Conteudo abaixo</td>
    <td>Conteudo ao lado</td>
  </tr>
</table>
```

`<tr>` define uma linha, `<td>` define uma celula/coluna. Forma uma grade tabular.

## 3. Tableless — Float (legado)

```html
<div style="float: left;">Conteudo</div>
<div style="float: right;">Outro conteudo</div>
<div style="clear: both;">Mais conteudo</div>
```

### O problema demonstrado pelo instrutor

Sem o `clear: both`, o terceiro elemento sobe e fica entre os dois flutuantes, quebrando o layout. O `clear: both` forca o retorno ao normal flow.

### Variacao: ambos a esquerda
```css
.col1 { float: left; }
.col2 { float: left; }  /* cola ao lado do col1 */
.footer { clear: both; } /* volta ao normal flow */
```

## 4. Flexbox — Container e Itens

### Exemplo basico da aula
```html
<div class="container">
  <span>1</span>
  <div>2</div>
  <span>3</span>
  <span>4</span>
</div>
```

```css
.container {
  display: flex;
}
```

Resultado: TODOS os filhos ficam em linha (flex items), independente de serem span (inline) ou div (block).

### Alinhamento centralizado
```css
.container {
  display: flex;
  justify-content: center;
}
```

### Espaco ao redor
```css
.container {
  display: flex;
  justify-content: space-around;
}
```

### Mudar para coluna
```css
.container {
  display: flex;
  flex-direction: column;
}
```

Resultado: itens empilham verticalmente, mas com todas as propriedades de alinhamento do flex disponiveis.

## 5. Grid — Colunas e Linhas

### Exemplo basico da aula
```html
<div class="grid">
  <span>1</span>
  <div>2</div>
  <span>3</span>
  <span>4</span>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: 20px 20px;
}
```

Resultado: 2 colunas de 20px. Itens 1 e 2 na primeira linha, 3 e 4 na segunda linha. A grade e formada automaticamente.

### Variacoes praticas

```css
/* Colunas responsivas */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 colunas iguais */
  gap: 1rem;
}

/* Colunas com tamanhos diferentes */
.grid {
  display: grid;
  grid-template-columns: 250px 1fr;  /* sidebar fixa + conteudo flexivel */
}

/* Areas nomeadas */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
```

## 6. Comparacao lado a lado

### Mesma tarefa: dois elementos lado a lado

**Float (legado):**
```css
.item1 { float: left; width: 50%; }
.item2 { float: left; width: 50%; }
.parent::after { content: ''; display: table; clear: both; } /* clearfix hack */
```

**Flexbox (moderno):**
```css
.parent { display: flex; gap: 1rem; }
.item1 { flex: 1; }
.item2 { flex: 1; }
```

**Grid (moderno):**
```css
.parent { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
```

A diferenca em legibilidade e previsibilidade e clara. Flex e grid fazem o mesmo com menos codigo e sem hacks.