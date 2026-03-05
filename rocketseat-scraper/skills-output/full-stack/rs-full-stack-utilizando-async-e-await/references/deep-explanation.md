# Deep Explanation: Async/Await em Requisicoes

## Por que existem duas formas?

O JavaScript evoluiu de callbacks para Promises (.then()) e depois para async/await. Ambas as formas trabalham com Promises — a diferenca e sintatica, nao funcional.

O `.then()` encadeia callbacks: cada `.then()` recebe o resultado do anterior. Funciona bem para fluxos curtos, mas fica dificil de ler quando ha muitas etapas dependentes.

O `async/await` faz o codigo assincrono parecer sincrono: cada `await` pausa a execucao da funcao ate a Promise resolver, e o resultado e atribuido diretamente a uma variavel. Isso torna o fluxo linear e legivel.

## O duplo await: fetch + .json()

Este e o ponto que mais causa confusao para iniciantes. O `fetch()` retorna uma Promise que resolve para um objeto Response. O metodo `.json()` desse Response TAMBEM retorna uma Promise. Por isso sao necessarios dois `await`:

```javascript
const response = await fetch(url)   // Promise 1: aguarda a resposta HTTP
const data = await response.json()  // Promise 2: aguarda o parse do corpo
```

Se voce esquecer o segundo `await`, a variavel contera um objeto Promise em vez dos dados reais. O instrutor destaca que o VS Code mostra isso ao passar o mouse sobre a variavel — se aparecer `Promise<any>`, falta um `await`.

## Quando usar cada abordagem (insight do instrutor)

O instrutor compartilha sua preferencia pessoal: **usa async/await na maioria das vezes**. A excecao principal e dentro de hooks como `useEffect` do React, onde nao se pode marcar a callback como `async`. Nesses casos, `.then()` evita a necessidade de criar uma funcao interna.

### Regra pratica do instrutor:
- **Quer amarrar etapas sequenciais?** → async/await
- **Nao quer criar funcao nova?** → .then()
- **Dentro de useEffect?** → .then() ou criar funcao interna async

O instrutor enfatiza que a escolha vem com a pratica: "conforme voce vai desenvolvendo e codando, voce vai sentindo essa necessidade" — nao e uma regra rigida, e uma sensibilidade que se desenvolve.

## A funcao precisa ser chamada

Um ponto sutil mas importante: declarar `async function fetchProducts() { ... }` nao executa nada. O instrutor demonstra que apos salvar o arquivo sem chamar a funcao, "nada vai acontecer". E preciso adicionar `fetchProducts()` para que o codigo execute. Com `.then()` isso nao acontece porque o `fetch()` ja inicia a execucao diretamente.

## Async/await na pratica do dia a dia

O instrutor afirma que "ate na maioria das vezes a gente vai usar o async/await". Isso reflete a tendencia da industria: async/await e o padrao dominante em codigo moderno JavaScript/TypeScript, especialmente em:
- Funcoes de API (handlers, controllers)
- Funcoes de servico (service layer)
- Scripts e automacoes
- Qualquer fluxo com multiplas etapas assincronas