# Code Examples: Manipulando Valor do Input com Regex

## Setup base (HTML assumido)

```html
<form>
  <input type="text" />
  <button type="submit">Adicionar</button>
</form>
```

## Exemplo 1: Capturar valor em tempo real com evento `input`

```javascript
const input = document.querySelector("input")

input.addEventListener("input", () => {
  console.log(input.value)
})
```

**Comportamento:** ao digitar "ROD", o console exibe:
```
R
RO
ROD
```

Ao apagar, tambem dispara:
```
RO
R
(vazio)
```

## Exemplo 2: Usar `match()` para encontrar ocorrencias

```javascript
const input = document.querySelector("input")
const regex = /\D+/g

input.addEventListener("input", () => {
  const value = input.value
  console.log(value.match(regex))
})
```

**Comportamento:**
- Digitar "10" → `null` (so digitos, nenhum nao-digito encontrado)
- Digitar "10R" → `["R"]`
- Digitar "10RO" → `["RO"]`
- Digitar "" (vazio) → `null`

## Exemplo 3: Usar `test()` para validacao booleana

```javascript
const input = document.querySelector("input")
const regex = /\D+/g

input.addEventListener("input", () => {
  const value = input.value
  const isValid = regex.test(value)
  console.log(isValid)
})
```

**Comportamento:**
- Digitar "1" → `false` (nao encontrou nao-digito)
- Digitar "R" → `true` (encontrou nao-digito)
- Digitar "R1" → `true` (tem texto, entao atende o padrao)

## Exemplo 4: Usar `replace()` para substituir por caractere

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value.replace(regex, "x")
  console.log(value)
})
```

**Input:** "34df23"
**Output:** "34x23" — as letras "df" foram substituidas por "x"

## Exemplo 5: Usar `replace()` para remover caracteres

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value.replace(regex, "")
  console.log(value)
})
```

**Input:** "Rodrigo3409Gonçalves3657"
**Output:** "340936​57" — somente os digitos permanecem

## Exemplo 6: Validacao condicional com `test()` e alert

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value

  if (!regex.test(value)) {
    alert("Valor invalido. Digite corretamente.")
    return
  }

  console.log(value)
})
```

**Comportamento:**
- Input "123" → alert "Valor invalido" (nao encontrou letras, negacao do test)
- Input "Rodrigo" → console.log "Rodrigo" (encontrou letras, passou)
- Input "Rodrigo3" → console.log "Rodrigo3" (encontrou letras, passou)

## Exemplo 7: Fluxo completo — validar e processar

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value

  if (regex.test(value)) {
    // padrao encontrado — valor valido
    console.log(value)
    // aqui faria: salvar no banco, fazer cadastro, etc.
  } else {
    // padrao NAO encontrado — valor invalido
    alert("Valor invalido. Digite corretamente.")
  }
})
```

## Variacoes praticas

### Aceitar apenas letras (remover numeros)

```javascript
const regexNumeros = /\d+/g
const cleanValue = input.value.replace(regexNumeros, "")
// "Rodrigo123" → "Rodrigo"
```

### Aceitar apenas numeros (remover letras)

```javascript
const regexLetras = /\D+/g
const cleanValue = input.value.replace(regexLetras, "")
// "Rodrigo123" → "123"
```

### Validar email basico

```javascript
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!regexEmail.test(input.value)) {
  alert("Email invalido")
}
```

### Feedback em tempo real + validacao no submit

```javascript
const input = document.querySelector("input")
const form = document.querySelector("form")
const regex = /\D+/g

// Feedback visual em tempo real
input.addEventListener("input", () => {
  if (regex.test(input.value)) {
    input.style.borderColor = "green"
  } else {
    input.style.borderColor = "red"
  }
})

// Validacao final no submit
form.addEventListener("submit", (event) => {
  event.preventDefault()
  if (!regex.test(input.value)) {
    alert("Valor invalido")
    return
  }
  // processar...
})
```