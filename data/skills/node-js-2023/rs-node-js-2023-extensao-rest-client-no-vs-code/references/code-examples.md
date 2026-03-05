# Code Examples: REST Client no VS Code

## Exemplo completo do arquivo demonstrado na aula

```http
@baseURL = http://localhost:3333

# @name create_account
POST {{baseURL}}/accounts
Content-Type: application/json

{
  "name": "Diego Fernandes",
  "email": "diego@skillz.com.br",
  "password": "123456"
}

###

# @name authenticate
POST {{baseURL}}/sessions
Content-Type: application/json

{
  "email": "diego@skillz.com.br",
  "password": "123456"
}
```

## Variacoes uteis

### Usando resposta de uma request em outra

```http
@baseURL = http://localhost:3333

# @name authenticate
POST {{baseURL}}/sessions
Content-Type: application/json

{
  "email": "diego@skillz.com.br",
  "password": "123456"
}

###

# @name create_question
POST {{baseURL}}/questions
Content-Type: application/json
Authorization: Bearer {{authenticate.response.body.access_token}}

{
  "title": "Minha pergunta",
  "content": "Conteudo da pergunta"
}
```

### Multiplos metodos HTTP

```http
@baseURL = http://localhost:3333

# @name list_questions
GET {{baseURL}}/questions?page=1

###

# @name get_question
GET {{baseURL}}/questions/some-slug

###

# @name delete_question
DELETE {{baseURL}}/questions/question-id
Authorization: Bearer {{authenticate.response.body.access_token}}
```

### Arquivo separado por dominio (auth.http)

```http
@baseURL = http://localhost:3333

# @name register
POST {{baseURL}}/accounts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

###

# @name login
POST {{baseURL}}/sessions
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

## Detalhes de sintaxe

- **Linha em branco obrigatoria** entre headers e body
- **Sem virgula final** no JSON (diferente de JavaScript objects)
- **`###` em linha propria** — nao colocar na mesma linha de outra coisa
- **`# @name` com espaco** antes do `@` — e um comentario HTTP com diretiva