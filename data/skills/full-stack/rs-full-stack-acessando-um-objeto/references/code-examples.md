# Code Examples: Acessando Propriedades e Métodos de Objetos

## Objeto base usado nos exemplos

```javascript
const user = {
  email: "rodrigo@email.com",
  age: 20,
  name: {
    firstName: "Rodrigo",
    surname: "Gonçalves",
  },
  message: function () {
    console.log("Oi Rodrigo")
  },
}
```

## 1. Acessando propriedade simples com ponto

```javascript
console.log(user.email) // "rodrigo@email.com"
console.log(user.age)   // 20
```

Se o valor muda, o acesso reflete a mudança:
```javascript
user.email = "rodrigo.goncalves@email.com"
console.log(user.email) // "rodrigo.goncalves@email.com"
```

## 2. Acessando propriedade aninhada com ponto

```javascript
console.log(user.name.firstName) // "Rodrigo"
console.log(user.name.surname)   // "Gonçalves"
```

Passo a passo do que acontece:
1. `user` → retorna o objeto inteiro
2. `user.name` → retorna `{ firstName: "Rodrigo", surname: "Gonçalves" }`
3. `user.name.firstName` → retorna `"Rodrigo"`

## 3. Executando método do objeto

```javascript
user.message() // console exibe: "Oi Rodrigo"
```

Não precisa de `console.log()` ao redor se o método já tem um internamente:
```javascript
// ERRADO (duplica o output ou exibe undefined)
console.log(user.message()) // exibe "Oi Rodrigo" E depois "undefined"

// CORRETO
user.message() // exibe "Oi Rodrigo"
```

## 4. Notação de colchetes — mesmos exemplos

### Propriedade simples
```javascript
console.log(user["email"]) // "rodrigo@email.com"
```

### Propriedade aninhada
```javascript
console.log(user["name"]["firstName"]) // "Rodrigo"
```

### Executando método
```javascript
user["message"]() // console exibe: "Oi Rodrigo"
```

## 5. Quando colchetes são obrigatórios

### Chave dinâmica
```javascript
const propriedade = "email"
console.log(user[propriedade]) // "rodrigo@email.com"

// Com ponto NÃO funciona para chave dinâmica:
console.log(user.propriedade) // undefined (procura literal "propriedade")
```

### Iterando sobre propriedades
```javascript
const campos = ["email", "age"]
campos.forEach(campo => {
  console.log(user[campo])
})
// "rodrigo@email.com"
// 20
```

### Chave com caracteres especiais
```javascript
const config = {
  "api-url": "https://api.example.com",
  "max-retries": 3,
}

console.log(config["api-url"])     // funciona
// console.log(config.api-url)     // ERRO: interpreta como subtração
```

## 6. Comparação lado a lado

| Operação | Notação de ponto | Notação de colchetes |
|----------|-----------------|---------------------|
| Propriedade simples | `user.email` | `user["email"]` |
| Aninhado | `user.name.firstName` | `user["name"]["firstName"]` |
| Método | `user.message()` | `user["message"]()` |
| Chave dinâmica | N/A | `user[variavel]` |