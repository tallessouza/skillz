# Code Examples: MainThread e Navegação em Callbacks Real-Time

## Exemplo 1: Callback completo de confirmação de conexão

```csharp
// UserConnectionJoinerViewModel.cs

private void InitializeHubCallbacks()
{
    // Quando o resultado da conexão chegar
    connection.On<ConnectionResult>("OnConnectionResult", (result) =>
    {
        MainThread.BeginInvokeOnMainThread(async () =>
        {
            if (result.IsSuccess)
            {
                ApproverName = result.ApproverName;
                PageStatus = ConnectionPageStatus.Connected;
                return; // Early return para não executar código de erro
            }

            // Erro: parar conexão
            await StopAsync();

            // Erro recuperável: código inválido → volta para input
            if (result.ErrorCode == "INVALID_CODE")
            {
                await ShowFeedback(result.Message, isError: true);
                await _navigationService.GoToAsync(
                    $"../{ RoutesPages.ConnectionUserCodeConnectionPage}");
            }
            else
            {
                // Erro fatal: fecha tudo
                await ShowFeedback(result.Message, isError: true);
                await _navigationService.ClosePage();
            }
        });
    });

    // Quando o usuário cancelar
    connection.On("OnCancel", () =>
    {
        MainThread.BeginInvokeOnMainThread(async () =>
        {
            await StopAsync();
            await ShowFeedback("Conexão cancelada.", isError: true);
            await _navigationService.ClosePage();
        });
    });

    // Quando o usuário desconectar
    connection.On("OnDisconnect", () =>
    {
        MainThread.BeginInvokeOnMainThread(async () =>
        {
            await StopAsync();
            await ShowFeedback("Usuário desconectou.", isError: true);
            await _navigationService.ClosePage();
        });
    });

    // Quando alguém entrar na sala
    connection.On<UserInfo>("OnUserJoins", (user) =>
    {
        MainThread.BeginInvokeOnMainThread(() =>
        {
            JoinerName = user.Name;
            PageStatus = ConnectionPageStatus.WaitingApproval;
        });
    });
}
```

## Exemplo 2: Navegação fechar-e-abrir após gerar código

```csharp
// UserCodeConnectionViewModel.cs

// ANTES (bug: página de código ficava na stack)
private async Task OnCodeGenerated(string code)
{
    await _navigationService.ClosePage();
    await _navigationService.GoToAsync(RoutesPages.ConnectionHubPage);
}

// DEPOIS (correto: ../ remove a página atual da stack)
private async Task OnCodeGenerated(string code)
{
    await _navigationService.GoToAsync(
        $"../{RoutesPages.ConnectionHubPage}");
}
```

## Exemplo 3: Configuração de idioma na conexão do hub

```csharp
// Antes: mensagens voltam em inglês
connection = new HubConnectionBuilder()
    .WithUrl(hubUrl)
    .Build();

// Depois: mensagens no idioma do dispositivo
connection = new HubConnectionBuilder()
    .WithUrl(hubUrl, options =>
    {
        options.Headers.Add("Accept-Language",
            CultureInfo.CurrentCulture.TwoLetterISOLanguageName);
    })
    .Build();
```

## Exemplo 4: Comparação — Command vs Hub callback

```csharp
// Command: NÃO precisa de MainThread (já é UI thread)
[RelayCommand]
private async Task OnAcceptConnection()
{
    await _connectionService.AcceptAsync();
    await ShowFeedback("Conexão aceita!");
    await _navigationService.GoToAsync("../DashboardPage");
}

// Hub callback: PRECISA de MainThread
connection.On("OnAccepted", () =>
{
    // SEM MainThread → bug silencioso (nada acontece na tela)
    // COM MainThread → funciona corretamente
    MainThread.BeginInvokeOnMainThread(async () =>
    {
        await ShowFeedback("Conexão aceita!");
        await _navigationService.GoToAsync("../DashboardPage");
    });
});
```

## Exemplo 5: Teste em múltiplos dispositivos (workflow)

O instrutor demonstrou o workflow para testar em dois dispositivos físicos simultaneamente:

1. **Setar projeto como Startup**: Botão direito no projeto MAUI → Set as Startup Project
2. **Selecionar dispositivo**: Clicar na seta ao lado do botão Play → Android Local Devices → selecionar dispositivo
3. **Instalar no primeiro dispositivo**: Play → aguardar deploy → parar execução (app fica instalado)
4. **Trocar dispositivo**: Seta → Android Local Devices → segundo dispositivo
5. **Instalar no segundo**: Play → aguardar deploy → parar execução
6. **Executar a API**: Botão direito no projeto API → Set as Startup Project → F5
7. **Testar**: Abrir o app manualmente nos dois dispositivos, ambos se comunicam pela API