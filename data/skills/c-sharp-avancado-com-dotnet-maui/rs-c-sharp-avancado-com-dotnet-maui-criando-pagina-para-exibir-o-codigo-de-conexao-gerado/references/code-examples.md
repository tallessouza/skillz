# Code Examples: Pagina de Codigo de Conexao com Estado

## Enum completo de status

```csharp
// Models/ConnectionByCodeStatusPage.cs
public enum ConnectionByCodeStatusPage
{
    GeneratingCode,                    // Conectando ao hub, gerando codigo
    WaitingForJoiner,                  // Codigo gerado, aguardando uso
    JoinerConnectedWaitingApproval     // Alguem conectou, aguardando aprovacao
}
```

Comparacao com o enum generico existente:

```csharp
// Models/StatusPage.cs (ja existente)
public enum StatusPage
{
    Default,
    Send,
    Load
}
```

## ViewModel com propriedade sobrescrita

```csharp
// ViewModels/Pages/User/Connection/UserConnectionGeneratorViewModel.cs
public partial class UserConnectionGeneratorViewModel : ViewModelBase
{
    [ObservableProperty]
    public new ConnectionByCodeStatusPage statusPage;
}
```

## Code-behind da pagina

```csharp
public partial class UserConnectionGeneratorPage : ContentPage
{
    public UserConnectionGeneratorPage(UserConnectionGeneratorViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
```

## XAML completo da pagina

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels.Pages.User.Connection"
             xmlns:resourceTexts="clr-namespace:PlanShare.App.Resources.Languages"
             xmlns:fontFamily="clr-namespace:PlanShare.App.Resources.Fonts"
             x:DataType="viewmodel:UserConnectionGeneratorViewModel">

    <VerticalStackLayout>
        <!-- Imagem do gatinho -->
        <Image Source="sweet_cats" HorizontalOptions="Center" />

        <!-- Titulo -->
        <Label Text="{x:Static resourceTexts:ResourceTexts.TitleShareTasks}"
               Style="{StaticResource PageTitle}"
               Margin="0,50,0,10" />

        <!-- Subtitulo explicativo -->
        <Label Text="{x:Static resourceTexts:ResourceTexts.SubtitleConnectionByCode}" />

        <!-- Codigo de conexao -->
        <Label Text="123456"
               FontFamily="{x:Static fontFamily:FontFamily.MainFonts}"
               FontSize="60"
               HorizontalOptions="Center"
               Margin="0,30,0,40" />

        <!-- Linha separadora -->
        <BoxView Color="{AppThemeBinding
                   Light={StaticResource LinesColorLight},
                   Dark={StaticResource LinesColorDark}}"
                 HeightRequest="1" />

        <!-- Botao cancelar -->
        <Button Style="{StaticResource DangerousButtonStyle}"
                Text="{x:Static resourceTexts:ResourceTexts.TitleCancelOperation}"
                Margin="0,70,0,0" />
    </VerticalStackLayout>
</ContentPage>
```

## Registro no MauiProgram

```csharp
// MauiProgram.cs - dentro de AddPages()
builder.Services.AddTransientWithRoute<UserConnectionGeneratorPage,
    UserConnectionGeneratorViewModel>(RoutePages.UserConnectionGeneratorPage);
```

## Constante de rota

```csharp
// RoutePages.cs
public static class RoutePages
{
    public const string UserConnectionGeneratorPage = "userConnectionGeneratorPage";
    // ... outras rotas
}
```

## Navegacao a partir do Dashboard

```csharp
// DashboardViewModel.cs
var optionSelected = await NavigationService.ShowPopup<OptionResult>();

switch (optionSelected)
{
    case GenerateCode:
        await NavigationService.NavigateTo(RoutePages.UserConnectionGeneratorPage);
        break;
}
```

## BoxView — de quadrado a linha

```xml
<!-- Quadrado azul 160x160 com bordas arredondadas -->
<BoxView Color="CornflowerBlue"
         HeightRequest="160"
         WidthRequest="160"
         CornerRadius="10" />

<!-- Linha separadora (apenas HeightRequest=1, sem WidthRequest) -->
<BoxView Color="{AppThemeBinding
           Light={StaticResource LinesColorLight},
           Dark={StaticResource LinesColorDark}}"
         HeightRequest="1" />
```

## Chaves de Resource utilizadas

```xml
<!-- Resources/Languages/ResourceTexts.resx -->
TitleShareTasks         = "Compartilhar tarefa"
SubtitleConnectionByCode = "Agora a outra pessoa precisa digitar o código..."
TitleCancelOperation    = "Cancelar operação"
```