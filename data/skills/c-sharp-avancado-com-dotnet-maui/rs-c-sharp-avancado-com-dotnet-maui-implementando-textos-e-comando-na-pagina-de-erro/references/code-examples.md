# Code Examples: Implementando UI de Página de Erro no .NET MAUI

## 1. Botão com estilo sobrescrito (ErrorsPage.xaml)

```xml
<Button
    Text="Tentar novamente"
    Style="{StaticResource ButtonStyle}"
    HeightRequest="60"
    CornerRadius="20"
    TextTransform="Uppercase"
    Command="{Binding CloseCommand}" />
```

O estilo global `ButtonStyle` define `HeightRequest=50` e `CornerRadius=15`. Aqui sobrescrevemos para 60 e 20 respectivamente. `TextTransform="Uppercase"` renderiza "TENTAR NOVAMENTE" sem alterar o texto fonte.

## 2. ViewModel completa com comando de navegação

```csharp
public partial class ErrorsViewModel : ObservableObject
{
    private readonly INavigationService _navigationService;

    public ErrorsViewModel(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [RelayCommand]
    public async Task Close()
    {
        await _navigationService.GoToAsync("..");
    }
}
```

**Pontos-chave:**
- `partial class` é obrigatório para o source generator do MVVM Toolkit funcionar
- `_navigationService` com underscore — convenção Microsoft para campos privados
- `readonly` — o campo é atribuído apenas no construtor
- `[RelayCommand]` gera `CloseCommand` automaticamente
- `GoToAsync("..")` remove a página atual da pilha de navegação

## 3. Labels com fontes customizadas e centralização

```xml
<!-- Label universal (sem tradução) -->
<Label
    Text="Oops!"
    FontFamily="{Static fonts:FontFamily.HallewayBlack}"
    FontSize="24"
    HorizontalOptions="Center" />

<!-- Label traduzível (via Resources) -->
<Label
    Text="{x:Static resources:AppResources.FollowErrorsWereFound}"
    FontSize="18"
    Margin="0,25,0,40"
    HorizontalOptions="Center" />
```

**Notas:**
- O segundo label NÃO sobrescreve `FontFamily` porque o estilo default do Label já usa `SecondaryFontRegular` (WorkSans), que é exatamente o que o Figma pede
- A margem `0,25,0,40` consolida: 25 top (distância do "Oops!") e 40 bottom (distância da lista de erros abaixo)

## 4. Estilo default do Label (para referência)

```xml
<!-- Em Resources/Styles/LabelStyles.xaml -->
<Style TargetType="Label">
    <Setter Property="FontFamily" Value="{Static fonts:FontFamily.SecondaryFontRegular}" />
    <Setter Property="FontSize" Value="14" />
    <Setter Property="TextColor" Value="{AppThemeBinding Light=Black, Dark=White}" />
</Style>
```

Quando o label usa WorkSans Regular (fonte secundária), não é necessário sobrescrever `FontFamily`. Apenas `FontSize` precisa ser ajustado.

## 5. Estilo default do Button (para referência)

```xml
<!-- Em Resources/Styles/ButtonStyles.xaml -->
<Style TargetType="Button">
    <!-- ... outras propriedades ... -->
    <Setter Property="HeightRequest" Value="50" />
    <Setter Property="CornerRadius" Value="15" />
</Style>
```

O botão da ErrorsPage sobrescreve HeightRequest para 60 e CornerRadius para 20.

## 6. Fluxo de navegação da pilha

```
// Estado inicial
[OnboardPage]

// Após clicar "Login com email e senha"
[OnboardPage] → [LoginPage]

// Após erro na API
[OnboardPage] → [LoginPage] → [ErrorsPage]

// Após tocar "Tentar Novamente" (GoToAsync(".."))
[OnboardPage] → [LoginPage]  // ErrorsPage removida
```

## 7. Registro no arquivo de Resources

```xml
<!-- Em Resources/AppResources.resx -->
<data name="FollowErrorsWereFound" xml:space="preserve">
    <value>Os seguintes erros foram encontrados</value>
</data>
```

Versões em outros idiomas seriam adicionadas em `AppResources.en.resx`, `AppResources.es.resx`, etc.