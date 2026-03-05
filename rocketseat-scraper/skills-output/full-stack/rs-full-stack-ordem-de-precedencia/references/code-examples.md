# Code Examples: Ordem de Precedência

## Exemplo 1: O classico do instrutor

```javascript
// Sem parenteses: multiplicacao tem precedencia
const result1 = 2 + 3 * 4
// Passo 1: 3 * 4 = 12
// Passo 2: 2 + 12 = 14
console.log(result1) // 14

// Com parenteses: forcamos a adicao primeiro
const result2 = (2 + 3) * 4
// Passo 1: 2 + 3 = 5
// Passo 2: 5 * 4 = 20
console.log(result2) // 20
```

## Exemplo 2: Calculos financeiros

```javascript
// ERRADO: desconto aplicado so no preco base, frete sem taxa
const total = price + price * discount + shipping * tax

// CORRETO: cada grupo explicito
const priceWithDiscount = price * (1 - discount)
const shippingWithTax = shipping * (1 + tax)
const total = priceWithDiscount + shippingWithTax
```

## Exemplo 3: Exponenciacao

```javascript
// Exponenciacao tem precedencia sobre multiplicacao
const result = 2 * 3 ** 2
// Passo 1: 3 ** 2 = 9
// Passo 2: 2 * 9 = 18
console.log(result) // 18

// Se quiser multiplicar primeiro:
const result2 = (2 * 3) ** 2
// Passo 1: 2 * 3 = 6
// Passo 2: 6 ** 2 = 36
console.log(result2) // 36
```

## Exemplo 4: Operadores relacionais e logicos

```javascript
// Aritmetica avaliada antes de comparacao
const isExpensive = price + tax > 100
// Equivale a: (price + tax) > 100 (parenteses implicitos)

// AND avaliado antes de OR
const canAccess = isAdmin || isPremium && isActive
// Equivale a: isAdmin || (isPremium && isActive)
// Se quiser OR primeiro:
const canAccess2 = (isAdmin || isPremium) && isActive
```

## Exemplo 5: Variaveis intermediarias para expressoes complexas

```javascript
// Dificil de ler e propenso a erros
const finalScore = baseScore * multiplier + bonus - penalty * difficultyFactor / 100

// Melhor: variaveis intermediarias com nomes descritivos
const adjustedBase = baseScore * multiplier
const adjustedPenalty = (penalty * difficultyFactor) / 100
const finalScore = adjustedBase + bonus - adjustedPenalty
```

## Exemplo 6: Modulo (%) com outras operacoes

```javascript
// Modulo tem mesma precedencia que multiplicacao/divisao
const result = 10 + 15 % 4
// Passo 1: 15 % 4 = 3
// Passo 2: 10 + 3 = 13
console.log(result) // 13

// Se quiser o modulo do total:
const result2 = (10 + 15) % 4
// Passo 1: 10 + 15 = 25
// Passo 2: 25 % 4 = 1
console.log(result2) // 1
```