---
name: rs-csharp-maui-button-click-events
description: "Applies .NET MAUI button click event handling patterns when writing XAML event handlers and code-behind. Use when user asks to 'add button click', 'handle tap event', 'create event handler in MAUI', 'wire up button', or 'add clicked event'. Covers handler signatures, sender casting, event args, and naming conventions. Make sure to use this skill whenever generating .NET MAUI event handling code. Not for MVVM command binding, gestures, or non-button interactions."
---

# Eventos de Clique em Botoes no .NET MAUI

> Ao adicionar eventos de clique em botoes .NET MAUI, use a assinatura correta do handler, nomeie descritivamente, e entenda que o code-behind e temporario ate migrar para MVVM.

## Rules

1. **Use a propriedade `Clicked` no XAML** — `Clicked="ButtonGoogle_Clicked"`, porque e o evento padrao de toque em botoes no .NET MAUI
2. **Assinatura obrigatoria: `object sender, EventArgs e`** — o handler DEVE receber esses dois parametros, porque o runtime exige essa assinatura para vincular o evento
3. **Nomeie handlers descritivamente** — `ButtonGoogle_Clicked` nao `Button_Clicked`, porque ao bater o olho voce entende qual botao disparou o evento
4. **`sender` e sempre o objeto que disparou** — faca cast para o tipo correto (`(Button)sender`) para acessar propriedades, porque `sender` chega como `object`
5. **`EventArgs` nao carrega dados uteis no Clicked** — ele existe apenas para cumprir a assinatura obrigatoria, nao tente extrair informacoes dele
6. **Code-behind e temporario** — logica de negocio no code-behind quebra separacao de responsabilidades; migre para MVVM com Commands assim que possivel

## How to write

### Handler no XAML

```xml
<Button
    Text="Continuar com o Google"
    Clicked="ButtonGoogle_Clicked" />

<Button
    Text="Login com e-mail e senha"
    Clicked="ButtonLogin_Clicked" />
```

### Handler no Code-Behind (C#)

```csharp
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
    // sender e o botao que foi clicado
    var button = (Button)sender;

    // Navegar, chamar servico, etc.
}

private void ButtonLogin_Clicked(object sender, EventArgs e)
{
    // Cada botao pode ter seu proprio handler
}
```

### Usando sender para acessar o botao

```csharp
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
    var button = (Button)sender;
    button.Text = "Carregando...";
    button.IsEnabled = false;
}
```

## Example

**Before (nome generico, handler padrao do Visual Studio):**
```csharp
// XAML: Clicked="Button_Clicked"
private void Button_Clicked(object sender, EventArgs e)
{
    // Qual botao? Impossivel saber pelo nome
}
```

**After (nome descritivo, cast correto):**
```csharp
// XAML: Clicked="ButtonGoogle_Clicked"
private void ButtonGoogle_Clicked(object sender, EventArgs e)
{
    var button = (Button)sender;
    // Claro qual botao disparou, acesso tipado ao sender
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Visual Studio sugere `Button_Clicked` | Renomeie imediatamente para nome descritivo |
| Rider nao sugere criar handler | Crie manualmente com assinatura `(object sender, EventArgs e)` |
| Dois botoes fazem a mesma acao | Podem apontar para o mesmo handler, use `sender` para diferenciar |
| Precisa passar parametros do XAML | Nao use Clicked — migre para Command com CommandParameter (MVVM) |
| Logica de negocio no handler | Sinalize como debt — pertence ao ViewModel, nao ao code-behind |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `Button_Clicked` (generico) | `ButtonGoogle_Clicked` (descritivo) |
| `sender.Text = "..."` (sem cast) | `((Button)sender).Text = "..."` |
| Regra de negocio no code-behind | Command no ViewModel via MVVM |
| Ignorar `sender` e hardcodar referencia | Usar `sender` cast para acessar o objeto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
