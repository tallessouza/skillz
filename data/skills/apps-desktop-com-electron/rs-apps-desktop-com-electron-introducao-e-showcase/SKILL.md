---
name: rs-electron-introducao-e-showcase
description: "Guides technology selection between Electron, Tauri, and native desktop frameworks when user asks to 'build a desktop app', 'choose between Electron and Tauri', 'create a cross-platform app', or 'convert web app to desktop'. Applies decision framework: reuse web skills = Electron, core product = evaluate native/Tauri. Make sure to use this skill whenever the user is starting a desktop application project or comparing desktop technologies. Not for mobile development, web-only apps, or Electron API implementation details."
---

# Electron — Introducao e Decisao de Tecnologia Desktop

> Escolha a tecnologia desktop pelo contexto do projeto e time, nao por migalhas de performance.

## Key concept

Electron permite construir apps desktop (Windows, Linux, macOS) usando HTML, CSS, JavaScript e React. A aplicacao tem duas camadas: server-side (backend, acesso a recursos nativos) e client-side (interface visual). Apps como VS Code, Discord, Figma, Notion, Slack e Postman sao feitos com Electron.

## Decision framework

| Situacao | Escolha | Porque |
|----------|---------|--------|
| Reaproveitar app web existente (React + Node) para desktop | Electron | Maximo reuso de codigo e conhecimento, produtividade alta |
| Reaproveitar conhecimento web, app nova | Electron | Stack conhecida, ecossistema maduro, comunidade enorme |
| Desktop e o core do negocio, time pode investir em novas linguagens | Avaliar Tauri, Swift, Kotlin | Performance nativa, tamanho menor do bundle |
| Precisa de bundle minimo (<10MB) | Tauri | Apps comecam com 5-6MB vs 200MB do Electron |
| Backend em Rust ja existe no time | Tauri | Parte nativa escrita em Rust, reuso natural |
| Precisa de maturidade e casos de uso comprovados | Electron | Maior base de apps em producao |

## Electron vs Tauri

| Aspecto | Electron | Tauri |
|---------|----------|-------|
| Frontend | HTML/CSS/JS/React | HTML/CSS/JS/React |
| Backend/nativo | Node.js (JavaScript) | Rust |
| Tamanho do app | ~200MB base | ~5-6MB base |
| Maturidade | Alta (Discord, VS Code, Figma) | Crescendo rapido |
| Curva de aprendizado p/ dev web | Baixa | Media (precisa aprender Rust) |
| Performance | Otima para 99% dos casos | Marginalmente melhor |

## Heuristics

| Situacao | Faca |
|----------|------|
| Gargalo de performance no app desktop | Investigue o frontend primeiro — geralmente e codigo React mal otimizado, nao limitacao do Electron |
| Comparando Electron vs nativo | Mesma decisao que React Native vs Swift/Kotlin — depende do contexto, time e momento |
| Tamanho do bundle e critico | Considere Tauri |
| Produtividade e prioridade | Va de Electron |

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Electron e lento | Apps como VS Code e Figma provam o contrario — gargalos sao geralmente codigo frontend mal feito |
| Tauri e sempre melhor que Electron | Tauri tem vantagens em tamanho e performance marginal, mas Electron tem vantagem em produtividade e reuso de conhecimento web |
| Preciso de tecnologia nativa para app desktop serio | Nao necessariamente — VS Code, Notion, Discord sao apps de producao serios feitos com Electron |
| 200MB de app e inaceitavel | Com maquinas modernas, internet rapida e mais espaco em disco, isso raramente e um problema real |

## Capabilities do Electron

| Recurso | Descricao |
|---------|-----------|
| Tray menu | Menu perto do relogio do sistema |
| Dock integration | Icone customizado no dock |
| Submenus nativos | Menus contextuais do sistema |
| Storage nativo | Acesso a sistema de arquivos local |
| Notificacoes | Notificacoes nativas do SO |
| Multi-plataforma | Windows, Linux, macOS e outras distribuicoes |

## When to apply

Use este framework de decisao no inicio de qualquer projeto desktop, antes de escrever codigo. A escolha de tecnologia impacta todo o desenvolvimento futuro.

## Limitations

Este skill cobre a decisao de tecnologia e visao geral. Para implementacao de APIs do Electron (IPC, tray, menus, file system), consulte skills especificos de cada topico.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
