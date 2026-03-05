# Code Examples: Comunicacao em Tempo Real com Hub no .NET MAUI

## Exemplo 1: ViewModel com atribuicao correta de dependencias

```csharp
public class UserConnectionJoinerViewModel : ViewModelBase
{
    private readonly IUseRefreshToken _useRefreshToken;
    private readonly IUserConnectionByCodeClient _userConnectionByCodeClient;

    // Propriedades observaveis
    [ObservableProperty]
    private string _generatedBy;

    [ObservableProperty]
    private ConnectionByCodeStatusPage _statusPage;

    public UserConnectionJoinerViewModel(
        IUseRefreshToken useRefreshToken,
        IUserConnectionByCodeClient userConnectionByCodeClient,
        INavigationService navigationService) : base(navigationService)
    {
        // CRITICO: atribuir cada dependencia ao campo
        _useRefreshToken = useRefreshToken;
        _userConnectionByCodeClient = userConnectionByCodeClient;
    }

    public async Task Initialize(string code)
    {
        StatusPage = ConnectionByCodeStatusPage.WaitingForJoiner;

        // Refresh token preventivo
        await _useRefreshToken.CreateClients();

        // Conectar ao Hub
        await _userConnectionByCodeClient.UnderlineConnection();

        // Chamar funcao no Hub com o codigo digitado
        var response = await _userConnectionByCodeClient.JoinWithCode(code);

        // Atualizar UI com resultado
        GeneratedBy = response.Name;
        StatusPage = ConnectionByCodeStatusPage.JoinerConnectedSpendingApproval;
    }
}
```

## Exemplo 2: Pagina XAML completa com ActivityIndicator e DataTrigger

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:resources="clr-namespace:App.Resources"
             xmlns:models="clr-namespace:App.Models"
             xmlns:toolkit="http://schemas.microsoft.com/dotnet/2022/maui/toolkit">

    <ContentPage.Behaviors>
        <toolkit:EventToCommandBehavior
            EventName="Appearing"
            Command="{Binding InitializeCommand}" />
    </ContentPage.Behaviors>

    <VerticalStackLayout Spacing="20">

        <!-- Label com texto dinamico via DataTrigger -->
        <Label Text="{x:Static resources:ResourceText.PhraseConnectingToTheServer}"
               HorizontalTextAlignment="Center"
               FontSize="20"
               FontFamily="{x:Static resources:FontFamily.MainFontBlack}"
               Margin="0,40,0,0">
            <Label.Triggers>
                <DataTrigger TargetType="Label"
                             Binding="{Binding StatusPage}"
                             Value="{x:Static models:ConnectionByCodeStatusPage.JoinerConnectedSpendingApproval}">
                    <Setter Property="Text"
                            Value="{Binding GeneratedBy,
                                StringFormat={StaticResource PhraseWaitingApprovalFrom}}" />
                </DataTrigger>
            </Label.Triggers>
        </Label>

        <!-- ActivityIndicator de loading -->
        <ActivityIndicator
            Color="{AppThemeBinding
                Light={StaticResource HighlightColorLight},
                Dark={StaticResource HighlightColorDark}}"
            HeightRequest="40"
            IsRunning="True" />

    </VerticalStackLayout>
</ContentPage>
```

## Exemplo 3: Enum de status da pagina

```csharp
public enum ConnectionByCodeStatusPage
{
    WaitingForJoiner,
    JoinerConnectedSpendingApproval
}
```

## Exemplo 4: Resource strings usadas

```xml
<!-- No arquivo de resources -->
<data name="PhraseConnectingToTheServer">
    <value>Aguarde um instante, estamos conectando ao servidor</value>
</data>
<data name="PhraseWaitingApprovalFrom">
    <value>Estamos esperando a aprovação de {0}</value>
</data>
```

## Exemplo 5: Comportamento EventToCommand para Initialize

```xml
<!-- Vincula o evento Appearing da pagina ao comando Initialize -->
<ContentPage.Behaviors>
    <toolkit:EventToCommandBehavior
        EventName="Appearing"
        Command="{Binding InitializeCommand}"
        CommandParameter="{Binding Code}" />
</ContentPage.Behaviors>
```

O `EventName="Appearing"` garante que `Initialize` e chamado quando a pagina aparece, passando o codigo de conexao como parametro via navegacao.

## Variacoes: DataTrigger para outros cenarios

### Trocar cor baseado em status
```xml
<Label Text="Status">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding IsConnected}"
                     Value="True">
            <Setter Property="TextColor" Value="Green" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

### Mostrar/esconder ActivityIndicator baseado em status
```xml
<ActivityIndicator
    IsRunning="{Binding IsLoading}"
    IsVisible="{Binding IsLoading}"
    HeightRequest="40"
    Color="{StaticResource PrimaryColor}" />
```