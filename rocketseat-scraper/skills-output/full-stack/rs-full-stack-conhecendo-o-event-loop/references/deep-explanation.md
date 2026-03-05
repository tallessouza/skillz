# Deep Explanation: Event Loop do JavaScript

## A analogia da fila unica

O instrutor usa a analogia de um lugar com uma unica fila e uma unica pessoa atendendo. Voce tem que esperar sua vez — e exatamente assim que a call stack funciona. So tem um "atendente" (a thread principal), e todas as funcoes ficam na fila esperando. Essa analogia captura perfeitamente a natureza single-thread do JavaScript.

A diferenca e que, ao inves de todo mundo ficar na mesma fila, algumas pessoas (operacoes assincronas) saem da fila para resolver algo em outro lugar (Web APIs) e depois voltam para uma fila separada (callback queue) quando terminam.

## As 4 caracteristicas fundamentais do JavaScript

O instrutor destaca 4 caracteristicas que se conectam em cadeia:

1. **Single Thread** → executa uma coisa por vez
2. **Non-blocking** → nao trava o contexto de execucao (se voce nao pede para aguardar uma Promise, o JS segue a vida)
3. **Assincrono** → paradigma necessario justamente PORQUE e non-blocking
4. **Concorrente** → tarefas assincronas concorrem pelo processamento, e o Event Loop gerencia essa concorrencia

A cadeia logica e: single-thread EXIGE non-blocking, que EXIGE async, que CRIA concorrencia, que EXIGE Event Loop.

## Como as engrenagens funcionam juntas

### Call Stack
- Pilha (LIFO) de funcoes em execucao
- TUDO passa pela call stack — ate operacoes assincronas passam por ela antes de serem delegadas
- Quando uma funcao e chamada, vai para o topo da pilha
- Quando retorna, sai do topo

### Web APIs
- Recursos executados FORA da thread principal (no browser: DOM events, fetch, timers)
- A funcao passa pela call stack mas e resolvida em outro lugar
- Quando a Web API termina, o callback vai para a callback queue

### Callback Queue
- Fila (FIFO) que armazena callbacks prontos para execucao
- Dividida em duas sub-filas com prioridades diferentes:
  - **Microtask queue**: Promises, queueMicrotask, MutationObserver
  - **Macrotask queue**: setTimeout, setInterval, eventos DOM, I/O

### Event Loop
- Monitora CONSTANTEMENTE a call stack e a callback queue
- Algoritmo: se a call stack esta vazia, pega o proximo item da fila e coloca na call stack
- Sempre prioriza microtasks sobre macrotasks

## Prioridades: Microtasks vs Macrotasks

O instrutor enfatiza que existem dois tipos de tarefas com prioridades diferentes:

### Microtasks (alta prioridade)
- Promises (.then, .catch, .finally)
- queueMicrotask()
- MutationObserver
- Executam TODAS antes de qualquer macrotask

### Macrotasks (baixa prioridade)
- setTimeout / setInterval
- Callbacks de eventos (click, load, etc.)
- I/O callbacks
- requestAnimationFrame (na verdade tem prioridade propria no browser)

### Por que isso importa?
Se voce tem uma Promise e um setTimeout(fn, 0), a Promise SEMPRE executa primeiro, independente da ordem no codigo. Isso surpreende muitos desenvolvedores.

## O resumo do instrutor (fluxo completo)

1. **Codigo sincrono** executa de cima para baixo, empilhando e desempilhando funcoes
2. **Eventos assincronos** — quando completam, o callback e enfileirado na callback queue
3. **Event Loop verifica** — se a call stack esta vazia, move um callback da fila para a call stack
4. **Microtasks primeiro** — antes de verificar a callback queue novamente, o Event Loop sempre processa todas as microtasks pendentes

## Edge cases importantes

### Microtask que agenda outra microtask
```javascript
Promise.resolve().then(() => {
  console.log('micro 1')
  Promise.resolve().then(() => console.log('micro 2'))
})
setTimeout(() => console.log('macro'), 0)
// Output: micro 1, micro 2, macro
```
O Event Loop esvazia COMPLETAMENTE a fila de microtasks antes de ir para macrotasks. Isso pode causar starvation de macrotasks se microtasks ficarem se agendando infinitamente.

### Codigo sincrono pesado bloqueia tudo
```javascript
// Isso trava a UI por ~5 segundos
for (let i = 0; i < 5_000_000_000; i++) {}
console.log('done') // so aparece depois do loop
```
Enquanto a call stack nao esvaziar, o Event Loop nao pode processar nenhum callback.

### async/await e microtasks
```javascript
async function example() {
  console.log('antes do await') // sincrono!
  await fetch('/api')           // pausa aqui
  console.log('depois do await') // microtask quando a Promise resolve
}
```
O codigo antes do primeiro `await` executa sincronamente. Tudo depois do `await` e agendado como microtask.