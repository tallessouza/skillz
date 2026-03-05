# Code Examples: Skeleton Loading e DataTriggers no .NET MAUI

## Exemplo completo do XAML com imports

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:skeletons="clr-namespace:PlainShare.App.Views.Components.Skeletons"
             xmlns:models="clr-namespace:PlainShare.App.Models"
             x:Class="PlainShare.App.Views.UserConnectionGeneratorPage">

    <!-- Skeleton loading - visivel apenas durante geracao do codigo -->
    <skeletons:SkeletonView
        IsVisible="False"
        HeightRequest="50"
        WidthRequest="230"
        Margin="0,20,0,0">
        <skeletons:SkeletonView.Triggers>
            <DataTrigger
                TargetType="skeletons:SkeletonView"
                Binding="{Binding StatusPage}"
                Value="{x:Static models:ConnectionByCodeStatusPage.GeneratingCode}">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </skeletons:SkeletonView.Triggers>
    </skeletons:SkeletonView>

    <!-- Label do codigo - visivel apenas quando aguardando joiner -->
    <Label
        Text="{Binding ConnectionCode}"
        IsVisible="False"
        Margin="0,20,0,0">
        <Label.Triggers>
            <DataTrigger
                TargetType="Label"
                Binding="{Binding StatusPage}"
                Value="{x:Static models:ConnectionByCodeStatusPage.WaitingForJoiner}">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </Label.Triggers>
    </Label>

</ContentPage>
```

## Enum de status da pagina

```csharp
namespace PlainShare.App.Models
{
    public enum ConnectionByCodeStatusPage
    {
        GeneratingCode,
        WaitingForJoiner
    }
}
```

## ViewModel com String.Join corrigido

```csharp
public class UserConnectionGeneratorViewModel : ObservableObject
{
    private string _connectionCode;
    public string ConnectionCode
    {
        get => _connectionCode;
        set => SetProperty(ref _connectionCode, value);
    }

    private ConnectionByCodeStatusPage _statusPage;
    public ConnectionByCodeStatusPage StatusPage
    {
        get => _statusPage;
        set => SetProperty(ref _statusPage, value);
    }

    [RelayCommand]
    public async Task Initialize()
    {
        StatusPage = ConnectionByCodeStatusPage.GeneratingCode;

        // ... chamadas async para API via SignalR ...
        var result = await _signalRService.GetConnectionCode();

        // CORRETO: ToCharArray() para separar cada digito
        ConnectionCode = String.Join(" ", result.Response.ToCharArray());

        StatusPage = ConnectionByCodeStatusPage.WaitingForJoiner;
    }
}
```

## Comparacao: String.Join com e sem ToCharArray

```csharp
string codigo = "710568";

// SEM ToCharArray — nao separa
string semConversao = String.Join(" ", codigo);
// Resultado: "710568"

// COM ToCharArray — separa cada caractere
string comConversao = String.Join(" ", codigo.ToCharArray());
// Resultado: "7 1 0 5 6 8"
```

## Padrão de transicao simplificada vs estendida

```xml
<!-- ANTES: tag simplificada (nao suporta triggers) -->
<Label Text="{Binding ConnectionCode}" Margin="0,20,0,0" />

<!-- DEPOIS: tag estendida (suporta triggers) -->
<Label Text="{Binding ConnectionCode}" IsVisible="False" Margin="0,20,0,0">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.WaitingForJoiner}">
            <Setter Property="IsVisible" Value="True" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

## Tecnica de debug: breakpoint para testar skeleton

```csharp
// No Hub da API (server-side), coloque breakpoint para simular delay:
public class UsersConnectionHub : Hub
{
    public async Task<string> GenerateCode()
    {
        // Breakpoint aqui → segura execucao → permite testar skeleton no app
        var code = await _codeService.Generate();
        return code;
    }
}
```

Isso permite ajustar `HeightRequest` e `WidthRequest` do skeleton iterativamente enquanto a API esta "pausada".