# Code Examples: Componentes de Perfil com Data Binding Reativo

## Classe User com ObservableProperty

```csharp
// Models/User.cs
// partial + ObservableObject sao obrigatorios para o source generator funcionar
public partial class User : ObservableObject
{
    // Apenas name precisa de ObservableProperty
    // porque o AvatarView mostra iniciais do nome
    [ObservableProperty]
    private string name;

    // Email nao precisa — nenhum componente visual reage a mudanca de email
    public string Email { get; set; }
}
```

**Erro comum — esquecer `partial` ou `ObservableObject`:**
```csharp
// ERRADO — source generator nao funciona sem partial
public class User
{
    [ObservableProperty]  // Vai dar erro de compilacao
    private string name;
}

// ERRADO — falta ObservableObject
public partial class User
{
    [ObservableProperty]  // Vai dar erro de compilacao
    private string name;
}
```

## ViewModel com namespace completo

```csharp
// Pages/UserProfile/UserProfileViewModel.cs
public partial class UserProfileViewModel : ObservableObject
{
    // Models.User porque existe pasta User/ no projeto
    // Se escrevesse apenas "User", o compilador confundiria com o namespace
    [ObservableProperty]
    private Models.User model;

    public UserProfileViewModel()
    {
        // Dados temporarios — no futuro vem da API
        Model = new Models.User
        {
            Name = "Wellison Arley",
            Email = "wellison@gmail.com"
        };
    }
}
```

## Pagina XAML com componentes reutilizados

```xml
<?xml version="1.0" encoding="utf-8" ?>
<ContentPage xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:inputs="clr-namespace:PlanShare.App.Components.Inputs"
             xmlns:components="clr-namespace:PlanShare.App.Components"
             xmlns:resource="clr-namespace:PlanShare.App.Resources.Text">

    <!-- Avatar com binding ao Model.Name -->
    <components:AvatarView
        Text="{Binding Model.Name, Converter={StaticResource InitialsConverter}}" />

    <!-- Componente de nome — reutilizado da pagina de registro -->
    <!-- Margin: 0 esquerda, 35 cima (distancia do avatar), 0 direita, 30 baixo (distancia do email) -->
    <inputs:EntryAndLabelComponent
        Title="{x:Static resource:ResourceText.NAME}"
        Text="{Binding Model.Name}"
        Margin="0,35,0,30" />

    <!-- Componente de email — reutilizado da pagina de registro -->
    <inputs:EntryAndLabelComponent
        Title="{x:Static resource:ResourceText.EMAIL}"
        Text="{Binding Model.Email}" />

</ContentPage>
```

## Converter com protecao contra string vazia

```csharp
// Converters/InitialsConverter.cs
public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
{
    var name = value?.ToString() ?? string.Empty;

    // Guard clause — protege contra string vazia, nula ou espacos
    if (string.IsNullOrWhiteSpace(name))
        return string.Empty;

    var names = name.Trim().Split(' ');

    if (names.Length == 1)
        return names[0][0].ToString().ToUpper();

    // Primeiro caractere do primeiro nome + primeiro caractere do ultimo nome
    return $"{names[0][0]}{names[^1][0]}".ToUpper();
}
```

**Versao sem protecao (causa crash):**
```csharp
// ERRADO — quando o usuario apaga todo o texto do campo nome:
// 1. value = "" (string vazia)
// 2. name.Split(' ') retorna [""] (array com 1 elemento vazio)
// 3. names[0][0] tenta acessar primeiro char de "" → IndexOutOfRangeException
// 4. App crasha
public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
{
    var name = value.ToString();
    var names = name.Split(' ');

    if (names.Length == 1)
        return names[0][0].ToString().ToUpper();  // CRASH quando name = ""

    return $"{names[0][0]}{names[^1][0]}".ToUpper();
}
```

## Evolucao do binding: storage local → Model

```csharp
// ANTES — lia do Preferences (storage local)
// Problema: nao reagia a edicoes em tempo real
public UserProfileViewModel()
{
    Username = Preferences.Get("username", "BW");
}

// DEPOIS — binding ao Model com ObservableProperty
// Qualquer edicao no campo Name atualiza o AvatarView automaticamente
public UserProfileViewModel()
{
    Model = new Models.User
    {
        Name = "Wellison Arley",
        Email = "wellison@gmail.com"
    };
}
```

## Fluxo de reatividade completo

```
Usuario digita no campo Nome
    ↓
Binding TwoWay atualiza Model.Name
    ↓
[ObservableProperty] no campo name dispara OnPropertyChanged
    ↓
AvatarView recebe notificacao de mudanca
    ↓
Converter e chamado com novo valor
    ↓
Guard clause verifica se vazio → retorna "" se sim
    ↓
Calcula iniciais e retorna
    ↓
AvatarView exibe novas iniciais
```