# Code Examples: Container, Itens e Eixo

## Exemplo 1: Normal flow vs Flex

### HTML base (usado em todos os exemplos)

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

### Normal flow (sem flex)

```css
.container {
  /* Sem display: flex */
  background: #333;
}

.item {
  background: purple;
  padding: 20px;
  margin: 5px;
  color: white;
}
```

**Resultado:** Cada item ocupa 100% da largura, empilhados verticalmente.

### Com display: flex

```css
.container {
  display: flex;
  background: #333;
}

.item {
  background: purple;
  padding: 20px;
  margin: 5px;
  color: white;
}
```

**Resultado:** Itens ficam lado a lado. Tamanho ajustado ao conteudo. Main axis horizontal (esquerda → direita).

## Exemplo 2: flex-direction row (padrao)

```css
.container {
  display: flex;
  flex-direction: row; /* padrao, pode omitir */
}
```

**Main axis:** horizontal, esquerda → direita
**Cross axis:** vertical, cima → baixo
**Ordem visual:** 1 | 2 | 3 | 4

## Exemplo 3: flex-direction column

```css
.container {
  display: flex;
  flex-direction: column;
}
```

**Main axis:** vertical, cima → baixo
**Cross axis:** horizontal, esquerda → direita
**Ordem visual:** Itens empilhados verticalmente (similar ao normal flow, mas agora dentro do contexto flex — propriedades como `justify-content` e `align-items` funcionam)

## Exemplo 4: flex-direction row-reverse

```css
.container {
  display: flex;
  flex-direction: row-reverse;
}
```

**Main axis:** horizontal, direita → esquerda (invertido)
**Cross axis:** vertical, cima → baixo
**Ordem visual:** 4 | 3 | 2 | 1 (itens alinham a partir da direita)

## Exemplo 5: flex-direction column-reverse

```css
.container {
  display: flex;
  flex-direction: column-reverse;
}
```

**Main axis:** vertical, baixo → cima (invertido)
**Cross axis:** horizontal, esquerda → direita
**Ordem visual:** Item 4 no topo, item 1 na base (start ficou embaixo, end ficou em cima)

## Variacoes praticas

### Navbar horizontal

```css
.navbar {
  display: flex;
  /* row e padrao — itens do menu ficam lado a lado */
}
```

### Sidebar vertical

```css
.sidebar {
  display: flex;
  flex-direction: column;
  /* Itens do menu empilham verticalmente */
}
```

### Lista invertida (mensagens de chat)

```css
.chat-messages {
  display: flex;
  flex-direction: column-reverse;
  /* Mensagens mais recentes aparecem embaixo (start = bottom) */
}
```