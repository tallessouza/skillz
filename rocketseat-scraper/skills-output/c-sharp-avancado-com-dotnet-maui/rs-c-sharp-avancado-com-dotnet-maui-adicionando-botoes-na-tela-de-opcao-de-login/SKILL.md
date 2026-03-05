---
name: rs-csharp-maui-botoes-estilizacao
description: "Enforces .NET MAUI button creation and styling patterns when building mobile UI screens. Use when user asks to 'create a button', 'style a button', 'add margin', 'add spacing', 'build a login screen', or any .NET MAUI layout task. Applies rules: Button properties (BackgroundColor, TextColor, CornerRadius, HeightRequest), Margin with 4-value syntax (left,top,right,bottom), image in buttons via ImageSource. Make sure to use this skill whenever generating .NET MAUI XAML with buttons or spacing. Not for backend logic, authentication implementation, or non-MAUI frameworks."
---

# Botoes e Estilizacao no .NET MAUI

> Ao criar botoes no .NET MAUI, defina todas as propriedades visuais (cor, borda, fonte, altura) e use Margin com 4 valores para controlar espacamento preciso entre elementos.

## Rules

1. **Sempre defina BackgroundColor e TextColor** — `BackgroundColor="Black" TextColor="White"`, porque o botao padrao nao segue o design do Figma
2. **Use CornerRadius para bordas arredondadas** — `CornerRadius="20"`, porque botoes modernos raramente tem cantos retos
3. **Use HeightRequest para altura fixa** — `HeightRequest="60"`, porque o tamanho padrao do botao nao corresponde ao design
4. **Margin com 4 valores segue a ordem esquerda, cima, direita, baixo** — `Margin="0,20,0,40"`, porque essa e a convencao do .NET MAUI (diferente de CSS)
5. **Cores hexadecimais precisam do prefixo #** — `BackgroundColor="#E8E8E8"`, porque o MAUI so aceita nomes padrao (Red, Black) sem o prefixo
6. **Nomes de imagem devem ser minusculos sem espacos** — `google_logo.svg`, porque o .NET MAUI rejeita imagens com letras maiusculas ou espacos

## How to write

### Botao estilizado completo

```xml
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20" />
```

### Botao com imagem

```xml
<Button
    Text="Continuar com o Google"
    TextColor="Black"
    BackgroundColor="#E8E8E8"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    ImageSource="google_logo.png" />
```

### Espacamento com Margin (4 valores)

```xml
<!-- Margin="esquerda, cima, direita, baixo" -->
<Label
    Text="Tarefas pequenas, grandes resultados"
    Margin="0,30,0,40" />

<Button
    Text="Login com e-mail e senha"
    Margin="0,20,0,40" />
```

## Example

**Before (sem estilizacao):**
```xml
<Button Text="Login" />
<Button Text="Google" />
```

**After (com esta skill aplicada):**
```xml
<Button
    Text="Login com e-mail e senha"
    TextColor="White"
    BackgroundColor="Black"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    Margin="0,20,0,40" />

<Button
    Text="Continuar com o Google"
    TextColor="Black"
    BackgroundColor="#E8E8E8"
    FontSize="18"
    FontFamily="Raleway-Black"
    HeightRequest="60"
    CornerRadius="20"
    ImageSource="google_logo.png" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao com cor customizada | Use hexadecimal com # no BackgroundColor |
| Espacamento entre elementos | Use Margin com 4 valores no elemento que precisa de espaco |
| Espacamento uniforme em todos os lados | Passe um unico valor: `Margin="40"` |
| Adicionou nova imagem ao projeto | Pare o app e recompile (Hot Reload nao detecta novos recursos) |
| Imagem exportada do Figma | Renomeie para minusculas, sem espacos, use underline |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Margin="80"` quando so precisa de cima/baixo | `Margin="0,30,0,40"` |
| `Google_Logo.svg` (maiusculas) | `google_logo.svg` |
| `BackgroundColor="E8E8E8"` (sem #) | `BackgroundColor="#E8E8E8"` |
| Botao sem HeightRequest | `HeightRequest="60"` para altura consistente |
| Espacamento via padding no container | Margin no elemento especifico para controle granular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
