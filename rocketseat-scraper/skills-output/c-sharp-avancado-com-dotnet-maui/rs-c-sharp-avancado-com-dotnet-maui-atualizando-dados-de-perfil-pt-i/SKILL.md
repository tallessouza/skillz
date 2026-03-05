---
name: rs-csharp-maui-atualizando-perfil-pt1
description: "Applies Refit API interface patterns for HTTP PUT endpoints returning 204 No Content in .NET MAUI apps. Use when user asks to 'create a PUT endpoint', 'update profile API', 'handle 204 response', 'configure Refit interface', or 'implement update endpoint'. Enforces IApiResponse without generic type for no-content responses, correct HTTP verb decoration, and Use Case interface scaffolding. Make sure to use this skill whenever building Refit API interfaces with non-GET/POST verbs or handling empty API responses. Not for GET endpoints, POST with response body, or ViewModel implementation."
---

# Refit API Interface para Endpoints PUT com 204 No Content

> Ao criar interfaces Refit para endpoints que retornam 204 No Content, use `IApiResponse` sem tipo generico ao inves de `ApiResponse<string>`.

## Rules

1. **Use o verbo HTTP correto na interface Refit** — `[Put]` para atualizacao, `[Post]` para criacao, porque o Refit precisa corresponder ao verbo do controller da API
2. **Use `IApiResponse` sem tipo generico para 204 No Content** — porque `ApiResponse<T>` obriga um tipo desnecessario quando a API nao retorna corpo na resposta
3. **Nunca use `ApiResponse<string>` como workaround** — funciona mas e semanticamente incorreto; `IApiResponse` e a interface correta, porque expressa a intencao real
4. **Confira o controller da API antes de definir a interface** — verifique o verbo HTTP, a rota e o tipo de retorno, porque copiar de outro endpoint sem ajustar causa erros silenciosos
5. **Registre o Use Case no container de DI imediatamente** — adicione no `MauiProgram` logo apos criar a classe, porque esquecer causa erro em runtime
6. **Use `Result` sem tipo generico quando ViewModel nao precisa de dados** — apenas sucesso/erro, porque o endpoint 204 nao retorna dados para exibir

## How to write

### Interface Refit para PUT sem resposta

```csharp
// IApiResponse sem tipo generico — endpoint retorna 204 No Content
[Put("/users")]
Task<IApiResponse> UpdateProfile([Body] RequestUpdateUserJSON request);
```

### Interface Refit para PUT/POST com resposta

```csharp
// IApiResponse<T> com tipo — endpoint retorna 200 com corpo
[Post("/users")]
Task<IApiResponse<ResponseRegisterUserJSON>> Register([Body] RequestRegisterUserJSON request);
```

### Use Case interface com Result sem tipo

```csharp
public interface IUpdateUserUseCase
{
    Task<Result> Execute(Models.User user);
}
```

### Registro no MauiProgram

```csharp
// Adicionar junto aos outros Use Cases
builder.Services.AddTransient<IUpdateUserUseCase, UpdateUserUseCase>();
```

## Example

**Before (workaround comum com string):**
```csharp
[Put("/users")]
Task<ApiResponse<string>> UpdateProfile([Body] RequestUpdateUserJSON request);
// Funciona mas ApiResponse<string>.Content sera null/vazio — semanticamente errado
```

**After (com esta skill aplicada):**
```csharp
[Put("/users")]
Task<IApiResponse> UpdateProfile([Body] RequestUpdateUserJSON request);
// IApiResponse sem generico — expressa corretamente que nao ha corpo na resposta
// Ainda tem acesso a StatusCode, IsSuccessStatusCode, Error, etc.
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API retorna 204 No Content | Use `IApiResponse` sem tipo generico |
| API retorna 200 com JSON | Use `IApiResponse<TipoResposta>` com tipo generico |
| Endpoint precisa de autenticacao | Confie no Handler centralizado (ex: PlainShareHandler) — nao adicione token manualmente |
| Copiando de outro endpoint Refit | Ajuste verbo HTTP, rota, tipo de request E tipo de response |
| Use Case nao retorna dados | Use `Result` sem tipo generico |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `Task<ApiResponse<string>> UpdateProfile(...)` | `Task<IApiResponse> UpdateProfile(...)` |
| `[Post("/users")] UpdateProfile(...)` | `[Put("/users")] UpdateProfile(...)` |
| `Task<ApiResponse> UpdateProfile(...)` | `Task<IApiResponse> UpdateProfile(...)` (use a interface, nao a classe) |
| `Task<Result<ResponseUpdateUserJSON>> Execute(...)` para 204 | `Task<Result> Execute(...)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
