# Code Examples: Evite Syntactic Sugars

## Exemplo 1: Conversao de string para numero

### O problema
```typescript
const numberInString = "123"

// Syntactic sugar — operador + como conversor
const number = +numberInString
```

O operador `+` unario no JavaScript tenta converter o operando para numero. Funciona, mas e um comportamento especifico do JS que confunde devs de outras linguagens.

### Alternativa com parseInt (parcialmente correta)
```typescript
const number = parseInt(numberInString)
```
Funciona para inteiros, mas **falha silenciosamente com decimais**:
```typescript
const decimalString = "3.14"
parseInt(decimalString) // retorna 3, nao 3.14
```

### Solucao recomendada
```typescript
const number = Number(numberInString)
```
- Funciona com inteiros e decimais
- Qualquer dev de qualquer linguagem entende
- Intencao explicita: "estou convertendo para numero"

## Exemplo 2: Conversao para booleano

### Syntactic sugar
```typescript
const isNumberNotNull = !!number
```
Dupla negacao: primeiro `!` converte para booleano e inverte, segundo `!` inverte de volta. Funciona, mas e um truque.

### Solucao recomendada
```typescript
const isNumberNotNull = Boolean(number)
```

## Exemplo 3: Conversao para string

### Syntactic sugar (implicito)
```typescript
const text = number + ""
// ou
const text = `${number}`  // template literal so pra converter
```

### Solucao recomendada
```typescript
const text = String(number)
```

## Resumo visual

```typescript
// ❌ Syntactic sugars obscuros
+value        // converter para numero
!!value       // converter para booleano
value + ""    // converter para string

// ✅ Construtores explicitos
Number(value)   // converter para numero
Boolean(value)  // converter para booleano
String(value)   // converter para string
```