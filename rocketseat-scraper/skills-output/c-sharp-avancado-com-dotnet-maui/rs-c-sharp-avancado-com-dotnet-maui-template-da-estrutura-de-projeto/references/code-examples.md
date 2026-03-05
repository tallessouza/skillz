# Code Examples: Estrutura de Projeto .NET com Solution Compartilhada

## 1. Verificacao de versao do SDK

```bash
# Verificar versao instalada do .NET SDK
dotnet --version
# Output esperado: 9.0.200 (ou superior 9.x)
```

Se a versao nao for 9.x, fazer download em: https://dotnet.microsoft.com/download

## 2. Estrutura completa do template PlanShare

```
PlanShare/
├── .github/
│   └── workflows/           # Pipelines CI/CD
│       ├── deploy-api.yml
│       └── deploy-mobile.yml
├── .gitattributes
├── .gitignore               # Arquivos gerados em tempo de execucao
├── images/
│   └── logo.png             # Imagens para README apenas
├── LICENSE
├── README.md
├── PlanShare.sln             # Solution principal
└── src/
    ├── backend/
    │   ├── PlanShare.API/
    │   │   └── Controllers/
    │   │       ├── DashboardController.cs
    │   │       ├── LoginController.cs
    │   │       └── UserController.cs
    │   ├── PlanShare.Application/
    │   ├── PlanShare.Domain/
    │   └── PlanShare.Infrastructure/
    └── shared/
        ├── PlanShare.Communication/    # Request/Response DTOs
        └── PlanShare.Exception/        # Exception classes compartilhadas
```

## 3. Controller existente no template (exemplo)

```csharp
// src/backend/PlanShare.API/Controllers/UserController.cs
// Ja presente no template — sera modificado durante o curso
[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(/* request */)
    {
        // Registro de usuario
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(/* request */)
    {
        // Atualizacao de perfil
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        // Obter perfil do usuario
    }

    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(/* request */)
    {
        // Troca de senha
    }
}
```

## 4. Pipeline GitHub Actions com path filter (exemplo real do instrutor)

```yaml
# .github/workflows/deploy-pincodes.yml
name: Publish PinCodes NuGet

on:
  push:
    branches: [master]
    paths:
      - 'src/PinCodes/**'        # Somente alteracoes nesta pasta
      - '!src/PinCodes/README.md' # Exceto alteracoes no README

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - run: dotnet pack src/PinCodes -c Release
      - run: dotnet nuget push **/*.nupkg --api-key ${{ secrets.NUGET_KEY }}
```

```yaml
# .github/workflows/deploy-mauidays.yml
name: Publish MauiDays NuGet

on:
  push:
    branches: [master]
    paths:
      - 'src/MauiDays/**'         # Pipeline separado, pasta diferente
      - '!src/MauiDays/README.md'
```

## 5. Exemplo de pipeline para o projeto PlanShare

```yaml
# .github/workflows/deploy-api.yml
name: Deploy PlanShare API

on:
  push:
    branches: [master]
    paths:
      - 'src/backend/**'
      - 'src/shared/**'          # Shared tambem afeta o backend
      - '!**/*.md'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
      - run: dotnet build src/backend/PlanShare.API -c Release
      - run: dotnet test
      - run: dotnet publish src/backend/PlanShare.API -c Release -o ./publish
      # Deploy steps...
```

```yaml
# .github/workflows/deploy-mobile.yml
name: Deploy PlanShare Mobile

on:
  push:
    branches: [master]
    paths:
      - 'src/mobile/**'
      - 'src/shared/**'          # Shared tambem afeta o mobile
      - '!**/*.md'

jobs:
  build:
    runs-on: macos-latest        # iOS requer macOS
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'
          workloads: maui
      # Build e publicacao nas lojas...
```

## 6. Referencia de projetos no .csproj (compartilhamento)

```xml
<!-- src/backend/PlanShare.API/PlanShare.API.csproj -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <ProjectReference Include="..\..\shared\PlanShare.Communication\PlanShare.Communication.csproj" />
    <ProjectReference Include="..\PlanShare.Application\PlanShare.Application.csproj" />
  </ItemGroup>
</Project>
```

```xml
<!-- src/mobile/PlanShare.Mobile/PlanShare.Mobile.csproj (futuro) -->
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <!-- Mesmo projeto Communication referenciado — zero duplicacao -->
    <ProjectReference Include="..\..\shared\PlanShare.Communication\PlanShare.Communication.csproj" />
  </ItemGroup>
</Project>
```

## 7. .gitignore tipico para .NET

```gitignore
# Build results
bin/
obj/

# User-specific files
*.user
*.suo
*.userosscache

# VS directories
.vs/
packages/

# NuGet
*.nupkg
project.lock.json

# Rider
.idea/

# OS files
.DS_Store
Thumbs.db
```