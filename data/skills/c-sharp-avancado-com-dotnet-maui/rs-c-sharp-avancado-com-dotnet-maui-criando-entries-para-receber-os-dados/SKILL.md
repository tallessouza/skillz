---
name: rs-csharp-maui-criando-entries
description: "Applies .NET MAUI Entry element patterns when building forms for user input. Use when user asks to 'create a form', 'add input fields', 'build a registration page', 'collect user data', or 'add text entry' in .NET MAUI. Covers Entry properties (Placeholder, Keyboard, IsPassword), styling, and reusable component preparation. Make sure to use this skill whenever generating XAML forms with text inputs in .NET MAUI projects. Not for web forms, Blazor inputs, or non-MAUI frameworks."
---

# Criando Entries no .NET MAUI

> Ao criar formularios com entrada de dados no .NET MAUI, use o elemento Entry com propriedades semanticas (Placeholder, Keyboard, IsPassword) para guiar o usuario e facilitar a digitacao.

## Rules

1. **Sempre defina Placeholder com exemplo real** — `Placeholder="Bruce Wayne"` nao `Placeholder="Digite aqui"`, porque o exemplo concreto comunica o formato esperado sem ambiguidade
2. **Use Keyboard apropriado para cada tipo de dado** — `Keyboard="Email"` para e-mail, `Keyboard="Numeric"` para numeros, `Keyboard="Telephone"` para telefone, porque altera o layout do teclado facilitando a digitacao
3. **Use IsPassword="True" para campos de senha** — esconde os caracteres digitados com asteriscos automaticamente
4. **Crie estilos reutilizaveis para labels de titulo** — defina Style com TargetType="Label" e Key descritiva como `TitleForEntry`, porque o padrao titulo+entry se repete em multiplas paginas
5. **Estilize PlaceholderColor e TextColor separadamente** — placeholder deve ser cinza claro, texto digitado deve ser escuro, porque sao estados visuais distintos
6. **Planeje componentes reutilizaveis** — quando o padrao label+entry se repete, extraia para um componente compartilhado entre paginas

## How to write

### Entry basica com placeholder

```xml
<Label
    Text="Nome"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="Bruce Wayne"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

### Entry para e-mail com keyboard especifico

```xml
<Label
    Text="E-mail"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="bruce@wayne.com"
    Keyboard="Email"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

### Entry para senha

```xml
<Label
    Text="Senha"
    Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="********"
    IsPassword="True"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

### Estilo reutilizavel para titulo da entry

```xml
<Style x:Key="TitleForEntry" TargetType="Label">
    <Setter Property="FontSize" Value="11" />
    <Setter Property="FontFamily" Value="MainFontThin" />
</Style>
```

## Example

**Before (sem semantica):**
```xml
<Label Text="E-mail" />
<Entry />
<Label Text="Senha" />
<Entry />
```

**After (com propriedades semanticas):**
```xml
<Label Text="E-mail" Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="bruce@wayne.com"
    Keyboard="Email"
    PlaceholderColor="#808080"
    TextColor="Black" />

<Label Text="Senha" Style="{StaticResource TitleForEntry}" />
<Entry
    Placeholder="********"
    IsPassword="True"
    PlaceholderColor="#808080"
    TextColor="Black" />
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo solicita e-mail | `Keyboard="Email"` — adiciona tecla @ no teclado |
| Campo solicita telefone | `Keyboard="Telephone"` — mostra teclado numerico |
| Campo solicita URL | `Keyboard="Url"` — adiciona barra e .com |
| Campo solicita senha | `IsPassword="True"` — esconde caracteres |
| Padrao label+entry repete em 2+ paginas | Extraia para componente reutilizavel |
| Cursor/linha da Entry com cor errada | Requer codigo especifico por plataforma (Android/iOS) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Placeholder="Digite aqui"` | `Placeholder="Bruce Wayne"` (exemplo real) |
| Entry de e-mail sem `Keyboard="Email"` | `<Entry Keyboard="Email" .../>` |
| Entry de senha sem `IsPassword="True"` | `<Entry IsPassword="True" .../>` |
| Copiar label+entry em cada pagina manualmente | Criar componente reutilizavel |
| Inline styles repetidos em cada Entry | Style com Key no ResourceDictionary |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
