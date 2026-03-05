---
name: rs-csharp-maui-handlers
description: "Applies .NET MAUI handler customization patterns when writing platform-specific UI code. Use when user asks to 'customize a control', 'change entry appearance', 'modify native behavior', 'create a handler', or 'extend MAUI controls'. Covers handler architecture (virtual-to-native mapping), AppendToMapping, ConfigureMauiHandlers setup, and Action vs Func distinction. Make sure to use this skill whenever customizing .NET MAUI control rendering or native platform behavior. Not for XAML styling, resource dictionaries, or general C# class design."
---

# Handlers no .NET MAUI

> Utilize handlers para mapear comportamentos customizados de elementos virtuais do .NET MAUI para controles nativos de cada plataforma.

## Rules

1. **Entenda a arquitetura de 3 camadas** — Virtual View (Entry, Button) → Handler (EntryHandler) → Native View (EditText no Android, UITextField no iOS), porque handlers sao a ponte entre o mundo .NET MAUI e o nativo
2. **Nunca recrie o handler inteiro** — use `AppendToMapping` para adicionar funcionalidades ao handler default, porque o .NET MAUI ja tem todos os mapeamentos necessarios
3. **Organize handlers em pasta dedicada** — crie `Resources/Styles/Handler/` para classes de handler, porque o projeto tera multiplos arquivos de customizacao
4. **Registre handlers no MauiProgram** — chame `ConfigureMauiHandlers` no builder, porque sem registro o app ignora a customizacao
5. **Use chave unica no AppendToMapping** — formato `{NomeProjeto}{Elemento}` (ex: `PlanShareEntry`), porque cada funcionalidade mapeada precisa de identificador unico
6. **Faca metodos de handler estaticos** — o metodo `Customize` nao precisa de instancia, porque sera chamado diretamente pela configuracao

## How to write

### Classe de handler customizado

```csharp
// Resources/Styles/Handler/CustomEntryHandler.cs
namespace SeuProjeto.Resources.Styles.Handler;

public class CustomEntryHandler
{
    public static void Customize()
    {
        Microsoft.Maui.Handlers.EntryHandler
            .Mapper
            .AppendToMapping("SeuProjetoEntry", (handler, view) =>
            {
                // Customizacoes nativas aqui
            });
    }
}
```

### Registro no MauiProgram

```csharp
// MauiProgram.cs
var builder = MauiApp.CreateBuilder();
builder
    .UseMauiApp<App>()
    .ConfigureFonts(fonts => { /* ... */ })
    .ConfigureMauiHandlers(_ =>
    {
        CustomEntryHandler.Customize();
    });
```

## Example

**Before (tentando customizar sem handler):**
```csharp
// Erro: tentar alterar propriedades nativas diretamente no XAML ou code-behind
var entry = new Entry();
// Nao existe propriedade para cor do cursor ou linha no .NET MAUI
```

**After (com handler customizado):**
```csharp
// CustomEntryHandler.cs
public class CustomEntryHandler
{
    public static void Customize()
    {
        EntryHandler.Mapper.AppendToMapping("MeuAppEntry", (handler, view) =>
        {
            // Acesso ao controle nativo via handler.PlatformView
            // Customizacoes de cor, cursor, linha aqui
        });
    }
}

// MauiProgram.cs — registrar
.ConfigureMauiHandlers(_ =>
{
    CustomEntryHandler.Customize();
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa alterar aparencia nativa (cor cursor, linha) | Crie handler com AppendToMapping |
| Parametro do delegate nao sera usado | Use `_` (underline) para ignorar |
| Funcao sem retorno como parametro | Use `Action<T1, T2>` (nao `Func`) |
| Funcao com retorno como parametro | Use `Func<T1, T2, TResult>` (ultimo tipo = retorno) |
| Customizacao afeta apenas um controle | Use handler especifico (EntryHandler, ButtonHandler) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Recriar handler do zero | `AppendToMapping` no handler existente |
| Colocar handler junto com pages | Pasta `Resources/Styles/Handler/` |
| Instanciar classe so para chamar Customize | `public static void Customize()` |
| Chamar Customize sem registrar no MauiProgram | `.ConfigureMauiHandlers(_ => { ... })` |
| Usar mesma chave para handlers diferentes | Chave unica: `{Projeto}{Elemento}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
