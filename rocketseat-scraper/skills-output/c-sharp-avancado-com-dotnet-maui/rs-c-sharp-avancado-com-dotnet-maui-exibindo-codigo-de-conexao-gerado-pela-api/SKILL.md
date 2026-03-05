---
name: rs-csharp-maui-exibindo-codigo-conexao-api
description: "Applies SignalR Hub client invocation patterns in .NET MAUI apps when user asks to 'call a hub method', 'invoke SignalR', 'connect to hub', 'display real-time data', or 'use InvokeAsync'. Enforces correct generic typing with InvokeAsync, access token validation before StartAsync, observable property binding, and EventToCommandBehavior for page lifecycle. Make sure to use this skill whenever implementing SignalR client-side hub communication in MAUI. Not for server-side Hub implementation, REST API calls, or non-real-time HTTP requests."
---

# Exibindo Dados de um SignalR Hub no .NET MAUI

> Ao chamar metodos de um Hub via cliente, use InvokeAsync com tipo generico explicito, valide o access token antes do handshake, e vincule o resultado via propriedades observaveis.

## Rules

1. **Use InvokeAsync com tipo generico** — `_connection.InvokeAsync<HubOperationResult<string>>("MethodName")`, porque o tipo generico instrui a deserializacao automatica da resposta
2. **Passe o nome do metodo como string exata** — copie o nome do metodo do Hub para evitar erros de digitacao, porque InvokeAsync resolve por nome em runtime
3. **Valide o access token antes de StartAsync** — o handshake envia o token e falha silenciosamente se expirado, porque a validacao ocorre na mensagem de handshake
4. **Use propriedades observaveis para exibir resultados** — `[ObservableProperty] private string connectionCode` gera notificacao automatica para a UI
5. **Configure EventToCommandBehavior para inicializacao** — vincule o evento Appearing da page ao InitializeCommand, porque metodos de Hub so devem ser chamados apos a pagina estar visivel

## Steps

### Step 1: Invocar metodo do Hub

```csharp
var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");
// Parametros adicionais: InvokeAsync<T>("Method", param1, param2)
```

### Step 2: Extrair resposta e atribuir a propriedade observavel

```csharp
[ObservableProperty]
private string connectionCode;

// No metodo Initialize:
ConnectionCode = result.Response!;
StatusPage = StatusPageEnum.ConnectionByCode;
```

### Step 3: Vincular no XAML

```xml
<Label Text="{Binding ConnectionCode}" />
```

### Step 4: Configurar EventToCommandBehavior

```xml
<ContentPage.Behaviors>
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeCommand}" />
</ContentPage.Behaviors>
```

Adicione o namespace do Toolkit se ausente:
```xml
xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Access token pode estar expirado | Execute RefreshToken UseCase antes de StartAsync |
| Metodo do Hub tem parametros | Passe apos o nome: `InvokeAsync<T>("Method", arg1, arg2)` |
| Resposta pode ser null | Use `result.Response!` apenas no caminho feliz; trate erros em producao |
| Pagina precisa executar codigo ao aparecer | Use EventToCommandBehavior com Appearing, nao o construtor |
| Codigo e temporario (validacao de token pre-dashboard) | Marque com comentario explicito e remova ao implementar o fluxo definitivo |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Chamar InvokeAsync sem tipo generico | `InvokeAsync<HubOperationResult<string>>(...)` |
| Digitar nome do metodo manualmente | Copie o nome exato do Hub |
| Chamar StartAsync sem validar token | Garanta token valido antes do handshake |
| Inicializar conexao no construtor da page | Use EventToCommandBehavior no evento Appearing |
| Injetar dependencia sem atribuir ao campo | `_useCase = useCase` no construtor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
