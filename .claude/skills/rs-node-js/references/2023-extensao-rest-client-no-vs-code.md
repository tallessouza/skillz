---
name: rs-node-js-2023-rest-client-vscode
description: "Applies REST Client extension patterns when creating or organizing HTTP test files in VS Code projects. Use when user asks to 'test an API route', 'create http file', 'test endpoint', 'setup REST Client', or 'add request file to project'. Ensures proper .http file structure with variables, named requests, and separator syntax. Make sure to use this skill whenever creating .http files or setting up API testing in VS Code. Not for Postman, Insomnia, or automated test suites."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ferramentas
  tags: [rest-client, vscode, http-file, api-testing, variables, requests]
---

# REST Client no VS Code

> Crie arquivos `.http` no projeto para que requisicoes fiquem versionadas e compartilhadas com o time.

## Rules

1. **Use arquivos `.http` no root do projeto** — `client.http` ou `{feature}.http`, porque ficam versionados no git e qualquer dev do time sabe quais rotas existem
2. **Defina variaveis globais no topo** — `@baseURL = http://localhost:3333`, porque evita repetir host/porta em cada requisicao
3. **Separe requisicoes com `###`** — tres cerquilhas entre cada request, porque sem isso o REST Client nao entende onde uma termina e outra comeca
4. **Nomeie cada requisicao** — `# @name create_account` antes do metodo HTTP, porque facilita navegacao e referencia entre requests
5. **Mantenha Content-Type explicito** — sempre declare `Content-Type: application/json` antes do body, porque o REST Client nao infere automaticamente

## How to write

### Estrutura basica de um arquivo .http

```http
@baseURL = http://localhost:3333

# @name create_account
POST {{baseURL}}/accounts
Content-Type: application/json

{
  "name": "Diego Fernandes",
  "email": "diego@example.com",
  "password": "123456"
}

###

# @name authenticate
POST {{baseURL}}/sessions
Content-Type: application/json

{
  "email": "diego@example.com",
  "password": "123456"
}
```

## Example

**Before (sem estrutura):**
```http
POST http://localhost:3333/accounts
Content-Type: application/json

{
  "name": "Diego",
  "email": "diego@test.com",
  "password": "123456"
}
POST http://localhost:3333/sessions
Content-Type: application/json

{
  "email": "diego@test.com",
  "password": "123456"
}
```

**After (com this skill applied):**
```http
@baseURL = http://localhost:3333

# @name create_account
POST {{baseURL}}/accounts
Content-Type: application/json

{
  "name": "Diego",
  "email": "diego@test.com",
  "password": "123456"
}

###

# @name authenticate
POST {{baseURL}}/sessions
Content-Type: application/json

{
  "email": "diego@test.com",
  "password": "123456"
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto novo com rotas HTTP | Criar `client.http` no root |
| Muitas rotas (>10) | Separar em arquivos por dominio: `auth.http`, `users.http` |
| Variavel muda entre ambientes | Usar `@baseURL` e trocar o valor conforme necessario |
| Resposta de uma request alimenta outra | Usar `@name` e referenciar com `{{nomeDaRequest.response.body.token}}` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| URL hardcoded em cada request | `@baseURL` + `{{baseURL}}/path` |
| Requests sem separador | `###` entre cada request |
| Requests sem nome | `# @name descricao_da_request` |
| Body sem Content-Type | `Content-Type: application/json` antes do body |

## Troubleshooting

### REST Client envia todas as requests de uma vez ao clicar Send
**Symptom:** Ao clicar "Send Request", multiplas requests sao enviadas simultaneamente
**Cause:** Faltam os separadores `###` entre as requests no arquivo `.http`
**Fix:** Adicione `###` (tres cerquilhas em linha separada) entre cada request para que o REST Client identifique onde uma termina e outra comeca

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
