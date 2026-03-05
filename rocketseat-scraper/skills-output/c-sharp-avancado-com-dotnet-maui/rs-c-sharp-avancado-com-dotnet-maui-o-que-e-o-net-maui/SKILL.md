---
name: rs-csharp-avancado-o-que-e-o-net-maui
description: "Guides technology decisions about .NET MAUI for cross-platform mobile development. Use when user asks 'should I use MAUI', 'MAUI vs native', 'cross-platform C#', 'Xamarin vs MAUI', or 'mobile app with .NET'. Provides decision framework for when MAUI fits and when it doesn't. Make sure to use this skill whenever evaluating .NET MAUI as a technology choice or starting a new mobile project with C#. Not for implementing MAUI code, UI patterns, or deployment workflows."
---

# .NET MAUI — Framework de Decisao

> Avalie se .NET MAUI e a escolha certa antes de iniciar o projeto — a decisao errada custa meses.

## Key concept

.NET MAUI (Multi-platform App UI) e o framework oficial da Microsoft para criar aplicacoes multiplataforma (Android, iOS, Mac, Windows) com uma unica base de codigo em C#. Lancado em 2022 com .NET 6, substituiu o Xamarin.Forms (sem suporte desde maio/2024).

## Decision framework

| Cenario | Decisao |
|---------|---------|
| Equipe ja domina C#/.NET e precisa de app Android + iOS | MAUI — curva de aprendizado minima |
| App multiplataforma com UI padrao (formularios, listas, navegacao) | MAUI — ponto forte do framework |
| App que precisa de camera avancada, filtros, AR | NAO usar MAUI — acesso apenas basico a camera |
| Animacoes complexas (dissolve, morphing, transicoes elaboradas) | NAO usar MAUI — suporte apenas basico |
| Jogos ou graficos 3D | NAO usar MAUI — nao e o proposito |
| Controle granular da status bar (imagens, tamanho customizado) | NAO usar MAUI — suporte apenas basico (cor) |
| Precisa de app Linux | NAO usar MAUI — sem suporte oficial da Microsoft |
| Equipe sem experiencia em C# | Avaliar — a vantagem de stack unificada desaparece |

## Evolucao: Xamarin.Forms → .NET MAUI

| Aspecto | Xamarin.Forms | .NET MAUI |
|---------|--------------|-----------|
| Lancamento | 2014 | 2022 (.NET 6) |
| Estrutura do projeto | Multiplos projetos (1 por plataforma + compartilhado) | Projeto unico com pastas por plataforma |
| Customizacao nativa | Custom Renderers (pesados, impacto em performance) | Handlers (leves, flexiveis, sem impacto) |
| Blazor | Sem suporte | Suporte hibrido nativo |
| Suporte oficial | Encerrado (maio/2024) | Continuo com novas versoes do .NET |

## Capacidades e limitacoes

### O que MAUI faz bem
- UI bonita e funcional (formularios, listas, navegacao, componentes padrao)
- Hot Reload para interface grafica (mudou cor/fonte/texto → atualiza sem reiniciar)
- Codigo especifico por plataforma organizado em pastas (nao projetos separados)
- Uma base de codigo → Android, iOS, Mac, Windows

### O que MAUI NAO faz
- Animacoes rebuscadas (dissolve, morphing)
- Graficos 3D ou jogos
- Acesso avancado a camera (filtros, AR)
- Controle granular da status bar
- Apps para Linux (comunidade trabalha nisso, mas nao e oficial)
- Hot Reload para codigo C# (regra de negocio exige restart)

## Ambiente de desenvolvimento

| SO | Plataformas-alvo | Setup |
|----|-----------------|-------|
| Windows | Android | Simples — instalar Visual Studio basta |
| Mac | Android + iOS | Alguns passos extras, mas tranquilo |
| Linux | Apenas Android | Configuracao trabalhosa, nao recomendado |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| MAUI faz apps feios | Apps bonitos sao perfeitamente possiveis — graficos "avancados" refere-se a animacoes complexas, nao estetica |
| MAUI nao suporta codigo nativo | Suporta via pastas por plataforma (Handlers) — mais limpo que Xamarin |
| Preciso de Mac para testar iOS | Sim para simulador, mas dispositivo fisico via USB no Windows funciona (requer conta Apple Developer, $99/ano) |
| Xamarin.Forms ainda e viavel | Suporte encerrou em maio/2024 — nao criar projetos novos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
