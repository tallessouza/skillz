---
name: rs-csharp-avancado-iniciando-websocket
description: "Applies SignalR WebSocket implementation patterns when setting up real-time communication in .NET/C# APIs. Use when user asks to 'add websocket', 'implement signalr', 'create a hub', 'real-time communication', or 'configure signalr in dotnet'. Covers Hub creation, Program.cs configuration, endpoint mapping, and handshake protocol. Make sure to use this skill whenever building real-time features in ASP.NET Core projects. Not for HTTP controllers, REST APIs, or frontend WebSocket client code."
---

# Implementando WebSocket com SignalR no .NET

> Configure comunicacao em tempo real criando Hubs (equivalentes a Controllers para WebSocket) e mapeando endpoints no Program.cs.

## Rules

1. **Use SignalR, nao WebSocket cru** — SignalR opera acima do protocolo WebSocket com protocolo proprio de alto nivel, porque simplifica envio/resposta de mensagens e adiciona funcionalidades como request-response do cliente
2. **Organize Hubs por contexto, como Controllers** — cada Hub deve ter responsabilidade unica (`UserConnectionsHub`, `ChatHub`), porque misturar contextos gera Hubs monoliticos impossiveis de manter
3. **Nomeie Hubs com sufixo Hub** — `UserConnectionsHub` nao `UserConnections`, porque segue a convencao de Controllers e facilita identificacao
4. **Cliente pode enviar e aguardar resposta, servidor nao** — SignalR permite request-response apenas do cliente para o servidor, porque o protocolo foi desenhado assim
5. **Funcoes sao chamadas pelo nome exato** — o cliente precisa conhecer o nome da funcao no Hub, porque nao ha endpoint individual por funcao como no HTTP
6. **Nao instale pacotes extras na API** — SignalR ja faz parte do ecossistema .NET, porque `Microsoft.AspNetCore.SignalR` vem incluido

## How to write

### Criar um Hub

```csharp
using Microsoft.AspNetCore.SignalR;

public class UserConnectionsHub : Hub
{
    public string GenerateCodes()
    {
        var code = "1234";
        return code;
    }
}
```

### Configurar no Program.cs (2 linhas)

```csharp
// Antes de builder.Build()
builder.Services.AddSignalR();

// Antes de app.Run()
app.MapHub<UserConnectionsHub>("/connection");
```

### Estrutura de pastas

```
API/
├── Controllers/    # Endpoints HTTP
└── Hubs/           # Hubs WebSocket (SignalR)
    └── UserConnectionsHub.cs
```

## Example

**Before (sem SignalR configurado):**
```csharp
// Program.cs — apenas HTTP
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
var app = builder.Build();
app.MapControllers();
app.Run();
```

**After (com SignalR configurado):**
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddSignalR();  // Linha 1
var app = builder.Build();
app.MapControllers();
app.MapHub<UserConnectionsHub>("/connection");  // Linha 2
app.Run();
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de comunicacao bidirecional persistente | Crie um Hub com SignalR |
| Funcao pertence a contexto diferente | Crie um novo Hub separado |
| Cliente precisa de resposta sincrona | Retorne valor na funcao do Hub (SignalR suporta) |
| Servidor precisa notificar cliente | Envie mensagem, mas nao espere resposta |
| Quer documentar no Swagger | Swagger so mostra endpoints HTTP, Hubs nao aparecem |
| Quer testar manualmente | Use Postman com conexao WSS e handshake JSON |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Hub unico que faz tudo (mensagens, conexoes, chat) | Um Hub por contexto de dominio |
| Instalar pacote NuGet do SignalR na API | Usar o que ja vem no .NET (`Microsoft.AspNetCore.SignalR`) |
| Esperar resposta do cliente no servidor | Servidor envia mensagem sem aguardar retorno |
| Criar endpoint HTTP para comunicacao em tempo real | Criar Hub com MapHub |
| Esquecer `AddSignalR()` no builder | Sempre adicionar antes de `builder.Build()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
