# Deep Explanation: Route Params em Node.js Puro

## Por que "parâmetros não nomeados"?

O instrutor explica que quando você passa `/products/7`, o `7` faz parte da rota mas **não está explícito** o que ele representa. Não existe um `id=7` visível — por isso o nome "parâmetro não nomeado". Ele é **implícito pela posição** na URL.

A convenção `:id` (dois pontos + nome) existe justamente para resolver isso **do lado da API**. O cliente envia `/products/7`, mas na definição da rota você escreve `/products/:id` para que o código saiba que aquele segmento dinâmico se chama `id`.

## O problema da comparação estrita

O ponto central da aula é demonstrar **por que igualdade estrita falha**. O instrutor mostra passo a passo:

1. Define a rota como `DELETE /products/:id`
2. O cliente envia `DELETE /products/7`
3. No middleware de routing, a comparação `route.path === url` compara a string `/products/:id` com `/products/7`
4. São strings diferentes → rota não encontrada

O instrutor prova isso com `console.log(request.url)` — a URL que chega é literalmente `/products/7`, não `/products/:id`.

## Por que regex é a solução

Para que o router entenda que `/products/7` casa com o padrão `/products/:id`, é necessário:

1. Converter a definição `/products/:id` em uma expressão regular: `/^\/products\/([^/]+)$/`
2. Testar a URL real contra essa regex
3. Extrair os grupos capturados e associá-los aos nomes dos parâmetros

Isso permite **matching por padrão** em vez de matching por igualdade.

## Fluxo mental do routing

```
Request chega: DELETE /products/7
         │
         ▼
Para cada rota registrada:
  - Método bate? DELETE === DELETE ✓
  - Path bate? /products/:id ~= /products/7 ?
    - Converte :id → regex group ([^/]+)
    - Testa /^\/products\/([^/]+)$/ contra /products/7
    - Match! Captura grupo 1 = "7"
         │
         ▼
params = { id: "7" }
Handler recebe params e executa lógica
```

## Contexto REST

Em APIs REST, cada método HTTP tem semântica:

| Método | Rota típica | Significado |
|--------|-------------|-------------|
| GET | `/products` | Listar todos |
| GET | `/products/:id` | Buscar um específico |
| POST | `/products` | Criar novo |
| PUT | `/products/:id` | Atualizar específico |
| DELETE | `/products/:id` | Remover específico |

O parâmetro `:id` aparece sempre que a operação age sobre **um recurso específico**, não sobre a coleção inteira.

## Param sempre chega como string

O valor extraído da URL é sempre uma string (`"7"`, não `7`). Se o banco espera um número, você precisa converter explicitamente com `Number(params.id)` ou validar com uma lib.