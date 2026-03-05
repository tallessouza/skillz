# Code Examples: Componente de Senha no .NET MAUI

## Estrutura completa do XAML

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentView xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             x:Class="PlanShare.App.Inputs.EntryAndLabelPasswordComponents">

    <VerticalStackLayout>
        <Label
            x:Name="LabelTitle"
            Text="{Binding Source={x:Reference this}, Path=Title}" />

        <Grid ColumnDefinitions="*, 40">
            <Entry
                Grid.Column="0"
                x:Name="EntryPassword"
                IsPassword="True"
                Placeholder="Minimo de 6 caracteres" />

            <VerticalStackLayout
                Grid.Column="1"
                Padding="0,12,0,12">
                <VerticalStackLayout.GestureRecognizers>
                    <TapGestureRecognizer Tapped="ShowHidePassword" />
                </VerticalStackLayout.GestureRecognizers>
                <Image
                    x:Name="ImageEye"
                    Source="icon_eye_hiding.png" />
            </VerticalStackLayout>
        </Grid>
    </VerticalStackLayout>

</ContentView>
```

## Code-behind completo

```csharp
namespace PlanShare.App.Inputs;

public partial class EntryAndLabelPasswordComponents : ContentView
{
    public static readonly BindableProperty TitleProperty =
        BindableProperty.Create(
            nameof(Title),
            typeof(string),
            typeof(EntryAndLabelPasswordComponents),
            string.Empty);

    public string Title
    {
        get => (string)GetValue(TitleProperty);
        set => SetValue(TitleProperty, value);
    }

    public EntryAndLabelPasswordComponents()
    {
        InitializeComponent();
    }

    private void ShowHidePassword(object sender, EventArgs e)
    {
        if (EntryPassword.IsPassword)
        {
            EntryPassword.IsPassword = false;
            ImageEye.Source = "icon_eye.png";
        }
        else
        {
            EntryPassword.IsPassword = true;
            ImageEye.Source = "icon_eye_hiding.png";
        }
    }
}
```

## Uso na pagina de registro

```xml
<!-- Dentro da pagina UserRegister -->
<inputs:EntryAndLabelPasswordComponents Title="Senha" />

<!-- Na tela de alterar senha, reutilizando com titulos diferentes -->
<inputs:EntryAndLabelPasswordComponents Title="Senha atual" />
<inputs:EntryAndLabelPasswordComponents Title="Nova senha" />
```

## Comparacao: HorizontalStackLayout vs Grid

### HorizontalStackLayout (NAO funciona)

```xml
<VerticalStackLayout>
    <Label Text="Senha" />
    <HorizontalStackLayout>
        <Entry Placeholder="Minimo de 6 caracteres" IsPassword="True" />
        <Image Source="icon_eye_hiding.png" />
    </HorizontalStackLayout>
</VerticalStackLayout>
<!-- Resultado: Entry comprimida, ocupa apenas o tamanho do placeholder -->
```

### Grid (funciona corretamente)

```xml
<VerticalStackLayout>
    <Label Text="Senha" />
    <Grid ColumnDefinitions="*, 40">
        <Entry Grid.Column="0" IsPassword="True"
               Placeholder="Minimo de 6 caracteres" />
        <VerticalStackLayout Grid.Column="1" Padding="0,12,0,12">
            <VerticalStackLayout.GestureRecognizers>
                <TapGestureRecognizer Tapped="ShowHidePassword" />
            </VerticalStackLayout.GestureRecognizers>
            <Image Source="icon_eye_hiding.png" />
        </VerticalStackLayout>
    </Grid>
</VerticalStackLayout>
<!-- Resultado: Entry expande para preencher o espaco disponivel -->
```

## Grid ColumnDefinitions explicado

```xml
<!-- Sintaxe -->
<Grid ColumnDefinitions="*, 40">

<!-- * = ocupa todo o espaco restante (Entry) -->
<!-- 40 = largura fixa de 40px (icone do olho) -->

<!-- Se precisasse de 3 colunas: -->
<Grid ColumnDefinitions="*, 2*, 40">
<!-- Coluna 0: 1 parte proporcional -->
<!-- Coluna 1: 2 partes proporcionais -->
<!-- Coluna 2: 40px fixos -->

<!-- Indices das colunas comecam em 0 -->
<Entry Grid.Column="0" />
<Label Grid.Column="1" />
<Image Grid.Column="2" />
```

## Tecnica de area de toque expandida

```xml
<!-- Imagem sozinha: area de toque = 21x21px (muito pequena) -->
<Image Source="icon_eye.png" WidthRequest="21" />

<!-- Com wrapper e padding: area de toque = 40x(21+24)px -->
<VerticalStackLayout Padding="0,12,0,12">
    <VerticalStackLayout.GestureRecognizers>
        <TapGestureRecognizer Tapped="ShowHidePassword" />
    </VerticalStackLayout.GestureRecognizers>
    <Image Source="icon_eye.png" />
</VerticalStackLayout>
```

## Debug: verificando area de toque com BackgroundColor

```xml
<!-- Tecnica do instrutor para visualizar a area ocupada -->
<VerticalStackLayout
    Grid.Column="1"
    Padding="0,12,0,12"
    BackgroundColor="Red">  <!-- Remova depois de testar -->
    <Image x:Name="ImageEye" Source="icon_eye_hiding.png" />
</VerticalStackLayout>
```