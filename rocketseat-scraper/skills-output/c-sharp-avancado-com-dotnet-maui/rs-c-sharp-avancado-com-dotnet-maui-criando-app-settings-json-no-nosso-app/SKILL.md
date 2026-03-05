---
name: rs-csharp-maui-appsettings-json
description: "Applies appsettings.json configuration pattern in .NET MAUI apps when user asks to 'add settings', 'configure API URL', 'read config in MAUI', 'setup appsettings', or 'manage environment config in mobile app'. Covers file creation, EmbeddedResource build action, NuGet packages, and MauiProgram registration. Make sure to use this skill whenever setting up configuration files in .NET MAUI projects. Not for ASP.NET API appsettings (which is built-in) or Xamarin projects."
---

# AppSettings.json em .NET MAUI

> Configurar appsettings.json em .NET MAUI requer setup manual: criar o arquivo, marcar como EmbeddedResource, instalar pacotes de configuracao, e registrar no MauiProgram.

## Rules

1. **Crie apenas um appsettings.json** — nao crie appsettings.Development.json ou appsettings.Production.json no app, porque MAUI nao tem IWebHostEnvironment para detectar ambiente automaticamente como a API faz
2. **Marque como EmbeddedResource** — o Build Action do arquivo deve ser `EmbeddedResource`, nao `None`, porque senao o assembly nao consegue ler o arquivo em runtime
3. **Use o nome completo no GetManifestResourceStream** — o path eh `{NomeProjeto}.appsettings.json` com pontos separando, porque eh assim que recursos embarcados sao nomeados no .NET
4. **Registre via extension method** — crie um metodo `AddAppSettings` no MauiProgram para manter o codigo organizado, porque o Program.cs tende a crescer com muitas configuracoes
5. **Use pipeline para trocar configs de producao** — em vez de multiplos arquivos por ambiente, mantenha um appsettings.json no codigo e substitua-o no pipeline de CI/CD, porque o pipeline tem acesso a segredos que o codigo-fonte nao deve conter

## Steps

### Step 1: Criar o arquivo appsettings.json

No projeto MAUI, adicionar novo item JSON na raiz do projeto:

```json
{
  "ApiUrl": "https://sua-url-publica-aqui"
}
```

### Step 2: Configurar Build Action

Selecionar o arquivo → Properties → Build Action → **EmbeddedResource**.

### Step 3: Instalar NuGet packages

```
Microsoft.Extensions.Configuration.Binder
Microsoft.Extensions.Configuration.Json
```

### Step 4: Registrar no MauiProgram.cs

```csharp
private static MauiAppBuilder AddAppSettings(this MauiAppBuilder builder)
{
    using var fileStream = Assembly
        .GetExecutingAssembly()
        .GetManifestResourceStream("NomeDoProjeto.appsettings.json");

    var config = new ConfigurationBuilder()
        .AddJsonStream(fileStream)
        .Build();

    builder.Configuration.AddConfiguration(config);

    return builder;
}
```

Chamar no builder:

```csharp
builder.AddAppSettings();
```

### Step 5: Consumir via IConfiguration

Injetar `IConfiguration` onde precisar e acessar valores:

```csharp
var apiUrl = configuration["ApiUrl"];
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de URL base da API | Coloque em appsettings.json, nao hardcoded |
| Chaves secretas (push notification, API keys) | appsettings.json + substitua via pipeline |
| Diferentes valores por ambiente | Um unico arquivo, pipeline substitui para producao |
| fileStream retorna null | Verifique o nome: `{Projeto}.appsettings.json` e Build Action = EmbeddedResource |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Hardcode URL da API no codigo | Use appsettings.json com IConfiguration |
| Criar appsettings.Development.json no MAUI | Um arquivo so, pipeline troca em producao |
| Build Action = None | Build Action = EmbeddedResource |
| Nome errado no GetManifestResourceStream | `NomeDoProjeto.appsettings.json` (com pontos) |
| Deixar chaves secretas no repositorio | Pipeline substitui o arquivo com versao segura |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
