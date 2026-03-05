# Deep Explanation: Obtendo Dados da Requisicao

## Tres fontes de dados em uma requisicao HTTP

O instrutor demonstra que existem fontes distintas de dados em uma requisicao, e cada uma tem um proposito diferente:

### 1. Query Params (`request.query` ou extraidos manualmente)
- Vem na URL apos `?`: `/tickets?status=open`
- Ja estavam sendo recuperados no middleware de rotas
- Usados para filtros, buscas, paginacao

### 2. Route Params (`request.params`)
- Vem como parte do path: `/tickets/:id` → `request.params.id`
- O router faz pattern matching e extrai automaticamente
- O instrutor mostra que no middleware de rotas, os parametros nomeados ja sao extraidos com spread operator (`...params`)
- Usados para identificar recursos especificos

### 3. Body Params (`request.body`)
- Vem no corpo da requisicao (POST, PUT, PATCH)
- Enviados como JSON, form-data, etc.
- O instrutor demonstra enviando `{ "equipment": "mouse", "description": "..." }` via Insomnia
- Usados para dados mutaveis que o cliente quer criar ou atualizar

## Como o middleware de rotas popula request.params

O instrutor mostra o codigo do middleware que lida com rotas. Ele ja extraia query params, e adiciona route params com:

```javascript
// No middleware de rotas
request.params = params  // parametros extraidos do pattern matching da URL
```

Isso significa que quando a rota `/tickets/:id` recebe `/tickets/abc-123`, o middleware automaticamente cria `request.params = { id: "abc-123" }`.

## Status codes — o raciocinio do instrutor

O instrutor passa por um processo de pensamento em voz alta:

1. Primeiro tenta 204 (No Content) — faz sentido para update sem retorno
2. Depois questiona se existe um status code especifico para "updated" — nao existe
3. Pesquisa e conclui: **200 e o padrao para sucesso**, 201 e para criacao
4. Decide que para PUT pode usar 200 (padrao) ou 204 (sem corpo)
5. Nota importante: **200 ja e o padrao**, entao `response.end()` sem `writeHead` ja retorna 200

### Tabela de status codes mencionados

| Code | Nome | Quando usar |
|------|------|-------------|
| 200 | OK | Sucesso generico (padrao, nao precisa definir) |
| 201 | Created | Apos criar um recurso (POST) |
| 204 | No Content | Sucesso sem corpo na resposta (DELETE, PUT sem retorno) |

### Insight do instrutor
"Voce nao precisa ficar decorando esses status codes" — a mensagem e que o importante e entender a semantica (sucesso, criado, sem conteudo) e consultar quando necessario, nao memorizar numeros.

## Desestruturacao como padrao

O instrutor evolui o codigo progressivamente:

1. Primeiro: `request.params.id` — acesso direto
2. Depois: `const { id } = request.params` — destructuring

Isso mostra um padrao de refatoracao natural: comece fazendo funcionar, depois melhore a legibilidade com destructuring.