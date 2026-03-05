---
name: rs-csharp-dotnet-maui-update-profile
description: "Applies .NET MAUI profile update patterns using Use Case, ViewModel, and UserStorage. Use when user asks to 'update user profile', 'implement edit profile', 'save user changes in MAUI', or 'sync local storage after API update'. Covers record immutability with 'with' syntax, UserStorage refresh, and status page feedback. Make sure to use this skill whenever implementing profile update flows in .NET MAUI apps. Not for authentication, login, password change, or registration flows."
---

# Atualizando Dados de Perfil no .NET MAUI

> Ao atualizar perfil, sincronize o UserStorage local apos a API confirmar sucesso, usando a sintaxe `with` para criar novos records imutaveis.

## Rules

1. **Use Case recebe apenas nome e email** — senha e um fluxo separado, porque misturar update de perfil com troca de senha gera complexidade desnecessaria
2. **Sempre atualize o UserStorage apos sucesso da API** — porque outras telas (ex: Dashboard) leem dados do storage local, e dados desatualizados causam inconsistencia visual
3. **Use `with` para criar novo record** — records em C# sao imutaveis apos inicializacao, entao `user.Name = x` nao compila; use `user with { Name = newName }` para clonar com alteracoes
4. **StatusPage deve ser Sending (nao Loading) durante envio** — porque Loading indica busca de dados, Sending indica envio e exibe a animacao de aviãozinho correta
5. **Retorne StatusPage ao estado original apos completar** — independente de sucesso ou erro, a UI deve voltar a mostrar os componentes normais
6. **Nao esqueca o Command Binding no XAML** — o botao precisa de `Command="{Binding UpdateProfileCommand}"`, sem isso nada acontece ao tocar

## How to write

### Use Case — Execute

```csharp
public async Task<ResultT<string>> Execute(Model model)
{
    var request = new RequestUpdateUserJson
    {
        Name = model.Name,
        Email = model.Email
    };

    var response = await _userApi.UpdateProfile(request);

    if (response.IsSuccessStatusCode)
    {
        // Recupera record atual e cria novo com nome atualizado
        var user = _userStorage.Get() with { Name = model.Name };
        _userStorage.Save(user);

        return ResultT<string>.Success("Perfil atualizado com sucesso");
    }

    return response.GetResponseError();
}
```

### ViewModel — Comando UpdateProfile

```csharp
public async Task UpdateProfile()
{
    StatusPage = StatusPageEnum.Sending;

    var result = await _updateUserUseCase.Execute(Model);

    if (result.IsSuccess)
    {
        // Feedback de sucesso (alert implementado depois)
    }
    else
    {
        await GoToPageWithErrors(result.Errors);
    }

    StatusPage = StatusPageEnum.Default;
}
```

### XAML — Animacao de envio + Binding do botao

```xml
<!-- Componente de animacao sending -->
<components:SendingAnimation
    IsVisible="False"
    Trigger="{Binding StatusPage, Converter={StaticResource StatusToSending}}" />

<!-- Botao com Command binding -->
<Button Text="Atualizar Perfil"
        Command="{Binding UpdateProfileCommand}" />
```

## Example

**Before (erro comum — tentar mutar record):**
```csharp
var user = _userStorage.Get();
user.Name = model.Name; // ERRO: record e imutavel
_userStorage.Save(user);
```

**After (com esta skill aplicada):**
```csharp
var user = _userStorage.Get() with { Name = model.Name };
_userStorage.Save(user);
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API nao retorna body na resposta | Use dados do model/request para atualizar storage local |
| Precisa do ID do usuario | Recupere do UserStorage.Get(), nao peca a API |
| Dados locais usados em outra tela | Atualize storage mesmo que valor seja igual (substituicao sem erro) |
| Operacao de envio (POST/PUT) | Use StatusPage.Sending, nao StatusPage.Loading |
| Feedback de sucesso necessario | Implemente via alert do .NET MAUI, nao deixe if vazio em producao |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `user.Name = newName` em record | `user with { Name = newName }` |
| Ignorar UserStorage apos update | Sempre salvar dados atualizados no storage |
| Usar Loading para envio de dados | Usar Sending para operacoes de escrita |
| Esquecer Command binding no XAML | `Command="{Binding UpdateProfileCommand}"` |
| Misturar senha no update de perfil | Fluxo separado para troca de senha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
