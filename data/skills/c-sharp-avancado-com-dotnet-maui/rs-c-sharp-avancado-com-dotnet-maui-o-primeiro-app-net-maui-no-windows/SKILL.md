---
name: rs-csharp-maui-primeiro-app-windows
description: "Guides .NET MAUI project setup on Windows with Visual Studio and physical Android device deployment. Use when user asks to 'create a MAUI project', 'setup dotnet maui', 'connect Android device to Visual Studio', 'deploy app to phone', or 'configure Android SDK'. Covers project creation, Android SDK configuration, USB debugging setup, and first deploy. Make sure to use this skill whenever setting up a new .NET MAUI development environment on Windows. Not for Mac/Rider setup, iOS deployment, Blazor Hybrid projects, or XAML layout design."
---

# Primeiro App .NET MAUI no Windows

> Criar um projeto .NET MAUI no Visual Studio, configurar Android SDK, habilitar depuracao USB no dispositivo fisico e fazer o primeiro deploy.

## Prerequisites

- Visual Studio com workload .NET MAUI instalado
- .NET 9 SDK
- Dispositivo Android fisico (recomendado sobre emulador)
- Cabo USB para conectar o dispositivo

## Steps

### Step 1: Organizar a solucao

Criar pasta `mobile` na solucao E no diretorio fisico (Windows Explorer):

```
Source/
├── BackEnd/
├── Shared/
└── Mobile/    ← criar aqui
```

Botao direito na pasta Source > Adicionar > Nova Pasta > `Mobile`.
Criar a mesma pasta no diretorio fisico do projeto.

### Step 2: Criar o projeto .NET MAUI

1. Botao direito em `Mobile` > Adicionar > Novo Projeto
2. Buscar "MAUI" no campo de pesquisa
3. Selecionar **.NET MAUI App** (NAO selecionar .NET MAUI Blazor Hybrid App)
4. Nome: `PlanShare.App`
5. Localizacao: apontar para a pasta `Source/Mobile/`
6. Framework: .NET 9
7. Clicar em Create

### Step 3: Aceitar termos do Android SDK

Na primeira vez, o Error List mostrara um erro sobre termos de uso do Android SDK.
Clicar duas vezes no erro e aceitar os termos. Isso so acontece uma vez por maquina.

### Step 4: Configurar Android SDK

1. Clicar no icone **Open Android SDK Manager** (setinha com simbolo Android)
2. Aba **Platforms**: instalar o **Android SDK Platform** correspondente ao API Level do dispositivo
3. Aba **Tools**: instalar o **Android SDK Build Tools** correspondente ao mesmo API Level

#### Descobrir o API Level do dispositivo

1. No Android: Configurar > Sobre o telefone > Versao do Android (ex: 14)
2. Consultar tabela de versoes: Android 14 = API Level 34

Instalar apenas o necessario — nao marcar pacotes extras.

### Step 5: Habilitar modo desenvolvedor no Android

1. Configurar > Sobre o telefone
2. Tocar 7 vezes em **Numero da versao**
3. Confirmar com senha do dispositivo
4. Voltar em Configurar > Sistema > **Opcoes do desenvolvedor**
5. Ativar **Depuracao USB**
6. Opcional: ativar "Manter tela ativada" (util para desenvolvimento)

### Step 6: Conectar dispositivo e fazer deploy

1. Conectar Android via USB ao PC
2. No Android: permitir depuracao USB quando solicitado (marcar "Sempre permitir")
3. No Visual Studio: botao direito no projeto > **Set as Startup Project**
4. No seletor de dispositivo: trocar "Windows Machine" para **Android Local Devices** > selecionar o dispositivo
5. Pressionar F5 para compilar e fazer deploy

## Output format

Primeiro deploy instala o app no dispositivo e abre automaticamente. A primeira compilacao demora mais que as subsequentes.

## Error handling

- Se erro de termos do SDK: clicar duas vezes no erro no Error List e aceitar
- Se dispositivo nao aparece: verificar se depuracao USB esta ativada e cabo esta conectado
- Se build falha com API Level: verificar se SDK Platform e Build Tools do API Level correto estao instalados

## Heuristics

| Situacao | Acao |
|----------|------|
| Primeiro projeto MAUI na maquina | Aceitar termos do Android SDK antes de tudo |
| Dispositivo novo | Verificar versao Android e instalar SDK correspondente |
| Multiplos dispositivos conectados | Todos aparecem no seletor — escolher o desejado |
| Precisa usar camera no app | Usar dispositivo fisico, emulador nao suporta |
| Deploy no iOS (Mac) | Requer conta de desenvolvedor Apple ($99/ano) — usar simulador |

## Anti-patterns

| Evitar | Fazer em vez disso |
|--------|-------------------|
| Usar emulador Android | Usar dispositivo fisico (emuladores sao instáveis) |
| Selecionar .NET MAUI Blazor Hybrid | Selecionar .NET MAUI App (para telas XAML) |
| Instalar todos os pacotes do Android SDK | Instalar apenas SDK Platform e Build Tools do API Level necessario |
| Criar projeto fora da pasta Mobile | Apontar localizacao para Source/Mobile/ |
| Confundir versao Android com API Level | Versao (14) e marketing, API Level (34) e o que importa para dev |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
