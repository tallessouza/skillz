# Code Examples: Recebendo Mensagens do Hub via SignalR

## Exemplo completo da ViewModel

```csharp
public partial class UserConnectionGeneratorViewModel : ObservableObject
{
    private HubConnection _connection;

    [ObservableProperty]
    private JoinerUser joinerUser;

    [ObservableProperty]
    private ConnectionByCodeStatusPage statusPage;

    public UserConnectionGeneratorViewModel()
    {
        _connection = CreateClient();

        // Configurar TODAS as mensagens antes do StartAsync
        _connection.On<ResponseConnectingUserJson>(
            "OnUserJoineds",
            onUserJoins
        );
    }

    private async Task Initialize()
    {
        // Start vem DEPOIS de todas as configuracoes de On()
        await _connection.StartAsync();

        // ... gerar codigo, etc.
    }

    private void onUserJoins(ResponseConnectingUserJson response)
    {
        JoinerUser = new JoinerUser
        {
            Name = response.Name
            // ProfilePhotoUrl sera adicionado depois
        };

        StatusPage = ConnectionByCodeStatusPage.JoinerConnectedPendingApproval;
    }
}
```

## O Hub que dispara a mensagem (lado servidor)

```csharp
public class UserConnectionsHub : Hub
{
    public async Task JoinWithCode(/* params */)
    {
        // ... logica de validacao ...

        var response = new ResponseConnectingUserJson(name, profilePhotoUrl);

        // Envia para conexao especifica
        await Clients.Client(connectionId)
            .SendAsync("OnUserJoineds", response);
    }
}
```

## Classes separadas: Response vs Entidade

```csharp
// Response DTO — responsabilidade: transportar dados da API
public class ResponseConnectingUserJson
{
    public string Name { get; set; }
    public string ProfilePhotoUrl { get; set; }
}

// Entidade observavel — responsabilidade: alimentar a UI
public partial class JoinerUser : ObservableObject
{
    [ObservableProperty]
    private string name;

    [ObservableProperty]
    private string profilePhotoUrl;
}
```

## Variacao: handler sem parametros

```csharp
// Quando o Hub envia evento sem payload
_connection.On("OnUserDisconnected", () =>
{
    StatusPage = ConnectionByCodeStatusPage.Disconnected;
    JoinerUser = null;
});
```

## Variacao: multiplos handlers configurados

```csharp
public UserConnectionGeneratorViewModel()
{
    _connection = CreateClient();

    // Todos os handlers registrados antes do Start
    _connection.On<ResponseConnectingUserJson>(
        "OnUserJoineds", onUserJoins);

    _connection.On("OnUserDisconnected",
        () => { StatusPage = ConnectionByCodeStatusPage.Idle; });

    _connection.On<ApprovalResponse>(
        "OnConnectionApproved", onConnectionApproved);
}
```

## XAML correspondente (contexto visual)

```xml
<!-- Elementos visiveis quando StatusPage == JoinerConnectedPendingApproval -->
<VerticalStackLayout Margin="0,40,0,0"
    IsVisible="{Binding StatusPage, 
        Converter={StaticResource EnumToBoolConverter}, 
        ConverterParameter=JoinerConnectedPendingApproval}">

    <Label Text="{Binding JoinerUser.Name}" />

    <Button Text="Aceitar"
        Style="{StaticResource HighlightColorLightButton}" />

    <Button Text="Cancelar operação"
        Style="{StaticResource DangerousButtonStyle}" />
</VerticalStackLayout>
```