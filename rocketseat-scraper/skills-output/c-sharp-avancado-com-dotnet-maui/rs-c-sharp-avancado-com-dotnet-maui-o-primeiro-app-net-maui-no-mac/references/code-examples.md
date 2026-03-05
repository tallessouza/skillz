# Code Examples: Primeiro App .NET MAUI no Mac

## Estrutura de pastas do projeto

```
PlanShare/
├── src/
│   ├── backend/
│   │   └── PlanShare.Api/
│   ├── shared/
│   │   ├── PlanShare.Communication/
│   │   └── PlanShare.Exception/
│   └── mobile/                    # ← Nova pasta criada nesta aula
│       └── PlanShare.App/         # ← Projeto .NET MAUI
│           ├── Platforms/
│           │   ├── Android/
│           │   ├── iOS/
│           │   ├── MacCatalyst/
│           │   ├── Tizen/
│           │   └── Windows/
│           ├── Resources/
│           ├── App.xaml
│           ├── App.xaml.cs
│           ├── AppShell.xaml
│           ├── AppShell.xaml.cs
│           ├── MainPage.xaml
│           ├── MainPage.xaml.cs
│           ├── MauiProgram.cs
│           └── PlanShare.App.csproj
└── PlanShare.sln
```

## Criação do projeto via terminal (alternativa ao Rider)

```bash
# Navegar até a pasta mobile
cd src/mobile

# Criar projeto .NET MAUI
dotnet new maui -n PlanShare.App --framework net9.0

# Adicionar à solução (voltar à raiz)
cd ../..
dotnet sln PlanShare.sln add src/mobile/PlanShare.App/PlanShare.App.csproj --solution-folder src/mobile
```

## Configuração do .csproj gerado pelo template

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TargetFrameworks>net9.0-android;net9.0-ios;net9.0-maccatalyst</TargetFrameworks>
        <OutputType>Exe</OutputType>
        <RootNamespace>PlanShare.App</RootNamespace>
        <UseMaui>true</UseMaui>
        <SingleProject>true</SingleProject>
    </PropertyGroup>
</Project>
```

## Verificação de simuladores disponíveis via terminal

```bash
# Listar simuladores iOS disponíveis
xcrun simctl list devices available

# Listar runtimes instalados
xcrun simctl list runtimes

# Se simuladores não aparecem no Rider, verificar:
xcode-select -p
# Deve retornar: /Applications/Xcode.app/Contents/Developer
```

## Executar app via terminal (se IDE não coopera)

```bash
# Build para iOS simulator
dotnet build src/mobile/PlanShare.App/PlanShare.App.csproj -f net9.0-ios

# Executar no simulador
dotnet build -t:Run -f net9.0-ios -p:_DeviceName=:v2:udid=SIMULATOR_UDID
```

## Fluxo de execução no Rider

```
1. Toolbar superior → Selecionar projeto: PlanShare.App
2. Toolbar superior → Selecionar device: iPhone 16 (iOS 18.x)
3. Clicar botão Debug (🪲) — NÃO o Play (▶)
4. Rider compila → abre simulador → instala app → attach debugger
5. Breakpoints ativos, console de debug disponível
```