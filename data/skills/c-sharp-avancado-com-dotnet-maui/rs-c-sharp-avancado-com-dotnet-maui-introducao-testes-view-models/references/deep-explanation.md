# Deep Explanation: Configuracao de Testes para ViewModels em .NET MAUI

## Por que o projeto MAUI nao pode ser referenciado diretamente

Um projeto .NET MAUI padrao define `TargetFrameworks` apenas com plataformas especificas (`net9.0-android`, `net9.0-ios`, `net9.0-maccatalyst`). Um projeto de teste xUnit usa `net9.0` puro. Como os frameworks sao incompativeis, o Visual Studio rejeita a referencia — o icone de warning (ponto de exclamacao) aparece em Dependencies.

A solucao e adicionar `net9.0` (sem sufixo de plataforma) ao `TargetFrameworks` do app. Isso permite que o projeto seja compilado como biblioteca .NET pura quando o contexto for testes.

## O papel do OutputType condicional

Por padrao, projetos MAUI geram um executavel (`Exe`). Para testes de unidade, precisamos de uma DLL (biblioteca). A condicao:

```xml
<OutputType Condition="'$(TargetFramework)' != 'net9.0'">Exe</OutputType>
```

Funciona como um `if`: quando o build e feito para Android/iOS/Mac, gera executavel. Quando e para `net9.0` puro (contexto de testes), nao aplica o OutputType, e o .NET gera uma DLL por padrao.

O instrutor enfatiza: **`TargetFrameworks` (plural) vs `TargetFramework` (singular)** sao coisas diferentes. O plural define todas as plataformas suportadas. O singular indica qual plataforma esta sendo usada no build atual. A condicao usa o singular porque avalia o build corrente.

## Dois tipos de testes para apps

### Testes de unidade
- Testam classes e funcoes isoladamente (ViewModels, UseCases)
- Nao executam o aplicativo
- Usam xUnit padrao
- Baixo custo, rapidos de implementar

### Testes de interface (UI Tests)
- Simulam comportamento de usuario real
- Requerem o app executando em dispositivo
- Precisam de plataformas externas com dispositivos fisicos
- Permitem testar em variedade de dispositivos (diferentes Androids, tamanhos de tela)
- Conseguem tirar screenshots para verificar layout
- **Pontos negativos:**
  - Custo alto (plataformas cobram em dolar)
  - Periodos de trial curtos (3-7 dias)
  - Barreira de entrada alta (drivers, projetos especiais, IDs nos componentes)
  - Empresas usam de forma limitada por causa do custo

## Estrutura de Solution Folders

O instrutor organiza os testes espelhando a estrutura do projeto:
- `Tests/Backend/` para testes da API
- `Tests/Mobile/` para testes do app

Solution Folders no Visual Studio sao virtuais — nao criam pastas fisicas. O instrutor cria manualmente as pastas no filesystem para manter consistencia.

## Documentacao oficial

A Microsoft disponibiliza documentacao especifica para unit testing em .NET MAUI: [Unit Testing](https://learn.microsoft.com/en-us/dotnet/maui/deployment/unit-testing). O padrao documentado e exatamente o que foi aplicado: adicionar o target framework puro e usar OutputType condicional.