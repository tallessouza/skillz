# Code Examples: Strings em JavaScript

## Exemplo 1: Criando uma string e verificando o tipo

Diretamente da aula — criacao basica de variavel string e uso do `typeof`:

```javascript
let userName = "Rodrigo"
console.log(userName)        // Output: Rodrigo
console.log(typeof userName) // Output: string
```

### Variacoes

```javascript
// Com aspas simples — mesmo resultado
let userName = 'Rodrigo'
console.log(typeof userName) // string

// Com template literal — mesmo resultado
let userName = `Rodrigo`
console.log(typeof userName) // string
```

## Exemplo 2: String com aspas duplas

```javascript
console.log("Uma String com aspas")
```

## Exemplo 3: String com aspas simples (apostrofos)

```javascript
console.log('Uma String com apostrofos (aspas simples)')
```

## Exemplo 4: Aspas duplas dentro de aspas simples

Da aula — quando o texto precisa exibir aspas duplas:

```javascript
console.log('Uma String com "aspas duplas" dentro de simples')
```

### O que NAO fazer:

```javascript
// ERRO: o parser se perde
console.log("Uma String com "aspas duplas" dentro")
// SyntaxError: Unexpected identifier
```

## Exemplo 5: Aspas simples dentro de aspas duplas

```javascript
console.log("Uma String com 'aspas simples' dentro de dupla")
```

### O que NAO fazer:

```javascript
// ERRO: mesmo problema, delimitador conflitante
console.log('Uma String com 'aspas simples' dentro')
// SyntaxError: Unexpected identifier
```

## Exemplo 6: Template literal (acento grave) com multiplas linhas

Da aula — demonstracao de que a crase preserva formatacao:

```javascript
console.log(`Uma String com acento grave
permite escrever
multiplas linhas`)
```

Output:
```
Uma String com acento grave
permite escrever
multiplas linhas
```

### O que NAO fazer:

```javascript
// ERRO: aspas duplas nao permitem quebra de linha
console.log("linha 1
linha 2")
// SyntaxError: Invalid or unexpected token

// ERRO: aspas simples tambem nao
console.log('linha 1
linha 2')
// SyntaxError: Invalid or unexpected token
```

## Exemplo 7: Interpolacao com template literals

Extensao natural do conceito da aula:

```javascript
const userName = "Rodrigo"
console.log(`Bem-vindo, ${userName}!`)
// Output: Bem-vindo, Rodrigo!

// Sem template literal (menos legivel):
console.log("Bem-vindo, " + userName + "!")
```

## Exemplo 8: Cenario real — HTML com aspas

```javascript
// HTML usa aspas duplas nos atributos
const button = '<button class="primary">Enviar</button>'

// Ou com template literal para multiline
const card = `
<div class="card">
  <h2 class="card-title">${title}</h2>
  <p class="card-body">${description}</p>
</div>
`
```

## Exemplo 9: Cenario real — Mensagens com apostrofos

```javascript
// Ingles com apostrofo
const message = "It's a beautiful day"

// Portugues com aspas de citacao
const quote = 'Como dizia minha mae: "estude sempre"'
```