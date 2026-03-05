---
name: rs-csharp-maui-ambiente-mac
description: "Guides .NET MAUI development environment setup on macOS. Use when user asks to 'setup MAUI on Mac', 'configure dotnet maui mac', 'install Xcode for MAUI', 'prepare Mac for mobile development', or 'setup Rider for MAUI'. Covers Xcode, .NET SDK, MAUI workload, Rider IDE, and Mono installation. Make sure to use this skill whenever setting up a Mac for .NET MAUI cross-platform mobile development. Not for Windows setup, Android-specific configuration, or Xcode Swift/SwiftUI development."
---

# Preparando Ambiente Mac para .NET MAUI

> Instalar e configurar os cinco componentes obrigatorios no macOS para desenvolver aplicativos .NET MAUI com simulador iOS.

## Prerequisites

- macOS com acesso a App Store
- Conta Apple (para baixar Xcode)
- Permissao de administrador (sudo)
- Conexao com internet estavel (downloads totalizam ~18 GB)

## Steps

### Step 1: Instalar e configurar o Xcode

Xcode e a IDE da Apple. Nao sera usada diretamente, mas e obrigatoria porque contem ferramentas de build e simuladores iOS usados por baixo dos panos.

1. Abrir **App Store** no Mac
2. Navegar ate **Develop** no menu lateral
3. Localizar **Xcode** (~3 GB download)
4. Clicar em instalar e aguardar
5. Abrir o Xcode pela primeira vez
6. Aceitar os termos de uso (Agree)
7. Digitar senha do Mac quando solicitado
8. Na tela de componentes: marcar **iOS** (obrigatorio) — download adicional de ~8.7 GB
9. Aguardar instalacao dos componentes e simuladores

### Step 2: Instalar .NET SDK 9

1. Acessar o site oficial do .NET SDK
2. Baixar o **.NET 9 SDK** para macOS
3. Selecionar o instalador correto para o processador:
   - **Intel** → `.pkg` Intel
   - **Apple Silicon (M1/M2/M3)** → `.pkg` ARM64
4. Executar o instalador (duplo clique no `.pkg`)
5. Seguir o wizard: Continuar → Instalar → Senha → Concluir

```bash
# Verificar instalacao
dotnet --version
```

### Step 3: Instalar .NET MAUI Workload

```bash
sudo dotnet workload install maui
```

- Requer `sudo` (permissao de administrador)
- Digitar senha do Mac quando solicitado
- Aguardar download e instalacao de todos os componentes

### Step 4: Instalar Rider (IDE)

1. Acessar o site da JetBrains e baixar o Rider
2. Selecionar versao correta: **Intel** ou **Apple Silicon** (~1.8 GB)
3. Abrir o arquivo `.dmg` baixado
4. Arrastar o icone do Rider para a pasta **Applications** (drag and drop)
5. Aguardar copia (~5 GB)
6. Abrir o Rider pelo Launchpad
7. Confirmar abertura do app baixado da internet
8. Criar conta ou fazer login na JetBrains (versao Community e gratuita)

### Step 5: Instalar Mono Framework

Mono e necessario para o debugger funcionar — sem ele, breakpoints e build no simulador iOS nao funcionam.

1. Pesquisar "Mono Project" no Google
2. Baixar a versao para Mac (~370 MB)
3. Executar o instalador `.pkg`
4. Seguir o wizard: Continuar → Aceitar termos → Instalar
5. Digitar senha do Mac
6. Aguardar instalacao (2-5 minutos, pode parecer travado mas e normal)

## Verification

```bash
# .NET SDK instalado
dotnet --version

# MAUI workload instalado
dotnet workload list
# Deve listar "maui"

# Xcode command line tools
xcode-select -p
# Deve retornar path do Xcode

# Mono instalado
mono --version
```

## Error handling

- Se `dotnet workload install maui` falhar com permissao → usar `sudo`
- Se terminal travar durante instalacao → fechar e reabrir terminal, executar novamente
- Se Rider pedir login → criar conta gratuita na JetBrains (versao Community)
- Se Xcode nao aparecer na App Store → verificar versao do macOS (precisa ser compativel)

## Heuristics

| Situacao | Acao |
|----------|------|
| Nao tem Mac fisico | Nao usar Mac na nuvem (delay torna inviavel com simulador) |
| Quer testar em Android no Mac | Instalar Android SDK e seguir passos da aula Windows |
| Quer testar em iPhone fisico | Possivel mas esta trilha usa simulador iOS |
| Download lento | Executar steps em paralelo (ex: instalar Rider enquanto MAUI workload instala) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
