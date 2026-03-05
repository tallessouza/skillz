# Code Examples: Expressoes Regulares

## Exemplo central da aula: `\D+` com flag `g`

```javascript
// Texto de exemplo usado na aula
const texto = "53A7B5C"

// Regex: encontrar todos os caracteres que NAO sao digitos
const regex = /\D+/g

// Usando match para extrair
const resultado = texto.match(regex)
console.log(resultado) // ["A", "B", "C"]

// Se o texto fosse "53A7BC5" (B e C juntos):
const texto2 = "53A7BC5"
const resultado2 = texto2.match(regex)
console.log(resultado2) // ["A", "BC"] — o + agrupou B e C
```

## Diferenca entre com e sem `+`

```javascript
const texto = "53A7BC5"

// SEM o quantificador +
const semMais = texto.match(/\D/g)
console.log(semMais) // ["A", "B", "C"] — cada letra separada

// COM o quantificador +
const comMais = texto.match(/\D+/g)
console.log(comMais) // ["A", "BC"] — sequencias agrupadas
```

## Diferenca entre com e sem flag `g`

```javascript
const texto = "53A7B5C"

// SEM flag g — para no primeiro match
const semGlobal = texto.match(/\D+/)
console.log(semGlobal[0]) // "A" — so o primeiro

// COM flag g — busca em toda a string
const comGlobal = texto.match(/\D+/g)
console.log(comGlobal) // ["A", "B", "C"] — todos os matches
```

## Usando `.test()` para validacao booleana

```javascript
// Verificar se tem alguma letra no texto
const temLetras = /\D/.test("53A7B5C")
console.log(temLetras) // true

const temLetras2 = /\D/.test("12345")
console.log(temLetras2) // false — so digitos
```

## Caso de uso classico: validacao de email

```javascript
// Regex basica para formato de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Testando formatos
console.log(emailRegex.test("user@email.com"))    // true
console.log(emailRegex.test("invalido"))           // false
console.log(emailRegex.test("sem@ponto"))          // false
console.log(emailRegex.test("user@domain.co.br"))  // true
```

## Variacoes uteis de classes de caracteres

```javascript
const texto = "Abc123!@#"

// \d — apenas digitos
console.log(texto.match(/\d+/g))  // ["123"]

// \D — tudo que NAO e digito
console.log(texto.match(/\D+/g))  // ["Abc", "!@#"]

// \w — letras, digitos e underscore (word characters)
console.log(texto.match(/\w+/g))  // ["Abc123"]

// \W — tudo que NAO e word character
console.log(texto.match(/\W+/g))  // ["!@#"]

// \s — espacos em branco
const frase = "hello world  test"
console.log(frase.match(/\s+/g))  // [" ", "  "]
```

## Usando regex para substituicao

```javascript
const telefone = "(11) 99999-8888"

// Remover tudo que nao e digito
const apenasNumeros = telefone.replace(/\D/g, "")
console.log(apenasNumeros) // "11999998888"
```

## Metodos de string que aceitam regex

```javascript
const texto = "53A7B5C"

// .match() — retorna array de correspondencias
texto.match(/\D+/g) // ["A", "B", "C"]

// .test() — retorna boolean (chamado NA regex, nao na string)
/\D/.test(texto) // true

// .replace() — substitui correspondencias
texto.replace(/\D/g, "*") // "53*7*5*"

// .search() — retorna indice da primeira correspondencia
texto.search(/\D/) // 2 (posicao do "A")

// .split() — divide string pelo padrao
texto.split(/\d+/) // ["", "A", "B", "C"]
```