---
name: rs-csharp-maui-toggle-visibility-triggers
description: "Enforces .NET MAUI DataTrigger visibility toggle patterns when building XAML pages with conditional UI states. Use when user asks to 'show/hide elements', 'toggle visibility', 'switch between views', 'conditional UI in MAUI', or 'status-based page layout'. Applies rules: wrap competing layouts in parent StackLayout, use DataTrigger with status enum binding, pair IsVisible with inverse triggers. Make sure to use this skill whenever generating XAML with state-dependent visibility in .NET MAUI. Not for navigation, animations, or non-MAUI frameworks."
---

# Toggle de Visibilidade com DataTriggers no .NET MAUI

> Ao alternar elementos visiveis em uma pagina XAML, use DataTriggers vinculados a um status enum em vez de code-behind manual.

## Rules

1. **Um ContentPage so aceita um layout raiz** — encapsule layouts concorrentes dentro de um VerticalStackLayout pai, porque ContentPage rejeita multiplos filhos diretos
2. **Use DataTrigger para controlar IsVisible** — vincule ao status da pagina via binding, porque isso mantem a logica de visibilidade declarativa no XAML
3. **DataTrigger exige tres propriedades** — `TargetType`, `Binding` (com `{Binding StatusPage}`) e `Value` (com `{x:Static Models:EnumValue}`), porque omitir qualquer uma silenciosamente ignora o trigger
4. **Layouts inversos comecam com IsVisible=False** — o layout alternativo deve ter `IsVisible="False"` por padrao e o trigger seta `True`, porque evita flash de conteudo incorreto
5. **CornerRadius = metade da largura para circulos** — em AvatarView com Height=Width=100, use CornerRadius=50, porque e a unica forma de garantir circulo perfeito
6. **Use Converters para transformar dados no binding** — iniciais de nome via `Converter={StaticResource NameToAvatarName}`, porque logica de apresentacao nao pertence a ViewModel

## How to write

### Estrutura de layouts com visibilidade alternada

```xml
<VerticalStackLayout>
    <!-- Layout A: visivel por padrao, escondido quando status muda -->
    <VerticalStackLayout>
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
                <Setter Property="IsVisible" Value="False" />
            </DataTrigger>
        </VerticalStackLayout.Triggers>
        <!-- conteudo do estado inicial -->
    </VerticalStackLayout>

    <!-- Layout B: escondido por padrao, exibido quando status muda -->
    <VerticalStackLayout IsVisible="False">
        <VerticalStackLayout.Triggers>
            <DataTrigger TargetType="VerticalStackLayout"
                         Binding="{Binding StatusPage}"
                         Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
                <Setter Property="IsVisible" Value="True" />
            </DataTrigger>
        </VerticalStackLayout.Triggers>
        <!-- conteudo do estado alternativo -->
    </VerticalStackLayout>
</VerticalStackLayout>
```

### AvatarView com Converter

```xml
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource AvatarColorLight}, Dark={StaticResource AvatarColor}}"
    BorderWidth="0"
    FontFamily="{x:Static FontFamily.MainFontsBlack}"
    FontSize="24"
    HeightRequest="100"
    WidthRequest="100"
    CornerRadius="50"
    TextColor="{AppThemeBinding Light={StaticResource SecondaryColorLight}, Dark={StaticResource SecondaryColorDark}}"
    Text="{Binding JoinerUser.Name, Converter={StaticResource NameToAvatarName}}" />
```

### TextTransform para uppercase sem alterar resource

```xml
<Button Text="{x:Static resources:TitleAccept}"
        TextTransform="Uppercase" />
```

## Example

**Before (logica de visibilidade no code-behind):**
```csharp
// ViewModel
if (status == JoinerConnectedPendingApproval)
{
    GenerateCodeLayout.IsVisible = false;
    ApprovalLayout.IsVisible = true;
}
```

**After (declarativo com DataTriggers):**
```xml
<VerticalStackLayout>
    <VerticalStackLayout.Triggers>
        <DataTrigger TargetType="VerticalStackLayout"
                     Binding="{Binding StatusPage}"
                     Value="{x:Static Models:ConnectionByCodeStatusPage.JoinerConnectedPendingApproval}">
            <Setter Property="IsVisible" Value="False" />
        </DataTrigger>
    </VerticalStackLayout.Triggers>
    <!-- elementos de gerar codigo -->
</VerticalStackLayout>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina com 2+ estados visuais distintos | Crie layouts separados com DataTriggers inversos |
| Precisa exibir iniciais de nome | Use Converter no binding, nunca formate na ViewModel |
| Botao com texto uppercase | Use `TextTransform="Uppercase"`, nunca altere o resource file |
| Circulo perfeito em AvatarView | `CornerRadius` = metade de `HeightRequest`/`WidthRequest` |
| Multiplos layouts concorrentes | Encapsule todos em um VerticalStackLayout pai |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `IsVisible` toggled no code-behind | DataTrigger no XAML com binding ao status |
| Texto em CAPS no arquivo de resource | `TextTransform="Uppercase"` no elemento XAML |
| `Text="{Binding JoinerUser.Name}"` direto no avatar | `Text="{Binding JoinerUser.Name, Converter={StaticResource NameToAvatarName}}"` |
| Dois ContentPage.Content para estados diferentes | Um layout pai com filhos alternados via triggers |
| `CornerRadius="100"` para circulo em elemento 100x100 | `CornerRadius="50"` (metade da dimensao) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
