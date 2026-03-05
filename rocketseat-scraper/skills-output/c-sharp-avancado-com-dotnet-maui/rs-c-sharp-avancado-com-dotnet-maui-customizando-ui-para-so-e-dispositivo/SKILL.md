---
name: rs-csharp-maui-customizando-ui-so-dispositivo
description: "Applies .NET MAUI platform-specific and device-specific UI customizations using OnPlatform and OnIdiom in XAML. Use when user asks to 'adjust layout for iOS and Android', 'handle platform differences in MAUI', 'customize margins per platform', 'use OnPlatform', or 'adapt UI for tablet vs phone'. Make sure to use this skill whenever writing XAML that needs different values per OS or device type. Not for C# code-behind platform checks, custom renderers, or platform-specific service implementations."
---

# Customizando UI para SO e Dispositivo no .NET MAUI

> Use `OnPlatform` e `OnIdiom` no XAML para definir valores especificos por sistema operacional e por tipo de dispositivo, garantindo layouts adaptaveis sem duplicar paginas.

## Rules

1. **Use `OnPlatform` para diferencas entre SO** — Android, iOS, Windows, macOS e Tizen tem renderizacoes nativas diferentes (ex: Entry no iOS tem borda retangular, no Android e uma linha fina), porque o .NET MAUI compila para controles nativos de cada plataforma
2. **Use `OnIdiom` para diferencas entre tipos de dispositivo** — Phone, Tablet, Desktop tem tamanhos e densidades diferentes, porque um valor de margem ideal para telefone pode ser inadequado para tablet
3. **Nunca use valores fixos quando o layout difere entre plataformas** — substitua por `OnPlatform` com valores especificos, porque um valor que funciona no Android pode quebrar o alinhamento no iOS
4. **Teste visualmente em simuladores de cada plataforma** — diferencas sutis de margem e padding so aparecem na execucao, porque o preview nem sempre reflete o comportamento nativo
5. **Valores no OnPlatform usam aspas simples** — a sintaxe XAML exige `'valor'` dentro das chaves, porque aspas duplas ja delimitam o atributo XML

## How to write

### OnPlatform para Margin

```xml
<!-- Valores diferentes de margem por SO -->
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntryStyle}">
    <Label.Margin>
        <OnPlatform x:TypeArguments="Thickness">
            <On Platform="Android" Value="4,0,0,0" />
            <On Platform="iOS" Value="0,0,0,4" />
        </OnPlatform>
    </Label.Margin>
</Label>
```

### OnPlatform inline (sintaxe compacta)

```xml
<!-- Sintaxe compacta dentro do atributo -->
<Label
    Text="Nome"
    Margin="{OnPlatform Android='4,0,0,0', iOS='0,0,0,4'}" />
```

### OnPlatform para Text

```xml
<!-- Textos diferentes por plataforma -->
<Label Text="{OnPlatform Android='Login Android', iOS='Login iPhone'}" />
```

### OnIdiom por tipo de dispositivo

```xml
<!-- Valores diferentes por tipo de dispositivo -->
<Label FontSize="{OnIdiom Phone=14, Tablet=18, Desktop=16}" />
```

### OnPlatform para qualquer propriedade

```xml
<!-- Funciona para FontSize, FontFamily, TextColor, etc -->
<Label
    FontSize="{OnPlatform Android=16, iOS=14}"
    TextColor="{OnPlatform Android='#333333', iOS='#222222'}" />
```

## Example

**Before (valor fixo que so funciona no Android):**
```xml
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntryStyle}"
    Margin="4,0,0,0" />
```

**After (adaptado para Android e iOS):**
```xml
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntryStyle}"
    Margin="{OnPlatform Android='4,0,0,0', iOS='0,0,0,4'}" />
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Entry tem borda diferente entre iOS e Android | Aceite o visual nativo por enquanto, customize com estilos dedicados depois |
| Margem de label desalinha com entry em uma plataforma | Use `OnPlatform` no `Margin` do label |
| Texto precisa variar por SO | Use `OnPlatform` no atributo `Text` |
| Layout precisa variar entre phone e tablet | Use `OnIdiom` com valores para `Phone` e `Tablet` |
| Titulo indesejado na navigation bar (ex: "Home") | Remova o `Title` do `ShellContent` no AppShell.xaml |
| Precisa da mesma logica no code-behind C# | Use `DeviceInfo.Platform` (sera ensinado em aulas futuras) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Valor fixo de margem que so funciona em um SO | `OnPlatform` com valores por SO |
| Criar paginas XAML separadas por plataforma | Uma pagina com `OnPlatform`/`OnIdiom` nos valores |
| Ignorar diferencas visuais entre iOS e Android | Testar em simuladores de ambas plataformas |
| Usar `OnIdiom` quando a diferenca e por SO | `OnPlatform` para SO, `OnIdiom` para tipo de dispositivo |
| Adivinhar valores sem testar visualmente | Exagerar o valor temporariamente para confirmar que esta aplicando |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
