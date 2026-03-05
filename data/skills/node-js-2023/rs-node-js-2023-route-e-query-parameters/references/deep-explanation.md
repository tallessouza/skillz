# Deep Explanation: Route e Query Parameters

## Os tres canais de comunicacao front-end → back-end

O instrutor (Diego Fernandes, Skillz) explica que existem exatamente tres formas de enviar informacoes para uma API:

1. **Query Parameters** — parametros nomeados na URL
2. **Route Parameters** — parametros nao-nomeados na URL
3. **Request Body** — dados enviados fora da URL

### URL Stateful — a analogia do compartilhamento

Diego usa uma analogia muito clara: imagine que voce filtrou uma lista de usuarios por "Diego", copiou a URL e mandou para um colega. Se os filtros estao nos query parameters (`?search=diego`), quando o colega abrir a URL, a lista ja vem filtrada. Se nao estiverem, o filtro se perde — a URL nao e "stateful".

Esse e o criterio principal para decidir usar query parameters: **a informacao precisa sobreviver ao compartilhamento da URL?**

### Route Parameters — o metodo HTTP da o contexto

Um ponto sutil que Diego destaca: route parameters nao precisam de nome porque o **metodo HTTP ja explica o significado**. 

- `GET /users/1` → estou **buscando** o usuario 1
- `DELETE /users/1` → estou **deletando** o usuario 1
- `PUT /users/1` → estou **atualizando** o usuario 1

A combinacao **metodo + recurso + route parameter** e auto-explicativa. Nao precisa de `?id=1` porque seria redundante.

### Seguranca: URL nunca e segura

Diego enfatiza que **nenhuma informacao na URL e criptografada**, independente de HTTPS. Tanto query params quanto route params ficam visiveis e facilmente interceptaveis. Somente o request body passa pelo protocolo HTTPS com criptografia.

Isso define a regra: dados sensiveis (senhas, tokens, dados pessoais extensos) → sempre no body.

### Praticidade: URL tem limite de tamanho

Outro argumento pratico: formularios com muitos campos (20+ campos) simplesmente nao cabem na URL de forma legivel. O body nao tem essa limitacao e aceita estruturas JSON complexas.

## Parametros dinamicos em rotas

Na parte pratica, Diego mostra o problema: ao criar uma rota `DELETE /users`, voce precisa saber **qual** usuario deletar. O ID do usuario e dinamico (cada usuario tem um UUID diferente), entao nao pode ser hardcoded no path. Isso motiva a necessidade de route parameters dinamicos (`:id`), que sera implementado nas proximas aulas.