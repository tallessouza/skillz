---
name: rs-csharp-maui-estilos-botoes
description: "Enforces correct implicit vs explicit style strategy for .NET MAUI buttons and UI components. Use when user asks to 'style a button', 'create MAUI styles', 'fix button appearance', 'set default styles', or 'apply ResourceDictionary styles'. Applies rules: default style = most frequent design variant, override exceptions inline, never set rare values as implicit defaults. Make sure to use this skill whenever creating or debugging .NET MAUI styles. Not for CSS, HTML, or non-XAML styling."
---

# Estilos Implícitos vs Explícitos em .NET MAUI

> O estilo implícito (sem x:Key) deve representar o padrão mais frequente do design — exceções recebem valores inline no componente.

## Rules

1. **Estilo implícito = variante mais frequente** — analise o design completo, conte quantos botões usam cada variante, e defina o implícito com os valores da maioria, porque isso elimina repetição em dezenas de componentes
2. **Exceções vão inline no componente** — se apenas 2-3 botões diferem do padrão, coloque `HeightRequest`, `CornerRadius` etc. diretamente na tag XAML, porque criar um estilo explícito para uso único é over-engineering
3. **Estilos explícitos (x:Key) só quando reutilizado** — se um estilo diferenciado aparece em múltiplas páginas, aí sim crie um estilo com `x:Key`, porque justifica a abstração
4. **Nunca confie em valores assumidos** — sempre confira cada propriedade contra o Figma antes de definir no estilo, porque valores errados no implícito propagam o erro para todo o app
5. **Ordem de declaração importa** — em VerticalStackLayout, a posição da tag define a posição visual na tela, porque MAUI empilha componentes na ordem declarada

## How to write

### Estilo implícito (default) no ResourceDictionary

```xml
<!-- ButtonStyles.xaml — valores do padrão MAIS FREQUENTE -->
<Style TargetType="Button">
    <Setter Property="FontFamily" Value="MainFontBlack"/>
    <Setter Property="BackgroundColor" Value="Black"/>
    <Setter Property="TextColor" Value="White"/>
    <Setter Property="FontSize" Value="18"/>
    <Setter Property="HeightRequest" Value="50"/>
    <Setter Property="CornerRadius" Value="15"/>
</Style>
```

### Botão de exceção — override inline

```xml
<!-- Botão que difere do padrão: altura 60, borda 20 -->
<Button Text="Criar minha conta"
        HeightRequest="60"
        CornerRadius="20"
        BackgroundColor="#1E90FF"
        TextColor="Black"/>
```

### Botão padrão — zero configuração extra

```xml
<!-- Herda tudo do estilo implícito automaticamente -->
<Button Text="Login"/>
```

## Example

**Before (estilo default com valores da exceção):**
```xml
<!-- ResourceDictionary -->
<Style TargetType="Button">
    <Setter Property="HeightRequest" Value="60"/>
    <Setter Property="CornerRadius" Value="20"/>
</Style>

<!-- Todo botão comum precisa sobrescrever -->
<Button Text="Salvar" HeightRequest="50" CornerRadius="15"/>
<Button Text="Cancelar" HeightRequest="50" CornerRadius="15"/>
<Button Text="Confirmar" HeightRequest="50" CornerRadius="15"/>
```

**After (estilo default com valores frequentes):**
```xml
<!-- ResourceDictionary -->
<Style TargetType="Button">
    <Setter Property="HeightRequest" Value="50"/>
    <Setter Property="CornerRadius" Value="15"/>
</Style>

<!-- Botões comuns: limpos -->
<Button Text="Salvar"/>
<Button Text="Cancelar"/>
<Button Text="Confirmar"/>

<!-- Exceção: override inline -->
<Button Text="Criar minha conta" HeightRequest="60" CornerRadius="20"/>
```

## Heuristics

| Situação | Faça |
|----------|------|
| Propriedade aparece igual em 70%+ dos botões | Coloque no estilo implícito |
| Apenas 1-3 botões diferem | Override inline no componente |
| Estilo diferente reutilizado em 3+ páginas | Crie estilo explícito com `x:Key` |
| Dúvida sobre qual é o padrão | Conte no Figma quantas vezes cada variante aparece |
| Componente precisa ficar antes de outro visualmente | Declare a tag XAML antes no arquivo |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Default com valores da exceção (3 botões) | Default com valores da maioria (todos os outros) |
| Estilo explícito para uso único em uma página | Propriedades inline no componente |
| Assumir valores sem conferir o Figma | Verificar cada propriedade contra o design |
| Colocar botão depois do texto se ele aparece antes no design | Respeitar a ordem visual na declaração XAML |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
