---
name: rs-csharp-maui-intro-testes-view-models
description: "Configures .NET MAUI projects for unit testing ViewModels by adjusting csproj TargetFrameworks and OutputType. Use when user asks to 'add unit tests to MAUI app', 'test ViewModels', 'setup xunit for MAUI', or 'configure MAUI project for testing'. Applies conditional OutputType pattern and multi-target framework setup. Make sure to use this skill whenever setting up test infrastructure for .NET MAUI projects. Not for UI/integration testing, backend API tests, or non-MAUI .NET projects."
---

# Configuracao de Testes de Unidade para .NET MAUI ViewModels

> Ao preparar um projeto .NET MAUI para testes de unidade, ajuste o csproj para suportar build como biblioteca (DLL) alem de executavel, permitindo que projetos de teste referenciem o app.

## Rules

1. **Adicione `net{version}` ao TargetFrameworks do app** — inclua o framework .NET puro (ex: `net9.0`) junto aos targets de plataforma, porque testes de unidade nao executam o app em dispositivo, apenas testam classes e funcoes
2. **Use OutputType condicional** — so gere executavel quando o target for plataforma especifica (Android/iOS/Mac), porque no contexto de testes o projeto deve gerar uma DLL
3. **Crie projeto de teste como xUnit Class Library** — use xUnit project template padrao com target framework .NET puro, porque testes de ViewModel nao precisam de runtime MAUI
4. **Mantenha Common Test Utilities separado por contexto** — crie um projeto CommonTestUtilities especifico para mobile, separado do backend, porque as dependencias e helpers sao diferentes
5. **Referencie o projeto do app somente apos ajustar o csproj** — sem os ajustes de TargetFrameworks e OutputType, a referencia vai falhar com warning de incompatibilidade

## How to write

### Ajuste do csproj do App MAUI

```xml
<PropertyGroup>
  <!-- ANTES: apenas plataformas -->
  <!-- <TargetFrameworks>net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks> -->

  <!-- DEPOIS: adicione net9.0 puro para suportar testes -->
  <TargetFrameworks>net9.0;net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>

  <!-- OutputType condicional: executavel apenas para plataformas -->
  <OutputType Condition="'$(TargetFramework)' != 'net9.0'">Exe</OutputType>
</PropertyGroup>
```

### Estrutura de projetos de teste

```
Tests/
├── Backend/
│   ├── CommonTestUtilities/
│   └── UseCases.Tests/
└── Mobile/
    ├── CommonTestUtilities/
    └── ViewModels.Tests/        # xUnit project, target: net9.0
```

### Projeto ViewModels.Tests csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.*" />
    <PackageReference Include="xunit" Version="2.*" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.*" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\Mobile\CommonTestUtilities\CommonTestUtilities.csproj" />
    <ProjectReference Include="..\..\..\src\PlanShare.App\PlanShare.App.csproj" />
  </ItemGroup>
</Project>
```

## Example

**Before (tentativa de referenciar app sem ajuste):**
```
Dependencies > Add Project Reference > PlanShare.App > OK
❌ Warning: ponto de exclamacao em Dependencies — incompatibilidade de framework
```

**After (com ajustes no csproj do app):**
```xml
<!-- PlanShare.App.csproj -->
<TargetFrameworks>net9.0;net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>
<OutputType Condition="'$(TargetFramework)' != 'net9.0'">Exe</OutputType>
```
```
Dependencies > Add Project Reference > PlanShare.App > OK
✅ Referencia adicionada sem erros
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criar testes para ViewModels | Projeto xUnit com referencia ao app (apos ajuste csproj) |
| Criar testes para UseCases do app | Mesmo padrao — projeto xUnit separado, referenciando o app |
| Compartilhar helpers entre testes mobile | Use CommonTestUtilities dentro de Tests/Mobile/ |
| Versao do .NET diferente de 9.0 | Substitua `net9.0` pela versao correta em todos os lugares |
| Testes de interface/UI | NAO use esta abordagem — requer plataformas externas com dispositivos reais |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Referenciar app MAUI sem ajustar TargetFrameworks | Adicione `net{version}` puro ao TargetFrameworks primeiro |
| Remover OutputType completamente | Use OutputType condicional para manter build de plataforma |
| Misturar CommonTestUtilities de backend e mobile | Crie projetos separados por contexto |
| Tentar executar o app dentro do teste de unidade | Teste apenas classes e funcoes — ViewModels, UseCases |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
