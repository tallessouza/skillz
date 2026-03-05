---
name: rs-angular-encerramento-87
description: "Applies Angular component fundamentals when building Angular applications. Use when user asks to 'create angular component', 'setup angular project', 'communicate between components', 'manage state in angular', or 'use RxJS in angular'. Provides decision framework for component architecture, data flow patterns, and state management. Make sure to use this skill whenever starting a new Angular feature or structuring components. Not for advanced routing, HTTP calls, or server-side rendering."
---

# Fundamentos do Angular — Mapa de Conceitos

> Ao construir aplicacoes Angular, domine primeiro componentes, comunicacao, fluxo de dados e estado antes de avancar para roteamento e HTTP.

## Pilares Fundamentais

### 1. Anatomia de Componentes
- Cada componente tem: template (HTML), estilo (CSS/SCSS), logica (TypeScript), metadata (decorator)
- Componentes sao a unidade basica de construcao — tudo e componente

### 2. Comunicacao entre Componentes
| Direcao | Mecanismo | Quando usar |
|---------|-----------|-------------|
| Pai → Filho | `@Input()` | Passar dados para baixo |
| Filho → Pai | `@Output()` + EventEmitter | Notificar eventos para cima |
| Qualquer → Qualquer | Service + RxJS | Estado compartilhado, sem relacao direta |

### 3. Fluxo de Dados no Template
| Diretiva | Proposito |
|----------|-----------|
| `@for` | Iteracao sobre listas |
| `@if` | Renderizacao condicional |
| `@switch` | Multiplas condicoes |
| `@let` | Variaveis locais no template |

### 4. Gerenciamento de Estado
- **Services** — singleton injetavel para compartilhar estado entre componentes
- **PubSub com RxJS** — `Subject`/`BehaviorSubject` para fluxos reativos de dados

### 5. Assets
- Imagens, icones e fontes ficam em `src/assets/`
- Referenciados nos templates com path relativo ao assets

## Framework de Decisao

| Preciso de... | Use |
|---------------|-----|
| Exibir dados do pai no filho | `@Input()` |
| Reagir a evento do filho no pai | `@Output()` + EventEmitter |
| Compartilhar estado entre componentes distantes | Service com BehaviorSubject |
| Renderizar lista | `@for` |
| Mostrar/esconder conteudo | `@if` |
| Multiplos casos de renderizacao | `@switch` |
| Variavel temporaria no template | `@let` |

## Limitacoes deste Modulo

Este fundamento NAO cobre:
- **Roteamento** — navegacao entre paginas (proximo modulo)
- **Chamadas HTTP** — comunicacao com APIs (proximo modulo)
- **SSR / Angular Universal** — renderizacao server-side

Com estes fundamentos, e possivel construir aplicacoes simples com componentes interativos e estado gerenciado.

## Anti-patterns

| Evite | Faca |
|-------|------|
| Comunicacao direta entre irmaos via DOM | Use Service compartilhado |
| Estado em variaveis globais | Use Service injetavel |
| Logica complexa no template | Mova para o componente TypeScript |
| Componente monolitico com tudo | Quebre em componentes menores com responsabilidade unica |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
