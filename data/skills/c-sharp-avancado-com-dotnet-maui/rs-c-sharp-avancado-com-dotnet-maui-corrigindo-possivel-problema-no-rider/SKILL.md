---
name: rs-csharp-maui-fix-rider-simulators
description: "Guides through fixing JetBrains Rider not detecting iOS simulators after Xcode updates on macOS. Use when user mentions 'Rider not showing simulators', 'iPhone simulator missing', 'Xcode simulator not found in Rider', 'iOS simulator disappeared', or 'MAUI simulator not working'. Covers manual simulator runtime download and import via xcodebuild. Make sure to use this skill whenever troubleshooting Rider + iOS simulator issues on Mac. Not for Visual Studio simulator issues, Android emulator problems, or Xcode-only workflows."
---

# Corrigindo Simuladores iOS no Rider

> Quando o Rider nao enxerga simuladores iOS apos atualizacao do Xcode, importe manualmente o Simulator Runtime da versao anterior.

## Prerequisites

- macOS com Xcode instalado
- JetBrains Rider instalado
- Conta Apple Developer (gratuita — nao precisa pagar os $99)
- Terminal com acesso a `xcodebuild`

## Steps

### Step 1: Fechar Rider e Xcode completamente

Fechar as janelas nao basta no macOS — verificar se nao ha bolinha no Dock.

```bash
# Botao direito no icone do Dock → Quit
# Ou via terminal:
killall Rider 2>/dev/null
killall Xcode 2>/dev/null
```

### Step 2: Identificar a versao necessaria

Abrir Xcode → Settings → Components. Verificar qual versao do Simulator Runtime esta com problema (ex: "iOS 18.2 + iOS 18.3.1 Simulator" — a versao combinada indica corrupcao). Anotar a versao anterior limpa necessaria (ex: iOS 18.2).

### Step 3: Baixar o Simulator Runtime manualmente

1. Acessar [Apple Developer Downloads](https://developer.apple.com/download/all/)
2. Fazer login com conta Apple Developer
3. Buscar por "iOS Simulator Runtime" na versao desejada
4. Baixar o arquivo `.dmg` (~9 GB)

### Step 4: Importar o Simulator Runtime via terminal

```bash
cd ~/Downloads
xcodebuild -importPlatform iOS_18.2_Simulator_Runtime.dmg
```

Aguardar a importacao completa — uma modal do sistema aparecera e deve sumir antes de prosseguir.

### Step 5: Verificar e usar

1. Abrir Xcode → Settings → Components → confirmar que a versao aparece
2. Abrir Rider → verificar que simuladores aparecem no device selector
3. Rodar o projeto normalmente

## Error handling

- Se `xcodebuild -importPlatform` falhar: verificar se Xcode esta completamente fechado
- Se a modal do sistema travar: aguardar — pode demorar varios minutos
- Se o Rider ainda nao mostrar simuladores apos importar: reiniciar o Mac

## Verification

- No Xcode: Settings → Components → Simulator Runtime da versao importada visivel
- No Rider: dropdown de devices mostra iPhones disponiveis (ex: iPhone 16 Pro)

## Heuristics

| Situacao | Acao |
|----------|------|
| Atualizacao do Xcode quebrou simuladores | Importar versao anterior do Simulator Runtime |
| Versao desejada nao aparece no Xcode Components | Baixar manualmente pelo site Apple Developer |
| Highlights vermelhos no Rider com MAUI | Ignorar — Rider nao e 100% compativel com MAUI |
| Precisa de iPhone fisico para testar | Conta Apple Developer paga ($99/ano) necessaria |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
