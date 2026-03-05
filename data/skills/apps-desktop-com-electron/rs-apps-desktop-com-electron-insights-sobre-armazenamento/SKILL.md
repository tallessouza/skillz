---
name: rs-electron-storage-insights
description: "Guides storage architecture decisions in Electron apps. Use when user asks to 'build an Electron app', 'store data in Electron', 'add a database to Electron', 'choose between local and online storage', or 'make an app work offline'. Clarifies that Electron's main process is not a backend replacement and helps decide between local storage (offline-first) and traditional API communication (shared/online data). Make sure to use this skill whenever designing data flow in Electron applications. Not for web-only apps, mobile apps, or general database selection outside Electron context."
---

# Insights sobre Armazenamento no Electron

> Decida entre armazenamento local (offline) e comunicação com API (online) baseado no caso de uso real, nunca por default.

## Key concept

O processo `main` do Electron **não substitui um backend tradicional**. Ele é uma camada local que dá acesso a APIs nativas do sistema operacional. Quando dados precisam ser compartilhados entre dispositivos ou plataformas (web, mobile), use comunicação HTTP/GraphQL com um backend real — exatamente como uma aplicação web tradicional.

## Decision framework

| Cenario | Estrategia | Motivo |
|---------|------------|--------|
| Dados precisam funcionar offline | Banco de dados local via processo `main` + IPC | Aproveita APIs do Electron, funciona sem internet |
| Dados compartilhados entre web/mobile/desktop | Requisicoes HTTP/GraphQL para API externa | Electron vira um "wrap" da comunicacao web tradicional |
| App precisa de login, sync, colaboracao | API externa + backend real | Processo `main` nao escala para multi-usuario |
| Quer explorar ao maximo as APIs do Electron | Armazenamento local | Mais superficie de contato com o Electron |

## Rules

1. **Identifique o caso de uso antes de escolher** — pergunte "os dados precisam existir apenas nesta maquina ou em multiplos dispositivos?", porque a resposta define toda a arquitetura
2. **Nunca trate o processo main como backend** — ele roda na maquina do usuario, nao em servidor, porque nao tem escalabilidade, autenticacao distribuida ou acesso compartilhado
3. **Use IPC apenas para operacoes locais** — comunicacao front-end ↔ main via IPC e para acesso a filesystem, banco local, APIs nativas, porque para dados online, use fetch/axios como faria na web
4. **Prefira offline-first quando possivel** — armazenamento local oferece melhor UX (sem latencia de rede, funciona sem internet), porque o usuario instala e sai usando imediatamente

## Heuristics

| Situacao | Faca |
|----------|------|
| App tipo Notion com sync entre dispositivos | Backend real + API HTTP, Electron apenas consome |
| App tipo editor de codigo (VS Code) | Armazenamento local, arquivos no filesystem |
| App com login e dados do usuario na nuvem | API externa, main process so para features nativas |
| App que deve funcionar 100% sem internet | Banco local (SQLite, LevelDB, etc) via main process |
| Prototipo ou curso para aprender Electron | Armazenamento local para explorar mais APIs |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Tratar main process como servidor Node.js tradicional | Usar main process apenas para acesso a APIs nativas e storage local |
| Salvar dados localmente quando precisam ser compartilhados | Usar API HTTP/GraphQL para dados que precisam de sync |
| Usar IPC para replicar chamadas REST a um servidor | Fazer fetch direto do renderer process para a API externa |
| Construir autenticacao complexa no main process | Usar OAuth/JWT com backend real, Electron so armazena o token |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
