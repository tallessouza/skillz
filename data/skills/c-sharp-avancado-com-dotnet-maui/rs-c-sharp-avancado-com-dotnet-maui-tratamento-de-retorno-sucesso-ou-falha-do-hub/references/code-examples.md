# Code Examples: Tratamento de Retorno Sucesso ou Falha do Hub

## 1. ShowFailureFeedback no NavigationService

```csharp
// NavigationService.cs
public async Task ShowFailureFeedback(string message)
{
    var snackbarOptions = new SnackbarOptions
    {
        BackgroundColor = Application.Current.GetDangerColor(),
        // Mesmas configs visuais do sucesso
    };

    var snackbar = Snackbar.Make(
        message,
        duration: TimeSpan.FromSeconds(4),  // 4s para erro (3s para sucesso)
        visualOptions: snackbarOptions
    );

    await snackbar.Show();
}
```

## 2. Assinatura na interface INavigationService

```csharp
// INavigationService.cs
Task ShowFailureFeedback(string message);
```

## 3. GetDangerColor — Extension Method

```csharp
// ApplicationExtension.cs
public static Color GetDangerColor(this Application application)
{
    // Busca DangerActionColorLight ou DangerActionColorDark
    // baseado no tema atual do dispositivo
    var key = Application.Current.RequestedTheme == AppTheme.Dark
        ? "DangerActionColorDark"
        : "DangerActionColorLight";

    application.Resources.TryGetValue(key, out var color);
    return (Color)color;
}
```

## 4. Initialize — tratamento completo

```csharp
// UserConnectionGeneratorViewModel.cs
private async Task Initialize()
{
    await _connection.Start();
    var result = await _connection.InvokeAsync<HubOperationResult<string>>("GenerateCode");

    if (result.IsSuccess)
    {
        // Preenche o codigo com espacos entre caracteres
        ConnectionCode = string.Join(" ", result.Data.ToCharArray());
    }
    else
    {
        await _connection.Stop();
        await _navigationService.ClosePage();
        await _navigationService.ShowFailureFeedback(result.Error);
    }
}
```

## 5. Cancel — sem tratamento de resultado

```csharp
// UserConnectionGeneratorViewModel.cs — Cancel command
// Nao precisa verificar resultado porque sucesso e falha
// levam ao mesmo estado final
await _connection.InvokeAsync("Cancel", code);
await _connection.Stop();
await _navigationService.ClosePage();
```

## 6. Approve — sucesso com mensagem formatada

```csharp
// UserConnectionGeneratorViewModel.cs — Approve command
var result = await _connection.InvokeAsync<HubOperationResult<string>>("Approve", args);

if (result.IsSuccess)
{
    await _navigationService.ShowSuccessFeedback(
        string.Format(ResourceText.UserJoinedSuccessfully, joinerUser.Name)
    );
}
else
{
    await _navigationService.ShowFailureFeedback(result.Error);
}

// Cleanup acontece independente do resultado
await _connection.Stop();
await _navigationService.ClosePage();
```

## 7. Joiner ViewModel — tratamento no lado de quem entra

```csharp
// UserConnectionJoinerViewModel.cs
var result = await _connection.InvokeAsync<HubOperationResult>("JoinMethod", args);

if (result.IsSuccess)
{
    // Exibe nome da pessoa e troca status da pagina
    OwnerName = result.Data;
    PageStatus = ConnectionPageStatus.Connected;
}
else
{
    await _connection.Stop();
    await _navigationService.ClosePage();
    await _navigationService.ShowFailureFeedback(result.Error);
}
```

## 8. Teste com erro forcado (tecnica de debug)

```csharp
// Hub — UserConnectionHub.cs (TEMPORARIO para teste)
public async Task<HubOperationResult> GenerateCode()
{
    // COMENTAR codigo original para forcar erro:
    // var code = await _useCase.Execute(...);
    // return HubOperationResult.Success(code);

    // FORCAR FALHA para testar tratamento no app:
    return HubOperationResult.Failure("erro de testes", "invalid code");
}
// LEMBRAR de descomentar apos validar!
```

## Padrao reutilizavel — bloco de falha

O bloco de falha se repete em multiplos comandos. Pode ser extraido:

```csharp
private async Task HandleHubFailure(string errorMessage)
{
    await _connection.Stop();
    await _navigationService.ClosePage();
    await _navigationService.ShowFailureFeedback(errorMessage);
}

// Uso:
if (!result.IsSuccess)
{
    await HandleHubFailure(result.Error);
    return;
}
```