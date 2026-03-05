# Code Examples: Imutabilidade em JavaScript

## Exemplo 1: Referencia de objetos (o problema)

```javascript
const address1 = {
  street: 'Avenida Brasil',
  number: 20
}

const address2 = address1 // REFERENCIA, nao copia!

address2.number = 30

console.log(address1, address2)
// Ambos mostram { street: 'Avenida Brasil', number: 30 }
// address1 foi alterado indiretamente!
```

**Por que:** `address2 = address1` copia o endereco de memoria, nao o objeto. Ambas variaveis apontam para o mesmo objeto.

## Exemplo 2: Copia com spread (opcao 1)

```javascript
const address1 = {
  street: 'Avenida Brasil',
  number: 20
}

// Criando um novo objeto utilizando as propriedades e valores de address1
const address2 = { ...address1 }

address2.number = 30

console.log(address1) // { street: 'Avenida Brasil', number: 20 } — intacto!
console.log(address2) // { street: 'Avenida Brasil', number: 30 } — so ele mudou
```

## Exemplo 3: Copia com override inline (opcao 2)

```javascript
const address1 = {
  street: 'Avenida Brasil',
  number: 20
}

// Copia + override em uma unica expressao
const address2 = { ...address1, number: 30 }

console.log(address1) // { street: 'Avenida Brasil', number: 20 }
console.log(address2) // { street: 'Avenida Brasil', number: 30 }
```

## Exemplo 4: Ordem importa — override ANTES do spread (errado)

```javascript
const address1 = {
  street: 'Avenida Brasil',
  number: 20
}

// ERRADO: number vem antes do spread
const address2 = { number: 30, ...address1 }

console.log(address2) // { number: 20, street: 'Avenida Brasil' }
// number ficou 20 porque o spread de address1 sobrescreveu!
```

## Exemplo 5: Referencia de arrays (o problema)

```javascript
const list1 = ['apple', 'banana']

const list2 = list1 // REFERENCIA!

list2.push('watermelon')

console.log(list1) // ['apple', 'banana', 'watermelon'] — alterou o original!
console.log(list2) // ['apple', 'banana', 'watermelon']
```

## Exemplo 6: Copia de array com spread

```javascript
const list1 = ['apple', 'banana']

const list2 = [...list1]

list2.push('watermelon')

console.log(list1) // ['apple', 'banana'] — intacto!
console.log(list2) // ['apple', 'banana', 'watermelon']
```

## Exemplo 7: Copia de array com item inline

```javascript
const list1 = ['apple', 'banana']

const list2 = [...list1, 'watermelon']

console.log(list1) // ['apple', 'banana']
console.log(list2) // ['apple', 'banana', 'watermelon']
```

## Variacoes adicionais

### Removendo propriedade ao copiar (destructuring + rest)

```javascript
const user = { name: 'João', password: '123', email: 'j@j.com' }
const { password, ...safeUser } = user
// safeUser = { name: 'João', email: 'j@j.com' }
```

### Atualizando item em array sem mutar

```javascript
const items = ['apple', 'banana', 'cherry']
const updated = items.map(item => item === 'banana' ? 'mango' : item)
// ['apple', 'mango', 'cherry'] — array novo
```

### Removendo item de array sem mutar

```javascript
const items = ['apple', 'banana', 'cherry']
const without = items.filter(item => item !== 'banana')
// ['apple', 'cherry'] — array novo
```

### Objeto aninhado — spread em dois niveis

```javascript
const user = {
  name: 'João',
  address: { street: 'Av Brasil', number: 20 }
}

const updated = {
  ...user,
  address: { ...user.address, number: 30 }
}
// user.address.number continua 20
// updated.address.number e 30
```