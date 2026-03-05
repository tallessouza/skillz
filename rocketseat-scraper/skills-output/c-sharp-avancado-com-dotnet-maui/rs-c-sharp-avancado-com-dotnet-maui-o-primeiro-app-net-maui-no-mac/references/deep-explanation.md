# Deep Explanation: Primeiro App .NET MAUI no Mac

## Por que organizar em pastas dentro de src/

O instrutor enfatiza que organização em pastas é fundamental para quando você criar pipelines de CI/CD. Com pastas separadas (`src/backend`, `src/mobile`, etc.), você pode configurar pipelines que fazem deploy apenas do back-end ou apenas do app, sem afetar outros componentes.

## Solution Folder vs Pasta Física — Um problema recorrente

Tanto no Visual Studio quanto no Rider, existe uma armadilha: **Solution Folders são virtuais**. Quando você cria uma Solution Folder no IDE, ela aparece na árvore da solução mas NÃO é criada no sistema de arquivos. Pastas físicas só são criadas quando estão dentro de um projeto.

A solução é criar a pasta manualmente (via Finder, terminal ou file explorer) e depois referenciar no IDE. Esse é um comportamento consistente entre Visual Studio e Rider.

## Padrão de nomenclatura

O instrutor segue um padrão consistente: `{Projeto}.{Tipo}`:
- `PlanShare.Api` — projeto de API
- `PlanShare.App` — aplicativo mobile
- `PlanShare.Communication` — biblioteca de comunicação
- `PlanShare.Exception` — biblioteca de exceções

Esse padrão facilita identificação rápida do propósito de cada projeto na solução.

## Diferença de Debug entre Rider e Visual Studio

No Visual Studio, F5 ou o botão Play já executa em modo debug com breakpoints ativos. No Rider, existem dois botões separados:

1. **Run (Play)** — executa otimizado, sem debug, breakpoints ignorados
2. **Debug (ícone de inseto)** — executa com debugger attached, breakpoints funcionam

Isso é uma decisão de design do Rider para otimização: execução sem debug é mais rápida. O instrutor alerta especificamente para não confundir os dois.

## Problema de simuladores no Xcode

Na época da gravação, houve um update do Xcode (iOS 18.2 → 18.3.1) que quebrou a integração dos simuladores com o Rider. O instrutor explica que:
- A culpa é compartilhada entre Apple (mudou algo no simulator runtime) e JetBrains (não atualizou o Rider a tempo)
- Isso é um problema temporário que se resolve com patches
- Existe um workaround simples (coberto na aula seguinte)

Esse tipo de problema é recorrente no ecossistema Apple/iOS — updates do Xcode frequentemente quebram ferramentas de terceiros.

## Mac vs Windows — Divisão estratégica do instrutor

O instrutor deliberadamente separa:
- **Windows + Visual Studio** → debug/deploy em dispositivo Android físico via USB
- **Mac + Rider** → simulador iOS

Motivo: simplificar o setup e evitar configurar Android SDK no Mac quando o foco é iOS. As configurações do dispositivo Android (modo desenvolvedor, USB debugging) são as mesmas independente do OS do computador.