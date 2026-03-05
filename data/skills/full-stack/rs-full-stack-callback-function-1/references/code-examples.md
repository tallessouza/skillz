# Code Examples: Callback Functions

## Exemplo 1: Funcao nomeada como callback (do instrutor)

```javascript
// Definir a funcao separadamente
function callback() {
  console.log("Tarefa finalizada")
}

// Funcao que recebe o callback como parametro
function execute(taskName, callback) {
  console.log(`Executando a tarefa: ${taskName}`)
  callback()
}

// Chamar passando a funcao por referencia
execute("Download do arquivo", callback)
// Output:
// Executando a tarefa: Download do arquivo
// Tarefa finalizada
```

## Exemplo 2: Funcao anonima inline (do instrutor)

```javascript
execute("Upload do arquivo", function() {
  console.log("Funcao de callback com uma funcao anonima")
})
// Output:
// Executando a tarefa: Upload do arquivo
// Funcao de callback com uma funcao anonima
```

## Exemplo 3: Arrow function inline (do instrutor)

```javascript
execute("Excluindo o arquivo", () => {
  console.log("Arquivo excluido")
})
// Output:
// Executando a tarefa: Excluindo o arquivo
// Arquivo excluido
```

## Exemplo 4: Forma curta sem chaves (do instrutor)

```javascript
execute("Salvando arquivo", () => console.log("Arquivo salvo"))
// Output:
// Executando a tarefa: Salvando arquivo
// Arquivo salvo
```

## Exemplo 5: Inversao de ordem (do instrutor)

```javascript
function execute(taskName, callback) {
  callback() // executado PRIMEIRO
  console.log(`Executando a tarefa: ${taskName}`) // executado DEPOIS
}

execute("Excluindo o arquivo", () => {
  console.log("Arquivo excluido")
})
// Output:
// Arquivo excluido
// Executando a tarefa: Excluindo o arquivo
```

## Variacoes adicionais

### Callback com parametros

```javascript
function execute(taskName, onComplete) {
  console.log(`Executando: ${taskName}`)
  const result = { success: true, task: taskName }
  onComplete(result)
}

execute("Download", (result) => {
  console.log(`${result.task} finalizado: ${result.success}`)
})
```

### Callback em array methods

```javascript
const numbers = [1, 2, 3, 4, 5]

// Callback nomeado
function double(number) {
  return number * 2
}
const doubled = numbers.map(double)

// Callback inline arrow
const tripled = numbers.map((number) => number * 3)

// Callback com filter
const evenNumbers = numbers.filter((number) => number % 2 === 0)
```

### Multiplos callbacks (sucesso/erro)

```javascript
function fetchData(url, onSuccess, onError) {
  console.log(`Buscando: ${url}`)
  
  const success = Math.random() > 0.3
  
  if (success) {
    onSuccess({ data: "resultado" })
  } else {
    onError(new Error("Falha na requisicao"))
  }
}

fetchData(
  "/api/users",
  (data) => console.log("Dados recebidos:", data),
  (error) => console.log("Erro:", error.message)
)
```

### Callback opcional com guarda

```javascript
function processFile(fileName, onProgress) {
  console.log(`Processando: ${fileName}`)
  
  if (onProgress) {
    onProgress(50)
    onProgress(100)
  }
  
  console.log("Processamento concluido")
}

// Com callback
processFile("relatorio.pdf", (percent) => console.log(`${percent}%`))

// Sem callback (tambem funciona)
processFile("relatorio.pdf")
```

### Encadeamento com callbacks

```javascript
function step1(next) {
  console.log("Passo 1: Validando dados")
  next()
}

function step2(next) {
  console.log("Passo 2: Salvando no banco")
  next()
}

function step3() {
  console.log("Passo 3: Enviando confirmacao")
}

// Encadeamento
step1(() => {
  step2(() => {
    step3()
  })
})
// Output:
// Passo 1: Validando dados
// Passo 2: Salvando no banco
// Passo 3: Enviando confirmacao
```