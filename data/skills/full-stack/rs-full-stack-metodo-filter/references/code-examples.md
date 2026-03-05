# Code Examples: Método filter()

## Exemplo 1: Filtrando array de strings por tamanho

Direto da aula — filtrar palavras com mais de 3 caracteres:

```javascript
const words = ["JavaScript", "HTML", "CSS", "web"]

const result = words.filter(word => word.length > 3)

console.log(result) // ["JavaScript", "HTML"]
```

**Por que CSS e web não aparecem:** ambas têm exatamente 3 caracteres, e a condição é `> 3` (maior que), não `>= 3`.

### Variação: filtrar por tamanho >= 3
```javascript
const wordsWithThreeOrMore = words.filter(word => word.length >= 3)
// ["JavaScript", "HTML", "CSS", "web"]
```

### Variação: filtrar por conteúdo
```javascript
const wordsWithS = words.filter(word => word.includes("S"))
// ["CSS"] — case-sensitive

const wordsWithS_insensitive = words.filter(word => word.toLowerCase().includes("s"))
// ["JavaScript", "CSS"]
```

## Exemplo 2: Filtrando objetos por propriedade booleana

Direto da aula — filtrar produtos em promoção:

```javascript
const products = [
  { description: "teclado", price: 150, promotion: true },
  { description: "mouse", price: 70, promotion: false },
  { description: "monitor", price: 900, promotion: true },
]

const productsOnPromotion = products.filter(product => product.promotion === true)

console.log(productsOnPromotion)
// [
//   { description: "teclado", price: 150, promotion: true },
//   { description: "monitor", price: 900, promotion: true }
// ]
```

### Versão implícita (mesmo resultado, menos explícita)
```javascript
const productsOnPromotion = products.filter(product => product.promotion)
```

O instrutor mostra que ambas funcionam, mas mantém a versão explícita para clareza.

## Exemplo 3: Filtrando objetos por valor numérico

Direto da aula — filtrar produtos com preço menor que 100:

```javascript
const affordableProducts = products.filter(product => product.price < 100)

console.log(affordableProducts)
// [{ description: "mouse", price: 70, promotion: false }]
```

### Variações com comparações numéricas
```javascript
// Produtos acima de 100
const expensiveProducts = products.filter(product => product.price > 100)
// [teclado, monitor]

// Produtos entre 100 e 500
const midRangeProducts = products.filter(product => product.price >= 100 && product.price <= 500)
// [teclado]
```

## Exemplo 4: Combinando condições

Não mostrado diretamente na aula, mas extensão natural:

```javascript
// Produtos em promoção E com preço maior que 100
const premiumPromoProducts = products.filter(
  product => product.promotion === true && product.price > 100
)
// [monitor]
```

## Exemplo 5: Encadeando filter com outros métodos

```javascript
// Filtrar produtos em promoção e extrair só os nomes
const promoProductNames = products
  .filter(product => product.promotion === true)
  .map(product => product.description)
// ["teclado", "monitor"]
```

## Exemplo 6: Extraindo condição complexa para função nomeada

```javascript
function isAffordablePromoProduct(product) {
  return product.promotion === true && product.price < 200
}

const deals = products.filter(isAffordablePromoProduct)
// [{ description: "teclado", price: 150, promotion: true }]
```

## Padrão: filter retorna array vazio quando nada passa

```javascript
const freeProducts = products.filter(product => product.price === 0)
console.log(freeProducts) // []
console.log(freeProducts.length) // 0
```