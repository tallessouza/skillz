# Code Examples: Igual a (==) e Diferente de (!=)

## Exemplos da aula (completos)

### Setup inicial

```javascript
const on = 1
const to = 2
```

### Igual a (==)

```javascript
// Comparando duas variaveis com valores diferentes
console.log(on == to)    // false

// Comparando variavel com literal do mesmo tipo
console.log(on == 1)     // true

// Comparando number com string — coercao de tipo
console.log(on == "1")   // true (compara conteudo, ignora tipo)
```

### Diferente de (!=)

```javascript
// Valores diferentes
console.log(on != to)    // true

// Mesmo valor, mesmo tipo
console.log(1 != 1)      // false

// Mesmo valor, tipos diferentes — coercao de tipo
console.log(1 != "1")    // false (conteudo igual apos coercao)
```

## Variacoes e edge cases

### Coercao com boolean

```javascript
console.log(1 == true)     // true (true vira 1)
console.log(0 == false)    // true (false vira 0)
console.log("" == false)   // true ("" vira 0, false vira 0)
console.log("1" == true)   // true ("1" vira 1, true vira 1)
```

### null e undefined

```javascript
console.log(null == undefined)  // true (regra especial)
console.log(null == 0)          // false
console.log(undefined == 0)     // false
console.log(null != undefined)  // false
```

### Strings e numeros

```javascript
console.log("42" == 42)     // true
console.log("0" == 0)       // true
console.log("" == 0)        // true (string vazia converte para 0)
console.log(" " == 0)       // true (string com espaco converte para 0)
```

### Comparacao com objetos

```javascript
console.log([] == 0)         // true ([].toString() = "", "" → 0)
console.log([] == "")        // true ([].toString() = "")
console.log([1] == 1)        // true ([1].toString() = "1", "1" → 1)
console.log({} == "[object Object]")  // true ({}.toString())
```

## Pattern aceito: null check com ==

```javascript
function processUser(user) {
  // Captura tanto null quanto undefined
  if (user == null) {
    throw new Error("User is required")
  }
  
  return user.name
}

processUser(null)       // Error
processUser(undefined)  // Error
processUser({ name: "João" })  // "João"
```

## Exemplo pratico: input de formulario

```javascript
// Valor vindo de um input HTML e sempre string
const inputAge = document.getElementById("age").value  // "25"
const minimumAge = 18

// Com == funciona (coercao string → number)
if (inputAge == minimumAge) {
  console.log("Idade minima atingida")
}

// Mais seguro: converter explicitamente
if (Number(inputAge) === minimumAge) {
  console.log("Idade minima atingida")
}
```