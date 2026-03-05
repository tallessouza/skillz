# Code Examples: Testes de Integracao com WebApplicationFactory

## Setup completo passo a passo

### 1. Criar o projeto de teste

No Visual Studio:
- Botao direito na pasta `BackEnd/Tests`
- Adicionar → Novo Projeto → xUnit Test Project
- Nome: `WebAPI`
- Localização: pasta `Tests/BackEnd`

### 2. Adicionar referencias de projeto

```
Dependencias do projeto WebAPI:
- CommonTestUtilities (builders compartilhados)
- PlanShare.API (para acessar Program)
```

### 3. Instalar pacotes NuGet

```bash
dotnet add package Microsoft.AspNetCore.Mvc.Testing --version 9.0.10
dotnet add package Shouldly
```

Tambem atualizar todos os pacotes existentes para ultimas versoes.

### 4. Configurar Program.cs

```csharp
// Program.cs da API - adicionar no FINAL do arquivo
// Sem isso, o projeto de teste nao consegue referenciar a API

public partial class Program { }
```

**Nota:** `partial` e obrigatorio. Sem ele, da erro de compilacao porque o compilador ja gera uma classe Program implicitamente a partir dos top-level statements.

### 5. Criar estrutura de pastas

```
WebAPI/
  User/
    Register/
      RegisterUserTests.cs
```

### 6. Implementar a classe de teste

```csharp
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Shouldly;

public class RegisterUserTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _httpClient;

    public RegisterUserTests(WebApplicationFactory<Program> factory)
    {
        _httpClient = factory.CreateClient();
    }

    [Fact]
    public async Task Sucesso()
    {
        // Arrange - usando builder do CommonTestUtilities
        var request = RequestRegisterUserJsonBuilder.Build();

        // Act - requisicao HTTP real na API
        var response = await _httpClient.PostAsJsonAsync("/users", request);

        // Assert - verificar status code
        response.StatusCode.ShouldBe(HttpStatusCode.Created);
    }
}
```

## Comparacao: como a URL funciona

### No app MAUI (com Refit)

```csharp
// Interface Refit
[Post("/users")]
Task<ResponseRegisteredUserJson> Register([Body] RequestRegisterUserJson request);

// Configuracao no MauiProgram.cs
services.AddRefitClient<IUserApi>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri(apiUrl));
```

### No teste de integracao

```csharp
// CreateClient() ja configura a URL base automaticamente
var client = factory.CreateClient();

// Basta passar o path relativo
var response = await client.PostAsJsonAsync("/users", request);
```

O `CreateClient()` faz o equivalente ao que o Refit faz: configura o endereco base internamente. Voce so precisa do path.

## Depuracao de testes de integracao

```csharp
[Fact]
public async Task Sucesso()
{
    var request = RequestRegisterUserJsonBuilder.Build();

    // Coloque breakpoint AQUI para ver a request
    var response = await _httpClient.PostAsJsonAsync("/users", request);

    // Coloque breakpoint AQUI tambem - importante!
    // Sem este breakpoint, o teste pode finalizar antes de voce inspecionar
    response.StatusCode.ShouldBe(HttpStatusCode.Created);
}
```

**Dica do instrutor:** coloque breakpoint tambem no controller da API. Voce vera o fluxo completo:
1. Teste envia request
2. Breakpoint no controller e atingido
3. UseCase executa (validacao, criptografia, etc)
4. Repository salva no banco
5. Tokens sao gerados
6. Response volta ao teste
7. Assert valida o StatusCode

## Verificacao de diferentes status codes

```csharp
// POST - criacao de recurso
response.StatusCode.ShouldBe(HttpStatusCode.Created); // 201

// GET - busca de recurso
response.StatusCode.ShouldBe(HttpStatusCode.OK); // 200

// POST com dados invalidos
response.StatusCode.ShouldBe(HttpStatusCode.BadRequest); // 400

// Acesso nao autorizado
response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized); // 401
```

## Cenarios que precisam de mock vs fluxo real

```csharp
// FLUXO REAL (sem mock) - maioria dos cenarios
// Controller → UseCase → Repository → Banco
[Fact]
public async Task RegistrarUsuario_Sucesso()
{
    var request = RequestRegisterUserJsonBuilder.Build();
    var response = await _httpClient.PostAsJsonAsync("/users", request);
    response.StatusCode.ShouldBe(HttpStatusCode.Created);
}

// COM MOCK - servico externo (Azure Storage, por exemplo)
// Nao queremos fazer upload real de imagem durante teste
// Implementacao de mock sera vista em aulas futuras
```