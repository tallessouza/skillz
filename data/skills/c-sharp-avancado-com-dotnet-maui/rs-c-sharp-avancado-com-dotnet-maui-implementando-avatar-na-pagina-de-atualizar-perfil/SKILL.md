---
name: rs-csharp-maui-avatar-border-overlay
description: "Applies .NET MAUI Avatar View and Border overlay patterns when building profile pages or user avatar components. Use when user asks to 'create avatar', 'profile page', 'circular image', 'overlay icon on image', 'border component MAUI', or 'round element'. Enforces correct CornerRadius formula (size/2), StrokeShape for circles, negative margins for overlays, and proper copy-paste verification. Make sure to use this skill whenever implementing circular UI elements or image overlays in .NET MAUI. Not for backend logic, authentication, or non-UI tasks."
---

# Avatar com Border Overlay no .NET MAUI

> Ao criar avatares circulares com elementos sobrepostos, use CornerRadius = tamanho/2, Border com StrokeShape para circulos, e margem negativa para sobreposicao.

## Rules

1. **CornerRadius = metade do tamanho** — para um elemento 100x100, CornerRadius=50, porque esse calculo transforma qualquer quadrado em circulo perfeito desde que altura=largura
2. **Sempre defina HeightRequest e WidthRequest explicitamente** — nao confie nos valores default do .NET MAUI, porque o default cria formas inesperadas (quadrados com bordas arredondadas)
3. **Altura e largura devem ser iguais para circulos** — CornerRadius so gera circulo perfeito quando HeightRequest == WidthRequest
4. **Use Border do .NET MAUI para circulos com borda** — nao crie imagens separadas para fundos circulares, porque o componente Border com StrokeShape ja resolve isso nativamente
5. **Verifique propriedade por propriedade ao copiar codigo** — cores, tamanhos e bindings mudam entre contextos, porque ctrl-c ctrl-v sem revisao gera bugs silenciosos
6. **Use margem negativa para sobreposicao** — Margin="0,-20,0,0" posiciona elementos por cima de outros sem AbsoluteLayout

## How to write

### AvatarView circular com tamanho correto

```xml
<toolkit:AvatarView
    BackgroundColor="{AppThemeBinding Light={StaticResource PrimaryColorLight},
                      Dark={StaticResource PrimaryColorDark}}"
    BorderWidth="0"
    CornerRadius="50"
    FontSize="32"
    HeightRequest="100"
    WidthRequest="100"
    Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />
```

### Border circular com icone sobreposto

```xml
<Border
    BackgroundColor="{AppThemeBinding Light={StaticResource HighlightColorLight},
                      Dark={StaticResource HighlightColorDark}}"
    HeightRequest="35"
    WidthRequest="35"
    StrokeShape="RoundRectangle 35,35,35,35"
    StrokeThickness="3"
    Stroke="{AppThemeBinding Light={StaticResource SecondaryColorLight},
             Dark={StaticResource SecondaryColorDark}}"
    Margin="0,-20,0,0">
    <Image
        Source="icon_pen"
        HeightRequest="15"
        WidthRequest="15">
        <Image.Behaviors>
            <toolkit:IconTintColorBehavior
                TintColor="{AppThemeBinding Light={StaticResource SecondaryColorLight},
                            Dark={StaticResource SecondaryColorDark}}" />
        </Image.Behaviors>
    </Image>
</Border>
```

## Example

**Before (avatar sem dimensoes, border como imagem):**
```xml
<toolkit:AvatarView Text="{Binding Username}" CornerRadius="10" />
<Image Source="blue_circle_bg" />
<Image Source="icon_pen" />
```

**After (com esta skill aplicada):**
```xml
<toolkit:AvatarView
    HeightRequest="100" WidthRequest="100"
    CornerRadius="50"
    FontSize="32"
    BorderWidth="0"
    Text="{Binding Username, Converter={StaticResource NameToAvatarConverter}}" />

<Border
    HeightRequest="35" WidthRequest="35"
    StrokeShape="RoundRectangle 35,35,35,35"
    StrokeThickness="3"
    Stroke="{AppThemeBinding Light={StaticResource SecondaryColorLight},
             Dark={StaticResource SecondaryColorDark}}"
    Margin="0,-20,0,0">
    <Image Source="icon_pen" HeightRequest="15" WidthRequest="15" />
</Border>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento precisa ser circulo | HeightRequest = WidthRequest, CornerRadius = valor/2 |
| Circulo com borda e conteudo | Use Border com StrokeShape, nao imagens empilhadas |
| Elemento deve sobrepor outro | Margem negativa no eixo desejado |
| Copiando componente de outra pagina | Revise CADA propriedade: cores, tamanhos, bindings, converters |
| Imagem nao aparece (branca no fundo branco) | Cor do elemento e igual ao fundo — aplique IconTintColorBehavior ou mude o fundo |
| Precisa saber margem negativa exata | No Figma: segure Alt e meça distancia, Shift+seta move 10px por vez |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `CornerRadius="10"` para circulo | `CornerRadius="50"` (metade de 100x100) |
| AvatarView sem HeightRequest/WidthRequest | Sempre definir ambos explicitamente |
| Imagem separada para fundo circular | `Border` com `StrokeShape="RoundRectangle"` |
| `Stroke="Red"` hardcoded | `Stroke="{AppThemeBinding ...}"` com recursos tematicos |
| Copiar codigo sem revisar propriedades | Verificar cada propriedade contra o Figma |
| HeightRequest diferente de WidthRequest para circulo | Valores iguais obrigatoriamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
