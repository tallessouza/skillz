# Code Examples: AppSettings.json em .NET MAUI

## Exemplo completo do appsettings.json

```json
{
  "ApiUrl": "https://url-publica-do-devtunnel.devtunnels.ms"
}
```

Apenas chave-valor simples. A URL muda dependendo de como voce expoe sua API localmente (DevTunnel no Visual Studio ou ngrok).

## Comparacao: appsettings.json na API vs no App

### Na API (ja vem pronto, automatico)

```
appsettings.json                    ← sempre carregado
appsettings.Development.json        ← carregado se ambiente = Development
appsettings.Production.json         ← carregado se ambiente = Production
```

A API usa `IWebHostEnvironment` para detectar automaticamente:

```csharp
// Na API, isso ja funciona nativamente
app.Environment // tipo IWebHostEnvironment
// A API sabe qual ambiente esta executando e carrega o arquivo correto
```

### No App MAUI (manual)

```
appsettings.json                    ← unico arquivo, lido manualmente
```

Nao existe deteccao automatica de ambiente.

## MauiProgram.cs completo com AddAppSettings

```csharp
using System.Reflection;
using Microsoft.Extensions.Configuration;

namespace PlanShare.App;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        
        builder
            .UseMauiApp<App>()
            .AddAppSettings();  // ← registra appsettings.json

        return builder.Build();
    }

    private static MauiAppBuilder AddAppSettings(this MauiAppBuilder builder)
    {
        // 1. Ler o arquivo embarcado como stream
        using var fileStream = Assembly
            .GetExecutingAssembly()
            .GetManifestResourceStream("PlanShare.App.appsettings.json");

        // 2. Criar o configuration builder e adicionar o JSON stream
        var config = new ConfigurationBuilder()
            .AddJsonStream(fileStream)
            .Build();

        // 3. Registrar no servico de injecao de dependencia
        builder.Configuration.AddConfiguration(config);

        return builder;
    }
}
```

## Consumindo IConfiguration em um servico

```csharp
public class ApiService
{
    private readonly string _apiUrl;

    public ApiService(IConfiguration configuration)
    {
        _apiUrl = configuration["ApiUrl"];
    }

    public async Task<List<User>> GetUsersAsync()
    {
        using var client = new HttpClient();
        client.BaseAddress = new Uri(_apiUrl);
        // ...
    }
}
```

## NuGet Packages necessarios

```xml
<!-- No .csproj do projeto MAUI -->
<PackageReference Include="Microsoft.Extensions.Configuration.Binder" Version="9.0.7" />
<PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="9.0.7" />
```

Ou via Package Manager Console:

```
Install-Package Microsoft.Extensions.Configuration.Binder
Install-Package Microsoft.Extensions.Configuration.Json
```

## Configuracao do Build Action no .csproj

Quando voce marca como EmbeddedResource via Properties, o .csproj recebe:

```xml
<ItemGroup>
  <EmbeddedResource Include="appsettings.json" />
</ItemGroup>
```

## Debugging: verificando se o arquivo foi lido

O instrutor demonstra com breakpoint:

```csharp
// Se fileStream == null → nome errado ou Build Action != EmbeddedResource
using var fileStream = Assembly
    .GetExecutingAssembly()
    .GetManifestResourceStream("PlanShare.App.appsettings.json");

// Apos o Build(), inspecionar config mostra as secoes lidas
var config = new ConfigurationBuilder()
    .AddJsonStream(fileStream)
    .Build();

// config tera uma secao com Key="ApiUrl" e Value="https://..."
```

## Exemplo com mais configuracoes

```json
{
  "ApiUrl": "https://url-publica.devtunnels.ms",
  "PushNotification": {
    "ServerKey": "chave-secreta-aqui"
  },
  "AppVersion": "1.0.0"
}
```

Acesso:

```csharp
var apiUrl = configuration["ApiUrl"];
var pushKey = configuration["PushNotification:ServerKey"];
var version = configuration["AppVersion"];
```