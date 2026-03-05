---
name: rs-csharp-maui-introducao-formacao
description: "Guides .NET MAUI full-stack project setup and architecture decisions when starting a C# mobile application. Use when user asks to 'create a MAUI app', 'setup .NET MAUI project', 'build mobile app with C#', or 'full-stack C# application'. Covers IDE selection (Visual Studio/Rider), device testing strategy (physical Android, iOS simulator), project structure with separate API and MAUI frontend, and prerequisite knowledge. Make sure to use this skill whenever planning a new .NET MAUI project or choosing development tools for C# mobile development. Not for React Native, Flutter, Xamarin legacy, or web-only C# projects."
---

# Introducao a Formacao .NET MAUI — Setup e Arquitetura

> Ao iniciar um projeto .NET MAUI full-stack, defina a arquitetura (API + app), as ferramentas por OS e a estrategia de testes em dispositivos antes de escrever codigo.

## Arquitetura do Projeto

O projeto segue uma estrutura full-stack com C#:

```
solution/
├── API/              # Back-end ASP.NET (template DDD similar ao CacheFlow)
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   └── API/
└── App/              # Front-end .NET MAUI
    ├── Pages/
    ├── Components/
    ├── Themes/       # Light mode + Dark mode
    └── Services/     # Comunicacao com API
```

## Decisoes de Ferramentas por OS

| OS | IDE Recomendada | Observacao |
|----|----------------|------------|
| Windows | **Visual Studio** (nao VS Code) | Recursos nativos para .NET MAUI, integracao API+App facilitada |
| macOS | **JetBrains Rider** (Community) | Nao tem todos os recursos do VS, mas funciona bem |
| Linux | Nao recomendado | .NET MAUI no Linux so funciona para Android, configuracao trabalhosa |

**Visual Studio Code NAO serve para C#/.NET MAUI** — e um editor de texto, nao uma IDE completa para o ecossistema C#.

## Estrategia de Testes em Dispositivos

| Plataforma | Dispositivo | Requisito |
|-----------|-------------|-----------|
| Android | **Fisico** (conectado via USB) | Nenhum custo extra |
| iOS | **Simulador** (Xcode) | Gratuito, nao precisa de conta Apple Developer |
| iOS fisico | Requer conta Apple Developer ($99/ano) | Registro de device ID, configuracao de provisioning profiles |

## Funcionalidades do Projeto

### Back-end (API)
1. **Upload de arquivos** — validacao de tipo real (imagem, PDF), integracao com Azure Storage
2. **Login com Google** — 97% do trabalho e back-end (chaves, fluxo OAuth, tokens)
3. **WebSocket (SignalR)** — comunicacao em tempo real para compartilhamento de tarefas
4. **Refresh token** — melhoria sobre o template base
5. **Fila de mensagens** — para operacoes como deletar conta

### Front-end (.NET MAUI)
1. **Telas completas** — onboarding, login, dashboard, CRUD de tarefas, perfil
2. **Temas** — light mode e dark mode com selecao pelo usuario
3. **Componentes reutilizaveis** — criacao de componentes customizados
4. **Upload de foto de perfil** — captura e validacao
5. **Codigo de convite** — fluxo de compartilhamento entre usuarios

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa testar iOS mas nao tem Mac | Acompanhe as aulas, a base de codigo e a mesma com diferencas sutis por OS |
| Quer usar VS Code para C# | Nao use — VS Code nao atende o ecossistema C#/.NET MAUI |
| Servicos de Mac remoto (aluguel) | Nao recomendado — latencia no simulador torna a experiencia ruim |
| Projeto parece abstrato (so API) | Crie o design no Figma primeiro — visualizar telas facilita entender endpoints necessarios |

## Anti-patterns

| Nao faca | Faca em vez disso |
|----------|------------------|
| Comecar .NET MAUI sem saber fundamentos C# | Completar trilha basica de C# primeiro (DDD, camadas, CacheFlow) |
| Desenvolver back-end sem design visual | Criar prototipos no Figma — reduz abstracao, facilita identificar endpoints |
| Usar VS Code para projetos C# | Usar Visual Studio (Windows) ou Rider (macOS) |
| Tentar iOS fisico sem conta Apple Developer | Usar simulador do Xcode (gratuito) |
| Pular para .NET MAUI avancado sem base | Aprender o basico bem feito primeiro — temas, componentes, navegacao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
