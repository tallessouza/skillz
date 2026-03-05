# Code Examples: Template Literals

## Exemplo 1: Montagem basica (da aula)

```javascript
let username = "Rodrigo"
let email = "rodrigo@email.com"

// Concatenacao tradicional
let message = "Ola, " + username + ". Voce conectou com o email " + email
console.log(message)
// Output: Ola, Rodrigo. Voce conectou com o email rodrigo@email.com

// Template literal (mesmo resultado, codigo mais limpo)
console.log(`Ola, ${username}. Voce conectou com o email ${email}`)
// Output: Ola, Rodrigo. Voce conectou com o email rodrigo@email.com
```

## Exemplo 2: console.log com multiplos parametros

```javascript
console.log(username, email)
// Output: Rodrigo rodrigo@email.com

console.log(username, email, "teste")
// Output: Rodrigo rodrigo@email.com teste
```

## Exemplo 3: Cuidado com espacos na concatenacao

```javascript
// Sem espaco — valores ficam colados
let msg = "Ola," + username + "voce conectou com o email" + email
// Output: Ola,Rodrigovoce conectou com o emailrodrigo@email.com

// Com espacos manuais
let msg = "Ola, " + username + " voce conectou com o email " + email
// Output: Ola, Rodrigo voce conectou com o email rodrigo@email.com

// Template literal — espacos ficam naturais no texto
let msg = `Ola, ${username} voce conectou com o email ${email}`
// Output: Ola, Rodrigo voce conectou com o email rodrigo@email.com
```

## Exemplo 4: Expressoes dentro de ${}

```javascript
const a = 10
const b = 20
console.log(`A soma de ${a} + ${b} e ${a + b}`)
// Output: A soma de 10 + 20 e 30
```

## Exemplo 5: Chamada de funcao dentro de ${}

```javascript
const name = "rodrigo"
console.log(`Nome: ${name.toUpperCase()}`)
// Output: Nome: RODRIGO
```

## Exemplo 6: String multilinha

```javascript
const card = `
  Nome: ${username}
  Email: ${email}
  Status: Ativo
`
console.log(card)
// Output:
//   Nome: Rodrigo
//   Email: rodrigo@email.com
//   Status: Ativo
```

## Exemplo 7: Uso em funcoes (cenario real)

```javascript
function welcomeMessage(user) {
  return `Bem-vindo, ${user.name}! Seu email cadastrado e ${user.email}.`
}

const user = { name: "Rodrigo", email: "rodrigo@email.com" }
console.log(welcomeMessage(user))
// Output: Bem-vindo, Rodrigo! Seu email cadastrado e rodrigo@email.com.
```

## Comparacao lado a lado

| Abordagem | Codigo |
|-----------|--------|
| Concatenacao | `"Ola, " + name + ". Email: " + email` |
| Template literal | `` `Ola, ${name}. Email: ${email}` `` |
| console.log params | `console.log("Ola,", name, "Email:", email)` |