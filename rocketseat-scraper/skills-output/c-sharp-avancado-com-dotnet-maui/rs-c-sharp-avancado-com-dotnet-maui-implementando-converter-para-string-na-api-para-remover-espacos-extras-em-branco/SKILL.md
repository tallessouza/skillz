---
name: rs-csharp-dotnet-maui-string-converter
description: "Applies JSON string converter pattern in ASP.NET/C# APIs to sanitize incoming text by removing extra whitespace. Use when user asks to 'create a converter', 'sanitize input strings', 'trim whitespace in API', 'clean request body text', or 'implement JsonConverter for strings'. Ensures all string inputs are trimmed and extra spaces collapsed before reaching controllers. Make sure to use this skill whenever building C# APIs that receive user text input. Not for frontend validation, non-string converters, or output formatting."
---

# String Converter para APIs C#/.NET

> Implemente um JsonConverter<string> customizado para sanitizar todas as strings recebidas pela API, removendo espaços extras antes de chegarem aos controllers.

## Rules

1. **Nunca confie no front-end para sanitizacao** — a API e a ultima camada antes do banco de dados, porque dados sujos que passam pelo front-end vao direto para persistencia
2. **Use JsonConverter<string> para tratamento global** — registre o converter uma vez e todas as strings de todas as requests passam por ele, porque tratamento manual em cada endpoint e fragil e esquecivel
3. **Trim + Regex juntos** — `Trim()` remove espacos do inicio/fim, `Regex.Replace` com `\s+` colapsa espacos internos multiplos em um so, porque cada um resolve metade do problema
4. **Retorne null para valores nulos** — nao tente tratar null, repasse para a regra de negocio decidir, porque converter nao e validador
5. **Use GeneratedRegex em tempo de compilacao** — o Visual Studio sugere e melhora performance, porque regex compilado evita recompilacao a cada request
6. **Write apenas repassa** — no metodo Write do converter, apenas repasse o valor sem tratamento, porque a sanitizacao e responsabilidade da entrada, nao da saida

## How to write

### StringConverter com GeneratedRegex

```csharp
public partial class StringConverter : JsonConverter<string>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();

        if (value is null)
            return null;

        return RemoveExtraWhiteSpaces().Replace(value, " ").Trim();
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex RemoveExtraWhiteSpaces();
}
```

### Registro no Program.cs

```csharp
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new StringConverter());
});
```

## Example

**Before (sem converter — dados sujos salvos no banco):**
```
Input:  "  Ellison     Arley  "
Salvo:  "  Ellison     Arley  "
```

**After (com StringConverter registrado):**
```
Input:  "  Ellison     Arley  "
Salvo:  "Ellison Arley"
```

## Heuristics

| Situacao | Acao |
|----------|------|
| API recebe texto de usuario | Registrar StringConverter globalmente |
| Precisa transformar saida (ex: tudo maiusculo) | Adicionar logica no metodo Write (ex: `.ToUpper()`) |
| Valor recebido e null | Retornar null, deixar validacao de negocio tratar |
| Precisa de outros converters (datas, numeros) | Criar classes separadas na pasta Converters, registrar cada uma |
| Regex complexo em hot path | Sempre usar `[GeneratedRegex]` para compilacao em tempo de build |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Tratar espacos no front-end e confiar que basta | Tratar no back-end como obrigacao, front-end e bonus |
| Fazer `.Replace(" ", "")` manual em cada endpoint | Registrar um JsonConverter global |
| Usar apenas `Trim()` | Combinar `Trim()` + `Regex(\s+)` para cobrir espacos internos |
| Tratar null como string vazia no converter | Retornar null e deixar a regra de negocio validar |
| Usar `new Regex()` inline em cada chamada | Usar `[GeneratedRegex]` para regex compilado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
