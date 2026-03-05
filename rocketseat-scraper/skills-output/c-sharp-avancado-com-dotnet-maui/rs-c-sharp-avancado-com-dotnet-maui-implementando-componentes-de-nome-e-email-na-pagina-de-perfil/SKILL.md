---
name: rs-csharp-maui-profile-components
description: "Enforces correct data binding and ObservableProperty patterns when building profile or editable form pages in .NET MAUI. Use when user asks to 'create a profile page', 'bind form fields', 'implement ObservableProperty', 'handle empty string in converter', or 'reuse components across pages'. Applies rules: bind to model properties not local storage, use ObservableProperty only where UI reactivity is needed, guard converters against null/empty input, reuse existing components via copy-and-bind. Make sure to use this skill whenever implementing editable user profile screens or reactive data binding in MAUI. Not for API integration, image upload, or navigation logic."
---

# Componentes de Perfil com Data Binding Reativo

> Vincule campos editaveis ao Model via ObservableProperty e proteja converters contra valores vazios ou nulos.

## Rules

1. **Reutilize componentes existentes** — copie componentes como `EntryAndLabelComponent` de outras paginas e ajuste os bindings, porque recriar duplica bugs e diverge estilos
2. **Binding ao Model, nao ao storage local** — vincule `AvatarView` e campos a `Model.Name` em vez de `LocalPreferences`, porque o storage local nao reflete edicoes em tempo real
3. **ObservableProperty apenas onde a UI reage** — adicione `[ObservableProperty]` somente em propriedades que precisam notificar a tela (ex: `Name` atualiza iniciais no avatar, `Email` nao atualiza nada visual)
4. **Classe parcial + heranca ObservableObject** — toda classe com `[ObservableProperty]` precisa ser `partial` e herdar de `ObservableObject`, porque o source generator do CommunityToolkit exige ambos
5. **Namespace completo quando ha conflito de pastas** — se existe pasta `User` no projeto, referencie `Models.User` em vez de apenas `User`, porque o compilador confunde namespace com tipo
6. **Guard clause em converters** — sempre valide `string.IsNullOrWhiteSpace` antes de acessar caracteres, porque string vazia causa `IndexOutOfRangeException` ao acessar posicao zero

## How to write

### Model com ObservableProperty seletivo

```csharp
// partial + ObservableObject obrigatorios para source generator
public partial class User : ObservableObject
{
    // ObservableProperty porque avatar reage a mudancas no nome
    [ObservableProperty]
    private string name;

    // Propriedade simples — nenhum componente visual reage a mudancas no email
    public string Email { get; set; }
}
```

### ViewModel com referencia de namespace completo

```csharp
public partial class UserProfileViewModel : ObservableObject
{
    // Models.User em vez de User para evitar conflito com pasta User/
    [ObservableProperty]
    private Models.User model;

    public UserProfileViewModel()
    {
        // Valor temporario — substituir por chamada API no futuro
        Model = new Models.User
        {
            Name = "Wellison Arley",
            Email = "wellison@gmail.com"
        };
    }
}
```

### Converter com guard clause

```csharp
public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
{
    var name = value?.ToString() ?? string.Empty;

    if (string.IsNullOrWhiteSpace(name))
        return string.Empty;

    var names = name.Trim().Split(' ');
    // Agora seguro — name nunca esta vazio aqui
    return names.Length == 1
        ? names[0][0].ToString().ToUpper()
        : $"{names[0][0]}{names[^1][0]}".ToUpper();
}
```

### XAML com binding ao Model

```xml
<!-- Referencia ao namespace de componentes -->
<ContentPage xmlns:inputs="clr-namespace:PlanShare.App.Components.Inputs">

<!-- Bind ao Model.Name, nao a username do storage -->
<components:AvatarView Text="{Binding Model.Name, Converter={StaticResource InitialsConverter}}" />

<inputs:EntryAndLabelComponent
    Title="{x:Static resource:ResourceText.NAME}"
    Text="{Binding Model.Name}"
    Margin="0,35,0,30" />

<inputs:EntryAndLabelComponent
    Title="{x:Static resource:ResourceText.EMAIL}"
    Text="{Binding Model.Email}" />
```

## Example

**Before (binding ao storage local, converter sem protecao):**
```csharp
// ViewModel le do storage — nao reage a edicoes
Username = Preferences.Get("username", "BW");

// Converter quebra com string vazia
var initials = names[0][0]; // IndexOutOfRangeException!
```

**After (binding ao Model, converter protegido):**
```csharp
// ViewModel usa Model com ObservableProperty
Model = new Models.User { Name = "Wellison Arley", Email = "wellison@gmail.com" };

// Converter seguro
if (string.IsNullOrWhiteSpace(name))
    return string.Empty;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Propriedade muda e UI precisa reagir | `[ObservableProperty]` na propriedade |
| Propriedade muda mas UI nao reage | Propriedade auto-implementada simples |
| Componente ja existe em outra pagina | Copie e ajuste bindings |
| Nome de classe conflita com pasta | Use namespace completo (`Models.User`) |
| Converter recebe input do usuario | Guard clause com `IsNullOrWhiteSpace` antes de qualquer acesso |
| Espacamentos entre componentes | Use `Margin="esq,cima,dir,baixo"` conforme Figma |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Username = Preferences.Get(...)` para binding reativo | `Model.Name` com `[ObservableProperty]` |
| `names[0][0]` sem verificar se vazio | `if (string.IsNullOrWhiteSpace(name)) return "";` |
| `public class User` com `[ObservableProperty]` | `public partial class User : ObservableObject` |
| `User model` quando existe pasta User/ | `Models.User model` |
| `[ObservableProperty]` em todas as propriedades | Apenas nas que a UI observa |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
