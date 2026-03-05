# Code Examples: Toast no .NET MAUI

## Exemplo completo do curso — ViewModel com Toast

Contexto: dentro de uma ViewModel de perfil do usuario, apos atualizar os dados via API.

```csharp
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;

public class UserProfileViewModel : BaseViewModel
{
    // Comando de atualizar perfil
    [RelayCommand]
    private async Task UpdateProfile()
    {
        var result = await _apiService.UpdateProfile(profileData);

        if (result.IsSuccess)
        {
            var toast = Toast.Make(
                "Perfil atualizado com sucesso!",
                duration: ToastDuration.Long,
                textSize: 24
            );
            await toast.Show();
        }
    }
}
```

## Variacoes

### Toast minimo (so mensagem)

```csharp
var toast = Toast.Make("Salvo!");
await toast.Show();
// Duracao: Short (2s), Fonte: 14
```

### Toast com duracao Short explicita

```csharp
var toast = Toast.Make(
    "Senha alterada!",
    duration: ToastDuration.Short
);
await toast.Show();
// Aparece por 2 segundos
```

### Toast com duracao Long e fonte grande

```csharp
var toast = Toast.Make(
    "Perfil atualizado com sucesso!",
    duration: ToastDuration.Long,
    textSize: 24
);
await toast.Show();
// Aparece por 3.5 segundos, fonte 24
```

### Inline (uma linha)

```csharp
await Toast.Make("Operacao concluida!").Show();
```

## Assinatura do metodo Toast.Make

```csharp
public static IToast Make(
    string message,                          // obrigatorio
    ToastDuration duration = ToastDuration.Short,  // opcional, default Short (2s)
    double textSize = 14                     // opcional, default 14
);
```

## Cenarios de uso recomendados

```csharp
// Sucesso em salvar dados
if (saveResult.IsSuccess)
{
    await Toast.Make("Dados salvos com sucesso!").Show();
}

// Confirmacao de exclusao
if (deleteResult.IsSuccess)
{
    await Toast.Make("Item removido.", duration: ToastDuration.Short).Show();
}

// Copia para clipboard
await Clipboard.SetTextAsync(text);
await Toast.Make("Copiado!").Show();
```

## Limitacoes demonstradas no curso

O que NAO e possivel fazer com Toast:

```csharp
// NAO EXISTE — nao ha como customizar cor
Toast.Make("msg", backgroundColor: Colors.Green);  // ERRO

// NAO EXISTE — nao ha como remover icone do app
Toast.Make("msg", showIcon: false);  // ERRO

// NAO EXISTE — nao ha como adicionar botao de acao
Toast.Make("msg", action: () => { });  // ERRO

// NAO EXISTE — duracao customizada em segundos
Toast.Make("msg", durationInSeconds: 5);  // ERRO
// Apenas ToastDuration.Short (2s) ou ToastDuration.Long (3.5s)
```