---
name: rs-csharp-maui-spacing-layout
description: "Enforces correct spacing techniques in .NET MAUI VerticalStackLayout using spacing property and negative margins. Use when user asks to 'fix spacing', 'adjust layout', 'align components', 'add margins in MAUI', or 'build a XAML page layout'. Applies rules: use VerticalStackLayout spacing as base, calculate margins relative to base spacing, use negative margins to subtract, maintain minimum 30px between clickable elements. Make sure to use this skill whenever building or adjusting .NET MAUI page layouts with multiple stacked elements. Not for CSS layouts, HTML spacing, or non-MAUI frameworks."
---

# Espaçamento em .NET MAUI com VerticalStackLayout

> Defina um spacing base no VerticalStackLayout e use margens positivas/negativas nos elementos individuais para atingir o espaçamento exato do design.

## Rules

1. **Defina spacing no VerticalStackLayout como base** — `Spacing="30"` aplica espaçamento uniforme entre TODOS os filhos, porque evita repetir margens em cada elemento
2. **Calcule margens como delta do base** — se o design pede 40px e o base é 30, adicione `Margin="0,10,0,0"` (10+30=40), porque mantém a matemática previsível
3. **Use margens negativas para reduzir** — se o design pede 20px e o base é 30, use `Margin="0,-10,0,0"` (30-10=20), porque o MAUI suporta valores negativos em Margin
4. **Mínimo 30px entre elementos clicáveis** — botões e campos tocáveis precisam de espaço suficiente para o dedo do usuário, porque toques acidentais no elemento errado frustram o usuário
5. **Confira espaçamentos no Figma com Alt+hover** — segure Alt e passe o mouse sobre elementos adjacentes para ver a distância exata, porque garante fidelidade pixel-perfect

## How to write

### VerticalStackLayout com spacing base

```xml
<VerticalStackLayout Spacing="30">
    <!-- Todos os filhos terão 30px de espaçamento entre si -->
    <Label Text="Título" />
    <components:EntryLabelComponent />
    <components:EntryLabelPasswordComponent />
    <Button Text="Criar minha conta" />
</VerticalStackLayout>
```

### Margem positiva (aumentar além do base)

```xml
<!-- Design pede 70px acima e abaixo do botão. Base = 30. Delta = 40. -->
<Button
    Text="Criar minha conta"
    Margin="0,40,0,40" />
```

### Margem negativa (reduzir abaixo do base)

```xml
<!-- Design pede 20px entre labels. Base = 30. Delta = -10. -->
<Label
    Text="Subtítulo"
    Margin="0,-10,0,0" />
```

## Example

**Before (sem spacing, tudo colado):**
```xml
<VerticalStackLayout>
    <Label Text="PlanShare" />
    <Label Text="Comande sua rotina" />
    <components:EntryLabelComponent Title="Nome" />
    <components:EntryLabelComponent Title="E-mail" />
    <components:EntryLabelPasswordComponent Title="Senha" />
    <Button Text="Criar minha conta" Margin="0,50,0,50" />
</VerticalStackLayout>
```

**After (com spacing base + deltas):**
```xml
<VerticalStackLayout Spacing="30">
    <Label Text="PlanShare"
           Margin="0,0,0,-10" />
    <Label Text="Comande sua rotina"
           Margin="0,0,0,10" />
    <components:EntryLabelComponent Title="Nome" />
    <components:EntryLabelComponent Title="E-mail" />
    <components:EntryLabelPasswordComponent Title="Senha" />
    <Button Text="Criar minha conta"
            Margin="0,40,0,40" />
</VerticalStackLayout>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elementos com espaçamento uniforme | Use apenas `Spacing` no VerticalStackLayout |
| Um elemento precisa de mais espaço | Adicione margem positiva (delta = desejado - base) |
| Um elemento precisa de menos espaço | Adicione margem negativa (delta = desejado - base) |
| Botão entre seções | Margem generosa (40+) em top e bottom |
| Elementos clicáveis consecutivos | Mínimo 30px de distância final |
| Dúvida no valor | Confira no Figma com Alt+hover |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Colocar `Margin` em cada filho sem `Spacing` | Defina `Spacing` no layout pai e use margens só para exceções |
| Espaçamento < 20px entre elementos clicáveis | Mínimo 30px para touch targets |
| Chutar espaçamentos sem conferir design | Alt+hover no Figma para medir |
| `Spacing="0"` com margens individuais em todos | `Spacing="30"` como base e deltas pontuais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
