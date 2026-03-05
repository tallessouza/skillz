# Code Examples: Criando Componentes para Entries

## 1. Criando o arquivo ContentView

No Visual Studio: botao direito em `Views/Components/Inputs/` → Novo Item → .NET MAUI → .NET MAUI Content View (XAML)

Nome do arquivo: `EntryAndLabelComponent.xaml`

### Arquivo gerado automaticamente (template padrao):

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Views.Components.Inputs.EntryAndLabelComponent">
    <VerticalStackLayout>
        <Label Text="Welcome to .NET MAUI!" />
    </VerticalStackLayout>
</ContentView>
```

### Code-behind gerado:

```csharp
namespace PlanShare.Views.Components.Inputs;

public partial class EntryAndLabelComponent : ContentView
{
    public EntryAndLabelComponent()
    {
        InitializeComponent();
    }
}
```

## 2. Componente customizado com Label + Entry

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.Views.Components.Inputs.EntryAndLabelComponent">
    <VerticalStackLayout>
        <Label
            Text="Nome"
            Style="{StaticResource LabelStyle}" />
        <Entry
            Placeholder="Bruce Wayne"
            Style="{StaticResource EntryStyle}" />
    </VerticalStackLayout>
</ContentView>
```

## 3. Erro ao remover o layout container

```xml
<!-- ERRO: multiplos filhos direto no ContentView -->
<ContentView>
    <Label Text="Nome" />
    <Entry Placeholder="Bruce Wayne" />
</ContentView>
<!-- Resultado: erro de compilacao - content so aceita um filho -->
```

## 4. Registrando xmlns na pagina consumidora

```xml
<ContentPage
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:component="clr-namespace:PlanShare.Views.Components.Inputs"
    x:Class="PlanShare.Views.Pages.RegisterPage">

    <VerticalStackLayout>
        <component:EntryAndLabelComponent />
        <component:EntryAndLabelComponent />
        <component:EntryAndLabelComponent />

        <Button Text="Criar minha conta" />
    </VerticalStackLayout>
</ContentPage>
```

## 5. Correcao de margem para Android

No arquivo de estilos (`Styles.xaml` ou equivalente):

```xml
<Style TargetType="Entry" x:Key="EntryStyle">
    <!-- Outras propriedades de estilo -->
    <Setter Property="Margin" Value="4,0,0,0" />
</Style>
```

Valores de Margin: `esquerda, cima, direita, baixo`

A margem de 4px a esquerda compensa o padding interno que o Android aplica automaticamente na Entry, alinhando-a com o Label acima.

## 6. Duplicando componentes na pagina

```xml
<!-- Cada tag gera um componente independente -->
<component:EntryAndLabelComponent />  <!-- Nome: Bruce Wayne -->
<component:EntryAndLabelComponent />  <!-- Nome: Bruce Wayne (mesmo texto!) -->
<component:EntryAndLabelComponent />  <!-- Nome: Bruce Wayne (mesmo texto!) -->
```

Problema: todos mostram "Nome" e "Bruce Wayne" porque os valores estao fixos no componente. Solucao na proxima aula: BindableProperty para receber parametros como `Title="E-mail"` e `Placeholder="bruce@wayne.com"`.