# Code Examples: Styles no .NET MAUI

## Exemplo 1: Estilo Implícito em ContentPage

Declarado dentro da página — aplica-se a todos os Buttons daquela página.

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <ContentPage.Resources>
        <Style TargetType="Button">
            <Setter Property="CornerRadius" Value="20"/>
            <Setter Property="FontSize" Value="18"/>
            <Setter Property="HeightRequest" Value="60"/>
            <Setter Property="FontFamily" Value="HalloweenBlack"/>
            <Setter Property="BackgroundColor" Value="Red"/>
            <Setter Property="TextColor" Value="White"/>
        </Style>
    </ContentPage.Resources>

    <VerticalStackLayout>
        <!-- Herda todas as propriedades do estilo implícito -->
        <Button Text="Login com e-mail e senha"/>

        <!-- Sobrescreve BackgroundColor localmente -->
        <Button Text="Login com Google"
                BackgroundColor="Black"/>
    </VerticalStackLayout>

</ContentPage>
```

**Comportamento:** Qualquer novo `<Button>` adicionado à página já vem com CornerRadius=20, FontSize=18, Height=60 automaticamente.

## Exemplo 2: Estilo Explícito com x:Key

Variação nomeada que só é aplicada quando explicitamente referenciada.

```xml
<ContentPage.Resources>
    <!-- Implícito: todos os botões -->
    <Style TargetType="Button">
        <Setter Property="CornerRadius" Value="20"/>
        <Setter Property="FontSize" Value="18"/>
        <Setter Property="HeightRequest" Value="60"/>
        <Setter Property="FontFamily" Value="HalloweenBlack"/>
        <Setter Property="BackgroundColor" Value="Black"/>
        <Setter Property="TextColor" Value="White"/>
    </Style>

    <!-- Explícito: variação para Google Login -->
    <Style TargetType="Button" x:Key="ButtonGoogleLogin">
        <Setter Property="BackgroundColor" Value="#E0E0E0"/>
        <Setter Property="TextColor" Value="Black"/>
    </Style>

    <!-- Explícito: variação para ações perigosas -->
    <Style TargetType="Button" x:Key="ButtonDangerAction">
        <Setter Property="BackgroundColor" Value="Red"/>
        <Setter Property="TextColor" Value="White"/>
    </Style>
</ContentPage.Resources>

<!-- Uso -->
<Button Text="Login" />
<Button Text="Google" Style="{StaticResource ButtonGoogleLogin}"/>
<Button Text="Deletar Conta" Style="{StaticResource ButtonDangerAction}"/>
```

**Herança automática:** `ButtonGoogleLogin` herda CornerRadius, FontSize, HeightRequest e FontFamily do implícito. Só sobrescreve BackgroundColor e TextColor.

## Exemplo 3: Migração para Estilo Global (App.xaml)

Movendo estilos de ContentPage para Application para acesso em todas as páginas.

```xml
<!-- App.xaml -->
<Application xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <Application.Resources>
        <!-- Estilo implícito global: todo Button no app -->
        <Style TargetType="Button">
            <Setter Property="CornerRadius" Value="20"/>
            <Setter Property="FontSize" Value="18"/>
            <Setter Property="HeightRequest" Value="60"/>
            <Setter Property="FontFamily" Value="HalloweenBlack"/>
            <Setter Property="BackgroundColor" Value="Black"/>
            <Setter Property="TextColor" Value="White"/>
        </Style>

        <!-- Estilo explícito global -->
        <Style TargetType="Button" x:Key="ButtonGoogleLogin">
            <Setter Property="BackgroundColor" Value="#E0E0E0"/>
            <Setter Property="TextColor" Value="Black"/>
        </Style>
    </Application.Resources>

</Application>
```

```xml
<!-- Qualquer página do app agora tem acesso -->
<ContentPage>
    <VerticalStackLayout>
        <Button Text="Login"/>
        <Button Text="Google" Style="{StaticResource ButtonGoogleLogin}"/>
    </VerticalStackLayout>
</ContentPage>
```

## Exemplo 4: Demonstração de sobrescrita local

```xml
<!-- Estilo implícito define BackgroundColor="Red" -->
<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="Red"/>
</Style>

<!-- Este botão fica PRETO (sobrescrita local vence) -->
<Button Text="Login" BackgroundColor="Black"/>

<!-- Este botão fica VERMELHO (segue o estilo implícito) -->
<Button Text="Cadastrar"/>
```

## Exemplo 5: Erro — dois implícitos para o mesmo tipo

```xml
<!-- ERRO: dois estilos implícitos para Button -->
<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="Black"/>
</Style>

<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="Red"/>
</Style>
<!-- MAUI não sabe qual usar → erro de compilação -->
```

**Correção:** adicionar `x:Key` ao segundo:

```xml
<Style TargetType="Button">
    <Setter Property="BackgroundColor" Value="Black"/>
</Style>

<Style TargetType="Button" x:Key="ButtonAlternative">
    <Setter Property="BackgroundColor" Value="Red"/>
</Style>
```