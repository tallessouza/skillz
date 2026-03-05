# Code Examples: Funcionamento do Node.js

## Operacao sincrona — vai direto para Call Stack

```javascript
// Operacao simples como "pegar uma garrafa de agua"
// Executa imediatamente na Call Stack, sem passar pela Event Queue

function soma(a, b) {
  return a + b
}

const resultado = soma(2, 3) // Sincrono — Call Stack direta
console.log(resultado) // 5
```

## Operacao assincrona — passa pela Event Queue

```javascript
// Operacao complexa como "assar um bolo"
// Vai para Event Queue, Event Loop monitora e move para Call Stack quando pronta

const fs = require('fs')

// Leitura de arquivo — operacao assincrona (I/O)
fs.readFile('dados.txt', 'utf-8', (err, data) => {
  // Este callback so executa quando a leitura termina
  // Event Loop detecta que terminou → move para Call Stack
  console.log(data)
})

// Esta linha executa ANTES do callback acima
// Porque a thread nao fica bloqueada esperando o readFile
console.log('Continuo executando enquanto o arquivo e lido')
```

**Saida:**
```
Continuo executando enquanto o arquivo e lido
(conteudo do arquivo)
```

## Demonstrando Non-Blocking I/O

```javascript
// Tres operacoes assincronas — nenhuma bloqueia a outra

const https = require('https')

console.log('1. Iniciando requisicoes...')

// Requisicao 1 — vai para Event Queue
https.get('https://api.example.com/users', (res) => {
  console.log('3. Usuarios recebidos')
})

// Requisicao 2 — vai para Event Queue (nao espera a 1 terminar)
https.get('https://api.example.com/products', (res) => {
  console.log('4. Produtos recebidos')
})

console.log('2. Requisicoes disparadas, thread livre')

// Saida:
// 1. Iniciando requisicoes...
// 2. Requisicoes disparadas, thread livre
// 3. Usuarios recebidos (ou 4, depende de qual termina primeiro)
// 4. Produtos recebidos (ou 3)
```

## Call Stack em acao

```javascript
// Visualizando a pilha de execucao

function terceira() {
  console.log('Executando terceira') // 3. Topo da pilha
}

function segunda() {
  terceira() // 2. Chama terceira, empilha
  console.log('Executando segunda') // 4. Terceira saiu, segunda no topo
}

function primeira() {
  segunda() // 1. Chama segunda, empilha
  console.log('Executando primeira') // 5. Segunda saiu, primeira no topo
}

primeira()

// Call Stack (momento em que terceira() executa):
// | terceira()  |  ← topo (executando)
// | segunda()   |
// | primeira()  |
// | main()      |
```

## Exemplo de bloqueio — o que NAO fazer

```javascript
// ERRADO: operacao sincrona pesada bloqueia a Call Stack
// Como se o barista ficasse fazendo UM bolo gigante e ignorasse todos os clientes

function operacaoPesada() {
  let soma = 0
  for (let i = 0; i < 10_000_000_000; i++) {
    soma += i
  }
  return soma
}

// Isso BLOQUEIA o Event Loop — nenhuma outra requisicao e processada
const resultado = operacaoPesada()
```

```javascript
// CORRETO: dividir trabalho pesado ou usar Worker Threads
// Manter a Call Stack livre para o Event Loop continuar orquestrando

const { Worker } = require('worker_threads')

// Delega trabalho pesado para outra thread (Worker)
const worker = new Worker('./operacao-pesada.js')
worker.on('message', (resultado) => {
  console.log('Resultado:', resultado)
})

// Event Loop continua livre para processar outras requisicoes
```

## Event Loop decidindo: sincrono vs assincrono

```javascript
const fs = require('fs')

// 1. Sincrono — Call Stack direta (como pegar agua)
const nome = 'Node.js'
console.log(`Bem-vindo ao ${nome}`)

// 2. Assincrono — Event Queue (como assar bolo)
fs.readFile('config.json', 'utf-8', (err, data) => {
  const config = JSON.parse(data)
  console.log('Config carregada:', config.port)
})

// 3. Sincrono — Call Stack direta
const soma = 2 + 2
console.log('Soma:', soma)

// 4. Assincrono — Event Queue
setTimeout(() => {
  console.log('Timer disparou')
}, 1000)

// 5. Sincrono — Call Stack direta
console.log('Fim do script')

// Saida:
// Bem-vindo ao Node.js     (sincrono — imediato)
// Soma: 4                   (sincrono — imediato)
// Fim do script             (sincrono — imediato)
// Config carregada: 3000    (assincrono — quando arquivo lido)
// Timer disparou            (assincrono — apos 1 segundo)
```