# Code Examples: Validando Input com Regex

## Exemplo base da aula

```javascript
const amount = document.getElementById("amount")

amount.addEventListener("input", () => {
  const hasCharactersRejects = /\D+/g
  amount.value = amount.value.replace(hasCharactersRejects, "")
})
```

## Com console.log para debug (como o instrutor demonstrou)

```javascript
amount.addEventListener("input", () => {
  console.log("Valor antes:", amount.value) // mostra letras aqui
  
  const hasCharactersRejects = /\D+/g
  amount.value = amount.value.replace(hasCharactersRejects, "")
  
  console.log("Valor depois:", amount.value) // só números aqui
})
```

## Variação: permitindo decimais

```javascript
amount.addEventListener("input", () => {
  const hasCharactersRejects = /[^0-9.,]+/g
  amount.value = amount.value.replace(hasCharactersRejects, "")
})
```

## Variação: inline sem variável intermediária

```javascript
amount.addEventListener("input", () => {
  amount.value = amount.value.replace(/\D+/g, "")
})
```

## Variação: função reutilizável

```javascript
function allowOnlyNumbers(inputElement) {
  inputElement.addEventListener("input", () => {
    inputElement.value = inputElement.value.replace(/\D+/g, "")
  })
}

// Uso
allowOnlyNumbers(document.getElementById("amount"))
allowOnlyNumbers(document.getElementById("quantity"))
```

## Variação: com limite de caracteres

```javascript
amount.addEventListener("input", () => {
  amount.value = amount.value.replace(/\D+/g, "")
  
  if (amount.value.length > 10) {
    amount.value = amount.value.slice(0, 10)
  }
})
```

## Comparação: abordagem keydown (NÃO recomendada)

```javascript
// NÃO FAÇA ISSO — não cobre paste, autocomplete, drag-and-drop
amount.addEventListener("keydown", (e) => {
  if (e.key.length === 1 && /\D/.test(e.key)) {
    e.preventDefault()
  }
})
```

## Regex equivalentes

```javascript
/\D+/g        // \D = não-dígito (forma curta)
/[^0-9]+/g    // [^0-9] = não-dígito (forma explícita)
/[a-zA-Z]+/g  // só letras — NÃO USE, ignora símbolos como @#$
```