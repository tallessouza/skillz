# Code Examples: Utilizando o RegExr

## Exemplo base da aula

O texto usado na aula foi uma sequencia de numeros e letras misturados, similar a `"1a2b3c"`.

### Progressao demonstrada pelo instrutor

```javascript
// Passo 1: \D sem flags — apenas primeira ocorrencia
const regex1 = /\D/
"1a2b3c".match(regex1)
// Resultado: ["a"] (index: 1)
// Explicacao: encontrou "a" e parou

// Passo 2: \D com flag g — todas as ocorrencias separadas
const regex2 = /\D/g
"1a2b3c".match(regex2)
// Resultado: ["a", "b", "c"]
// Explicacao: encontrou cada letra individualmente

// Passo 3: \D+ com flag g — sequencias agrupadas
const regex3 = /\D+/g
"1a2b3c".match(regex3)
// Resultado: ["a", "b", "c"] (neste caso igual, pois letras nao sao consecutivas)
```

### Com letras consecutivas (demonstrado na aula)

```javascript
// Texto com sequencia de letras: "1abf2c"
const texto = "1abf2c"

// Sem +: cada letra separada
texto.match(/\D/g)
// Resultado: ["a", "b", "f", "c"] — 4 matches

// Com +: sequencias agrupadas
texto.match(/\D+/g)
// Resultado: ["abf", "c"] — 2 matches
// "abf" veio junto porque sao 3 caracteres nao-digito consecutivos
```

## Variacoes praticas

### Extrair apenas numeros (inverso do exemplo)

```javascript
const texto = "abc123def456"

// \d = digito (inverso de \D)
texto.match(/\d+/g)
// Resultado: ["123", "456"]
```

### Validar se string contem apenas numeros

```javascript
const apenasNumeros = /^\d+$/
apenasNumeros.test("12345")    // true
apenasNumeros.test("123a5")    // false
```

### Extrair palavras de texto misto

```javascript
const texto = "Pedido #1234 - Total: R$99,90"

// Extrair numeros
texto.match(/\d+/g)
// ["1234", "99", "90"]

// Extrair texto (cuidado: espacos e pontuacao tambem sao \D)
texto.match(/\D+/g)
// ["Pedido #", " - Total: R$", ","]

// Extrair apenas letras
texto.match(/[a-zA-Z]+/g)
// ["Pedido", "Total", "R"]
```

### Workflow completo: do regexr ao JavaScript

```javascript
// 1. Testou no regexr.com que /\D+/g funciona para o caso
// 2. Implementa no codigo:

function extrairTexto(input) {
  const matches = input.match(/\D+/g)
  return matches || []
}

extrairTexto("1abc2def3")  // ["abc", "def"]
extrairTexto("123456")     // []
extrairTexto("abcdef")     // ["abcdef"]
```