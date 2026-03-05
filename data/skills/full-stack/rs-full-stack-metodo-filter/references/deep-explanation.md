# Deep Explanation: Método filter()

## Conceito fundamental

O `filter()` é um método de arrays que percorre cada elemento, aplica uma função de callback como condição, e retorna um **novo array** contendo apenas os elementos onde a condição retornou `true`. O array original permanece intacto.

Isso é a base da programação funcional com arrays: ao invés de criar loops manuais com `for` e `if` para construir um novo array, você declara a condição e o `filter()` cuida da iteração.

## Como o filter() funciona internamente

1. Recebe uma função de callback como argumento
2. Executa essa função para **cada item** do array
3. Se a função retorna `true` (ou valor truthy), o item entra no novo array
4. Se retorna `false` (ou falsy), o item é descartado
5. Retorna o novo array com os itens que passaram

## Estratégia de nomenclatura do instrutor

O instrutor destaca uma estratégia pessoal importante: **o array fica no plural e o item do callback no singular**. Isso cria uma leitura natural:

```javascript
words.filter(word => word.length > 3)
// "das words, filtre cada word onde word.length > 3"

products.filter(product => product.promotion === true)
// "dos products, filtre cada product onde product.promotion é true"
```

Essa convenção funciona como documentação inline — o código se lê como uma frase.

## Comparação explícita vs implícita

O instrutor demonstra que `product.promotion === true` e `product.promotion` produzem o mesmo resultado quando a propriedade é booleana. Ele mostra os dois e conscientemente escolhe manter a versão explícita "para ficar bem claro o que a gente está fazendo nessa verificação".

A versão implícita funciona por causa da coerção truthy/falsy do JavaScript, mas a explícita comunica a intenção de forma inequívoca — especialmente importante para desenvolvedores iniciantes ou ao ler código meses depois.

## filter() com primitivos vs objetos

O instrutor mostra dois cenários distintos:

**Primitivos (strings):** A condição opera diretamente no valor do item.
```javascript
words.filter(word => word.length > 3)
```

**Objetos:** A condição acessa propriedades do objeto. Isso é o caso mais comum em aplicações reais — filtrar listas de produtos, usuários, pedidos, etc.
```javascript
products.filter(product => product.promotion === true)
products.filter(product => product.price < 100)
```

## Caso de uso real mencionado

O instrutor menciona explicitamente o caso de **filtro de produtos em promoção** como exemplo prático de e-commerce. Esse é um padrão universal: qualquer listagem com filtros (preço, categoria, disponibilidade, promoção) usa `filter()` por baixo.

## Retorno como novo array

O instrutor enfatiza que filter() **retorna um novo array**. Isso é crucial porque:
- O array original não é modificado (imutabilidade)
- Você pode encadear operações: `arr.filter(...).map(...)`
- O resultado pode ter 0 elementos (array vazio), todos os elementos, ou qualquer quantidade intermediária