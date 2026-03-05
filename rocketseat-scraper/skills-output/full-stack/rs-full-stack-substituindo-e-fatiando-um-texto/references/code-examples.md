# Code Examples: Substituindo e Fatiando Texto

## Replace — Todos os exemplos da aula

### Substituicao simples de palavra
```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Trocar "JavaScript" por "HTML"
console.log(message.replace("JavaScript", "HTML"))
// Output: "Estou estudando os fundamentos do HTML."

// Original inalterada
console.log(message)
// Output: "Estou estudando os fundamentos do JavaScript."
```

### Substituicao de trecho completo
```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Trocar trecho inteiro
console.log(message.replace("os fundamentos do JavaScript", "métodos de string"))
// Output: "Estou estudando métodos de string."
```

## Slice — Todos os exemplos da aula

### Extracao do inicio (posicoes positivas)
```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Primeiros 5 caracteres
console.log(message.slice(0, 5))
// Output: "Estou"

// Da posicao 6 ate 30
console.log(message.slice(6, 30))
// Output: "estudando os fundamentos"
```

### Extracao do final (posicao negativa)
```javascript
const message = "Estou estudando os fundamentos do JavaScript."

// Ultimos 11 caracteres (JavaScript.)
console.log(message.slice(-11))
// Output: "JavaScript."
```

## Trim — Todos os exemplos da aula

### Remocao de espacos
```javascript
const textWithSpace = "   texto de exemplo   "

// Tamanho com espacos
console.log(textWithSpace.length)
// Output: 23

// Aplicar trim
console.log(textWithSpace.trim())
// Output: "texto de exemplo"

// Tamanho apos trim
console.log(textWithSpace.trim().length)
// Output: 16
```

## Variacoes Praticas Adicionais

### Replace em formularios
```javascript
// Usuario digitou ponto, mas sistema precisa de virgula (cenario da aula)
const userPrice = "19.90"
const formattedPrice = userPrice.replace(".", ",")
// "19,90"
```

### Slice para preview de texto
```javascript
const article = "Este é um artigo muito longo sobre JavaScript e suas funcionalidades..."
const preview = article.slice(0, 50) + "..."
// "Este é um artigo muito longo sobre JavaScript e su..."
```

### Slice negativo para extensao de arquivo
```javascript
const filename = "documento.pdf"
const extension = filename.slice(-3)
// "pdf"

const withDot = filename.slice(-4)
// ".pdf"
```

### Trim em pipeline de input
```javascript
// Cenario real: limpeza de input de formulario
function cleanInput(rawInput) {
  return rawInput.trim()
}

cleanInput("  usuario@email.com  ")  // "usuario@email.com"
cleanInput("  João Silva  ")          // "João Silva"
// Espacos no meio ("João Silva") sao preservados
```

### Combinando metodos
```javascript
const rawEmail = "  Usuario@Email.COM  "
const cleanEmail = rawEmail.trim().toLowerCase()
// "usuario@email.com"

const message = "Olá, mundo! Olá, JavaScript!"
const updated = message.replace("Olá", "Hi").slice(0, 10)
// "Hi, mundo!"
```