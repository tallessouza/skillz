# Deep Explanation: Utilizando o Fetch

## Por que fetch retorna uma Promise?

Quando voce faz uma requisicao para uma API, a resposta nao chega instantaneamente. Existe latencia de rede, processamento no servidor, etc. O JavaScript nao bloqueia a execucao esperando — ele continua rodando o codigo seguinte. Por isso fetch retorna uma Promise: um "contrato" de que o valor vai chegar no futuro.

O instrutor demonstra isso de forma pratica:

```javascript
const response = fetch("http://localhost:3333/products")
console.log(response) // Promise { <pending> }
```

O resultado e `Promise { <pending> }` — a requisicao ainda nao completou. Esse e o erro mais comum de iniciantes: tratar fetch como se fosse sincrono.

## O objeto Response vs os dados

O primeiro `.then()` nao retorna os dados da API. Ele retorna um **objeto Response** que contem metadados da requisicao:

- **url**: o endereco que foi requisitado
- **status**: codigo HTTP (200 = sucesso, 404 = nao encontrado)
- **headers**: cabecalhos da resposta
- **body**: o corpo da resposta (ainda nao decodificado)

O instrutor mostra isso no console: ao fazer `.then(response => console.log(response))`, voce ve informacoes sobre a requisicao (status 200, URL), mas NAO os dados dos produtos.

Para extrair os dados, e necessario chamar `response.json()`, que tambem e assincrono (retorna outra Promise), por isso o segundo `.then()`.

## Anatomia da URL da API

```
http://localhost:3333/products
│      │         │    │
│      │         │    └── endpoint (recurso)
│      │         └── porta onde a API atende
│      └── host (localhost = maquina local, ou IP/dominio remoto)
└── protocolo (http = local, https = producao com criptografia)
```

- **localhost**: a API esta rodando na sua propria maquina
- Se estivesse remoto, seria o endereco IP ou dominio do servidor
- **http vs https**: o "s" e de security. Em desenvolvimento local usa-se http; em producao, sempre https

## O padrao de dois .then()

```javascript
fetch(url)
  .then((response) => response.json())  // 1. Converte metadados → dados JSON
  .then((data) => {                      // 2. Consome os dados
    console.log(data)
  })
```

Esse padrao existe porque o fetch separa duas preocupacoes:
1. **A requisicao HTTP foi bem-sucedida?** (primeiro .then — acesso ao Response)
2. **Quais sao os dados?** (segundo .then — acesso ao conteudo parseado)

## Nomenclatura das callbacks

O instrutor menciona que `response` e `data` sao convencoes de mercado:
- **response** no primeiro .then() — porque e a resposta HTTP completa
- **data** no segundo .then() — porque sao os dados de fato

Voce pode usar qualquer nome (o instrutor mostra que `result` tambem funciona), mas `response` e `data` comunicam melhor a intencao para outros desenvolvedores.

## Parenteses opcionais no parametro de arrow function

```javascript
// Com parenteses (instrutor prefere)
.then((response) => response.json())

// Sem parenteses (tambem funciona)
.then(response => response.json())
```

Ambos sao validos. O instrutor menciona que pessoalmente prefere usar parenteses.

## Servidor precisa estar rodando

Detalhe pratico importante: para o fetch funcionar em desenvolvimento local, o servidor da API precisa estar em execucao. No caso da aula, o comando e `npm run server`. O instrutor mostra que fechar o terminal integrado do VS Code (clicar no X) NAO interrompe o servidor — ele continua rodando em background.