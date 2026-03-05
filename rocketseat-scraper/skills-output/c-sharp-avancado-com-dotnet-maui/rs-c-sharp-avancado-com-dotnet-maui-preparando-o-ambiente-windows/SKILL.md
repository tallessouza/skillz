---
name: rs-csharp-maui-setup-windows
description: "Guides Windows environment setup for .NET MAUI development with Visual Studio. Use when user asks to 'setup MAUI', 'install Visual Studio for MAUI', 'configure .NET MAUI environment', 'prepare Windows for mobile development', or 'install Visual Studio workloads'. Covers workload selection, XAML Styler extension, and modifying existing installations. Make sure to use this skill whenever setting up a .NET MAUI development environment on Windows. Not for Mac setup, VS Code setup, or non-MAUI .NET development."
---

# Setup Windows para .NET MAUI

> Instale o Visual Studio com os workloads corretos e a extensao XAML Styler para desenvolver aplicacoes .NET MAUI.

## Prerequisites

- Windows 10/11
- Conexao com internet
- Download: [Visual Studio](https://visualstudio.microsoft.com/pt-br/downloads/)

## Steps

### Step 1: Baixar o Visual Studio Community

1. Acessar visualstudio.microsoft.com
2. Clicar em **Downloads** → **Community** → **Free Download**
3. Executar o instalador `VisualStudioSetup.exe`
4. Clicar em **Continuar** para preparar componentes do installer

> Community e gratuita para estudo e projetos open source. Para projetos com receita, use Professional ou Enterprise conforme os termos de licenciamento.

### Step 2: Selecionar os 3 Workloads obrigatorios

Na aba **Workloads**, marcar exatamente estas 3 opcoes:

| Secao | Workload | Por que |
|-------|----------|---------|
| Web & Cloud | **ASP.NET and Web Development** | Para desenvolver APIs com .NET |
| Desktop & Mobile | **.NET Multi-platform App UI** | SDK e templates do .NET MAUI |
| Desktop & Mobile | **.NET Desktop Development** | Ferramentas para debug em Windows |

> Sem o .NET Desktop Development, nao e possivel fazer debug do MAUI em maquina Windows. Se o foco for apenas iOS/Android, apenas o .NET Multi-platform App UI e suficiente.

### Step 3: Configuracoes adicionais

- **Individual Components**: Verificar que .NET 8 (LTS) e .NET 9 estao inclusos (vem automaticamente com os workloads)
- **Language Pack**: Manter em ingles (documentacao e tutoriais sao majoritariamente em ingles)
- **Install location**: Manter padrao salvo necessidade especifica
- **Combo box**: Selecionar "Install while downloading" para paralelizar download e instalacao

Clicar em **Install** e aguardar (~10-30 min dependendo da conexao).

### Step 4: Configuracao inicial do Visual Studio

1. **Login**: Opcional no inicio (sera necessario mais adiante para funcionalidades especificas). Pode clicar em "Skip"
2. **Tema**: Escolher preferencia (Dark recomendado)
3. **Start Visual Studio**

### Step 5: Instalar extensao XAML Styler

1. Abrir Visual Studio → "Continue without code"
2. Menu **Extensions** → **Manage Extensions**
3. Aba **Browse** → pesquisar `XAML`
4. Instalar **XAML Styler for Visual Studio 2022**
5. Fechar o Visual Studio para a instalacao completar
6. No VSIX Installer que aparece, clicar em **Modify**

> XAML Styler formata automaticamente o codigo XAML do .NET MAUI.

## Ja tem Visual Studio instalado?

1. Menu Iniciar → pesquisar **Visual Studio Installer** (nao o Visual Studio)
2. Clicar em **Modify** na instalacao existente
3. Marcar os 3 workloads listados no Step 2
4. Selecionar "Install while downloading"
5. Clicar em **Modify** para instalar apenas os componentes faltantes

## Verification

- Abrir Visual Studio → **Create a new project**
- Verificar que templates .NET MAUI aparecem na lista
- No dropdown de Framework, confirmar que .NET 8 e .NET 9 estao disponiveis

## Error handling

- Se workloads nao aparecem: reabrir o Visual Studio Installer e verificar selecao
- Se XAML Styler nao instala: fechar completamente o Visual Studio antes de confirmar
- Se .NET 9 nao aparece no dropdown: verificar aba Individual Components no Installer

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
