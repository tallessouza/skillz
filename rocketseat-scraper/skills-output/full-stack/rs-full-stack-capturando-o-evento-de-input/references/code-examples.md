# Code Examples: Capturando o Evento de Input

## Exemplo 1: Selecao basica e log (do transcript)

O primeiro passo do instrutor — verificar que o evento funciona:

```javascript
// Seleciona os elementos do formulario
const amount = document.getElementById("amount")

// Observa entrada de conteudo no input
amount.oninput = () => {
  console.log("novo conteúdo")
}
```

**Resultado:** Ao digitar "123", o console mostra "novo conteudo" tres vezes — uma para cada caractere.

## Exemplo 2: Validacao numerica com regex

```javascript
const amount = document.getElementById("amount")

amount.oninput = () => {
  // Remove qualquer caractere que nao seja digito
  amount.value = amount.value.replace(/\D/g, "")
}
```

## Exemplo 3: Validacao com feedback visual

```javascript
const amount = document.getElementById("amount")

amount.oninput = () => {
  const rawValue = amount.value
  const numericValue = rawValue.replace(/\D/g, "")

  if (rawValue !== numericValue) {
    amount.style.borderColor = "red"
    setTimeout(() => {
      amount.style.borderColor = ""
    }, 500)
  }

  amount.value = numericValue
}
```

## Exemplo 4: Multiplos inputs com validacoes diferentes

```javascript
// Seleciona os elementos do formulario
const amount = document.getElementById("amount")
const description = document.getElementById("description")

// Valida amount: somente numeros
amount.oninput = () => {
  amount.value = amount.value.replace(/\D/g, "")
}

// Valida description: maximo 100 caracteres
description.oninput = () => {
  if (description.value.length > 100) {
    description.value = description.value.slice(0, 100)
  }
}
```

## Exemplo 5: Usando arrow function vs function tradicional

```javascript
// Arrow function (padrao do instrutor)
amount.oninput = () => {
  amount.value = amount.value.replace(/\D/g, "")
}

// Function tradicional (alternativa)
amount.oninput = function () {
  this.value = this.value.replace(/\D/g, "")
}
```

**Nota:** Com arrow function, `this` nao referencia o elemento, entao use `amount.value` diretamente. Com function tradicional, `this` referencia o elemento que disparou o evento.

## Exemplo 6: Acessando o valor via evento

```javascript
amount.oninput = (event) => {
  // event.target e o proprio input
  console.log(event.target.value)

  // Equivalente a:
  console.log(amount.value)
}
```

## HTML de referencia (do projeto)

```html
<input id="amount" type="text" placeholder="Valor da despesa">
```

O input usa `type="text"` (nao `type="number"`) porque a validacao e feita via JavaScript, dando controle total sobre o comportamento.