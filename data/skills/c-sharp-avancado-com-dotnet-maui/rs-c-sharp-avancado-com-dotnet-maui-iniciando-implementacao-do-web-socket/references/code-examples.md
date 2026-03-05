# Code Examples: Implementando WebSocket com SignalR

## 1. Criando a estrutura de pastas

No Visual Studio, dentro do projeto API:
- Botao direito → Adicionar → Nova Pasta → `Hubs`
- Dentro de `Hubs` → Adicionar → Classe → `UserConnectionsHub.cs`

## 2. Hub completo

```csharp
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class UserConnectionsHub : Hub
    {
        public string GenerateCodes()
        {
            var code = "1234";
            return code;
        }
    }
}
```

**Pontos-chave:**
- A classe herda de `Hub` (de `Microsoft.AspNetCore.SignalR`)
- O nome da funcao `GenerateCodes` e o que o cliente usa para chama-la
- Retornar valor e possivel gracas ao SignalR (WebSocket puro nao suporta)

## 3. Program.cs configurado

```csharp
var builder = WebApplication.CreateBuilder(args);

// Servicos existentes...
builder.Services.AddControllers();
// ... outros servicos ...

// LINHA 1: Adicionar SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Middleware existente...
app.MapControllers();

// LINHA 2: Mapear Hub ao endpoint
app.MapHub<UserConnectionsHub>("/connection");

app.Run();
```

**Ordem importa:**
- `AddSignalR()` deve vir **antes** de `builder.Build()`
- `MapHub<>()` deve vir **antes** de `app.Run()`

## 4. Testando com Postman

### Passo 1: Criar conexao WebSocket
- No Postman: New → WebSocket
- URL: `wss://localhost:27045/connection` (substituir porta pela sua)
- Clicar "Connect"

### Passo 2: Handshake (obrigatorio, uma unica vez)
```json
{"protocol":"json","version":1}␞
```
(O `␞` e o caractere Unicode 0x1E — Record Separator)

### Passo 3: Chamar funcao
```json
{"type":1,"invocationId":"1","target":"GenerateCodes","arguments":[]}␞
```

**Campos da mensagem:**
| Campo | Valor | Significado |
|-------|-------|-------------|
| `type` | `1` | Chamada de funcao (invocation) |
| `invocationId` | `"1"` | ID unico da mensagem |
| `target` | `"GenerateCodes"` | Nome exato da funcao no Hub |
| `arguments` | `[]` | Lista de parametros (vazia neste caso) |

### Resposta esperada
```json
{"type":3,"invocationId":"1","result":"1234"}
```
- `type: 3` = resultado de invocacao

## 5. Variacao: Hub com parametros

```csharp
public class UserConnectionsHub : Hub
{
    public string GenerateCodes()
    {
        var code = "1234";
        return code;
    }

    // Exemplo com parametro
    public string GreetUser(string userName)
    {
        return $"Bem-vindo, {userName}!";
    }
}
```

Chamada no Postman:
```json
{"type":1,"invocationId":"2","target":"GreetUser","arguments":["Alisson"]}␞
```

## 6. Comparacao lado a lado: HTTP vs SignalR

### HTTP (Controller)
```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult GetUser(int id) { /* ... */ }

    [HttpPost]
    public IActionResult CreateUser(UserDto dto) { /* ... */ }
}
// Cada funcao = 1 endpoint (GET /api/users/1, POST /api/users)
```

### SignalR (Hub)
```csharp
public class UserConnectionsHub : Hub
{
    public string GenerateCodes() { /* ... */ }

    public string GreetUser(string userName) { /* ... */ }
}
// 1 endpoint (/connection) = todas as funcoes
// Funcoes chamadas pelo nome via mensagem
```