# Deep Explanation: Criando uma API com json-server

## O que e um recurso (endpoint)

O instrutor explica que "recurso" e o que voce acessa quando coloca `localhost:porta/nome-do-recurso`. Cada propriedade raiz do arquivo JSON vira automaticamente um endpoint da API. Se voce tem `"products"` e `"users"` no JSON, o json-server cria `/products` e `/users` como rotas acessiveis.

O termo "endpoint" e sinonimo de "recurso" neste contexto — ambos referem-se ao caminho que a API disponibiliza para acesso.

## Como o json-server detecta endpoints

Ao rodar o servidor, ele le o arquivo JSON e identifica todas as propriedades raiz. O output do terminal mostra quais endpoints foram detectados. Se voce adicionar uma nova propriedade e salvar, ele recarrega e detecta o novo endpoint automaticamente.

## Comportamento de filtragem por ID

O json-server usa a propriedade `id` como criterio automatico de filtro:

- `/products` → retorna o array completo
- `/products/2` → procura no array o objeto com `id: 2` e retorna so ele
- `/products/7` (inexistente) → retorna 404 Not Found

Isso simula o comportamento real de uma API REST onde:
- A rota sem parametro lista todos
- A rota com parametro retorna um item especifico
- Item inexistente retorna erro

## Analogia com o mundo real

O instrutor faz uma analogia com e-commerce:
1. Pagina de listagem de produtos → `GET /products` (busca todos)
2. Usuario clica em um produto → `GET /products/3` (busca detalhes do produto 3)

Em uma API real, isso envolveria consulta ao banco de dados com `SELECT ... WHERE id = 3`. O json-server abstrai toda essa complexidade, permitindo que o frontend developer foque no consumo da API sem precisar configurar banco de dados.

## Por que usar json-server

- Simula comportamento real de API REST
- Nao precisa de backend, banco de dados ou configuracao complexa
- Permite testar o frontend com dados realistas
- Suporta GET, POST, PUT, PATCH, DELETE automaticamente
- Ideal para aprender fetch/AJAX antes de ter um backend real

## Requisicoes pelo navegador

O instrutor explica que quando voce acessa uma URL no navegador, ele faz uma requisicao HTTP GET por padrao. Por isso e possivel testar a API diretamente na barra de enderecos. Nas aulas seguintes, essas requisicoes serao feitas via JavaScript usando `fetch()`.