---
name: rs-csharp-maui-primeiro-app-mac
description: "Guides .NET MAUI project setup on Mac using JetBrains Rider. Use when user asks to 'create MAUI app on Mac', 'setup .NET MAUI with Rider', 'configure iOS simulator for MAUI', or 'start mobile project on macOS'. Covers project creation, folder organization, simulator selection, and debug configuration. Make sure to use this skill whenever setting up a new .NET MAUI project on Mac or troubleshooting Rider simulator issues. Not for Windows/Visual Studio setup, Android device configuration, or MAUI UI development."
---

# Primeiro App .NET MAUI no Mac

> Criar e configurar um projeto .NET MAUI no Mac usando JetBrains Rider, com estrutura de pastas organizada e simulador iOS.

## Prerequisites

- macOS com Xcode instalado (com simuladores iOS)
- JetBrains Rider instalado
- .NET 9 SDK instalado
- Projeto/solução existente clonado localmente

## Steps

### Step 1: Organizar estrutura de pastas

Criar pasta `mobile` dentro de `src/` para manter organização do projeto:

1. No Rider: botão direito em `src` → Add → New Solution Folder → nome: `mobile`
2. No Finder/terminal: criar a pasta fisicamente dentro de `src/` (Solution Folders no Rider não criam pastas no disco)
3. Arrastar a pasta física para dentro da Solution Folder no Rider

```bash
# Criar pasta manualmente porque Solution Folder não cria no disco
mkdir -p src/mobile
```

### Step 2: Criar projeto .NET MAUI

1. Botão direito na pasta `mobile` → Add → New Project
2. Selecionar template **MAUI**
3. Configurar:
   - Nome: `{NomeProjeto}.App` (ex: `PlanShare.App`)
   - Diretório: apontar para `src/mobile/` (não a raiz)
   - .NET version: 9.0
   - Language: C#
   - Target Platform: MAUI
   - Type: App (não Blazor híbrido)
4. Clicar em "Create" e aguardar (pode levar 30-40 segundos)

### Step 3: Selecionar simulador e executar

1. No topo do Rider, garantir que o projeto selecionado é `{NomeProjeto}.App`
2. Selecionar um simulador iOS na lista (ex: iPhone 15/16)
3. Usar o botão correto para executar:

| Botão | Função | Breakpoints |
|-------|--------|-------------|
| Play (▶) | Executa sem debug | Não funcionam |
| Debug (🪲) | Executa com debug | Funcionam |

**Diferença importante do Visual Studio:** no Rider, o botão Play NÃO ativa breakpoints. Usar sempre o botão Debug para depuração.

## Error handling

- Se nenhum simulador aparece: verificar Xcode → Settings → Components → versão dos simuladores iOS
- Se simuladores quebraram após update do Xcode: aguardar patch da JetBrains/Apple ou aplicar workaround (downgrade do simulator runtime)
- Se pasta não aparece no Solution Explorer: criar Solution Folder E pasta física separadamente

## Verification

- Projeto `{NomeProjeto}.App` visível na solução
- Pasta `src/mobile/{NomeProjeto}.App/` existe no disco
- Simulador iOS selecionável no Rider
- Hello World do template MAUI executa no simulador

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
