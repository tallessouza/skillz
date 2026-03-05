---
name: rs-angular-req-registro-usuario
description: "Applies Angular HTTP request patterns when creating API service methods for user registration or similar POST endpoints. Use when user asks to 'create an API service', 'implement a register endpoint', 'make a POST request in Angular', or 'type an HTTP response'. Enforces typed HttpClient calls, response interfaces, and clean parameter passing. Make sure to use this skill whenever building Angular services that call REST APIs. Not for template/component logic, form validation, or routing."
---

# Requisicoes HTTP Tipadas em Angular

> Toda chamada HTTP deve ter tipagem explicita no retorno — nunca retornar Observable de Object.

## Rules

1. **Tipe o generico do HttpClient** — `this.httpClient.post<MinhaInterface>(...)` nao `this.httpClient.post(...)`, porque Observable de Object perde toda informacao de tipo e quebra autocomplete
2. **Crie interfaces para cada response** — uma interface por endpoint de sucesso em `shared/models/`, porque respostas tipadas previnem bugs silenciosos em projetos complexos
3. **Use shorthand de propriedades** — `{ name, email, password }` nao `{ name: name, email: email }`, porque quando parametros tem o mesmo nome das propriedades do body, shorthand e mais limpo
4. **Receba parametros primitivos, monte o objeto dentro** — o metodo recebe `(name: string, email: string, password: string)` e monta o body internamente, porque isola a estrutura da API do chamador
5. **Nomeie interfaces pelo contexto** — `UserRegisterSuccessResponse` nao `RegisterResponse` ou `ApiResponse`, porque o nome deve indicar endpoint + tipo de resposta

## How to write

### Metodo de servico com POST tipado

```typescript
// user-api.service.ts
register(name: string, email: string, password: string) {
  return this.httpClient.post<UserRegisterSuccessResponse>(
    'http://localhost:3000/users',
    { name, email, password }
  );
}
```

### Interface de response

```typescript
// shared/models/user-register-success-response.ts
export interface UserRegisterSuccessResponse {
  id: number;
  name: string;
  email: string;
}
```

## Example

**Before (sem tipagem):**
```typescript
register(name: string, email: string, password: string) {
  return this.httpClient.post('http://localhost:3000/users', {
    name: name,
    email: email,
    password: password,
  });
}
// Retorna Observable<Object> — sem autocomplete, sem seguranca
```

**After (com tipagem aplicada):**
```typescript
register(name: string, email: string, password: string) {
  return this.httpClient.post<UserRegisterSuccessResponse>(
    'http://localhost:3000/users',
    { name, email, password }
  );
}
// Retorna Observable<UserRegisterSuccessResponse> — tipado, seguro
```

## Heuristics

| Situation | Do |
|-----------|-----|
| POST/PUT/PATCH com body | Tipar o generico do metodo HTTP com interface de response |
| GET sem body | Tipar o generico do GET: `this.httpClient.get<T>(url)` |
| Response tem estrutura conhecida | Criar interface em `shared/models/` |
| Parametros do metodo = propriedades do body | Usar shorthand `{ name, email }` |
| Endpoint retorna dados diferentes em erro | Criar interface separada para error response |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `this.httpClient.post(url, body)` sem generico | `this.httpClient.post<MyResponse>(url, body)` |
| `{ name: name, email: email }` | `{ name, email }` |
| Interface generica `ApiResponse` para tudo | Interface especifica `UserRegisterSuccessResponse` |
| Body montado fora do servico | Body montado dentro do metodo do servico |
| `any` como tipo de retorno | Interface explicita com todas as propriedades |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
