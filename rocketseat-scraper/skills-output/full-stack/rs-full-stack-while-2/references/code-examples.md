# Code Examples: Loop While

## Exemplo 1: Codigo exato da aula

```javascript
let execute = true

while (execute) {
  let response = window.prompt("Deseja continuar? 1 para sim ou 2 para não")

  if (response === "2") {
    execute = false
  }
}

console.log("Segue o fluxo")
```

**Comportamento:**
- Exibe prompt repetidamente
- Digitar "1" (ou qualquer coisa diferente de "2") → continua
- Digitar "2" → para o loop
- "Segue o fluxo" aparece no console apenas apos o loop encerrar

## Exemplo 2: Versao com comparacao redundante (mostrada e descartada na aula)

```javascript
let execute = true

// Funciona, mas e redundante — o instrutor mostra e depois simplifica
while (execute === true) {
  // ...
}

// Versao simplificada preferida
while (execute) {
  // ...
}
```

## Exemplo 3: While com condicao numerica (mencionado na aula)

```javascript
let age = 0

while (age < 18) {
  age = Number(window.prompt("Digite sua idade:"))
}

console.log("Acesso permitido")
```

## Exemplo 4: Tratando cancelamento do prompt

```javascript
let shouldContinue = true

while (shouldContinue) {
  const response = window.prompt("Deseja continuar? (1-Sim / 2-Nao)")

  if (response === "2" || response === null) {
    shouldContinue = false
  }
}

console.log("Segue o fluxo")
```

## Exemplo 5: Multiplas condicoes de saida

```javascript
let isRunning = true
let attempts = 0
const maxAttempts = 5

while (isRunning) {
  const guess = window.prompt("Adivinhe o numero (1-10):")
  attempts++

  if (guess === "7") {
    console.log(`Acertou em ${attempts} tentativas!`)
    isRunning = false
  }

  if (attempts >= maxAttempts) {
    console.log("Tentativas esgotadas!")
    isRunning = false
  }
}
```

## Exemplo 6: Acumulador com while

```javascript
let total = 0
let shouldAdd = true

while (shouldAdd) {
  const value = window.prompt("Digite um valor (ou 'sair' para encerrar):")

  if (value === "sair" || value === null) {
    shouldAdd = false
  } else {
    total += Number(value)
    console.log(`Total parcial: ${total}`)
  }
}

console.log(`Total final: ${total}`)
```

## Exemplo 7: Menu interativo com while

```javascript
let isMenuOpen = true

while (isMenuOpen) {
  const option = window.prompt(
    "Escolha uma opcao:\n1 - Ver saldo\n2 - Depositar\n3 - Sair"
  )

  if (option === "1") {
    console.log("Saldo: R$ 1.000,00")
  } else if (option === "2") {
    console.log("Deposito realizado")
  } else if (option === "3") {
    isMenuOpen = false
  }
}

console.log("Obrigado por usar nosso sistema")
```