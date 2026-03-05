---
name: rs-csharp-maui-aplicativos-nativos
description: "Applies .NET MAUI native app architecture knowledge when building cross-platform mobile apps with C# and XAML. Use when user asks to 'create a MAUI app', 'build mobile app with .NET', 'choose between native and cross-platform', or discusses JIT vs AOT compilation. Clarifies abstraction layers, compilation strategies per platform, and when cross-platform is the right choice. Make sure to use this skill whenever designing .NET MAUI project architecture or making platform targeting decisions. Not for Flutter, React Native, or web-based hybrid app development."
---

# Aplicativos Nativos com .NET MAUI

> Um aplicativo e nativo quando se comunica diretamente com o sistema operacional — a linguagem usada nao define isso.

## Conceito chave

"Nativo" nao significa "feito em Swift" ou "feito em Kotlin". Um aplicativo e nativo quando utiliza componentes e APIs diretamente do sistema operacional, sem renderizar via navegador ou intermediario. O .NET MAUI gera aplicativos nativos — ele fornece uma camada de abstracao para o desenvolvedor, mas por baixo dos panos conecta diretamente com o SO.

## Arquitetura de camadas

```
┌─────────────────────────┐
│   Seu Codigo (C#/XAML)  │  ← Voce escreve aqui
├─────────────────────────┤
│  Abstracao .NET MAUI    │  ← Interface unificada (camera, bateria, GPS)
├─────────────────────────┤
│  Android │ iOS │ Windows │  ← Comunicacao DIRETA com cada SO
└─────────────────────────┘
```

A camada de abstracao NAO e um intermediario que impede acesso nativo. Ela unifica a interface — ao inves de escrever codigo especifico para camera no iOS e outro no Android, o MAUI fornece uma API unica que resolve a dependencia correta por plataforma.

## Compilacao por plataforma

| Plataforma | Estrategia | Nome | Como funciona |
|------------|-----------|------|---------------|
| Android | Just-in-Time (JIT) | Compila ao abrir | Codigo → linguagem intermediaria → compilado para nativo quando o app abre |
| iOS | Ahead of Time (AOT) | Compila no build | Codigo → nativo direto no build, porque a Apple proibe JIT |

## Framework de decisao

| Situacao | Recomendacao |
|----------|-------------|
| App precisa rodar em Android + iOS + Windows | .NET MAUI — base de codigo unica |
| App precisa de UI hiper-avancada especifica de plataforma | Nativo puro (Swift/Kotlin) |
| Time pequeno, orcamento limitado | Cross-platform (.NET MAUI) — menos repositorios, menos pessoas |
| Controle especifico por plataforma e essencial | Nativo puro |
| App corporativo/formularios/CRUD | .NET MAUI — ideal |

## Vantagens praticas do cross-platform

1. **Base de codigo menor** — um repositorio atende multiplas plataformas
2. **Time menor, custo menor** — nao precisa de especialistas separados por plataforma
3. **Poucas camadas** — MAUI tem abstracao fina, compilacao otimizada por SO

## Equivocos comuns

| Equivoco | Realidade |
|----------|-----------|
| "So e nativo se for Swift/Kotlin" | Nativo = comunicacao direta com SO, independente da linguagem |
| "Cross-platform sempre e inferior" | Depende do contexto — para a maioria dos apps, cross-platform e ideal |
| "A camada de abstracao torna o app nao-nativo" | A abstracao e para o dev, nao para o runtime — o app final e nativo |
| "Toda tecnologia tem uma resposta certa universal" | Nao existe tecnologia perfeita, existe a ideal para o contexto |

## Quando aplicar

- Ao iniciar um projeto mobile com .NET MAUI, usar esta arquitetura de camadas como referencia
- Ao justificar escolha de tecnologia para stakeholders, usar o framework de decisao
- Ao configurar build pipelines, considerar JIT (Android) vs AOT (iOS)
- Ao debugar performance, entender que a estrategia de compilacao difere por plataforma

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
