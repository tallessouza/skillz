# Code Examples: Execucao de Multiplos Projetos (.NET MAUI + API)

## Configuracao MultiLaunch no Rider — Passo a Passo Visual

### Metodo 1: Via botao direito
```
1. No Solution Explorer, clique com botao direito em qualquer projeto
2. Selecione "Run Multiple Projects"
3. Tela de configuracao aparece
```

### Metodo 2: Via dropdown de execucao
```
1. Clique na setinha ao lado do dropdown de projetos (topo da IDE)
2. Selecione a penultima opcao: "Multi Launch"
3. Clique nos "..." (tres pontinhos) para editar
4. Mesma tela de configuracao aparece
```

### Configuracao dos projetos
```
Projeto: PlanShare.Api
  - Settings: HTTPS (clique no icone de settings ao lado)
  - Debug: desmarcado (checkbox do "inseto") — executa without debug
  - Launch Action: Immediately

Projeto: PlanShare.App
  - Settings: iOS Simulator > iPhone 16 Pro Max
  - Debug: marcado — permite breakpoints no app
  - Launch Action: Immediately (ou "After previous started" para garantir API pronta)
```

### Resultado
```
Dropdown mostra: "MultiLaunch, PlanShare"
Botoes disponiveis:
  - Play (triangulo verde) = executar todos
  - Debug (icone de inseto) = executar com debug
```

## Visual Studio — Multiple Startup Projects

```
1. Solution Explorer → clique direito na Solution (nao no projeto)
2. Properties (ou Set Startup Projects...)
3. Common Properties → Startup Project
4. Radio button: "Multiple startup projects"

Configuracao:
  PlanShare.Api    → Action: Start without debugging
  PlanShare.App    → Action: Start
  
5. Use setas para ordenar (API primeiro)
6. OK
```

## Configuracao de URL da API no App

### Arquivo de configuracao (appconstants ou similar)
```csharp
public static class AppConstants
{
    // Tunel publico — funciona em qualquer dispositivo/simulador
    public const string ApiBaseUrl = "https://abc123.ngrok-free.app";
    
    // Alternativas para desenvolvimento local:
    // Android Emulator: "https://10.0.2.2:7001"
    // iOS Simulator:    "https://localhost:7001"  
    // Dispositivo fisico na mesma rede: "https://192.168.1.100:7001"
}
```

### Uso no HttpClient
```csharp
public class ApiService
{
    private readonly HttpClient _httpClient;
    
    public ApiService()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(AppConstants.ApiBaseUrl)
        };
    }
    
    public async Task<bool> CreateAccountAsync(string name, string email, string password)
    {
        var payload = new { name, email, password };
        var response = await _httpClient.PostAsJsonAsync("/api/accounts", payload);
        return response.IsSuccessStatusCode;
    }
}
```

## Teste realizado na aula

### Dados de teste usados
```
Nome:  Charlie
Email: charlie@gmail.com
Senha: 123456789
```

### Fluxo testado
```
1. App aberto no simulador iOS (iPhone 16 Pro Max) — Dark Mode
2. Tela de login → "Nao tem uma conta? Cria a sua"
3. Preencheu nome, email, senha
4. Clicou "Criar conta"
5. Processamento ocorreu (sem feedback visual — divida tecnica)
6. Clicou "Voltar" → voltou sem erros
7. Verificacao no banco: registro "Charlie" presente
```

### Verificacao no banco de dados
```sql
-- Consulta para verificar registros criados durante testes
SELECT * FROM users ORDER BY created_at DESC;

-- Resultado esperado: registros do teste Android + Charlie do teste iOS
```

## Opcoes de Launch Action no Rider

```
| Opcao                    | Comportamento                                    |
|--------------------------|--------------------------------------------------|
| Immediately              | Inicia junto com os outros projetos               |
| After previous started   | Espera o projeto acima comecar a executar         |
| After previous finished  | Espera o projeto acima terminar completamente     |
| After port opened        | Espera uma porta especifica ficar disponivel      |
```

### Exemplo pratico de uso
```
Cenario: API demora para inicializar (migrations, seed, etc.)

Configuracao recomendada:
  PlanShare.Api  → Immediately
  PlanShare.App  → After port opened (porta 7001)

Assim o app so inicia quando a API esta pronta para receber requisicoes.
```