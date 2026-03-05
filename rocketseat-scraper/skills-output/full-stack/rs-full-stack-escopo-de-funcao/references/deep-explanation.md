# Deep Explanation: Escopo de Função e Hoisting

## O que é Hoisting de Função

O instrutor (Rodrigo) explica hoisting com uma analogia simples: a função é "içada" — levada para o topo do escopo. Isso significa que o JavaScript engine, antes de executar qualquer código, faz uma primeira passada registrando todas as function declarations.

Diferente de variáveis (`var` é parcialmente hoisted — só o nome, não o valor), function declarations são **completamente** hoisted: tanto o nome quanto o corpo da função ficam disponíveis desde o início do escopo.

### Por que isso importa

Na prática, isso permite um estilo de código onde você organiza o "o quê" antes do "como":

```javascript
// Primeiro o fluxo principal (legível)
showMessage("Olá, Rodrigo")

// Depois os detalhes de implementação
function showMessage(message) {
  console.log(message)
}
```

Esse padrão é comum em codebases que priorizam legibilidade top-down.

## Funções dentro de funções

O instrutor demonstra que é perfeitamente válido declarar funções dentro de funções. A função `endLine` existe **apenas** dentro de `showMessage`:

```javascript
function showMessage(message) {
  console.log(message)
  endLine()

  function endLine() {
    console.log("----------")
  }
}
```

Pontos importantes destacados:
1. `endLine()` é chamada ANTES de sua declaração dentro de `showMessage` — funciona pelo hoisting
2. `endLine()` chamada FORA de `showMessage` gera erro — o escopo delimita onde ela existe
3. O escopo da função é definido pelas chaves `{}` da função pai

## O erro de escopo

O instrutor mostra explicitamente o que acontece quando você tenta chamar `endLine()` fora de `showMessage`:

```
ReferenceError: endLine is not defined
```

A explicação dele: "Essa função, ela não existe nesse escopo. A função existe aqui dentro." — apontando para o corpo de `showMessage`.

### Regra mental

O escopo de uma função = tudo entre as chaves `{}` onde ela foi declarada. Fora dessas chaves, ela simplesmente não existe.

## Edge cases não cobertos na aula (mas relevantes)

### Function expressions NÃO são hoisted

```javascript
showMessage("Oi") // TypeError: showMessage is not a function

const showMessage = function(message) {
  console.log(message)
}
```

A variável `showMessage` existe (se for `var`, é hoisted como `undefined`), mas o valor (a função) ainda não foi atribuído.

### Arrow functions seguem a mesma regra de expressions

```javascript
showMessage("Oi") // ReferenceError (com const/let) ou TypeError (com var)

const showMessage = (message) => {
  console.log(message)
}
```

### Hoisting em blocos (if/for)

Em strict mode, function declarations dentro de blocos `if`/`for` têm comportamento inconsistente entre engines. Evitar.

```javascript
// Evitar — comportamento inconsistente
if (true) {
  function helper() { return 1 }
}
helper() // Pode ou não funcionar dependendo do engine
```