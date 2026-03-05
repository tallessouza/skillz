# Code Examples: Criando Objetos em JavaScript

## 1. Objeto vazio

```javascript
// Criando um objeto vazio com chaves
const obj = {}

// Verificando o conteudo
console.log(obj)        // {}

// Verificando o tipo
console.log(typeof obj) // "object"
```

## 2. Objeto com propriedades simples

```javascript
const user = {
  email: "rodrigo@email.com",
  age: 18
}
```

**Variacao — diferentes tipos de valor:**
```javascript
const product = {
  name: "Notebook",
  price: 2999.90,
  in_stock: true,
  tags: ["eletronico", "informatica"]
}
```

## 3. Propriedades aninhadas — nome composto

```javascript
const user = {
  name: {
    first_name: "Rodrigo",
    surname: "Gonçalves"
  },
  email: "rodrigo@email.com",
  age: 18
}
```

## 4. Propriedades aninhadas — endereco completo

```javascript
const user = {
  email: "rodrigo@email.com",
  age: 18,
  name: {
    first_name: "Rodrigo",
    surname: "Gonçalves"
  },
  address: {
    street: "Rua X",
    number: 23,
    city: "São Paulo",
    postal_code: "12345-123"
  }
}
```

**Variacao — endereco mais completo:**
```javascript
const user = {
  address: {
    street: "Av Paulista",
    number: 1000,
    complement: "Sala 501",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    country: "Brasil",
    postal_code: "01310-100"
  }
}
```

## 5. Metodos no objeto

```javascript
const user = {
  email: "rodrigo@email.com",
  age: 18,
  name: {
    first_name: "Rodrigo",
    surname: "Gonçalves"
  },
  address: {
    street: "Rua X",
    number: 23,
    city: "São Paulo",
    postal_code: "12345-123"
  },
  message: () => {
    console.log("Oi Rodrigo")
  }
}
```

**Variacao — metodo com funcao anonima:**
```javascript
const user = {
  message: function() {
    console.log("Oi Rodrigo")
  }
}
```

**Variacao — metodo shorthand (ES6):**
```javascript
const user = {
  message() {
    console.log("Oi Rodrigo")
  }
}
```

## 6. Objeto completo do instrutor (codigo final da aula)

```javascript
const user = {
  email: "rodrigo@email.com",
  age: 18,
  name: {
    first_name: "Rodrigo",
    surname: "Gonçalves"
  },
  address: {
    street: "Rua X",
    number: 23,
    city: "São Paulo",
    postal_code: "12345-123"
  },
  message: () => {
    console.log("Oi Rodrigo")
  }
}
```

## 7. Padroes de nomenclatura lado a lado

```javascript
// camelCase — para variaveis
const firstName = "Rodrigo"
const postalCode = "12345-123"

// snake_case — para propriedades de objeto
const user = {
  first_name: "Rodrigo",
  postal_code: "12345-123"
}
```