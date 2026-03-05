# Deep Explanation: Utilizando Status Code no Node.js

## Por que status codes importam

Status codes sao metadados do cabecalho HTTP que informam ao cliente o resultado da requisicao. Sem eles, o cliente nao consegue distinguir entre sucesso, erro do cliente ou erro do servidor de forma programatica.

O instrutor demonstra isso visualmente no Insomnia: cada faixa de status code tem uma cor diferente (verde para 2xx, vermelho para 4xx/5xx), facilitando a identificacao rapida durante desenvolvimento.

## O metodo writeHead

`response.writeHead(statusCode)` escreve o cabecalho da resposta HTTP. Deve ser chamado ANTES de `response.end()`.

A sequencia correta e sempre:
1. `res.writeHead(statusCode)` — define o status
2. `res.end(body)` — envia o corpo e finaliza

## Faixas de status code

| Faixa | Significado | Cor no Insomnia |
|-------|-------------|-----------------|
| 1xx | Informacional | — |
| 2xx | Sucesso | Verde |
| 3xx | Redirecionamento | — |
| 4xx | Erro do cliente | Vermelho/Laranja |
| 5xx | Erro do servidor | Vermelho |

### Status codes mais comuns mencionados na aula

- **200 OK** — Resposta padrao de sucesso. Node.js usa este quando nenhum status code e definido explicitamente.
- **201 Created** — Recurso criado com sucesso. Usar em respostas de POST que criam algo.
- **404 Not Found** — Recurso nao encontrado. O nome "Not Found" vem automaticamente da tabela de status codes HTTP.
- **500 Internal Server Error** — Erro interno do servidor. Indica que algo deu errado no backend.

## Comportamento padrao

Quando voce NAO define um status code com `writeHead()`, o Node.js automaticamente usa `200`. O instrutor enfatiza que e melhor ser explicito, porque:
1. Torna a intencao clara no codigo
2. Permite tratar diferentes cenarios com status codes apropriados
3. Facilita debugging — voce ve exatamente o que esta acontecendo

## Cada numero tem um significado

O instrutor repete varias vezes: "cada numero tem um significado". Os nomes associados (OK, Not Found, Internal Server Error, Created) vem da especificacao HTTP e sao adicionados automaticamente pelo Node.js quando voce usa o status code correspondente.

## Analogia do instrutor

O status code e como uma "informacao adicional" no cabecalho da resposta. Assim como o metodo da requisicao (GET, POST) diz o que o cliente quer fazer, o status code diz o que aconteceu com essa requisicao.