# Code Examples: Loop Do While

## Exemplo 1: Contador basico (do instrutor)

```javascript
// Valor inicial: 0
// Incrementa antes de exibir
// Condicao: value < 10
let value = 0

do {
  value++
  console.log(value) // Exibe 1, 2, 3, ..., 10
} while (value < 10)

console.log("segue o fluxo")
```

**Saida:**
```
1
2
3
4
5
6
7
8
9
10
segue o fluxo
```

## Exemplo 2: Valor inicial que invalida a condicao (do instrutor)

```javascript
// Mesmo com value = 11 (ja maior que 10), executa uma vez
let value = 11

do {
  value++
  console.log(value) // Exibe 12
} while (value < 10)

console.log("segue o fluxo")
```

**Saida:**
```
12
segue o fluxo
```

**Por que 12?** O bloco executa, incrementa 11 para 12, exibe 12. A condicao `12 < 10` e falsa, entao para.

## Exemplo 3: Menu interativo

```javascript
let option

do {
  console.log("1 - Novo jogo")
  console.log("2 - Carregar jogo")
  console.log("3 - Sair")
  option = Number(prompt("Escolha uma opcao:"))

  switch (option) {
    case 1:
      startNewGame()
      break
    case 2:
      loadGame()
      break
    case 3:
      console.log("Ate logo!")
      break
    default:
      console.log("Opcao invalida!")
  }
} while (option !== 3)
```

## Exemplo 4: Validacao de input

```javascript
let password

do {
  password = prompt("Digite sua senha (min 8 caracteres):")
} while (password.length < 8)

console.log("Senha aceita!")
```

## Exemplo 5: Tentativas com limite

```javascript
let attempts = 0
let success = false

do {
  attempts++
  console.log(`Tentativa ${attempts}...`)
  success = tryConnection()
} while (!success && attempts < 3)

if (success) {
  console.log("Conectado!")
} else {
  console.log("Falha apos 3 tentativas")
}
```

## Exemplo 6: Comparacao while vs do-while

```javascript
// Com while: nao executa nada
let x = 10
while (x < 5) {
  console.log(x) // Nunca executa
  x++
}

// Com do-while: executa uma vez
let y = 10
do {
  console.log(y) // Exibe 10
  y++
} while (y < 5)
```

## Exemplo 7: Gerando numero aleatorio ate acertar

```javascript
const target = 7
let guess

do {
  guess = Math.floor(Math.random() * 10) + 1
  console.log(`Tentou: ${guess}`)
} while (guess !== target)

console.log("Acertou!")
```