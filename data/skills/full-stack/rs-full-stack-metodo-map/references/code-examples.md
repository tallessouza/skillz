# Code Examples: Método map()

## Exemplo 1: Percorrendo itens (basico)

```javascript
const products = ['teclado', 'mouse', 'monitor']

// Percorrendo e exibindo cada item
products.map(product => console.log(product))
// Output: teclado, mouse, monitor

// NOTA: este uso é valido para demonstracao, mas em producao
// use forEach quando nao precisa do retorno
```

## Exemplo 2: Sintese reduzida

```javascript
const products = ['teclado', 'mouse', 'monitor']

// Sem chaves — retorno implicito
products.map(product => console.log(product))
// Equivalente ao exemplo com chaves, porem mais conciso
```

## Exemplo 3: Transformar para maiusculas (novo array)

```javascript
const products = ['teclado', 'mouse', 'monitor']

const formatted = products.map(product => product.toUpperCase())

console.log(formatted)
// ['TECLADO', 'MOUSE', 'MONITOR']
```

**Pontos-chave:**
- `formatted` é um **novo array**, `products` permanece inalterado
- `toUpperCase()` é chamado em cada string individualmente
- Resultado armazenado em variavel com nome descritivo

## Exemplo 4: Construindo array de objetos

```javascript
const products = ['teclado', 'mouse', 'monitor']

const formatted = products.map(product => ({
  description: product,
  id: Math.random(),
}))

console.log(formatted)
// [
//   { description: 'teclado', id: 0.123... },
//   { description: 'mouse', id: 0.456... },
//   { description: 'monitor', id: 0.789... },
// ]
```

**Pontos-chave:**
- Parenteses ao redor do objeto `({})` sao obrigatorios na sintese reduzida
- Cada item do array original vira a propriedade `description`
- `Math.random()` gera ID unico para cada objeto
- O array resultante tem a mesma quantidade de itens que o original

## Variacoes praticas

### Com index (segundo parametro)

```javascript
const products = ['teclado', 'mouse', 'monitor']

const withIndex = products.map((product, index) => ({
  id: index + 1,
  name: product,
}))
// [{ id: 1, name: 'teclado' }, { id: 2, name: 'mouse' }, { id: 3, name: 'monitor' }]
```

### Extraindo propriedade de objetos

```javascript
const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
]

const names = users.map(user => user.name)
// ['Alice', 'Bob']
```

### Transformacao com logica condicional

```javascript
const prices = [100, 250, 50, 300]

const adjustedPrices = prices.map(price => {
  if (price > 200) {
    return price * 0.9 // 10% desconto
  }
  return price
})
// [100, 225, 50, 270]
```

### Encadeamento map + filter

```javascript
const products = ['teclado', 'mouse', 'monitor']

const result = products
  .map(product => product.toUpperCase())
  .filter(product => product.length > 5)
// ['TECLADO', 'MONITOR']
```

### Uso em React (caso real mais comum)

```tsx
const products = ['teclado', 'mouse', 'monitor']

function ProductList() {
  return (
    <ul>
      {products.map(product => (
        <li key={product}>{product}</li>
      ))}
    </ul>
  )
}
```