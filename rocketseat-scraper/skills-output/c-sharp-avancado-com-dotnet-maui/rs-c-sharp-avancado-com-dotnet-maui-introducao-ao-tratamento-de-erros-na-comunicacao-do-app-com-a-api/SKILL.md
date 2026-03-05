---
name: rs-csharp-avancado-tratamento-erros-api
description: "Enforces proper API error handling in .NET MAUI apps using Refit's ApiResponse wrapper. Use when user asks to 'call an API', 'handle API errors', 'fix app crash', 'use Refit', or 'communicate with API from mobile app'. Applies rules: never assume API success, always use ApiResponse<T> instead of direct deserialization, check IsSuccessStatusCode before accessing Content, handle error branch explicitly. Make sure to use this skill whenever generating Refit API interface code or API communication in .NET MAUI. Not for general C# exception handling, backend API development, or non-Refit HTTP clients."
---

# Tratamento de Erros na Comunicação App-API com Refit

> Nunca assuma que a API vai retornar sucesso — sempre use `ApiResponse<T>` do Refit e verifique o status antes de acessar o conteúdo.

## Rules

1. **Nunca retorne o tipo direto na interface Refit** — use `ApiResponse<T>` em vez de `Task<T>`, porque retorno direto lança exceção não tratada quando a API retorna erro, crashando o app
2. **Sempre verifique IsSuccessStatusCode antes de acessar Content** — porque `Content` só está deserializado corretamente em caso de sucesso
3. **Acesse propriedades via response.Content, não response diretamente** — porque `ApiResponse<T>` encapsula a resposta completa da API, e o objeto deserializado está em `.Content`
4. **Trate o branch de erro explicitamente** — `response.Error.Content` contém a string JSON do erro, que precisa ser deserializada separadamente
5. **Use StatusCode para decisões granulares** — `response.StatusCode` dá acesso ao código HTTP (400, 401, 404, 500) para tratamento específico por tipo de erro

## How to write

### Interface Refit com ApiResponse

```csharp
// CORRETO: ApiResponse encapsula toda a resposta
public interface ILoginApi
{
    [Post("/login")]
    Task<ApiResponse<ResponseHasTheUserJson>> Login([Body] RequestLoginJson request);
}

public interface IUserApi
{
    [Post("/user")]
    Task<ApiResponse<ResponseHasTheUserJson>> Register([Body] RequestRegisterUserJson request);
}
```

### Verificação de sucesso no Use Case

```csharp
var response = await _loginApi.Login(request);

if (response.IsSuccessStatusCode)
{
    // Content está deserializado no tipo correto
    var id = response.Content.Id;
    var name = response.Content.Name;
    var tokens = response.Content.Tokens;

    // Criar records, armazenar dados...
}
else
{
    // Erro: response.Error.Content é uma string JSON
    var errorJson = response.Error.Content;
    // Deserializar na próxima etapa
}
```

## Example

**Before (app crasha com erro da API):**
```csharp
// Interface retorna tipo direto
public interface ILoginApi
{
    [Post("/login")]
    Task<ResponseHasTheUserJson> Login([Body] RequestLoginJson request);
}

// Use case acessa direto
var response = await _loginApi.Login(request);
var id = response.Id;        // EXCEÇÃO se API retornar 401
var name = response.Name;    // App crasha aqui
```

**After (com ApiResponse do Refit):**
```csharp
// Interface usa ApiResponse<T>
public interface ILoginApi
{
    [Post("/login")]
    Task<ApiResponse<ResponseHasTheUserJson>> Login([Body] RequestLoginJson request);
}

// Use case verifica sucesso
var response = await _loginApi.Login(request);

if (response.IsSuccessStatusCode)
{
    var id = response.Content.Id;
    var name = response.Content.Name;
    var tokens = response.Content.Tokens;
}
else
{
    // Tratar erro sem crashar
    var errorContent = response.Error.Content;
}
```

## Heuristics

| Situação | Ação |
|----------|------|
| Qualquer chamada Refit a API externa | Usar `ApiResponse<T>` no retorno |
| App fecha sozinho após chamada API | Verificar se está usando retorno direto sem `ApiResponse` |
| Precisa do status code HTTP | Acessar `response.StatusCode` |
| Precisa do corpo do erro | Acessar `response.Error.Content` (string JSON) |
| Sucesso confirmado | Acessar dados via `response.Content` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Task<ResponseJson> Login(...)` | `Task<ApiResponse<ResponseJson>> Login(...)` |
| `var id = response.Id` | `var id = response.Content.Id` |
| Acessar Content sem verificar sucesso | `if (response.IsSuccessStatusCode) { ... }` |
| Ignorar o branch de erro | Sempre ter um `else` tratando `response.Error` |
| Try-catch genérico em volta da chamada | Usar `ApiResponse` que já previne a exceção |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
