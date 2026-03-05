# Code Examples: Data Triggers no .NET MAUI

## Exemplo completo da página de registro

### Enum StatusPage

```csharp
namespace PlanShare.App.Models;

public enum StatusPage
{
    Default,
    Sending
}
```

### ViewModel com StatusPage

```csharp
public class UserRegisterViewModel : ObservableObject
{
    private StatusPage _statusPage;
    public StatusPage StatusPage
    {
        get => _statusPage;
        set => SetProperty(ref _statusPage, value);
    }

    public async Task RegisterAsync()
    {
        // Troca para Sending ANTES de executar o use case
        StatusPage = StatusPage.Sending;

        await _registerUserUseCase.ExecuteAsync(/* params */);

        // Volta para Default DEPOIS de concluir
        StatusPage = StatusPage.Default;
    }
}
```

### XAML completo com DataTriggers

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:models="clr-namespace:PlanShare.App.Models"
             xmlns:components="clr-namespace:PlanShare.App.Components"
             xmlns:viewmodel="clr-namespace:PlanShare.App.ViewModels"
             x:DataType="viewmodel:UserRegisterViewModel">

    <!-- Formulário: visível apenas quando StatusPage == Default -->
    <VerticalStackLayout IsVisible="False">
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Default}">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </VerticalStackLayout.Triggers>

        <Label Text="Nome" />
        <Entry Placeholder="Digite seu nome" />
        <Label Text="E-mail" />
        <Entry Placeholder="Digite seu e-mail" />
        <Label Text="Senha" />
        <Entry Placeholder="Digite sua senha" IsPassword="True" />
        <Button Text="Criar minha conta" Command="{Binding RegisterCommand}" />
    </VerticalStackLayout>

    <!-- Animação: visível apenas quando StatusPage == Sending -->
    <components:AnimationSendInformationComponent IsVisible="False">
        <components:AnimationSendInformationComponent.Triggers>
            <DataTrigger TargetType="components:AnimationSendInformationComponent"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static models:StatusPage.Sending}">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </components:AnimationSendInformationComponent.Triggers>
    </components:AnimationSendInformationComponent>
</ContentPage>
```

## Variações e outros tipos de triggers

### Property Trigger — mudar background no foco

```xml
<Entry Placeholder="Digite aqui">
    <Entry.Triggers>
        <Trigger TargetType="Entry" Property="IsFocused" Value="True">
            <Setter Property="BackgroundColor" Value="Yellow" />
        </Trigger>
    </Entry.Triggers>
</Entry>
```

### MultiTrigger — múltiplas condições (AND)

```xml
<Button Text="Salvar" IsEnabled="False">
    <Button.Triggers>
        <MultiTrigger TargetType="Button">
            <MultiTrigger.Conditions>
                <BindingCondition Binding="{Binding IsNameValid}" Value="True" />
                <BindingCondition Binding="{Binding IsEmailValid}" Value="True" />
            </MultiTrigger.Conditions>
            <Setter Property="IsEnabled" Value="True" />
        </MultiTrigger>
    </Button.Triggers>
</Button>
```

### Múltiplos Setters em um DataTrigger

```xml
<Label Text="Status" TextColor="Gray" FontAttributes="None">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding IsActive}"
                     Value="True">
            <Setter Property="TextColor" Value="Green" />
            <Setter Property="FontAttributes" Value="Bold" />
            <Setter Property="Text" Value="Ativo" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

## Fluxo visual do padrão

```
StatusPage = Default     StatusPage = Sending     StatusPage = Default
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  [Nome]          │     │                  │     │  [Nome]          │
│  [E-mail]        │ --> │   ✈️ Animação    │ --> │  [E-mail]        │
│  [Senha]         │     │   Enviando...    │     │  [Senha]         │
│  [Criar conta]   │     │                  │     │  [Criar conta]   │
└──────────────────┘     └──────────────────┘     └──────────────────┘
  Form visível            Animação visível          Form visível
  Animação oculta         Form oculto               Animação oculta
```