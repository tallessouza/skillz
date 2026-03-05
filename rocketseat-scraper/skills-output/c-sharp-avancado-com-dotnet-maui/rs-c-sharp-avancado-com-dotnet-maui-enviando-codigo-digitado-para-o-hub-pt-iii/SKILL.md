---
name: rs-csharp-maui-hub-communication-ui
description: "Enforces .NET MAUI patterns for real-time Hub communication UI with SignalR. Use when user asks to 'connect to SignalR', 'show loading indicator in MAUI', 'use ActivityIndicator', 'DataTrigger in XAML', 'dynamic text with binding StringFormat', or 'switch UI based on status'. Applies ActivityIndicator setup, DataTrigger with ViewModel status binding, and XAML StringFormat for parameterized resource strings. Make sure to use this skill whenever building real-time connection UI in .NET MAUI. Not for backend Hub implementation, API design, or non-MAUI mobile frameworks."
---

# Comunicacao em Tempo Real com Hub no .NET MAUI

> Ao construir UI de conexao em tempo real, use ActivityIndicator para feedback visual, DataTriggers para trocar conteudo baseado em status, e StringFormat no XAML para textos parametrizados.

## Rules

1. **Sempre preencha as 3 propriedades do ActivityIndicator** — `Color`, `HeightRequest` (ou `WidthRequest`), e `IsRunning`, porque sem `IsRunning=True` o indicador nao aparece
2. **Use DataTrigger para trocar texto por status** — vincule ao StatusPage da ViewModel via `Binding` no DataTrigger, porque evita code-behind e mantem reatividade declarativa
3. **Use StringFormat no XAML para textos parametrizados** — `{Binding Property, StringFormat={StaticResource key}}` substitui o `{0}` do resource, porque elimina string.Format manual no C#
4. **Associe dependencias injetadas no construtor da ViewModel** — receber no construtor sem atribuir as propriedades e um erro silencioso comum
5. **Use HorizontalTextAlignment para centralizar texto** — `HorizontalOptions="Center"` centraliza o Label como container, mas `HorizontalTextAlignment="Center"` centraliza o texto dentro dele

## How to write

### ActivityIndicator com AppThemeBinding

```xml
<ActivityIndicator
    Color="{AppThemeBinding
        Light={StaticResource HighlightColorLight},
        Dark={StaticResource HighlightColorDark}}"
    HeightRequest="40"
    IsRunning="True" />
```

### DataTrigger para trocar texto por status

```xml
<Label Text="{x:Static resources:ResourceText.PhraseConnectingToTheServer}"
       HorizontalTextAlignment="Center"
       FontSize="20">
    <Label.Triggers>
        <DataTrigger TargetType="Label"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static models:ConnectionByCodeStatusPage.JoinerConnectedSpendingApproval}">
            <Setter Property="Text"
                    Value="{Binding GeneratedBy,
                        StringFormat={StaticResource PhraseWaitingApprovalFrom}}" />
        </DataTrigger>
    </Label.Triggers>
</Label>
```

### Atribuicao de dependencias na ViewModel

```csharp
public UserConnectionJoinerViewModel(
    IUseRefreshToken useRefreshToken,
    IUserConnectionByCodeClient client,
    INavigationService navigationService) : base(navigationService)
{
    _useRefreshToken = useRefreshToken;
    _userConnectionByCodeClient = client;
    // NAO esqueca de atribuir — injecao sem atribuicao = NullReferenceException
}
```

## Example

**Before (ActivityIndicator sem propriedades obrigatorias):**
```xml
<ActivityIndicator />
<!-- Nada aparece na tela -->
```

**After (com as 3 propriedades):**
```xml
<ActivityIndicator
    Color="{AppThemeBinding Light=#FF6B6B, Dark=#FF8E8E}"
    HeightRequest="40"
    IsRunning="True" />
<!-- Loading spinner visivel e girando -->
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Processo async com espera (1-2s) | Exiba ActivityIndicator com IsRunning vinculado ao status |
| Texto muda baseado em estado da pagina | Use DataTrigger com Binding ao StatusPage enum |
| Texto de resource tem parametro `{0}` | Use StringFormat no Binding XAML, nao string.Format no C# |
| ActivityIndicator tamanho | 40 e um bom padrao — 30 muito pequeno, 50 muito grande |
| Label nao centraliza com HorizontalOptions | Use HorizontalTextAlignment="Center" |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<ActivityIndicator />` sem propriedades | `<ActivityIndicator Color="..." HeightRequest="40" IsRunning="True" />` |
| `HorizontalOptions="Center"` para centralizar texto | `HorizontalTextAlignment="Center"` |
| string.Format no code-behind para trocar texto | DataTrigger + StringFormat no XAML |
| Construtor recebe dependencia sem atribuir | `_field = parameter` para cada dependencia |
| Texto fixo que muda por status via code-behind | DataTrigger com Value vinculado ao enum |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
