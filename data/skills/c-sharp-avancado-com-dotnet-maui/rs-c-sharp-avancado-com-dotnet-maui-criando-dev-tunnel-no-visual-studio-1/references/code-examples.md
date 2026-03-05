# Code Examples: Dev Tunnel no Visual Studio

## URL base da API — antes e depois do tunnel

### Sem tunnel (localhost — so funciona no computador)
```
https://localhost:7045
```

Chamadas com essa URL base:
```
https://localhost:7045/login
https://localhost:7045/dashboard
```

### Com tunnel (URL publica — funciona de qualquer dispositivo)
```
https://kw073h3q-7045.usedevtunnels.ms
```

Chamadas equivalentes:
```
https://kw073h3q-7045.usedevtunnels.ms/login
https://kw073h3q-7045.usedevtunnels.ms/dashboard
```

## Configuracao tipica no app .NET MAUI

### Definindo a URL base no app
```csharp
public static class ApiConfig
{
    // Em desenvolvimento: usar URL do Dev Tunnel
    public const string BaseUrl = "https://kw073h3q-7045.usedevtunnels.ms";

    // Em producao: usar URL do servidor na nuvem
    // public const string BaseUrl = "https://minha-api.azurewebsites.net";
}
```

### Fazendo chamada HTTP
```csharp
var httpClient = new HttpClient();
httpClient.BaseAddress = new Uri(ApiConfig.BaseUrl);

// Chamada para login
var response = await httpClient.PostAsJsonAsync("/login", loginRequest);

// Chamada para dashboard
var dashboardResponse = await httpClient.GetAsync("/dashboard");
```

## Gerenciamento de tunnels

### Visualizar tunnels existentes
No Visual Studio: seta do botao Play → Dev Tunnels → **Show Dev Tunnels Window**

### Operacoes disponiveis na janela Dev Tunnels
- Ver todos os tunnels criados
- Criar novos tunnels
- Remover tunnels (botao direito → Delete)
- Cada tunnel pode ser associado a um projeto/API diferente

## Estrutura da API referenciada na aula

```
API/
├── Controllers/
│   ├── LoginController.cs      → rota: /login
│   └── DashboardController.cs  → rota: /dashboard
```

O Swagger abre automaticamente ao executar a API e permite testar as rotas diretamente no navegador, tanto com localhost quanto com a URL do tunnel.