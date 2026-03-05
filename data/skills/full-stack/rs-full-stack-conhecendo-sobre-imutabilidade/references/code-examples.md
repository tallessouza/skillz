# Code Examples: Imutabilidade em JavaScript

## Exemplo 1: O problema da referencia (direto da aula)

```javascript
// Criando objeto original
const address1 = { street: "Avenida Brasil", number: 20 }

// ERRADO: isso NAO cria uma copia
const address2 = address1

// Modificando address2
address2.number = 30

// Surpresa: address1 tambem mudou!
console.log(address1.number) // 30 (nao 20!)
console.log(address2.number) // 30
console.log(address1 === address2) // true — sao o mesmo objeto
```

## Exemplo 2: Solucao com spread operator (direto da aula)

```javascript
const address1 = { street: "Avenida Brasil", number: 20 }

// CORRETO: spread cria novo objeto na memoria
const address2 = { ...address1, number: 30 }

console.log(address1.number) // 20 (preservado!)
console.log(address2.number) // 30
console.log(address1 === address2) // false — objetos diferentes
```

## Exemplo 3: Arrays — mesmo problema, mesma solucao

```javascript
// ERRADO: referencia
const fruits = ["maca", "banana", "laranja"]
const copy = fruits
copy.push("uva")
console.log(fruits) // ["maca", "banana", "laranja", "uva"] — mutou o original!

// CORRETO: spread
const fruits2 = ["maca", "banana", "laranja"]
const withGrape = [...fruits2, "uva"]
console.log(fruits2) // ["maca", "banana", "laranja"] — preservado
console.log(withGrape) // ["maca", "banana", "laranja", "uva"]
```

## Exemplo 4: Removendo item de array sem mutar

```javascript
const users = ["Ana", "Bruno", "Carlos"]

// ERRADO: splice muta o array original
// users.splice(1, 1)

// CORRETO: filter cria novo array
const withoutBruno = users.filter(user => user !== "Bruno")
console.log(users) // ["Ana", "Bruno", "Carlos"] — preservado
console.log(withoutBruno) // ["Ana", "Carlos"]
```

## Exemplo 5: Atualizando item especifico em array

```javascript
const products = [
  { id: 1, name: "Camiseta", price: 50 },
  { id: 2, name: "Calca", price: 100 },
  { id: 3, name: "Tenis", price: 200 },
]

// Atualizar preco do produto id 2
const updated = products.map(product =>
  product.id === 2
    ? { ...product, price: 120 }
    : product
)

console.log(products[1].price) // 100 — preservado
console.log(updated[1].price)  // 120
```

## Exemplo 6: React useState com objeto

```javascript
import { useState } from "react"

function UserProfile() {
  const [user, setUser] = useState({
    name: "Ana",
    age: 25,
    city: "Sao Paulo"
  })

  function handleBirthday() {
    // ERRADO: mutar diretamente
    // user.age = user.age + 1
    // setUser(user) — React nao re-renderiza!

    // CORRETO: novo objeto via spread
    setUser({ ...user, age: user.age + 1 })
  }

  return (
    <div>
      <p>{user.name}, {user.age} anos</p>
      <button onClick={handleBirthday}>Aniversario!</button>
    </div>
  )
}
```

## Exemplo 7: React useState com array

```javascript
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Estudar JS", done: false },
    { id: 2, text: "Fazer exercicio", done: false },
  ])

  function addTodo(text) {
    const newTodo = { id: Date.now(), text, done: false }
    setTodos([...todos, newTodo])
  }

  function toggleTodo(id) {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, done: !todo.done }
        : todo
    ))
  }

  function removeTodo(id) {
    setTodos(todos.filter(todo => todo.id !== id))
  }
}
```

## Exemplo 8: Objetos aninhados — cuidado com shallow copy

```javascript
const company = {
  name: "Skillz",
  address: {
    city: "Porto Alegre",
    state: "RS"
  }
}

// ERRADO: spread raso — address ainda e referencia
const copy = { ...company }
copy.address.city = "Sao Paulo"
console.log(company.address.city) // "Sao Paulo" — mutou!

// CORRETO: spread em cada nivel
const safeCopy = {
  ...company,
  address: { ...company.address, city: "Sao Paulo" }
}
console.log(company.address.city) // "Porto Alegre" — preservado

// ALTERNATIVA: structuredClone (deep copy completa)
const deepCopy = structuredClone(company)
deepCopy.address.city = "Curitiba"
console.log(company.address.city) // "Porto Alegre" — preservado
```

## Exemplo 9: Comparacao rasa na pratica

```javascript
const obj1 = { name: "Ana" }
const obj2 = obj1           // referencia
const obj3 = { ...obj1 }    // copia

// Comparacao rasa (o que React faz)
console.log(obj1 === obj2)  // true — mesma referencia
console.log(obj1 === obj3)  // false — objetos diferentes

// Por isso React re-renderiza com spread mas nao com mutacao direta
```

## Tabela resumo: metodos mutaveis vs imutaveis

| Operacao | Mutavel (evitar) | Imutavel (preferir) |
|----------|-------------------|---------------------|
| Adicionar ao array | `arr.push(item)` | `[...arr, item]` |
| Remover do array | `arr.splice(i, 1)` | `arr.filter(...)` |
| Atualizar no array | `arr[i] = val` | `arr.map(...)` |
| Adicionar prop ao objeto | `obj.key = val` | `{ ...obj, key: val }` |
| Remover prop do objeto | `delete obj.key` | `const { key, ...rest } = obj` |
| Atualizar prop do objeto | `obj.key = newVal` | `{ ...obj, key: newVal }` |