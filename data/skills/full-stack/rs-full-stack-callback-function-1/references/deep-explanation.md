# Deep Explanation: Callback Functions

## O que e um callback

Callback function e uma funcao passada como argumento para outra funcao. A funcao receptora decide quando e como executar o callback. O nome "callback" vem da ideia de "chamar de volta" — voce entrega uma funcao e ela sera chamada de volta quando apropriado.

## Mental model do instrutor

O instrutor usa a analogia de **tarefa + finalizacao**: a funcao `execute` recebe o nome da tarefa E o que fazer quando terminar. Isso separa a orquestracao (execute) da acao especifica (callback).

```
execute("Download", onComplete)
         ^              ^
    O QUE fazer    O QUE fazer DEPOIS
```

## Tres formas de passar callbacks

O instrutor enfatiza que "na programacao tem varias maneiras de fazer a mesma coisa". Para callbacks, existem tres formas equivalentes:

### 1. Funcao nomeada (referencia)

```javascript
function callback() {
  console.log("Tarefa finalizada")
}
execute("Download", callback)
```

- A funcao ja existe antes da chamada
- Passada por referencia (sem parenteses)
- Reutilizavel em multiplas chamadas

### 2. Funcao anonima inline

```javascript
execute("Upload", function() {
  console.log("Funcao de callback com funcao anonima")
})
```

- Criada no momento da chamada
- Sem nome, nao reutilizavel
- Util para logica unica

### 3. Arrow function inline

```javascript
execute("Exclusao", () => {
  console.log("Arquivo excluido")
})
```

- Sintaxe mais curta
- Mesma semantica que funcao anonima para este caso
- Forma preferida no JavaScript moderno

## Ordem de execucao importa

O instrutor demonstra que a posicao do `callback()` dentro da funcao receptora determina a ordem de execucao:

```javascript
// Callback DEPOIS da logica
function execute(taskName, callback) {
  console.log(`Executando: ${taskName}`)  // Primeiro
  callback()                                // Depois
}

// Callback ANTES da logica
function execute(taskName, callback) {
  callback()                                // Primeiro
  console.log(`Executando: ${taskName}`)  // Depois
}
```

Isso e fundamental para entender fluxo assincrono mais tarde.

## Forma curta (sem chaves)

Quando o callback tem uma unica instrucao, as chaves sao opcionais na arrow function:

```javascript
// Com chaves (desnecessario para uma linha)
execute("Salvando", () => { console.log("Salvo") })

// Sem chaves (forma curta)
execute("Salvando", () => console.log("Salvo"))
```

O instrutor recomenda chaves apenas quando ha mais de uma instrucao.

## Edge cases e nuances

### Callback que recebe parametros

O instrutor nao cobre explicitamente, mas o padrao se estende:

```javascript
function execute(taskName, onComplete) {
  console.log(`Executando: ${taskName}`)
  onComplete(taskName) // passando dados para o callback
}

execute("Download", (task) => console.log(`${task} finalizado`))
```

### Callback opcional

Se o callback pode ou nao ser passado:

```javascript
function execute(taskName, onComplete) {
  console.log(`Executando: ${taskName}`)
  if (onComplete) onComplete()
}
```

### Multiplos callbacks

Para sucesso e erro:

```javascript
function execute(taskName, onSuccess, onError) {
  try {
    console.log(`Executando: ${taskName}`)
    onSuccess()
  } catch (error) {
    onError(error)
  }
}
```

## Por que isso importa

Callbacks sao a base de:
- Event listeners (`addEventListener('click', callback)`)
- Array methods (`.map()`, `.filter()`, `.forEach()`)
- Operacoes assincronas (antes de Promises/async-await)
- Patterns como middleware (Express.js)

Entender callbacks e pre-requisito para entender todo o ecossistema JavaScript.