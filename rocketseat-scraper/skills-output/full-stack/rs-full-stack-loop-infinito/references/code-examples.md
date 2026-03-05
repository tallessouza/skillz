# Code Examples: Loop Infinito

## Exemplo original da aula — Loop infinito básico

```javascript
// PERIGO: Este código trava o navegador
let value = true

while (value) {
  console.log("executando while")
  // value nunca é alterado → loop infinito
}
```

**O que acontece:** O `console.log` executa milhares de vezes por segundo. Em poucos segundos, o instrutor observou mais de 44.000 execuções. O navegador fica lento, novas abas não abrem, e eventualmente trava.

**Nota do instrutor:** Para saber se o arquivo foi salvo no VS Code, observe o ícone na aba — bolinha branca = não salvo, X = salvo.

## Variação 1: Corrigindo com condição de saída

```javascript
let value = true
let count = 0

while (value) {
  console.log("executando while")
  count++
  
  if (count >= 10) {
    value = false
  }
}
// Saída: "executando while" impresso 10 vezes
```

## Variação 2: Usando break ao invés de mudar a variável

```javascript
let value = true

while (value) {
  console.log("executando while")
  
  const userWantsToStop = confirm("Parar?")
  if (userWantsToStop) {
    break // Sai do loop imediatamente
  }
}
```

## Variação 3: while (true) com proteção

```javascript
// Intentional: buscar dados até sucesso
let attempts = 0
const maxAttempts = 5

while (true) {
  attempts++
  console.log(`Tentativa ${attempts}`)
  
  const success = Math.random() > 0.7
  if (success) {
    console.log("Sucesso!")
    break
  }
  
  if (attempts >= maxAttempts) {
    console.log("Máximo de tentativas atingido")
    break
  }
}
```

## Variação 4: Comparação while vs for para evitar loop infinito

```javascript
// PERIGOSO: fácil esquecer de incrementar
let i = 0
while (i < 5) {
  console.log(i)
  i++ // Se esquecer esta linha → loop infinito
}

// SEGURO: incremento está na estrutura
for (let i = 0; i < 5; i++) {
  console.log(i) // Impossível esquecer o incremento
}
```

## Variação 5: do...while com mesma armadilha

```javascript
// PERIGO: mesma armadilha do while
let value = true

do {
  console.log("executando do while")
  // value nunca muda → loop infinito
} while (value)

// CORRETO:
let counter = 0
do {
  console.log(`Iteração ${counter}`)
  counter++
} while (counter < 5)
```

## Variação 6: Loop infinito em cenário real — polling

```javascript
// Cenário: verificar se um job terminou
async function waitForJob(jobId) {
  let attempts = 0
  const maxAttempts = 30 // Safety net: máximo 30 tentativas
  
  while (attempts < maxAttempts) {
    const status = await checkJobStatus(jobId)
    
    if (status === "completed") {
      return { success: true, attempts }
    }
    
    if (status === "failed") {
      throw new Error(`Job ${jobId} falhou`)
    }
    
    attempts++
    await new Promise(resolve => setTimeout(resolve, 2000)) // Espera 2s
  }
  
  throw new Error(`Job ${jobId} timeout após ${maxAttempts} tentativas`)
}
```

## Checklist: Como identificar loop infinito potencial

```javascript
// Para cada while/do-while no seu código, verifique:

// 1. A condição pode se tornar falsa?
while (condition) { /* condition muda aqui dentro? */ }

// 2. Existe break/return no corpo?
while (true) { /* tem break ou return? */ }

// 3. A variável de controle é modificada corretamente?
while (x < 10) { /* x está incrementando? Na direção certa? */ }

// 4. A comparação é do tipo correto?
while (x !== "5") { /* x é string? Se for number, nunca será igual */ }
```