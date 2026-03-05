# Deep Explanation: Criando o Primeiro Servidor Node.js

## Por que `request` e `response` por extenso?

O instrutor faz questao de explicar que `req` e `res` sao abreviacoes muito comuns nos projetos, mas escolhe deliberadamente usar os nomes completos `request` e `response` para deixar o codigo mais claro. A decisao e pedagogica: quando voce le `request`, sabe imediatamente que e a requisicao; quando le `response`, sabe que e a resposta. Abreviacoes adicionam uma camada de decodificacao mental desnecessaria.

Citacao do instrutor: "Pra ficar o mais claro possível eu não vou abreviar, mas tudo bem se você quiser abreviar, é bem comum ver essa abreviação nos projetos por aí."

## O que acontece quando o servidor inicia?

O instrutor destaca um comportamento fundamental: ao contrario de scripts JavaScript comuns que executam e encerram, um servidor HTTP fica **em execucao continua**. Quando voce roda `node src/server.js`, o terminal "para" — isso nao e um erro, e o servidor escutando requisicoes.

Citacao: "Antes quando a gente executava um conteúdo simples de JavaScript, ele já executava e encerrava, né? Agora não, porque o nosso servidor está escutando, ele está atendendo requisições na porta 3333."

## O ciclo request/response

A arrow function dentro do `createServer` recebe dois parametros:

1. **request** — contem todas as informacoes sobre a requisicao que chegou (URL, metodo, headers, body)
2. **response** — e o objeto que voce usa para devolver a resposta ao cliente

O `response.end()` e o metodo que finaliza a resposta e a envia de volta. Sem ele, a conexao fica pendente.

## localhost:3333

O instrutor explica que `localhost` aponta para a propria maquina onde o servidor esta rodando. Os dois pontos seguidos do numero da porta (3333) indicam em qual porta o servidor esta escutando. Ao acessar `localhost:3333` no navegador, o navegador faz uma requisicao HTTP GET para o servidor local, que responde com o conteudo passado em `response.end()`.

## A porta 3333

A escolha da porta 3333 e uma convencao nos cursos da Rocketseat. Portas comuns como 3000 (React) e 8080 (proxies) podem gerar conflitos. A porta 3333 e alta o suficiente para nao exigir permissoes especiais e raramente conflita com outros servicos.

## Anatomia do createServer

```javascript
const server = http.createServer((request, response) => {
  // request: tudo sobre o que o cliente enviou
  // response: ferramenta para devolver a resposta
  return response.end('Hello World')
})
```

O `return` antes de `response.end()` e uma boa pratica para garantir que nenhum codigo adicional execute apos o envio da resposta.