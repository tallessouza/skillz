# Code Examples: String Converter para APIs C#/.NET

## Exemplo 1: StringConverter completo (versao final com GeneratedRegex)

```csharp
// PlanShare.Api/Converters/StringConverter.cs
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

public partial class StringConverter : JsonConverter<string>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();

        if (value is null)
            return null;

        // RemoveExtraWhiteSpaces() retorna regex compilado em tempo de build
        // .Replace(value, " ") colapsa multiplos espacos em um
        // .Trim() remove espacos do inicio e fim
        return RemoveExtraWhiteSpaces().Replace(value, " ").Trim();
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Write apenas repassa o valor — sanitizacao e responsabilidade da entrada
        writer.WriteStringValue(value);
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex RemoveExtraWhiteSpaces();
}
```

## Exemplo 2: Versao sem GeneratedRegex (funcional, porem menos performatica)

```csharp
public class StringConverter : JsonConverter<string>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();

        if (value is null)
            return null;

        var result = value.Trim();
        result = Regex.Replace(result, @"\s+", " ");

        return result;
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value);
    }
}
```

## Exemplo 3: Registro no Program.cs

```csharp
// Program.cs
// Antes: apenas AddControllers()
builder.Services.AddControllers();

// Depois: AddControllers com JsonOptions registrando o converter
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new StringConverter());
});
```

**Atencao com o using:**
```csharp
using PlanShare.Api.Converters; // NAO usar System.ComponentModel.DataAnnotations
```

## Exemplo 4: Como o Write poderia ser customizado

```csharp
// Exemplo: forcar todas as respostas string para maiusculo
public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
{
    writer.WriteStringValue(value.ToUpper());
}
```

## Exemplo 5: Cenarios de teste demonstrados na aula

### Cenario A — Espacos extras entre palavras
```
Input:   "Ellison          Arley"
Read():  "Ellison Arley"
```

### Cenario B — Espacos no inicio e fim
```
Input:   "   ABC   "
Read():  "ABC"
```

### Cenario C — Espacos no inicio, meio e fim
```
Input:   "  Ellison     Arley  "
Read():  "Ellison Arley"
```

### Cenario D — Valor nulo
```
Input:   null
Read():  null (repassado sem tratamento)
```

### Cenario E — Sem espacos extras (regex nao encontra padrao)
```
Input:   "Ellison Arley"
Read():  "Ellison Arley" (nenhuma alteracao, sem erro)
```

## Exemplo 6: Fluxo completo de uma request

```
1. Cliente envia POST /login com body:
   { "email": "  ellison@test.com  ", "password": "abc     123  " }

2. StringConverter.Read() executa ANTES do controller:
   - "  ellison@test.com  " → "ellison@test.com"
   - "abc     123  " → "abc 123"

3. Controller recebe objeto ja limpo:
   request.Email = "ellison@test.com"
   request.Password = "abc 123"
```