# Deep Explanation: Async e Await

## Por que async/await existe

O JavaScript ja tinha `.then()`, `.catch()` e `.finally()` para lidar com promises. O async/await e uma **sintaxe alternativa** que torna o codigo assincrono mais legivel, parecendo codigo sincrono sequencial.

O instrutor demonstra isso reaproveitando a mesma funcao da aula anterior (que usava `.then()`) e mostrando como reescreve-la com async/await — o comportamento e identico, a sintaxe e mais limpa.

## O que acontece sem `await`

Quando voce chama uma funcao que retorna promise sem `await`, voce recebe o **objeto Promise em estado pendente**, nao o valor resolvido. O instrutor demonstra isso explicitamente:

```javascript
function fetch() {
  const response = minhaPromise() // Promise { <pending> }
  console.log(response) // Nao e o valor, e o objeto Promise
}
```

O `await` diz ao JavaScript: "espere essa promise ser resolvida ou rejeitada antes de continuar".

## A obrigatoriedade do `async`

O `await` so funciona dentro de funcoes marcadas com `async`. O instrutor testa removendo o `async` e mostra que da erro. Isso porque o JavaScript precisa saber em tempo de compilacao que aquela funcao contem operacoes assincronas.

## Posicionamento do `async` por tipo de funcao

O instrutor mostra explicitamente as duas formas:

### Funcao tradicional
```javascript
async function fetch() {
  const response = await minhaPromise()
}
```
O `async` vai antes da palavra `function`.

### Arrow function
```javascript
const fetch = async () => {
  const response = await minhaPromise()
}
```
O `async` vai antes dos parenteses dos parametros. O instrutor comenta ambas e deixa visivel para o aluno comparar.

## Try/Catch/Finally com async/await

O `.catch()` do `.then()` chain e substituido pelo bloco `catch` do try/catch. O `.finally()` e substituido pelo bloco `finally`.

O comportamento e identico:
- **try** — executa quando a promise resolve (equivale ao `.then()`)
- **catch** — executa quando a promise rejeita (equivale ao `.catch()`)
- **finally** — executa sempre, independente do resultado (equivale ao `.finally()`)

O instrutor demonstra alternando o parametro da funcao entre `true` (resolve) e `false` (rejeita) para mostrar os dois caminhos.

## Quando usar async/await vs .then()

Ambas as sintaxes sao validas. O async/await e preferido na maioria dos casos porque:
1. Codigo fica sequencial e mais facil de ler
2. Tratamento de erro com try/catch e familiar (mesmo padrao de codigo sincrono)
3. Debugging e mais simples (stack traces mais claras)

Use `.then()` quando precisar de composicao funcional simples ou quando nao estiver dentro de uma funcao async.