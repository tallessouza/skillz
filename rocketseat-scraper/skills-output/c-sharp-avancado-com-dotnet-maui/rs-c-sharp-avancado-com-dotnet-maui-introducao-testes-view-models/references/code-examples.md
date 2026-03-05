# Code Examples: Configuracao de Testes para ViewModels em .NET MAUI

## Exemplo 1: csproj original do app MAUI (antes)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>
    <OutputType>Exe</OutputType>
    <!-- outras propriedades -->
  </PropertyGroup>
</Project>
```

Problema: `TargetFrameworks` so tem plataformas. Projeto xUnit com `net9.0` nao consegue referenciar.

## Exemplo 2: csproj do app ajustado para suportar testes

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net9.0;net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>
    <OutputType Condition="'$(TargetFramework)' != 'net9.0'">Exe</OutputType>
    <!-- outras propriedades -->
  </PropertyGroup>
</Project>
```

Mudancas:
1. Adicionado `net9.0` no inicio de `TargetFrameworks`
2. `OutputType` agora tem condicao — so gera `Exe` quando target NAO e `net9.0` puro

## Exemplo 3: csproj do projeto ViewModels.Tests

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="coverlet.collector" Version="6.0.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="xunit" Version="2.5.3" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.3" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\CommonTestUtilities\CommonTestUtilities.csproj" />
    <ProjectReference Include="..\..\..\..\src\PlanShare.App\PlanShare.App.csproj" />
  </ItemGroup>
</Project>
```

## Exemplo 4: Estrutura completa de pastas

```
Solution/
├── src/
│   ├── PlanShare.App/              # .NET MAUI app
│   │   └── PlanShare.App.csproj
│   ├── PlanShare.Application/      # Use Cases
│   └── PlanShare.API/              # Backend API
│
└── Tests/
    ├── Backend/
    │   ├── CommonTestUtilities/
    │   │   └── CommonTestUtilities.csproj   # Helpers para testes backend
    │   └── UseCases.Tests/
    │       └── UseCases.Tests.csproj
    │
    └── Mobile/
        ├── CommonTestUtilities/
        │   └── CommonTestUtilities.csproj   # Helpers para testes mobile (SEPARADO)
        └── ViewModels.Tests/
            └── ViewModels.Tests.csproj      # Referencia PlanShare.App + CommonTestUtilities
```

## Exemplo 5: Passo a passo no Visual Studio

### Criar Solution Folder
1. Botao direito em `Tests/` > Add > New Solution Folder > `Mobile`
2. Criar pasta fisica: `Tests/Mobile/` no filesystem

### Criar CommonTestUtilities (Mobile)
1. Botao direito em `Mobile` > Add > New Project
2. Selecionar **Class Library**
3. Nome: `CommonTestUtilities`
4. Local: `Tests/Mobile/`
5. Framework: `net9.0`
6. Deletar `Class1.cs` gerado automaticamente

### Criar ViewModels.Tests
1. Botao direito em `Mobile` > Add > New Project
2. Selecionar **xUnit Test Project**
3. Nome: `ViewModels.Tests`
4. Local: `Tests/Mobile/`
5. Framework: `net9.0`

### Adicionar referencias
1. `ViewModels.Tests` > Dependencies > Add Project Reference > `CommonTestUtilities` (Mobile)
2. `ViewModels.Tests` > Dependencies > Add Project Reference > `PlanShare.App`
   - So funciona APOS ajustar o csproj do app

## Exemplo 6: Variacao para .NET 8

Se usando .NET 8, substitua todas as ocorrencias:

```xml
<!-- TargetFrameworks -->
<TargetFrameworks>net8.0;net8.0-android;net8.0-ios;net8.0-maccatalyst</TargetFrameworks>

<!-- Condicao do OutputType -->
<OutputType Condition="'$(TargetFramework)' != 'net8.0'">Exe</OutputType>

<!-- Projeto de teste -->
<TargetFramework>net8.0</TargetFramework>
```

## Exemplo 7: Logica do OutputType condicional explicada

```
Build para net9.0-android:
  Condicao: 'net9.0-android' != 'net9.0' → TRUE
  OutputType = Exe → gera aplicativo Android ✅

Build para net9.0-ios:
  Condicao: 'net9.0-ios' != 'net9.0' → TRUE
  OutputType = Exe → gera aplicativo iOS ✅

Build para net9.0 (contexto de teste):
  Condicao: 'net9.0' != 'net9.0' → FALSE
  OutputType nao definido → default = Library (DLL) ✅
  Projeto de teste consegue referenciar como biblioteca
```