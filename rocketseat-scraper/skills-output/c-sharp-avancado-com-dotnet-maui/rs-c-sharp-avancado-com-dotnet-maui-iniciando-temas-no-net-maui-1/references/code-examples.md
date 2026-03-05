# Code Examples: Temas Light/Dark no .NET MAUI

## 1. BackgroundColor com AppThemeBinding

```xml
<!-- ERRADO: cor fixa que sera invertida pelo sistema -->
<Button BackgroundColor="Red" Text="Login com email e senha" />

<!-- CORRETO: cor declarada por tema -->
<Button BackgroundColor="{AppThemeBinding Dark=Yellow, Light=Blue}"
        Text="Login com email e senha" />
```

## 2. Imagem que troca conforme o tema

```xml
<!-- Imagem diferente para cada tema -->
<Image Source="{AppThemeBinding Light=hero_image.png, Dark=google_logo.png}" />
```

## 3. Texto que muda conforme o tema

```xml
<!-- Texto literal (aspas simples obrigatorias) -->
<Label Text="{AppThemeBinding Light='Oi do light mode', Dark='Oi do dark mode'}" />
```

## 4. TextColor com AppThemeBinding

```xml
<Label Text="Bem vindo"
       TextColor="{AppThemeBinding Dark=Blue, Light=Green}" />
```

## 5. FontSize com AppThemeBinding

```xml
<!-- Possivel mas raramente necessario -->
<Label Text="Titulo"
       FontSize="{AppThemeBinding Dark=20, Light=50}" />
```

## 6. Texto vindo de Resource File

```xml
<!-- Quando o valor vem de StaticResource, sintaxe diferente -->
<Label Text="{AppThemeBinding
    Light={StaticResource FileResource.TextoLight},
    Dark={StaticResource FileResource.TextoDark}}" />
```

## 7. Detectar tema atual em C# (ViewModel)

```csharp
// Em qualquer lugar do code-behind ou ViewModel
AppTheme currentTheme = Application.Current.RequestedTheme;

if (currentTheme == AppTheme.Dark)
{
    // App esta em Dark Mode
}
else
{
    // App esta em Light Mode
}
```

## 8. Chavear tema em runtime (toggle)

```csharp
// Exemplo de comando que alterna entre temas
[RelayCommand]
private void ToggleTheme()
{
    AppTheme currentTheme = Application.Current.RequestedTheme;

    Application.Current.UserAppTheme =
        currentTheme == AppTheme.Dark
            ? AppTheme.Light
            : AppTheme.Dark;
}
```

## 9. Forcar tema especifico

```csharp
// Forcar Dark Mode independente do sistema
Application.Current.UserAppTheme = AppTheme.Dark;

// Forcar Light Mode
Application.Current.UserAppTheme = AppTheme.Light;

// Voltar a seguir o tema do sistema
Application.Current.UserAppTheme = AppTheme.Unspecified;
```

## 10. Exemplo completo — Onboarding Page

```xml
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml">

    <StackLayout Padding="20">

        <Image Source="{AppThemeBinding Light=hero_image.png, Dark=dark_hero.png}"
               HeightRequest="200" />

        <Label Text="{AppThemeBinding Light='Bem vindo ao PlanShare', Dark='PlanShare - Dark Mode'}"
               TextColor="{AppThemeBinding Dark=White, Light=Black}"
               FontSize="24"
               HorizontalOptions="Center" />

        <Button Text="Login com email e senha"
                BackgroundColor="{AppThemeBinding Dark=Yellow, Light=Blue}"
                TextColor="{AppThemeBinding Dark=Black, Light=White}" />

        <Button Text="Continuar com Google"
                Command="{Binding ToggleThemeCommand}" />

    </StackLayout>
</ContentPage>
```