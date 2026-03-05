# Deep Explanation: URL da Requisição e Roteamento Manual

## O que é a URL da requisição

Quando o servidor HTTP recebe uma requisição, o objeto `request` contém a propriedade `url` que representa o **path** após o endereço base. Por exemplo, em `http://localhost:3333/products/7`:

- **Base URL:** `http://localhost:3333` — endereço do servidor (host + porta). Não muda entre requisições.
- **Path:** `/products/7` — identifica a funcionalidade ou recurso sendo acessado. É o que importa para o roteamento.

O instrutor enfatiza: "essa parte sempre vai ser a mesma, por isso o que mais interessa para a gente é aqui [o path], porque conhecendo a URL a gente sabe qual é a funcionalidade."

## Método + URL = Rota

A grande sacada desta aula é que **a mesma URL pode ter comportamentos completamente diferentes dependendo do método HTTP**. O instrutor demonstra:

- `GET /products` → Lista de produtos
- `POST /products` → Produto cadastrado

Embora o endereço seja idêntico (`/products`), o método diferencia a intenção do cliente. Isso é a base do padrão RESTful — o recurso é identificado pela URL e a ação pelo método.

## Roteamento manual com if/else

Sem frameworks, o roteamento é feito com condicionais simples verificando `method` e `url`. O padrão demonstrado:

1. Checar método + URL em cada `if`
2. Usar `return` para encerrar a resposta e evitar execução do código seguinte
3. Setar status codes apropriados (`writeHead(201)` para criação)
4. Ter um fallback no final para rotas não mapeadas (404)

## Status codes ensinados

- **200** — Sucesso (padrão, não precisa setar explicitamente)
- **201** — Criado (usar em POST que cria recursos)
- **404** — Não encontrado (rota não existe na API)

## Por que `response.end()` vs `response.write()` + `response.end()`

O instrutor usa `response.end('mensagem')` como atalho para enviar a resposta e encerrar. Quando precisa setar status code diferente de 200, usa `response.writeHead(201)` antes do `end()`.